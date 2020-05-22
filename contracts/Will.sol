// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.6.0;


/* Since you canno return array of structs in sollidity (Still experimental)
    I decided to have an array of all beneficiaries and an array of all 
    their shares */

contract Will {

    enum State {NonExistent,Created, Active,PaidOut}
    struct willDetails {

        address payable [] beneficiaries;
        uint [] shares;
        uint totalAmount;
        uint payoutDate; 
        State state;
    }

    address payable [] willOwners;
    mapping (address => willDetails) allWills;

    function willAlreadyExists (address addr) internal view returns(bool) {
        if (allWills[addr].state != State.NonExistent) {
            return true;
        } else {
            return false;
        }
    }

    function initWill () public payable {
        require (!willAlreadyExists(msg.sender),"Your will already exists, Maybe modify it ?");
        willOwners.push(payable(msg.sender));
        allWills[msg.sender].totalAmount = msg.value;
        allWills[msg.sender].state = State.Created;
    }

    function addBenefeciary(address beneficiary, uint shareInAmount) internal {
        require(willAlreadyExists(msg.sender),"Your will doesn't exists, Maybe create one ?");
        allWills[msg.sender].beneficiaries.push(payable(beneficiary));
        allWills[msg.sender].shares.push(shareInAmount);
    }

    function getWillState() public view returns (State) {
        return allWills[msg.sender].state;
    }
    function getAllBeneficiaries() public view returns (address payable [] memory) {
        require (willAlreadyExists(msg.sender) ,"Your Will Doesn't Exist !"); 
        return allWills[msg.sender].beneficiaries;
    }

    function getSharesOfBeneficiaries () public view returns(uint [] memory) {
        require (willAlreadyExists(msg.sender) ,"Your Will Doesn't Exist !");
        return allWills[msg.sender].shares;
    }

    function getTotalAmount () public view returns(uint) {
        require (allWills[msg.sender].state != State.NonExistent ,"Your will doesn't exists, Maybe create one ?");
        return allWills[msg.sender].totalAmount;
    }

    function getCurrentEndDate() public view returns(uint) {
        require (allWills[msg.sender].state == State.Active ,"Your will doesn't exists, Maybe create one ?");
        return allWills[msg.sender].payoutDate; 
    }

    function editWill (address[] memory addresses,uint[] memory shares, uint payoutDate) public {
        require (willAlreadyExists(msg.sender),"Your will doesn't exists, Maybe create one ?");
        delete allWills[msg.sender].beneficiaries;

        for (uint i = 0; i < addresses.length;i++) {
            addBenefeciary(addresses[i],shares[i]);
        }
        allWills[msg.sender].payoutDate = now + payoutDate;
        allWills[msg.sender].state = State.Active;
    } 

    function deleteWill() public {
        require(willAlreadyExists(msg.sender), "Your Will doen't exist, Maybe create one ?");
        msg.sender.transfer(allWills[msg.sender].totalAmount);
        delete allWills[msg.sender];
    }

    function payoutExpiredWills() public {
        for (uint i=0; i < willOwners.length; i++){
            if (allWills[willOwners[i]].state == State.Active) {
                if (checkTimeOfWill(allWills[willOwners[i]].payoutDate) ){
                    payOutWill(willOwners[i]);
                }
            }
            if (allWills[willOwners[i]].state == State.NonExistent) {
                delete willOwners[i];
            }
        }
    }

    function payOutWill (address owner) internal {
        for (uint i=0;i<allWills[owner].beneficiaries.length; i++){
            if (!allWills[owner].beneficiaries[i].send(allWills[owner].shares[i])) {
                payable(owner).transfer((allWills[owner].shares[i]));
                allWills[owner].totalAmount - allWills[owner].shares[i];
            }
        }

        allWills[owner].state = State.PaidOut;
    }

    function getCurrentTime ()virtual internal view returns(uint){
        return now;
    }
    function checkTimeOfWill (uint time) public view returns(bool){
        return getCurrentTime() > time;
    }
}
