// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { IMonetization } from "./interfaces/IMonetization.sol";

contract Monetization is IMonetization {
	mapping(uint256 => uint256) public agreementEarnings;

	function distributeRevenue(uint256 _agreementId, uint256 _amount) external {
		if (_amount <= 0) revert AmountMustBeGreaterThanZero(_amount);

		// Example logic: 10% fee, 90% to owner
		uint256 platformFee = (_amount * 10) / 100;
		uint256 ownerEarnings = _amount - platformFee;

		agreementEarnings[_agreementId] = ownerEarnings;

		emit RevenueDistributed(_agreementId, ownerEarnings);

		// TODO Logic to distribute funds
		// Example: transfer ownerEarnings to the agreement owner
		// and platformFee to the platform treasury.
	}

	function getEarnings(uint256 _agreementId) external view returns (uint256) {
		return agreementEarnings[_agreementId];
	}

	// Allow the contract to receive payments
	receive() external payable {}
}
