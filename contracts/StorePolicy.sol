// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.22;

contract StorePolicy {
    mapping(uint256 => address) policyDetails;

    function insertInList(uint256 id, address _address) external {
        policyDetails[id] = _address;
    }

    function contains(uint256 id) external view returns(address) {
        return policyDetails[id];
    }
}
