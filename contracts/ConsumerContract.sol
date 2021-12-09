// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.22;
import "./Roles.sol";

contract ConsumerContract {
    Roles public rc;
    
    constructor(address _address) public {
        rc = Roles(_address);
    }

    struct Consumer {
        string name;
        string contact;
    }

    mapping(address => Consumer) public consumers;
    address[] public consumerAccounts;

    function addConsumer(
        string memory _name,
        string memory _contact
    ) public {
        Consumer storage consumer = consumers[tx.origin];
        
        consumer.name = _name;
        consumer.contact = _contact;
        
        consumerAccounts.push(tx.origin);
        rc.addRole(tx.origin, rc.consumerRoleID());
    }

    function getConsumer(address _address)
        public
        view
        returns (string memory _name, string memory _contact)
    {
        return (consumers[_address].name, consumers[_address].contact);
    }
}
