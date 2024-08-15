// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ISocialFi } from "./interfaces/ISocialFi.sol";

contract SocialFi is ISocialFi {
	mapping(address => uint256) public rewards;

	function rewardUser(address _user, uint256 _amount) external {
		if (_amount <= 0) revert RewardAmountMustBeGreaterThanZero(_amount);
		rewards[_user] += _amount;

		emit UserRewarded(_user, _amount);
	}

	function getRewardBalance(address _user) external view returns (uint256) {
		return rewards[_user];
	}

	function claimRewards() external {
		uint256 amount = rewards[msg.sender];
		if (amount <= 0) revert NoRewardsToClaim();

		rewards[msg.sender] = 0;

		// Logic to transfer the rewards to the user
		payable(msg.sender).transfer(amount);
	}

	// Allow the contract to receive payments (if rewards are in Ether)
	receive() external payable {}
}
