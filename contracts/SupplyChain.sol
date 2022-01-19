// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;

import './Roles.sol';
import './HelperMethods.sol';

contract SupplyChain {
    Roles public rc;
    
    string[] cropsAllowed = ['arecanut', 'arhar/tur', 'bajra', 'banana', 'barley', 'bhindi', 'black pepper', 'blackgram', 'brinjal', 'cabbage', 'cardamom', 'carrot', 'cashewnut', 'castor seed', 'chillies', 'citrus fruit', 
    'coconut', 'coffee', 'coriander', 'cotton', 'cowpea(lobia)', 'drum stick', 'garlic', 'ginger', 'gram', 'grapes', 'groundnut', 'guar seed', 'horse-gram', 'jack fruit', 'jowar', 'jute', 'khesari', 'korra', 'lentil',
    'linseed', 'maize', 'mango', 'masoor', 'mesta', 'mothbeans', 'mungbean', 'niger seed', 'onion', 'orange', 'papaya', 'pineapple', 'pomegranate', 'potato', 'ragi', 'rapeseed &mustard', 'redish', 'rice', 'rubber',
    'safflower', 'samai', 'sannhamp', 'sesamum', 'small millets', 'soyabean', 'sugarcane', 'sunflower', 'sweet potato', 'tapioca', 'tea', 'tobacco', 'tomato', 'turmeric', 'turnip', 'urad', 'varagu', 'wheat'];

    struct Crop {
        uint256 serialNo;
        uint256 priceForDistributor;
        uint256 priceForRetailer;
        uint256 priceForConsumer;
    }

    struct Item {
        address ownerID; 
        address farmerID; 
        address distributorID;  
        address retailerID; 
        address consumerID;
        
        string  productType;
        uint256 weight;
        uint256 parts;
    }

    struct OwnerProduct {
        address[] owners;
        mapping (address=>string[]) perOwner;
    }

    mapping (string => Item) items;
    mapping (string => Crop) cropPrices;

    mapping (uint256=>OwnerProduct) productAvailability;

    modifier verifyReceiver(address _address, uint256 roleID) {
        require(rc.getRole(_address) == roleID, "Receiver role is incorrect");
        _;
    }

    modifier validProduct(string _productType) {
        require(getSerialNumber(_productType) > 0, "Crop not allowed in system");
        _;
    }

    function setPrice (string _product, uint256 basePrice, uint256 profitDistributor, uint256 profitRetailer) public
    verifyReceiver(tx.origin, rc.governmentID())
    validProduct(_product)
    {
        Crop storage crop = cropPrices[_product];
        crop.priceForDistributor = basePrice;
        crop.priceForRetailer = crop.priceForDistributor * (100 + profitDistributor) / 100;
        crop.priceForConsumer = crop.priceForRetailer * (100 + profitRetailer) / 100;
    }
    
    function removeFromArray(string _productName, uint256 stage, address _address) private {
        uint256 i;
        uint256 j;

        address[] storage ownersArray = productAvailability[getSerialNumber(_productName) * 10 + stage].owners;
        
        for (i = 0; i < ownersArray.length; i++){
            if (ownersArray[i] == _address) {
                for (j = i; j < ownersArray.length - 1; j++) {
                    ownersArray[j] = ownersArray[j+1];
                }
                ownersArray.length--;
                break;
            }
        }
    }
    
    function getItems(string id) public view returns(Item) {
        return items[id];
    }

    function getSerialNumber(string crop) public view returns(uint256) {
        return getCropPrices(crop).serialNo;
    }
    
    function getCropPrices(string crop) public view returns(Crop) {
        return cropPrices[crop];
    }
    
    function insertItem(address _ownerID, address _farmerID, address _distributorID, address _retailerID, 
        address _consumerID, string  _productType, uint256 _weight, string _productID, uint256 _parts) external {
        items[_productID].ownerID = _ownerID;
        items[_productID].farmerID = _farmerID;
        items[_productID].distributorID = _distributorID;
        items[_productID].retailerID = _retailerID;
        items[_productID].consumerID = _consumerID;
        items[_productID].productType = _productType;
        items[_productID].weight = _weight;
        items[_productID].parts = _parts;
    }
    
    function deleteItem(string _productID) external {
        delete items[_productID];
    }
    
    constructor(address _address) public {
        rc = Roles(_address);        
        setValidProducts();
    }
    
    function setValidProducts() private {
        for(uint256 i = 0; i < cropsAllowed.length; i++) {
            cropPrices[cropsAllowed[i]].serialNo = i+1;
        }
    }

    function getNumOwners (string _productName, uint256 stage) public view returns(uint256) {
        return productAvailability[getSerialNumber(_productName) * 10 + stage].owners.length;
    }

    function getOwnerAddresses(string _productName, uint256 stage, uint256 index) public view returns(address) {
        return productAvailability[getSerialNumber(_productName) * 10 + stage].owners[index];
    }

    function getNumProductsPerOwner(string _productName, uint256 stage, address _address) public view returns(uint256) {
        return productAvailability[getSerialNumber(_productName) * 10 + stage].perOwner[_address].length;
    }
    
    function getProductPerOwner(string _productName, uint256 stage, address _address, uint256 _index) public view returns(string) {
        return productAvailability[getSerialNumber(_productName) * 10 + stage].perOwner[_address][_index];
    }

    function getAllProductsPerOwner(string _productName, uint256 stage, address _address) public view returns (string[]) {
        return productAvailability[getSerialNumber(_productName) * 10 + stage].perOwner[_address];
    }

    function insertNewId(address _address, string _id, string _productName, uint256 stage) external {
        uint256 serial = getSerialNumber(_productName)*10+stage;
        if (getNumProductsPerOwner(_productName, stage, _address) == 0)
        productAvailability[serial].owners.push(_address);
        productAvailability[serial].perOwner[_address].push(_id);
    }

    function deleteFromOwner(string _productName, address _owner, uint256 stage, uint256 len) external {
        string [] storage productArray = productAvailability[getSerialNumber(_productName) * 10 + stage].perOwner[_owner];
        productArray.length -= len;
        if (productArray.length == 0) {
            removeFromArray(_productName,stage,_owner);
        }
    }

    function updateCurrentItem(string id, uint256 wt) external {
        items[id].weight -= wt;
        items[id].parts++;
    }

    function checkAvailability(string _productName, uint256 _weight, address _owner, uint256 stage) external view returns(uint256) {
        string[] memory ids = getAllProductsPerOwner(_productName, stage, _owner);
        uint256 weightPresent = 0;
        for (uint256 i = ids.length ; i > 0 && weightPresent < _weight; i--) {
            weightPresent = weightPresent + getItems(ids[i-1]).weight;
        }
        if (weightPresent < _weight) {
            return 0;
        } else {
            return ids.length - i;
        }
    }
}

