// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

/**
 * @title IUserIdentity
 * @notice Interface for managing user verification and admin functions in the UserIdentity system
 * @dev This interface defines the core functionality for user verification management
 */
interface IUserIdentity is ICommonErrors {
	/**
	 * @dev Emitted when a user is successfully verified
	 * @param user The address of the verified user
	 */
	event UserVerified(address indexed user);

	/**
	 * @dev Emitted when a user's verification status is revoked
	 * @param user The address of the user whose verification was revoked
	 */
	event UserRevoked(address indexed user);

	/**
	 * @dev Error thrown when attempting to verify an already verified user
	 * @param user The address of the user that is already verified
	 */
	error UserAlreadyVerified(address user);

	/**
	 * @dev Error thrown when attempting to perform an action on an unverified user that requires verification
	 * @param user The address of the unverified user
	 */
	error UserNotVerified(address user);

	/**
	 * @notice Verifies a user and marks them as verified
	 * @dev Can only be called by the admin. Emits a UserVerified event upon success.
	 * @param _user The address of the user to be verified
	 */
	function verifyUser(address _user) external;

	/**
	 * @notice Revokes the verification status of a user
	 * @dev Can only be called by the admin. Emits a UserRevoked event upon success.
	 * @param _user The address of the user whose verification status is to be revoked
	 */
	function revokeUser(address _user) external;

	/**
	 * @notice Checks if a user is verified
	 * @dev This function can be called by any address
	 * @param _user The address of the user to check
	 * @return bool True if the user is verified, false otherwise
	 */
	function isVerifiedUser(address _user) external view returns (bool);

	/**
	 * @notice Transfers the admin role to a new address
	 * @dev Can only be called by the current admin. The new admin address cannot be the zero address.
	 * @param _newAdmin The address of the new admin
	 */
	function transferAdmin(address _newAdmin) external;
}
