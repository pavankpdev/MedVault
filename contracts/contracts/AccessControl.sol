// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/// @title Access Control
/// @notice Provides Doctor and Ownership access
/// @dev Extend this contract to take advantage of Owner & Doctor roles
abstract contract AccessProtected is Context, Ownable {
    mapping(address => bool) internal _doctors; // user address => doctor? mapping

    event DoctorAccessSet(address _doctor, bool _enabled);

    /// @notice Set Doctor Access
    /// @param doctor Address of Doctor
    /// @param enabled Enable/Disable Doctor Access
    function setDoctorAccess(address doctor, bool enabled) public onlyOwner {
        _doctors[doctor] = enabled;
        emit DoctorAccessSet(doctor, enabled);
    }

    /// @notice Set Batch Doctor Access
    /// @param doctors Addresses of Doctors
    /// @param enabled Enable/Disable Doctor Access
    function batchSetDoctorAccess(address[] memory doctors, bool[] memory enabled)
    external
    onlyOwner
    {
        require(doctors.length == enabled.length, "Length mismatch");
        for (uint256 i = 0; i < doctors.length; i++) {
            setDoctorAccess(doctors[i], enabled[i]);
        }
    }

    /// @notice Check Doctor Access
    /// @param doctor Address of Doctor
    /// @return whether doctor has access (boolean)
    function isDoctor(address doctor) public view returns (bool) {
        return _doctors[doctor];
    }

    /// @dev Throws if called by any account other than the Doctor
    modifier onlyDoctors() {
        require(
            _doctors[_msgSender()] || _msgSender() == owner(),
            "AccessProtected: Caller does not have Doctor or Owner Access"
        );
        _;
    }
}