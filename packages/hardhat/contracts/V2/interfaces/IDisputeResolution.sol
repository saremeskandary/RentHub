// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title IDisputeResolution - Interface for the DisputeResolution contract
/// @notice Interface for managing and resolving disputes within the Rental DAO ecosystem
interface IDisputeResolution {
	/// @notice Initiates a dispute for a specific rental agreement
	/// @param _agreementId The ID of the rental agreement in dispute
	function initiateDispute(uint256 _agreementId) external;

	/// @notice Casts a vote on an active dispute
	/// @param _agreementId The ID of the rental agreement in dispute
	/// @param _voteForOwner True if voting for the owner, false if voting for the renter
	function voteOnDispute(uint256 _agreementId, bool _voteForOwner) external;

	/// @notice Resolves a dispute based on the votes cast and updates reputations accordingly
	/// @param _agreementId The ID of the rental agreement in dispute
	function resolveDispute(uint256 _agreementId) external;

	/// @notice Adds a new arbiter to the system
	/// @param _arbiter The address of the new arbiter
	function addArbiter(address _arbiter) external;

	/// @notice Removes an arbiter from the system
	/// @param _arbiter The address of the arbiter to be removed
	function removeArbiter(address _arbiter) external;
}
