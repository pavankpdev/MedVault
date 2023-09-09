// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract EHRVault {
    using Counters for Counters.Counter;

    Counters.Counter private _recordIds;

    mapping (uint256 => address) private records;

    event RecordAdded(uint256 indexed id, address indexed recordAddress);

    function addRecord(address recordAddress) public returns (uint256) {
        _recordIds.increment();

        uint256 newRecordId = _recordIds.current();
        records[newRecordId] = recordAddress;

        emit RecordAdded(newRecordId, recordAddress);

        return newRecordId;
    }

    function getRecord(uint256 id) public view returns (address) {
        return records[id];
    }

    function totalRecords() public view returns (uint256) {
        return _recordIds.current();
    }

}