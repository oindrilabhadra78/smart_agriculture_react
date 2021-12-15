// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
import "./Roles.sol";
//import "github.com/provable-things/ethereum-api/provableAPI_0.4.25.sol";

contract FarmerContract is Roles/*, usingProvable*/ {
    Roles public rc;
    string public recommendedCrops;
    event newProvableQuery(string description);
    event LogConstructorInitiated(string nextStep);
    
    constructor(address _address) public {
        rc = Roles(_address);
        emit LogConstructorInitiated("Constructor was initiated. Call 'update()' to send the Provable Query.");
    }
    
    struct Farmer {
        string name;
        string stateOfResidence;
        string gender;
        uint256 landOwned;
        int256 latitude;
        int256 longitude;
        bool isEligible;
    }

    mapping(address => Farmer) public farmers;
    address[] public farmerAccounts;
    address[] public unverifiedFarmerAccounts;
    
    modifier onlyGovernmentOfficial() {
        require(rc.getRole(tx.origin) == rc.governmentID(), "Only government officials can access");
        _;
    }
    
    modifier onlyFarmer() {
        require(rc.getRole(tx.origin) == rc.farmerRoleID());
        _;
    }

    function addFarmer(
        string memory _name,
        string memory _stateOfResidence,
        string memory _gender,
        uint256 _landOwned,
        int256 _latitude,
        int256 _longitude
    ) public {
        Farmer storage farmer = farmers[tx.origin];
        farmer.name = _name;
        farmer.stateOfResidence = _stateOfResidence;
        farmer.gender = _gender;
        farmer.landOwned = _landOwned;
        farmer.latitude = _latitude;
        farmer.longitude = _longitude;
        farmer.isEligible = false;

        unverifiedFarmerAccounts.push(tx.origin);
    }

    function getFarmers() public view returns (address[] memory) {
        return farmerAccounts;
    }

    function getFarmer(address _address)
        public 
        view
        returns (
            string memory _name,
            string memory _stateOfResidence,
            string memory _gender,
            uint256 _landOwned,
            int256 _latitude,
            int256 _longitude,
            bool _isEligible
        )
    {
        require(farmers[_address].isEligible == true || _address == tx.origin || rc.getRole(tx.origin) == rc.governmentID(), "Unauthorised actor");

        return (
            farmers[_address].name,
            farmers[_address].stateOfResidence,
            farmers[_address].gender,
            farmers[_address].landOwned,
            farmers[_address].latitude,
            farmers[_address].longitude,
            farmers[_address].isEligible
        );
    }

    function getLocation(address _address) external view returns(int256, int256) {
        return (farmers[_address].latitude, farmers[_address].longitude);
    }

    function countFarmers() public view returns (uint256) {
        return farmerAccounts.length;
    }

    function getNumFarmer(uint256 pos) public view returns(address) {
        return farmerAccounts[pos];
    }
    
    function setEligible(address _address) public onlyGovernmentOfficial {
        for (uint256 i = 0 ; i < unverifiedFarmerAccounts.length ; i++) {
            if (unverifiedFarmerAccounts[i] == _address) {
                unverifiedFarmerAccounts[i] = unverifiedFarmerAccounts[unverifiedFarmerAccounts.length-1];
                delete unverifiedFarmerAccounts[unverifiedFarmerAccounts.length-1];
                unverifiedFarmerAccounts.length--;
                farmers[_address].isEligible = true;
                farmerAccounts.push(_address);
                rc.addRole(_address, rc.farmerRoleID());
                break;
            }
        }
    }
    
    function getUnverifiedFarmers() public onlyGovernmentOfficial view returns (address[] memory) {
        return unverifiedFarmerAccounts;
    }
    
    function getNumUnverifiedFarmers() public onlyGovernmentOfficial view returns (uint256) {
        return unverifiedFarmerAccounts.length;
    }

    function getUnverifiedFarmer(uint256 pos) public onlyGovernmentOfficial view returns (address) {
        return unverifiedFarmerAccounts[pos];
    }

    /*function __callback(bytes32 myid, string result, bytes proof) public {
        if (msg.sender != provable_cbAddress()) revert();
        recommendedCrops = result;
    }
    
    // Only call this function
    function getCropRecommendation() public onlyFarmer {
        emit newProvableQuery("Provable query was sent, standing by for the answer..");
        provable_query("URL", "json(http://358c-35-189-177-200.ngrok.io/recommend?temperature=25.0&humidity=97.0&ph=6.9&rainfall=200.0).result");
    }*/
}
