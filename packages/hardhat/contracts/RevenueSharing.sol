// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RevenueSharing
 * @dev This contract manages the distribution of revenue, allowing the owner to set a platform fee.
 */
contract RevenueSharing is Ownable {
	uint256 public platformFee = 50; // 5% platform fee
	uint256 public constant DENOMINATOR = 1000;

	event RevenuePaid(address indexed recipient, uint256 amount);

	/**
	 * @notice Distribute revenue to the recipient after deducting the platform fee
	 * @param _recipient The address of the recipient
	 */
	function distributeRevenue(address _recipient) external payable {
		uint256 platformAmount = (msg.value * platformFee) / DENOMINATOR;
		uint256 recipientAmount = msg.value - platformAmount;

		payable(owner()).transfer(platformAmount);
		payable(_recipient).transfer(recipientAmount);

		emit RevenuePaid(_recipient, recipientAmount);
	}

	/**
	 * @notice Set a new platform fee
	 * @param _newFee The new platform fee (in basis points, where 100 basis points = 10%)
	 */
	function setPlatformFee(uint256 _newFee) external onlyOwner {
		require(_newFee <= 100, "Fee too high"); // Max 10%
		platformFee = _newFee;
	}
}
