// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
import "./Roles.sol";

contract DistributorContract {
    Roles public rc;

    constructor(address _address) public {
        rc = Roles(_address);
    }

    struct Distributor {
        string name;
        string contact;
        int256 latitude;
        int256 longitude;
        bool isEligible;
    }

    mapping(address => Distributor) public distributors;
    address[] public distributorAccounts;
    address[] public unverifiedDistributorAccounts;
    
    modifier onlyGovernmentOfficial() {
        require(rc.getRole(tx.origin) == rc.governmentID(), "Only government officials can access");
        _;
    }

    function addDistributor(
        string memory _name,
        string memory _contact,
        int256 _latitude,
        int256 _longitude
    ) public {
        Distributor storage distributor = distributors[tx.origin];
        distributor.name = _name;
        distributor.contact = _contact;
        distributor.latitude = _latitude;
        distributor.longitude = _longitude;
        distributor.isEligible = false;
        
        unverifiedDistributorAccounts.push(tx.origin);
    }
    
    function getDistributors() public view returns (address[] memory) {
        return distributorAccounts;
    }

    function getDistributor(address _address)
        public
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
            distributors[_address].name, 
            distributors[_address].contact,
            distributors[_address].latitude,
            distributors[_address].longitude,
            distributors[_address].isEligible
        );
    }

    function getLocation(address _address) external view returns(int256, int256) {
        return (distributors[_address].latitude, distributors[_address].longitude);
    }
        
    function getUnverifiedDistributorAccounts() public onlyGovernmentOfficial view returns (address[] memory) {
        return unverifiedDistributorAccounts;
    }

    function getNumUnverifiedDistributors() public onlyGovernmentOfficial view returns (uint256) {
        return unverifiedDistributorAccounts.length;
    }

    function getUnverifiedDistributor(uint256 pos) public onlyGovernmentOfficial view returns (address) {
        return unverifiedDistributorAccounts[pos];
    }
    
    function setEligible(address _address) public onlyGovernmentOfficial {
        for (uint256 i = 0 ; i < unverifiedDistributorAccounts.length ; i++) {
            if (unverifiedDistributorAccounts[i] == _address) {
                unverifiedDistributorAccounts[i] = unverifiedDistributorAccounts[unverifiedDistributorAccounts.length-1];
                delete unverifiedDistributorAccounts[unverifiedDistributorAccounts.length-1];
                unverifiedDistributorAccounts.length--;
                distributors[_address].isEligible = true;
                distributorAccounts.push(_address);
                rc.addRole(_address, rc.distributorRoleID());
                break;
            }
        }
    }
}
