// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";
import { ISocialFi } from "./interfaces/ISocialFi.sol";

contract SocialFi is ISocialFi, ReentrancyGuard {
	using SafeERC20 for IERC20;
	IERC20 public token;
	IAccessRestriction public accessRestriction;

	mapping(address => uint256) public rewards;


	modifier onlyApprovedContract() {
		accessRestriction.ifApprovedContract(msg.sender);
		_;
	}

	constructor(IERC20 _token, address _accessRestriction) {
		token = _token;
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	function rewardUser(address _user, uint256 _amount) external onlyApprovedContract{
		if (_amount == 0) revert MustBeGraterThanZero("amount");
		if (_user == address(0)) revert InvalidAddress("user");
		rewards[_user] += _amount;

		emit UserRewarded(_user, _amount);
	}

	function getRewardBalance(address _user) external view returns (uint256) {
		if (_user == address(0)) revert InvalidAddress("user");
		return rewards[_user];
	}

	function claimRewards() external {
		uint256 amount = rewards[msg.sender];
		if (amount == 0) revert NoRewardsToClaim();

		rewards[msg.sender] = 0;

		emit RewardClaimed(msg.sender, amount);
		// Logic to transfer the rewards to the user
		token.safeTransfer(msg.sender, amount);
	}
}
