// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

/// @title IReputation - Interface for the Reputation contract
/// @notice Interface for managing user reputation scores
interface IReputation is ICommonErrors {
	event ReputationUpdated(
		uint256 agreementId,
		address user,
		int256 change,
		int256 newScore
	);

	// Custom errors
	error InvalidAddress(address user);
	error InvalidUpdaterAddress(address updater);

	/// @notice Updates the reputation of a user
	/// @param _agreementId The id of the agreement
	/// @param _user The address of the user whose reputation is to be updated
	/// @param _change The amount by which the user's reputation should change
	function updateReputation(
		uint256 _agreementId,
		address _user,
		int256 _change
	) external;

	/// @notice Retrieves the reputation score of a user
	/// @param _user The address of the user whose reputation score is being queried
	/// @return The reputation score of the user
	function getReputation(address _user) external view returns (int256);
}
