// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
import "./Roles.sol";
import "./FarmerContract.sol";
import "./DistributorContract.sol";
import "./RetailerContract.sol";
import "./ColdStorageContract.sol";

contract GovernmentContract {
    Roles public rc;
    FarmerContract public fc;
    DistributorContract public dc;
    RetailerContract public rtc;
    ColdStorageContract public csc;
    
    constructor(address _address, address _fcAddress, address _dcAddress, address _rtcAddress, address _cscAddress) public {
        rc = Roles(_address);
        fc = FarmerContract(_fcAddress);
        dc = DistributorContract(_dcAddress);
        rtc = RetailerContract(_rtcAddress);
        csc = ColdStorageContract(_cscAddress);
    }
    
    struct GovtOfficial {
        string name;
        string govId;
    }
    
    mapping(address => GovtOfficial) public govt;
    address[] public govtAccounts;
    
    function addGovtOfficial(
        string memory _name,
        string memory _govId
    ) public {
        GovtOfficial storage govtOfficial = govt[tx.origin];
        govtOfficial.name = _name;
        govtOfficial.govId = _govId;

        govtAccounts.push(tx.origin);
        rc.addRole(tx.origin, rc.governmentID());
    }

    function getOfficial(address _address)
        public
        view
        returns (string memory _name, string memory _govId)
    {
        return (govt[_address].name, govt[_address].govId);
    }
    
    function setFarmerAsEligible(address _address) public {
        fc.setEligible(_address);
    }
    
    function setDistributorAsEligible(address _address) public {
        dc.setEligible(_address);
    }
    
    function setRetailerAsEligible(address _address) public {
        rtc.setEligible(_address);
    }
    
    function setColdStorageAsEligible(address _address) public {
        csc.setEligible(_address);
    }
    
    /*function setPrice(address _address, uint256 price) public {
        food.setPrice(price);
    }*/
}