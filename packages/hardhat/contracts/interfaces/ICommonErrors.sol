// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/**
 * @title ICommonErrors
 * @dev Defines common error messages to be used across multiple contracts.
 */
interface ICommonErrors {
	// Common errors
	/// @dev Thrown when a function restricted to the owner is called by a non-owner.
	error NotOwner(address caller);
	/// @dev Thrown when a function restricted to admins is called by a non-admin.
	error NotAdmin(address caller);
	/// @dev Thrown when an invalid address is provided.
	error InvalidAddress(string field);
	/// @dev Thrown when an action is attempted by an unauthorized address.
	error NotAuthorized();
	error MustBeGraterThanZero(string param);
	error InsufficientBalance(uint256 available, uint256 required);
}
