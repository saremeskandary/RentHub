// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

/**
 * @title IDisputeResolution
 * @notice Interface for managing and resolving disputes within the Rental DAO ecosystem
 * @dev This interface defines the structure and functions for handling disputes between renters and rentees
 */
interface IDisputeResolution is ICommonErrors {
	/**
	 * @dev Struct representing a dispute
	 * @param isActive Whether the dispute is currently active
	 * @param votesForRentee Number of votes in favor of the rentee
	 * @param votesForRenter Number of votes in favor of the renter
	 * @param hasVoted Mapping to track if an arbiter has already voted
	 */
	struct Dispute {
		bool isActive;
		uint256 votesForRentee;
		uint256 votesForRenter;
		mapping(address => bool) hasVoted;
	}

	/**
	 * @dev Emitted when a new dispute is initiated
	 * @param agreementId The ID of the rental agreement under dispute
	 */
	event DisputeInitiated(uint256 agreementId);

	/**
	 * @dev Emitted when a dispute is resolved
	 * @param agreementId The ID of the resolved rental agreement
	 * @param winner The address of the winning party
	 * @param loser The address of the losing party
	 */
	event DisputeResolved(uint256 agreementId, address winner, address loser);

	/**
	 * @dev Emitted when an arbiter casts a vote
	 * @param agreementId The ID of the rental agreement being voted on
	 * @param arbiter The address of the voting arbiter
	 * @param votedForRentee True if the arbiter voted for the rentee, false otherwise
	 */
	event ArbitersVoted(
		uint256 agreementId,
		address arbiter,
		bool votedForRentee
	);

	error ContractAlreadyInitialized();
	/**
	 * @dev Error thrown when attempting to initiate a dispute for an agreement that already has an active dispute
	 * @param agreementId The ID of the rental agreement
	 */
	error DisputeAlreadyExists(uint256 agreementId);

	/**
	 * @dev Error thrown when trying to interact with a non-existent or inactive dispute
	 * @param agreementId The ID of the rental agreement
	 */
	error NoActiveDispute(uint256 agreementId);

	/**
	 * @dev Error thrown when an arbiter attempts to vote more than once on a single dispute
	 * @param arbiter The address of the arbiter
	 * @param agreementId The ID of the rental agreement
	 */
	error ArbiterAlreadyVoted(address arbiter, uint256 agreementId);

	/**
	 * @dev Error thrown when a non-arbiter attempts to perform an arbiter-only action
	 * @param caller The address of the unauthorized caller
	 */
	error NotArbiter(address caller);

	function init(
		address _rentalAgreement,
		address _reputation,
		address _accessRestriction
	) external;

	/**
	 * @notice Initiates a dispute for a specific rental agreement
	 * @dev Can only be called for agreements without an active dispute
	 * @param _agreementId The ID of the rental agreement in dispute
	 */
	function initiateDispute(uint256 _agreementId) external;

	/**
	 * @notice Allows an arbiter to cast a vote on an active dispute
	 * @dev Can only be called by registered arbiters who haven't voted on this dispute yet
	 * @param _agreementId The ID of the rental agreement in dispute
	 * @param _voteForRentee True if voting for the Rentee, false if voting for the renter
	 */
	function voteOnDispute(uint256 _agreementId, bool _voteForRentee) external;

	/**
	 * @notice Resolves a dispute based on the votes cast and updates reputations accordingly
	 * @dev Can only be called for active disputes
	 * @param _agreementId The ID of the rental agreement in dispute
	 */
	function resolveDispute(uint256 _agreementId) external;

	/**
	 * @notice Adds a new arbiter to the system
	 * @dev Can only be called by an admin
	 * @param _arbiter The address of the new arbiter
	 */
	function addArbiter(address _arbiter) external;

	/**
	 * @notice Removes an arbiter from the system
	 * @dev Can only be called by an admin
	 * @param _arbiter The address of the arbiter to be removed
	 */
	function removeArbiter(address _arbiter) external;

	/**
	 * @notice Retrieves the current state of a dispute
	 * @param _disputeId The ID of the dispute to query
	 * @return isActive Whether the dispute is active
	 * @return votesForRentee The number of votes for the rentee
	 * @return votesForRenter The number of votes for the renter
	 */
	function getDispute(
		uint256 _disputeId
	)
		external
		view
		returns (bool isActive, uint256 votesForRentee, uint256 votesForRenter);
}
