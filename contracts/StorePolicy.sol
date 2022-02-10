// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.22;

contract StorePolicy {
    mapping(uint256 => address) policyDetails;
    mapping(uint256 => string) policyName;
    uint256[] policies;

    function insertInList(uint256 id, address _address, string _name) external {
        policyDetails[id] = _address;
        policyName[id] = _name;
        policies.push(id);
    }

    function contains(uint256 id) external view returns(address) {
        return policyDetails[id];
    }

    function numPolicies() external view returns(uint256) {
        return policies.length;
    }

    function viewPolicy(uint256 index) external view returns(uint256, string) {
        return (policies[index], policyName[policies[index]]);
    }
}
