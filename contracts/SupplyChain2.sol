// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;

import "./Roles.sol";
import './ColdStorageContract.sol';
import "./SupplyChain.sol";
import "./HelperMethods.sol";

contract SupplyChain2 {
    Roles rc;
    SupplyChain sc;
    ColdStorageContract csc;
    
    constructor(address _rcaddress, address _scaddress, address _cscAddress) public {
        rc = Roles(_rcaddress);
        sc = SupplyChain(_scaddress);
        csc = ColdStorageContract(_cscAddress);
    }
    
    modifier verifyReceiver(address _address, uint256 roleID) {
        require(rc.getRole(_address) == roleID, "Receiver role is incorrect");
        _;
    }
    
    function harvestItem (uint256 _productID) public 
    {
        string memory productIDFull = sc.getFullProductID(string(abi.encodePacked("-1-", HelperMethods.integerToString(_productID))));
        
        SupplyChain.Item memory plantedItem = sc.getItems(productIDFull);
        require(plantedItem.ownerID == tx.origin, "Only owner farmer can call");
        sc.removeFromArray(productIDFull);
        string memory productIDHarvested = string(abi.encodePacked(HelperMethods.integerToString(plantedItem.weight), "-2-", HelperMethods.integerToString(_productID)));
        sc.pushInArray(productIDHarvested);
        
        sc.insertItem(plantedItem.ownerID, plantedItem.farmerID, plantedItem.coldStorageId, plantedItem.distributorID, plantedItem.retailerID, 
        plantedItem.consumerID, plantedItem.productType, plantedItem.weight, SupplyChain.State.Harvested, productIDHarvested);
        
        sc.deleteItem(productIDFull);
    }
    
    function storeItem (uint256 _productID, uint256 _weight, address _coldStorageId) public payable
    verifyReceiver(_coldStorageId, rc.coldStorageRoleID())
    {
        string memory productIDFull = sc.getFullProductID(string(abi.encodePacked("-2-", HelperMethods.integerToString(_productID))));
        SupplyChain.Item memory harvestedItem = sc.getItems(productIDFull);
        
        require(harvestedItem.ownerID == tx.origin, "Only owner farmer can call");
        require(_weight <= harvestedItem.weight, "Invalid weight provided");
        require(msg.value >= csc.getColdStoragePrice(_coldStorageId), "Insufficient ethers");
        
        string memory productIDStored = string(abi.encodePacked(HelperMethods.integerToString(_weight), "-3-", HelperMethods.integerToString(_productID)));
        string memory productIDHarvested = string(abi.encodePacked(HelperMethods.integerToString(harvestedItem.weight - _weight), "-2-", HelperMethods.integerToString(_productID)));
        
        sc.removeFromArray(productIDFull);
        sc.pushInArray(productIDStored);
        sc.pushInArray(productIDHarvested);
        
        harvestedItem.weight = harvestedItem.weight - _weight;
        sc.insertItem(harvestedItem.ownerID, harvestedItem.farmerID, address(0), address(0), address(0), address(0), harvestedItem.productType, harvestedItem.weight, 
        SupplyChain.State.Harvested, productIDHarvested);
        
        harvestedItem.weight = _weight;
        sc.insertItem(harvestedItem.ownerID, harvestedItem.farmerID, _coldStorageId, address(0), address(0), address(0), harvestedItem.productType, harvestedItem.weight, 
        SupplyChain.State.Stored, productIDStored);
        
        sc.deleteItem(productIDFull);
        
        _coldStorageId.transfer(csc.getColdStoragePrice(_coldStorageId));
        tx.origin.transfer(msg.value - csc.getColdStoragePrice(_coldStorageId));
    }
    
    function sellToDistributor (uint256 _productID, uint256 _weight, address _farmerId) public payable 
    verifyReceiver(tx.origin, rc.distributorRoleID())
    {
        string memory productIDFull = sc.getFullProductID(string(abi.encodePacked("-2-", HelperMethods.integerToString(_productID))));
        SupplyChain.Item memory harvestedItem = sc.getItems(productIDFull);
        
        require(harvestedItem.ownerID == _farmerId, "Wrong owner farmer");
        require(_weight <= harvestedItem.weight, "Invalid weight provided");
        
        SupplyChain.Crop memory crop = sc.getCropPrices(harvestedItem.productType);
        
        require(crop.priceForDistributor > 0, "Price not set");
        require(crop.priceForDistributor <= msg.value, "Insufficient ethers");
        
        _farmerId.transfer(crop.priceForDistributor);
        tx.origin.transfer(msg.value - crop.priceForDistributor);
        
        string memory productIDHarvested = string(abi.encodePacked(HelperMethods.integerToString(harvestedItem.weight - _weight), "-2-", HelperMethods.integerToString(_productID)));
        string memory productIDDistributor = string(abi.encodePacked(HelperMethods.integerToString(_weight), "-4-", HelperMethods.integerToString(_productID)));
        
        sc.removeFromArray(productIDFull);
        sc.pushInArray(productIDHarvested);
        sc.pushInArray(productIDDistributor);
        
        harvestedItem.weight = harvestedItem.weight - _weight;
        sc.insertItem(harvestedItem.ownerID, harvestedItem.farmerID, harvestedItem.coldStorageId, address(0), address(0), address(0), harvestedItem.productType, harvestedItem.weight, 
        SupplyChain.State.Harvested, productIDHarvested);
        
        harvestedItem.weight = _weight;
        sc.insertItem(tx.origin, harvestedItem.farmerID, harvestedItem.coldStorageId, tx.origin, address(0), address(0), harvestedItem.productType, harvestedItem.weight, 
        SupplyChain.State.SoldToDistributor, productIDDistributor);
        
        sc.deleteItem(productIDFull);
    }
    
    function sellToRetailer (uint256 _productID, uint256 _weight, address _distributorId) public payable 
    verifyReceiver(tx.origin, rc.retailerRoleID())
    {
        string memory productIDFull = sc.getFullProductID(string(abi.encodePacked("-4-", HelperMethods.integerToString(_productID))));
        SupplyChain.Item memory distributedItem = sc.getItems(productIDFull);
        
        require(distributedItem.ownerID == _distributorId, "Wrong owner distributor");
        require(_weight <= distributedItem.weight, "Invalid weight provided");
        
        SupplyChain.Crop memory crop = sc.getCropPrices(distributedItem.productType);
        
        require(crop.priceForRetailer > 0, "Price not set");
        require(crop.priceForRetailer <= msg.value, "Insufficient ethers");
        
        _distributorId.transfer(crop.priceForRetailer);
        tx.origin.transfer(msg.value - crop.priceForRetailer);
        
        string memory productIDDistributor = string(abi.encodePacked(HelperMethods.integerToString(distributedItem.weight - _weight), "-4-", HelperMethods.integerToString(_productID)));
        string memory productIDRetailer = string(abi.encodePacked(HelperMethods.integerToString(_weight), "-5-", HelperMethods.integerToString(_productID)));
        
        sc.removeFromArray(productIDFull);
        sc.pushInArray(productIDDistributor);
        sc.pushInArray(productIDRetailer);
        
        distributedItem.weight = distributedItem.weight - _weight;
        sc.insertItem(distributedItem.ownerID, distributedItem.farmerID, distributedItem.coldStorageId, distributedItem.distributorID, address(0), address(0), distributedItem.productType, distributedItem.weight, 
        SupplyChain.State.SoldToDistributor, productIDDistributor);
        
        distributedItem.weight = _weight;
        sc.insertItem(tx.origin, distributedItem.farmerID, distributedItem.coldStorageId, distributedItem.distributorID, tx.origin, address(0), distributedItem.productType, distributedItem.weight, 
        SupplyChain.State.SoldToRetailer, productIDRetailer);
        
        sc.deleteItem(productIDFull);
    }
    
    function sellToConsumer (uint256 _productID, uint256 _weight, address _retailerId) public payable 
    verifyReceiver(tx.origin, rc.consumerRoleID())
    {
        string memory productIDFull = sc.getFullProductID(string(abi.encodePacked("-5-", HelperMethods.integerToString(_productID))));
        SupplyChain.Item memory retailItem = sc.getItems(productIDFull);
        
        require(retailItem.ownerID == _retailerId, "Wrong owner retailer");
        require(_weight <= retailItem.weight, "Invalid weight provided");
        
        SupplyChain.Crop memory crop = sc.getCropPrices(retailItem.productType);
        
        require(crop.priceForConsumer > 0, "Price not set");
        require(crop.priceForConsumer <= msg.value, "Insufficient ethers");
        
        _retailerId.transfer(crop.priceForConsumer);
        tx.origin.transfer(msg.value - crop.priceForConsumer);
        
        string memory productIDRetailer = string(abi.encodePacked(HelperMethods.integerToString(retailItem.weight - _weight), "-5-", HelperMethods.integerToString(_productID)));
        string memory productIDConsumer = string(abi.encodePacked(HelperMethods.integerToString(_weight), "-6-", HelperMethods.integerToString(_productID)));
        
        sc.removeFromArray(productIDFull);
        sc.pushInArray(productIDRetailer);
        sc.pushInArray(productIDConsumer);
        
        retailItem.weight = retailItem.weight - _weight;
        sc.insertItem(retailItem.ownerID, retailItem.farmerID, retailItem.coldStorageId, retailItem.distributorID, retailItem.retailerID, address(0), retailItem.productType, retailItem.weight, 
        SupplyChain.State.SoldToRetailer, productIDRetailer);
        
        retailItem.weight = _weight;
        sc.insertItem(tx.origin, retailItem.farmerID, retailItem.coldStorageId, retailItem.distributorID, retailItem.retailerID, tx.origin, retailItem.productType, retailItem.weight, 
        SupplyChain.State.SoldToConsumer, productIDConsumer);
        
        sc.deleteItem(productIDFull);
    }
}