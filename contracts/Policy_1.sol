// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.22;
import "./FarmerContract.sol";
import "./StorePolicy.sol";

contract Policy_1 {
    FarmerContract fc;
    StorePolicy sp;

    // ID number of your policy
    uint256 policyID = 31124;
    uint256 policyTransferAmount = 4000000000000000000;
    uint256 timeGap = 2592000;

    mapping(address => uint256) timestamp;

    constructor(address _fcAddress, address _spaddress) public {
        fc = FarmerContract(_fcAddress);
        sp = StorePolicy(_spaddress);
        sp.insertInList(policyID, address(this));
    }

    // Code to check if farmer is eligible for the policy
    function isEligible(address _farmerAddress) external view returns (bool) {
        string memory _name;
        string memory _stateOfResidence;
        string memory _gender;
        uint256 _landOwned;
        int256 _latitude;
        int256 _longitude;
        bool isVerified;

        (_name, _stateOfResidence, _gender, _landOwned, _latitude, _longitude, isVerified) = fc
        .getFarmer(_farmerAddress);

        if (_landOwned < 10) {
            return true;
        }
        return false;
    }

    // Execution (Transfer of money)
    function action(address recipient, uint256 current) external payable {
        if (current-timestamp[recipient]>=timeGap) {
            recipient.transfer(policyTransferAmount);
            tx.origin.transfer(msg.value - policyTransferAmount);
            timestamp[recipient] = current;
        } else {
            tx.origin.transfer(msg.value);
        }
    }
}
