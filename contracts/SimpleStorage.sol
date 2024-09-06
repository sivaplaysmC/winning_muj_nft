// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    uint8 storedValue;

    function set(uint8 x) public {
        storedValue = x;
    }

    function get() public view returns (uint8) {
        return storedValue;
    }
}
