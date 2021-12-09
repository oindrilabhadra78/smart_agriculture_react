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
    
    enum State {
        None,
        Planted, 
        Harvested, 
        Stored,
        SoldToDistributor,
        SoldToRetailer,
        SoldToConsumer 
        }
        
    struct Crop {
        uint256 priceForDistributor;
        uint256 priceForRetailer;
        uint256 priceForConsumer;
        bool present;
    }
        
    struct Item {
        address ownerID; 
        address farmerID; 
        address coldStorageId;
        address distributorID;  
        address retailerID; 
        address consumerID;
        
        string  productType;
        uint256 weight;
        State   itemState;  // Product State as represented in the enum above
    }
        
    uint256 productID;
    mapping (string => Item) items;
    mapping (string => Crop) cropPrices;
    string[] productIDs;
    
    modifier verifyReceiver(address _address, uint256 roleID) {
        require(rc.getRole(_address) == roleID, "Receiver role is incorrect");
        _;
    }
    
    modifier validProduct(string _productType) {
        require(cropPrices[_productType].present == true, "This product is not allowed in this system");
        _;
    }
    
    function getFullProductID(string productIDEnd) public view returns(string) {
        for (uint256 i = 0; i < productIDs.length; i++) {
            if (HelperMethods.compareStrings(HelperMethods.substring(productIDs[i], bytes(productIDs[i]).length - bytes(productIDEnd).length, bytes(productIDs[i]).length), productIDEnd)) {
                return productIDs[i];
            }
        }
        return "";
    }
    
    function removeFromArray(string _productID) public {
        uint256 i;
        uint256 j;
        
        for (i = 0; i < productIDs.length; i++){
            if (HelperMethods.compareStrings(productIDs[i], _productID)) {
                for (j = i; j < productIDs.length - 1; j++) {
                    productIDs[j] = productIDs[j+1];
                }
                productIDs.length--;
                break;
            }
        }
    }
    
    function pushInArray(string _productID) public {
        productIDs.push(_productID);
    }
    
    function getItems(string id) public view returns(Item) {
        return items[id];
    }
    
    function getCropPrices(string crop) public view returns(Crop) {
        return cropPrices[crop];
    }
    
    function insertItem(address _ownerID, address _farmerID, address _coldStorageId, address _distributorID, address _retailerID, 
    address _consumerID, string  _productType, uint256 _weight, State _itemState, string _productID) public {
        items[_productID].ownerID = _ownerID;
        items[_productID].farmerID = _farmerID;
        items[_productID].coldStorageId = _coldStorageId;
        items[_productID].distributorID = _distributorID;
        items[_productID].retailerID = _retailerID;
        items[_productID].consumerID = _consumerID;
        items[_productID].productType = _productType;
        items[_productID].weight = _weight;
        items[_productID].itemState = _itemState;
    }
    
    function deleteItem(string _productID) public {
        delete items[_productID];
    }
    
    constructor(address _address) public {
        productID = 1;
        rc = Roles(_address);
        
        setValidProducts();
    }
    
    function setValidProducts() private {
        for(uint256 i = 0; i < cropsAllowed.length; i++) {
            cropPrices[cropsAllowed[i]].present = true;
        }
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
    
    function plantItem (
        string _productType,
        uint256 _weight
    ) public 
    verifyReceiver(tx.origin, rc.farmerRoleID()) 
    validProduct(_productType)
    {
        Item memory newItem;
        string memory newProductID = string(abi.encodePacked(HelperMethods.integerToString(_weight), "-", "1-", HelperMethods.integerToString(productID)));
        newItem.ownerID = tx.origin;
        newItem.farmerID = tx.origin;
        newItem.productType = _productType;
        newItem.weight = _weight;
        newItem.itemState = State.Planted;
        
        items[newProductID] = newItem;
        productIDs.push(newProductID);
        productID++;
    }
}

