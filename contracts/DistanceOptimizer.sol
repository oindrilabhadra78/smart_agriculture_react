// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;

import "./Roles.sol";
import "./FarmerContract.sol";
import "./DistributorContract.sol";
import "./RetailerContract.sol";
import "./ColdStorageContract.sol";

contract DistanceOptimizer {
    Roles rc;
    FarmerContract fc;
    DistributorContract dc;
    RetailerContract rtc;
    ColdStorageContract csc;
    
    constructor(address _rcaddress, address _fcaddress, address _dcaddress, address _rtcaddress, address _cscaddress) public {
        rc = Roles(_rcaddress);
        fc = FarmerContract(_fcaddress);
        dc = DistributorContract(_dcaddress);
        rtc = RetailerContract(_rtcaddress);
        csc = ColdStorageContract(_cscaddress);
    }
    
    modifier onlyFarmer() {
        require(rc.getRole(tx.origin) == rc.farmerRoleID(), "Only farmer can call");
        _;
    }
    
    modifier onlyDistributor() {
        require(rc.getRole(tx.origin) == rc.distributorRoleID(), "Only distributor can call");
        _;
    }
    
    modifier onlyRetailer() {
        require(rc.getRole(tx.origin) == rc.retailerRoleID(), "Only retailer can call");
        _;
    }
    
    int256[181] cosValues = [32767, 32740, 32711, 32684, 32655, 32627, 32578, 32495, 32410, 32327, 32243, 32160, 32034, 31896, 31756, 31619, 31479, 31335, 31141, 30950, 30756, 
        30565, 30371, 30155, 29908, 29667, 29419, 29178, 28931, 28647, 28350, 28059, 27762, 27471, 27163, 26826, 26482, 26145, 25801, 25464, 25093, 24714, 
        24326, 23946, 23558, 23170, 22752, 22323, 21905, 21476, 21057, 20616, 20162, 19698, 19244, 18780, 18326, 17838, 17353, 16858, 16373, 15877, 15390, 
        14867, 14356, 13834, 13323, 12801, 12279, 11735, 11203, 10659, 10127, 9583, 9037, 8477, 7929, 7368, 6820, 6257, 5698, 5126, 4567, 3995, 3436, 2861, 
        2297, 1719, 1155, 578, 0, int256(-564), int256(-1141), int256(-1706), int256(-2283), int256(-2848), int256(-3423), int256(-3982), int256(-4553), int256(-5113), int256(-5684), 
        int256(-6243), int256(-6807), int256(-7355), int256(-7915), int256(-8464), int256(-9024), int256(-9571), 
        int256(-10115), int256(-10647), int256(-11191), int256(-11723), int256(-12267), int256(-12788), int256(-13311), int256(-13822), int256(-14344), int256(-14855), int256(-15377),
        int256(-15866), int256(-16361), int256(-16846), int256(-17342), int256(-17826), int256(-18314), int256(-18769), 
        int256(-19233), int256(-19687), int256(-20151), int256(-20605), int256(-21047), int256(-21466), int256(-21894), int256(-22313), int256(-22741), int256(-23170), int256(-23549),
        int256(-23937), int256(-24316), int256(-24704), int256(-25084), int256(-25456), int256(-25793), int256(-26137), 
        int256(-26474), int256(-26818), int256(-27155), int256(-27464), int256(-27755), int256(-28052), int256(-28342), int256(-28639), int256(-28924), int256(-29171), int256(-29413),
        int256(-29660), int256(-29902), int256(-30149), int256(-30366), int256(-30560), int256(-30751), int256(-30945), 
        int256(-31136), int256(-31330), int256(-31474), int256(-31615), int256(-31752), int256(-31892), int256(-32030), int256(-32157), int256(-32240), int256(-32325), int256(-32408),
        int256(-32492), int256(-32575), int256(-32626), int256(-32654), int256(-32682), int256(-32710), int256(-32738), int256(-32767)];
        
    uint16[91] sinValues = [0,564,1141,1706,2283,2848,3423,3982,4553,5113,5684,6243,6807,7355,7915,8464,9024,9571,10115,10647,11191,11723,12267,12788,13311,13822,14344,14855,
        15377,15866,16361,16846,17342,17826,18314,18769,19233,19687,20151,20605,21047,21466,21894,22313,22741,23170,23549,23937,24316,24704,25084,25456,25793,26137,26474,26818,27155,27464,27755,28052,
        28342,28639,28924,29171,29413,29660,29902,30149,30366,30560,30751,30945,31136,31330,31474,31615,31752,31892,32030,32157,32240,32325,32408,32492,32575,32626,32654,32682,32710,32738,32767];

    function sinDegrees (int256 _degrees) private view returns (int256) {
        bool neg = false;
        if (_degrees < 0) {
            neg = true;
            _degrees = -_degrees;
        }
        uint256 degrees = uint256(_degrees);
        
        if (neg == true) {
            return -1 * int256(sinValues[degrees]);
        } else {
            return sinValues[degrees];
        }
    }

    function cosDegrees (int256 _degrees) private view returns (int256) {
        if (_degrees < 0) {
            _degrees = -_degrees;
        }
        uint256 degrees = uint256(_degrees);
        return cosValues[degrees];
    }
    
    function findDistance(int256 lat1, int256 lat2, int256 long1, int256 long2) public view returns (uint256) {
        int256 g;
        int256 diff = 2**255 - 1;
        int256 f;
        
        if (long2 >= long1) {
            f = (sinDegrees(lat1) * sinDegrees(lat2) * 32767 + cosDegrees(lat1) * cosDegrees(lat2) * cosDegrees(long2 - long1)) / (32767 * 32767);
        } else {
            f = (sinDegrees(lat1) * sinDegrees(lat2) * 32767 + cosDegrees(lat1) * cosDegrees(lat2) * cosDegrees(long1 - long2)) / (32767 * 32767);
        }
        
        for(int256 i = 0; i<=180 ; i++) {
            int256 x = f - cosDegrees(i);
            
            if (x<0 && -x<diff) {
                diff = -x;
                g = i;
            } else if (x>=0 && x<diff) {
                diff = x;
                g = i;
            }
        }
        
        return uint256(g*70081/630);
    }
    
    function getNearestColdStorage() public view onlyFarmer returns(address) {
        address[] memory coldStorages = csc.getColdStorages();
        uint256 minDistance = uint256(-1);
        uint256 coldStorage = uint256(-1);
        
        int256 _latitude1;
        int256 _longitude1;
        
        (_latitude1, _longitude1) = fc.getLocation(tx.origin);
        
        for (uint256 i = 0; i < coldStorages.length; i++) {
            int256 _latitude2;
            int256 _longitude2;
            (_latitude2, _longitude2) = csc.getLocation(coldStorages[i]);
            uint256 distance = findDistance(_latitude1, _latitude2, _longitude1, _longitude2);
            if (distance < minDistance) {
                minDistance = distance;
                coldStorage = i;
            }
        }
        
        return (coldStorage == uint256(-1) ? address(0) : coldStorages[coldStorage]); 
    }
    
    function getNearestFarmer() public view onlyDistributor returns(address) {
        address[] memory farmers = fc.getFarmers();
        uint256 minDistance = uint256(-1);
        uint256 farmer = uint256(-1);
        
        int256 _latitude1;
        int256 _longitude1;
        
        (_latitude1, _longitude1) = dc.getLocation(tx.origin);
        
        for (uint256 i = 0; i < farmers.length; i++) {
            int256 _latitude2;
            int256 _longitude2;
            (_latitude2, _longitude2) = fc.getLocation(farmers[i]);
            uint256 distance = findDistance(_latitude1, _latitude2, _longitude1, _longitude2);
            if (distance < minDistance) {
                minDistance = distance; 
                farmer = i;
            }
        }
        
        return (farmer == uint256(-1) ? address(0) : farmers[farmer]); 
    }
    
    function getNearestDistributor() public view onlyRetailer returns(address) {
        address[] memory distributors = dc.getDistributors();
        uint256 minDistance = uint256(-1);
        uint256 distributor = uint256(-1);
        
        int256 _latitude1;
        int256 _longitude1;
        
        (_latitude1, _longitude1) = rtc.getLocation(tx.origin);
        
        for (uint256 i = 0; i < distributors.length; i++) {
            int256 _latitude2;
            int256 _longitude2;
            (_latitude2, _longitude2) = dc.getLocation(distributors[i]);
            uint256 distance = findDistance(_latitude1, _latitude2, _longitude1, _longitude2);
            if (distance < minDistance) {
                minDistance = distance;
                distributor = i;
            }
        }
        
        return (distributor == uint256(-1) ? address(0) : distributors[distributor]); 
    }
}



