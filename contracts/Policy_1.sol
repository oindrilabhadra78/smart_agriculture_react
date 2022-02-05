// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
import "./FarmerContract.sol";
import "./Roles.sol";

contract Policy_1 {
    Roles rc;
    FarmerContract fc;

    // ID number of your policy
    uint256 policyID = 31124;
    uint256 policyTransferAmount = 100;

    constructor(address _fcAddress, address _rcaddress) public {
        rc = Roles(_rcaddress);
        fc = FarmerContract(_fcAddress);
    }

    modifier onlyGovernmentOfficial() {
        require(rc.getRole(tx.origin) == rc.governmentID(), "Only government officials can access");
        _;
    }

    modifier onlyFarmer() {
        require(rc.getRole(tx.origin) == rc.farmerRoleID(), "Only farmers can access");
        _;
    }

    // Code to check if farmer is eligible for the policy
    function isEligible(address _farmerAddress) private view returns (bool) {
        string memory _name;
        string memory _stateOfResidence;
        string memory _gender;
        uint256 _landOwned;
        int256 _latitude;
        int256 _longitude;
        bool isVerified;

        (_name, _stateOfResidence, _gender, _landOwned, _latitude, _longitude, isVerified) = fc
        .getFarmer(_farmerAddress);

        if (_landOwned < 10) return true;
        return false;
    }

    // Description of policy (what should be shown on screen)
    function description()
    public
    view
    onlyFarmer
    returns (string memory _description, uint256 _policyID) {
        if (isEligible(tx.origin) == true) {
            return ("You are eligible for Kisan yojana scheme, you have land less than 10", policyID);
        } else {
            return ("You are not eligible for Kisan yojana scheme, you have land more than or equal to 10", policyID);
        }
    }

    // Fund (To fund the smart contract)
    function fund() public payable onlyGovernmentOfficial {

    }

    // Execution (Transfer of money etc)
    function action(address recipient) public payable onlyGovernmentOfficial {
        if (isEligible(recipient) == true) {
            recipient.transfer(policyTransferAmount);
        }
    }
}
