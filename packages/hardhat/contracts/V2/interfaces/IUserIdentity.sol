// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title IUserIdentity - Interface for the UserIdentity contract
/// @notice Interface for managing user verification and admin functions in the UserIdentity system
interface IUserIdentity {
	/// @notice Verifies a user and marks them as verified
	/// @param _user The address of the user to be verified
	function verifyUser(address _user) external;

	/// @notice Revokes the verification status of a user
	/// @param _user The address of the user whose verification status is to be revoked
	function revokeUser(address _user) external;

	/// @notice Checks if a user is verified
	/// @param _user The address of the user to check
	/// @return True if the user is verified, false otherwise
	function isVerifiedUser(address _user) external view returns (bool);

	/// @notice Transfers the admin role to a new address
	/// @param _newAdmin The address of the new admin
	function transferAdmin(address _newAdmin) external;
}
