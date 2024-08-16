// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title IDisputeResolution - Interface for the DisputeResolution contract
/// @notice Interface for managing and resolving disputes within the Rental DAO ecosystem
interface IDisputeResolution {
	struct Dispute {
		bool isActive;
		uint256 votesForRentee;
		uint256 votesForRenter;
		mapping(address => bool) hasVoted;
	}

	event DisputeInitiated(uint256 agreementId);
	event DisputeResolved(uint256 agreementId, address winner, address loser);
	event ArbitersVoted(
		uint256 agreementId,
		address arbiter,
		bool votedForRentee
	);

	// Custom errors
	error InvalidAddress(string field);
	error DisputeAlreadyExists(uint256 agreementId);
	error NoActiveDispute(uint256 agreementId);
	error ArbiterAlreadyVoted(address arbiter, uint256 agreementId);

	/// @notice Initiates a dispute for a specific rental agreement
	/// @param _agreementId The ID of the rental agreement in dispute
	function initiateDispute(uint256 _agreementId) external;

	/// @notice Casts a vote on an active dispute
	/// @param _agreementId The ID of the rental agreement in dispute
	/// @param _voteForRentee True if voting for the Rentee, false if voting for the renter
	function voteOnDispute(uint256 _agreementId, bool _voteForRentee) external;

	/// @notice Resolves a dispute based on the votes cast and updates reputations accordingly
	/// @param _agreementId The ID of the rental agreement in dispute
	function resolveDispute(uint256 _agreementId) external;

	/// @notice Adds a new arbiter to the system
	/// @param _arbiter The address of the new arbiter
	function addArbiter(address _arbiter) external;

	/// @notice Removes an arbiter from the system
	/// @param _arbiter The address of the arbiter to be removed
	function removeArbiter(address _arbiter) external;

	function getDispute(
		uint256 _disputeId
	) external view returns (bool, uint256, uint256);
}
