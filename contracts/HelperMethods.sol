// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.22;

library HelperMethods {

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
    function integerToString(uint _i) internal pure 
      returns (string memory) {
      
      if (_i == 0) {
         return "0";
      }
      uint j = _i;
      uint len;
      
      while (j != 0) {
         len++;
         j /= 10;
      }
      bytes memory bstr = new bytes(len);
      j = len - 1;
      
      while (_i != 0) {
         bstr[j--] = byte(uint8(48 + _i % 10));
         _i /= 10;
      }
      return string(bstr);
   }
   
   function stringToUint(string s) internal pure returns (uint result) {
        result = 0;
        for (uint i = 0; i < bytes(s).length; i++) {
            require(uint(bytes(s)[i]) >= 48 && uint(bytes(s)[i]) <= 57, "Positive number required");
            result = result * 10 + (uint(bytes(s)[i]) - 48);
        }
    }
    
    function substring(string str, uint startIndex, uint endIndex) internal pure returns (string) {
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = bytes(str)[i];
        }
        return string(result);
    }
    
    function firstIndex(string s) internal pure returns(uint) {
        for (uint i = 0; i < bytes(s).length; i++) {
            if (uint(bytes(s)[i]) == 45) {
                return i;
            }
        }
    }
    
    function lastIndex(string s) internal pure returns(uint) {
        for (uint i = bytes(s).length - 1; i >= 0; i--) {
            if (uint(bytes(s)[i]) == 45) {
                return i;
            }
        }
    }
}