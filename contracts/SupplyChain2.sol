// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;

import "./Roles.sol";
import './FarmerContract.sol';
import "./SupplyChain.sol";
import "./HelperMethods.sol";

contract SupplyChain2 {
    Roles rc;
    SupplyChain sc;
    FarmerContract fc;

    uint256 productID;

    mapping(string => mapping(string => string[])) statewiseProduction;
    
    event ProductIDGeneratedFarmer(string);
    event ProductIDGeneratedDistributor(string[]);
    event ProductIDGeneratedRetailer(string[]);
    event ProductIDGeneratedConsumer(string[]);

    constructor(address _rcaddress, address _scaddress, address _fcaddress) public {
        rc = Roles(_rcaddress);
        sc = SupplyChain(_scaddress);
        fc = FarmerContract(_fcaddress);
        productID = 1;
    }
    
    modifier verifyReceiver(address _address, uint256 roleID) {
        require(rc.getRole(_address) == roleID, "Receiver role is incorrect");
        _;
    }

    modifier validProduct(string _productType) {
        require(sc.getSerialNumber(_productType) > 0, "Crop not allowed in system");
        _;
    }

    /*function addFirstItems(string newProductID, string _productType, uint256 _weight) private {
        sc.insertNewId(tx.origin, newProductID, _productType, 1);
        sc.insertItem(tx.origin, tx.origin,address(0),address(0),address(0), _productType, _weight, newProductID, 1);
    }*/

    function withdrawProductFromFarmer(string _productName, uint256 _weight, address _owner, address _receiver, uint256 sz) private {
        string[] memory ids = sc.getAllProductsPerOwner(_productName, 1, _owner);
        uint256 weightPresent = 0;
        
        string memory newId;
        string[] memory newIds = new string[](sz);

        for (uint256 i = ids.length; i > 0 && weightPresent < _weight; i--) {
            SupplyChain.Item memory currentItem = sc.getItems(ids[i-1]);
            newId = string(abi.encodePacked(ids[i-1],"-",HelperMethods.integerToString(currentItem.parts)));
            newIds[sz + i - 1 - ids.length] = newId;
             
            if (weightPresent + currentItem.weight <= _weight) {
                weightPresent = weightPresent + currentItem.weight;
                sc.insertItem(_receiver, currentItem.farmerID, _receiver, address(0), address(0), currentItem.productType, currentItem.weight, newId, 1);
                sc.insertNewId(_receiver, newId, _productName, 2);
                sc.deleteItem(ids[i-1]);
            } else {
                uint256 wt = _weight - weightPresent;
                sc.updateCurrentItem(ids[i-1],wt);
                sc.insertItem(_receiver, currentItem.farmerID, _receiver, address(0), address(0), currentItem.productType, wt, newId, 1);
                sc.insertNewId(_receiver, newId, _productName, 2);
                weightPresent = weightPresent + currentItem.weight + wt;
            }
        }
        
        if (weightPresent == _weight) {
            sc.deleteFromOwner(_productName, _owner, 1, ids.length-i);
        } else {
            sc.deleteFromOwner(_productName, _owner, 1, ids.length-i-1);
        }

        emit ProductIDGeneratedDistributor(newIds);
    }

    function withdrawProductFromDistributor(string _productName, uint256 _weight, address _owner, address _receiver, uint256 sz) private {
        string[] memory ids = sc.getAllProductsPerOwner(_productName, 2, _owner);
        uint256 weightPresent = 0;
        
        string memory newId;
        string[] memory newIds = new string[](sz);

        for (uint256 i = ids.length; i > 0 && weightPresent < _weight; i--) {
            SupplyChain.Item memory currentItem = sc.getItems(ids[i-1]);
            newId = string(abi.encodePacked(ids[i-1],"-",HelperMethods.integerToString(currentItem.parts)));
            newIds[sz + i - 1 - ids.length] = newId;
             
            if (weightPresent + currentItem.weight <= _weight) {
                weightPresent = weightPresent + currentItem.weight;
                sc.insertItem(_receiver, currentItem.farmerID, currentItem.distributorID, _receiver, address(0), currentItem.productType, currentItem.weight, newId, 1);
                sc.insertNewId(_receiver, newId, _productName, 3);
                sc.deleteItem(ids[i-1]);
            } else {
                uint256 wt = _weight - weightPresent;
                sc.updateCurrentItem(ids[i-1],wt);
                sc.insertItem(_receiver, currentItem.farmerID, currentItem.distributorID, _receiver, address(0), currentItem.productType, wt, newId, 1);
                sc.insertNewId(_receiver, newId, _productName, 3);
                weightPresent = weightPresent + currentItem.weight + wt;
            }
        }
        
        if (weightPresent == _weight) {
            sc.deleteFromOwner(_productName, _owner, 2, ids.length-i);
        } else {
            sc.deleteFromOwner(_productName, _owner, 2, ids.length-i-1);
        }

        emit ProductIDGeneratedRetailer(newIds);
    }

    function withdrawProductFromRetailer(string _productName, uint256 _weight, address _owner, address _receiver, uint256 sz) private {
        string[] memory ids = sc.getAllProductsPerOwner(_productName, 3, _owner);
        uint256 weightPresent = 0;
        
        string memory newId;
        string[] memory newIds = new string[](sz);

        for (uint256 i = ids.length; i > 0 && weightPresent < _weight; i--) {
            SupplyChain.Item memory currentItem = sc.getItems(ids[i-1]);
            newId = string(abi.encodePacked(ids[i-1],"-",HelperMethods.integerToString(currentItem.parts)));
            newIds[sz + i - 1 - ids.length] = newId;
             
            if (weightPresent + currentItem.weight <= _weight) {
                weightPresent = weightPresent + currentItem.weight;
                sc.insertItem(_receiver, currentItem.farmerID, currentItem.distributorID, currentItem.retailerID, _receiver, currentItem.productType, currentItem.weight, newId, 1);
                sc.insertNewId(_receiver, newId, _productName, 4);
                sc.deleteItem(ids[i-1]);
            } else {
                uint256 wt = _weight - weightPresent;
                sc.updateCurrentItem(ids[i-1],wt);
                sc.insertItem(_receiver, currentItem.farmerID, currentItem.distributorID, currentItem.retailerID, _receiver, currentItem.productType, wt, newId, 1);
                sc.insertNewId(_receiver, newId, _productName, 4);
                weightPresent = weightPresent + currentItem.weight + wt;
            }
        }
        
        if (weightPresent == _weight) {
            sc.deleteFromOwner(_productName, _owner, 3, ids.length-i);
        } else {
            sc.deleteFromOwner(_productName, _owner, 3, ids.length-i-1);
        }

        emit ProductIDGeneratedConsumer(newIds);
    }

    function harvestItem (
        string _productType,
        uint256 _weight
    ) public
    verifyReceiver(tx.origin, rc.farmerRoleID()) 
    validProduct(_productType)
    {
        string memory newProductID = HelperMethods.integerToString(productID);
        sc.insertNewId(tx.origin, newProductID, _productType, 1);
        sc.insertItem(tx.origin, tx.origin,address(0),address(0),address(0), _productType, _weight, newProductID, 1);
        productID++;
        string memory stateOfResidence = fc.getState(tx.origin);
        statewiseProduction[stateOfResidence][_productType].push(newProductID);

        emit ProductIDGeneratedFarmer(newProductID);
    }

    function buyFromFarmer(string _productName, uint256 _weight, address _farmerId)
    public payable
    verifyReceiver(tx.origin, rc.distributorRoleID())
    validProduct(_productName) {
        SupplyChain.Crop memory crop = sc.getCropPrices(_productName);        
        require(crop.priceForDistributor > 0, "Price not set");
        require(crop.priceForDistributor * _weight <= msg.value, "Low on ethers");

        uint256 sz = sc.checkAvailability(_productName, _weight, _farmerId, 1);
        
        require(sz > 0, "Low on product");
        withdrawProductFromFarmer(_productName, _weight, _farmerId, tx.origin, sz);
    
        _farmerId.transfer(crop.priceForDistributor*_weight);
        tx.origin.transfer(msg.value - crop.priceForDistributor*_weight);
    }

    function buyFromDistributor(string _productName, uint256 _weight, address _distributorId)
    public payable
    verifyReceiver(tx.origin, rc.retailerRoleID())
    validProduct(_productName) {
        SupplyChain.Crop memory crop = sc.getCropPrices(_productName);        
        require(crop.priceForRetailer > 0, "Price not set");
        require(crop.priceForRetailer * _weight <= msg.value, "Low on ethers");

        uint256 sz = sc.checkAvailability(_productName, _weight, _distributorId, 2);
        
        require(sz > 0, "Low on product");
        withdrawProductFromDistributor(_productName, _weight, _distributorId, tx.origin, sz);
        
        _distributorId.transfer(crop.priceForRetailer*_weight);
        tx.origin.transfer(msg.value - crop.priceForRetailer*_weight);
    }

    function buyFromRetailer(string _productName, uint256 _weight, address _retailerId)
    public payable
    verifyReceiver(tx.origin, rc.consumerRoleID())
    validProduct(_productName) {
        SupplyChain.Crop memory crop = sc.getCropPrices(_productName);        
        require(crop.priceForConsumer > 0, "Price not set");
        require(crop.priceForConsumer * _weight <= msg.value, "Low on ethers");

        uint256 sz = sc.checkAvailability(_productName, _weight, _retailerId, 3);
        
        require(sz > 0, "Low on product");
        withdrawProductFromRetailer(_productName, _weight, _retailerId, tx.origin, sz);
        
        _retailerId.transfer(crop.priceForConsumer*_weight);
        tx.origin.transfer(msg.value - crop.priceForConsumer*_weight);
    }

    function monitorProductsCount(string state, string crop) public view returns (uint256) {
        return statewiseProduction[state][crop].length;
    }

    function monitorProducts(string state, string crop, uint256 index) public view returns (string) {
        return statewiseProduction[state][crop][index];
    }

    function monitorAllProducts(string state, string crop) public view returns (string[]) {
        return statewiseProduction[state][crop];
    }
    
}