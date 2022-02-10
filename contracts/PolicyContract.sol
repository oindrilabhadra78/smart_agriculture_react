// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.22;
import "./StorePolicy.sol";
import "./Roles.sol";

interface Policy {
    function isEligible(address) external view returns (bool);
    function action(address, uint256) external payable;
}

contract PolicyContract {
    Roles rc;
    StorePolicy p; 
    constructor(address _spaddress, address _rcaddress) public {
        p = StorePolicy(_spaddress);
        rc = Roles(_rcaddress);
    }

    modifier onlyGovernmentOfficial() {
        require(rc.getRole(tx.origin) == rc.governmentID(), "Only government officials can access");
        _;
    }

    modifier onlyFarmer() {
        require(rc.getRole(tx.origin) == rc.farmerRoleID(), "Only farmers can access");
        _;
    }

    function checkEligibility(uint256 id) public view onlyFarmer returns(bool) {
        address _address = p.contains(id);
        if (_address != address(0)) {
            return Policy(_address).isEligible(tx.origin);
        } else {
            return false;
        }
    }

    function transferFunds(uint256 id, address _farmerAddress, uint256 currentTime) public payable onlyGovernmentOfficial {
        address _address = p.contains(id);
        if (_address != address(0) && Policy(_address).isEligible(_farmerAddress) == true) {
            Policy(_address).action.value(msg.value)(_farmerAddress, currentTime);
        } else {
            tx.origin.transfer(msg.value);
        }
    }  

    function viewNumPolicy() public view returns(uint256) {
        return p.numPolicies();
    }

    function viewPolicyDetails(uint256 index) public view returns(uint256, string) {
        return p.viewPolicy(index);
    }
}