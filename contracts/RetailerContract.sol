// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
import "./Roles.sol";

contract RetailerContract {
    Roles public rc;
    
    constructor(address _address) public {
        rc = Roles(_address);
    }

    struct Retailer {
        string name;
        string contact;
        int256 latitude;
        int256 longitude;
        bool isEligible;
    }

    mapping(address => Retailer) public retailers;
    address[] public retailerAccounts;
    address[] public unverifiedRetailerAccounts;
    
    modifier onlyGovernmentOfficial() {
        require(rc.getRole(tx.origin) == rc.governmentID(), "Only government officials can access");
        _;
    }

    modifier onlyAuthorisedActors(address _address) {
        require(retailers[_address].isEligible == true || _address == tx.origin || rc.getRole(tx.origin) == rc.governmentID(), "Unauthorised actor");
        _;
    }

    function addRetailer(
        string memory _name,
        string memory _contact,
        int256 _latitude,
        int256 _longitude
    ) public {
        Retailer storage retailer = retailers[tx.origin];
        retailer.name = _name;
        retailer.contact = _contact;
        retailer.latitude = _latitude;
        retailer.longitude = _longitude;
        retailer.isEligible = false;
        
        unverifiedRetailerAccounts.push(tx.origin);
    }

    function getRetailer(address _address)
        public onlyAuthorisedActors(_address)
        view
        returns (
            string memory _name, 
            string memory _contact,
            int256 _latitude,
            int256 _longitude,
            bool _isEligible
        )
    {
        return (
            retailers[_address].name, 
            retailers[_address].contact,
            retailers[_address].latitude,
            retailers[_address].longitude,
            retailers[_address].isEligible
        );
    }

    function getLocation(address _address) external view returns(int256, int256) {
        return (retailers[_address].latitude, retailers[_address].longitude);
    }
    
    function getUnverifiedRetailerAccounts() public onlyGovernmentOfficial view returns (address[] memory) {
        return unverifiedRetailerAccounts;
    }

    function getNumUnverifiedRetailers() public onlyGovernmentOfficial view returns (uint256) {
        return unverifiedRetailerAccounts.length;
    }

    function getUnverifiedRetailer(uint256 pos) public onlyGovernmentOfficial view returns (address) {
        return unverifiedRetailerAccounts[pos];
    }

    function countRetailers() public view returns (uint256) {
        return retailerAccounts.length;
    }

    function getNumRetailer(uint256 pos) public view returns(address) {
        return retailerAccounts[pos];
    }
    
    function setEligible(address _address) public onlyGovernmentOfficial {
        for (uint256 i = 0 ; i < unverifiedRetailerAccounts.length ; i++) {
            if (unverifiedRetailerAccounts[i] == _address) {
                unverifiedRetailerAccounts[i] = unverifiedRetailerAccounts[unverifiedRetailerAccounts.length-1];
                delete unverifiedRetailerAccounts[unverifiedRetailerAccounts.length-1];
                retailers[_address].isEligible = true;
                rc.addRole(_address, rc.retailerRoleID());
                unverifiedRetailerAccounts.length--;
                retailerAccounts.push(_address);
                break;
            }
        }
    }
}
