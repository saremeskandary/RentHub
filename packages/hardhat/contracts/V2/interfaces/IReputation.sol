// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title IReputation - Interface for the Reputation contract
/// @notice Interface for managing user reputation scores
interface IReputation {
	event ReputationUpdated(address user, int256 newScore);

	// Custom errors
	error InvalidUserAddress(address user);
	error InvalidUpdaterAddress(address updater);

	/// @notice Updates the reputation of a user
	/// @param _user The address of the user whose reputation is to be updated
	/// @param _change The amount by which the user's reputation should change
	function updateReputation(address _user, int256 _change) external;

	/// @notice Retrieves the reputation score of a user
	/// @param _user The address of the user whose reputation score is being queried
	/// @return The reputation score of the user
	function getReputation(address _user) external view returns (int256);

	/// @notice Grants the UPDATER_ROLE to a specific address
	/// @param _updater The address to be granted the UPDATER_ROLE
	function addUpdater(address _updater) external;

	/// @notice Revokes the UPDATER_ROLE from a specific address
	/// @param _updater The address to be revoked the UPDATER_ROLE
	function removeUpdater(address _updater) external;
}
