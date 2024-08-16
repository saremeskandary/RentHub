// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title ISocialFi - Interface for the SocialFi contract
/// @notice Interface for managing user rewards
interface ISocialFi {
	event UserRewarded(address indexed user, uint256 amount);

	// Custom errors
	error RewardAmountMustBeGreaterThanZero(uint256 amount);
	error NoRewardsToClaim();

	/// @notice Rewards a user with a specific amount
	/// @param _user The address of the user to be rewarded
	/// @param _amount The amount of the reward
	function rewardUser(address _user, uint256 _amount) external;

	/// @notice Retrieves the reward balance of a user
	/// @param _user The address of the user whose reward balance is being queried
	/// @return The reward balance of the user
	function getRewardBalance(address _user) external view returns (uint256);

	/// @notice Allows a user to claim their accumulated rewards
	function claimRewards() external;
}
