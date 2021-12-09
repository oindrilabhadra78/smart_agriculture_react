// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;

import "./Roles.sol";

contract ColdStorageContract {
    Roles public rc;
    
    constructor(address _address) public {
        rc = Roles(_address);
    }
    
    struct ColdStorage {
        string ownerName;
        int256 latitude;
        int256 longitude;
        uint256 capacity;
        uint256 price;
        bool isEligible;
        address[] requests;
        address[] approvedRequests;
        address[] tenants;
    }

    mapping(address => ColdStorage) public coldStorages;
    address[] public coldStorageAddresses;
    address[] public unverifiedColdStorages;

     modifier onlyGovernmentOfficial() {
        require(rc.getRole(tx.origin) == rc.governmentID(), "Only government officials can access");
        _;
    }

    function addColdStorage(
        string memory _ownerName,
        int256 _latitude,
        int256 _longitude,
        uint256 _capacity,
        uint256 _price
    ) public {
        ColdStorage storage coldStorage = coldStorages[tx.origin];
        coldStorage.ownerName = _ownerName;
        coldStorage.latitude = _latitude;
        coldStorage.longitude = _longitude;
        coldStorage.capacity = _capacity;
        coldStorage.price = _price;
        coldStorage.isEligible = false;
        
        coldStorageAddresses.push(tx.origin);
        unverifiedColdStorages.push(tx.origin);
    }

    function getColdStorages() public view returns (address[] memory) {
        return coldStorageAddresses;
    }

    function getRequests(address _address) public view returns (address[] memory) {
        require(msg.sender == _address);

        return coldStorages[_address].requests;
    }

    function getAllCSrequestedByAddress(address _address)
        public
        view
        returns (address[] memory)
    {
        address[] memory CSIDs = new address[](coldStorageAddresses.length);
        uint256 pointer = 0;
        
        //loop to traverse through cold storages
        for (uint256 i = 0; i < coldStorageAddresses.length; i++) {
            for (uint256 j = 0; j < coldStorages[coldStorageAddresses[i]].requests.length;j++) {
                if (coldStorages[coldStorageAddresses[i]].requests[j] == _address) {
                    CSIDs[pointer++] = coldStorageAddresses[i];
                    break;
                }
            }
        }
        return CSIDs;
    }

    function getAllCSapprovedForAddress(address _address)
        public
        view
        returns (address[] memory)
    {
        address[] memory CSIDs = new address[](coldStorageAddresses.length);
        uint256 pointer = 0;
        
        //loop to traverse through cold storages
        for (uint256 i = 0; i < coldStorageAddresses.length; i++) {
            for (uint256 j = 0; j < coldStorages[coldStorageAddresses[i]].approvedRequests.length; j++) {
                if (coldStorages[coldStorageAddresses[i]].approvedRequests[j] == _address) {
                    CSIDs[pointer++] = coldStorageAddresses[i];
                    break;
                }
            }
        }
        return CSIDs;
    }

    function getColdStorage(address _address)
        public
        view
        returns (
            string memory _ownerName,
            int256 _latitude,
            int256 _longitude,
            uint256 _capacity,
            uint256 _price
        )
    {
        return (
            coldStorages[_address].ownerName,
            coldStorages[_address].latitude,
            coldStorages[_address].longitude,
            coldStorages[_address].capacity,
            coldStorages[_address].price
        );
    }
    
    function getLocation(address _address) external view returns(int256, int256) {
        return (coldStorages[_address].latitude, coldStorages[_address].longitude);
    }
    
    function getColdStoragePrice(address _address) public view returns (uint256 _price) {
        return coldStorages[_address].price;
    }

    function countColdStorages() public view returns (uint256) {
        return coldStorageAddresses.length;
    }

    function requestColdStorage(address _address) public {
        //owner can't buy their own storage
        require(msg.sender != _address);

        if (address(msg.sender).balance >= coldStorages[_address].price) {
            coldStorages[_address].requests.push(address(msg.sender));
        }
    }

    function removeRequest(address _address, address _addressColdStorage) public {
        address[] storage reqs = coldStorages[_addressColdStorage].requests;

        bool isPresent = false;
        uint256 reqIndex = 0;
        uint256 i;
        
        for (i = 0; i < reqs.length; i++) {
            if (reqs[i] == _address) {
                isPresent = true;
                reqIndex = i;
                break;
            }
        }

        if (isPresent) {
            for (i = reqIndex; i < reqs.length - 1; i++) {
                reqs[i] = reqs[i + 1];
            }

            delete reqs[reqs.length - 1];
            coldStorages[_addressColdStorage].requests = reqs;
        } else 
        return;
    }

    function removeApprovedRequest(address _address, address _addressColdStorage) public {
        address[] storage appReqs = coldStorages[_addressColdStorage].approvedRequests;

        bool isPresent = false;
        uint256 reqIndex = 0;
        uint256 i;

        for (i = 0; i < appReqs.length; i++) {
            if (appReqs[i] == _address) {
                isPresent = true;
                reqIndex = i;
                break;
            }
        }

        if (isPresent) {
            for (i = reqIndex; i < appReqs.length - 1; i++) {
                appReqs[i] = appReqs[i + 1];
            }

            delete appReqs[appReqs.length - 1];
            coldStorages[_addressColdStorage].approvedRequests = appReqs;
        } else 
        return;
    }

    function approveColdStorage(address _addressColdStorage, address _address) public {
        require(msg.sender == _addressColdStorage);

        coldStorages[_addressColdStorage].approvedRequests.push(_address);
        removeRequest(_address, _addressColdStorage);
    }

    function getApprovedRequests(address _address)
        public
        view
        returns (address[] memory)
    {
        require(msg.sender == _address);

        return coldStorages[_address].approvedRequests;
    }

    function rentColdStorage(address _address) public {
        coldStorages[_address].tenants.push(msg.sender);
        removeApprovedRequest(msg.sender, _address);
    }

    function getRentedStorages(address _address)
        public
        view
        returns (address[] memory)
    {
        address[] memory rentedIDs = new address[](coldStorageAddresses.length);
        uint256 pointer = 0;
        
        for (uint256 i = 0; i < coldStorageAddresses.length; i++) {
            for (uint256 j = 0; j < coldStorages[coldStorageAddresses[i]].tenants.length; j++) {
                if (coldStorages[coldStorageAddresses[i]].tenants[j] == _address) {
                    rentedIDs[pointer++] = coldStorageAddresses[i];
                    break;
                }
            }
        }
        return rentedIDs;
    }

    function getTenants(address _address) public view returns (address[] memory) {
        require(msg.sender == _address);
        return coldStorages[_address].tenants;
    }

    /*//function to add new item to cold storage
    function addItem(
        address _address,
        string memory _itemName,
        uint256 _quantity
    ) public {
        coldStorages[_address].items[_itemName] = _quantity;
        coldStorages[_address].itemNames.push(_itemName);
    }

    //function to view items
    function getItemNames(uint256 _id) public view returns (string[] memory) {
        return coldStorages[_id].itemNames;
    }

    function getItemQuantites(uint256 _id, string memory _itemName)
        public
        view
        returns (uint256)
    {
        return coldStorages[_id].items[_itemName];
    }

    //function to get quantities of items*/
    
    function getUnverifiedColdStorages() public onlyGovernmentOfficial view returns (address[] memory) {
        return unverifiedColdStorages;
    }
    
    function setEligible(address _address) public onlyGovernmentOfficial {
        for (uint256 i = 0 ; i < unverifiedColdStorages.length ; i++) {
            if (unverifiedColdStorages[i] == _address) {
                unverifiedColdStorages[i] = unverifiedColdStorages[unverifiedColdStorages.length-1];
                delete unverifiedColdStorages[unverifiedColdStorages.length-1];
                coldStorages[_address].isEligible = true;
                unverifiedColdStorages.length--;
                rc.addRole(_address, rc.coldStorageRoleID());
                break;
            }
        }
    }
}
