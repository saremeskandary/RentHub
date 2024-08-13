// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract SocialFi {
	mapping(address => uint256) public rewards;

	event UserRewarded(address indexed user, uint256 amount);

	function rewardUser(address _user, uint256 _amount) external {
		require(_amount > 0, "Reward amount must be greater than zero");
		rewards[_user] += _amount;

		emit UserRewarded(_user, _amount);
	}

	function getRewardBalance(address _user) external view returns (uint256) {
		return rewards[_user];
	}

	function claimRewards() external {
		uint256 amount = rewards[msg.sender];
		require(amount > 0, "No rewards to claim");

		rewards[msg.sender] = 0;

		// Logic to transfer the rewards to the user would be implemented here
		payable(msg.sender).transfer(amount);
	}

	// Allow the contract to receive payments (if rewards are in Ether)
	receive() external payable {}
}
