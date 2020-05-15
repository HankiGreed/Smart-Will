// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.6.0;


/* Since you canno return array of structs in sollidity (Still experimental)
    I decided to have an array of all beneficiaries and an array of all 
    the share */

contract Will {

    enum State {NonExistent,Created, Active, OverDeadline, PaidOut}
    struct willDetails {

        address payable [] beneficiaries;
        uint [] shares;
        uint totalAmount;
        uint payoutDate; 
        State state;
    }

    mapping (address => willDetails) allWills;


    modifier inState (State expected,address addr) {
        require (allWills[addr].state == expected,"Invalid method call in this state !");
        _;
    }

    function willAlreadyExists (address addr) internal view returns(bool) {
        if (allWills[addr].state != State.NonExistent) {
            return true;
        } else {
            return false;
        }
    }

    function initWill () public payable {
        require (!willAlreadyExists(msg.sender),"Your will already exists, Maybe modify it ?");
        allWills[msg.sender].totalAmount = msg.value;
        allWills[msg.sender].state = State.Created;
    }

    function addBenefeciary(address beneficiary, uint shareInAmount) internal {
        require(willAlreadyExists(msg.sender),"Your will doesn't exists, Maybe create one ?");
        allWills[msg.sender].beneficiaries.push(payable(beneficiary));
        allWills[msg.sender].shares.push(shareInAmount);
    }


    function getAllBeneficiaries() public view returns (address payable [] memory) {
        require (allWills[msg.sender].state != State.Active ,"Your Will either has no beneficiaries, or is Paid out !");
        return allWills[msg.sender].beneficiaries;
    }

    function getSharesOfBeneficiaries () public view returns(uint [] memory) {
        require (allWills[msg.sender].state != State.Active ,"Your Will either has no beneficiaries, or is Paid out !");
        return allWills[msg.sender].shares;
    }

    function getTotalAmount () public view returns(uint) {
        require (allWills[msg.sender].state != State.Active ,"Your will doesn't exists, Maybe create one ?");
        return allWills[msg.sender].totalAmount;
    }


    function editWill (address[] memory addresses,uint[] memory shares, uint payoutDate) public {
        require (willAlreadyExists(msg.sender),"Your will doesn't exists, Maybe create one ?");
        delete allWills[msg.sender].beneficiaries;

        for (uint i = 0; i < addresses.length;i++) {
            addBenefeciary(addresses[i],shares[i]);
        }
        allWills[msg.sender].payoutDate = payoutDate;
    } 
}
