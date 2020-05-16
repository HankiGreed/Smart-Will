// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.6.0;

import './Will.sol';

contract TestWill is Will {
    uint time;

    function getCurrentTime() override internal view returns(uint) {
        return time;
    }

    function setCurrentTime(uint newTime) public{
        time = now + newTime;
    } 
}
