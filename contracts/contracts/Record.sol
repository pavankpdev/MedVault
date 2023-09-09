// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./AccessControl.sol";

/// @title Records Contract
/// @notice Deploys new Record contract for every new record the user creates
/// @dev This contract uses AccessProtected to restrict access to Doctor and the user(owner)
contract Record is AccessProtected {
    string private name;
    string private ipfs;

    constructor(string memory _name, string memory _ipfs) {
        name = _name;
        ipfs = _ipfs;
    }

    function getDetails() external view onlyDoctors returns (string memory, string memory) {
        return (name, ipfs);
    }
}