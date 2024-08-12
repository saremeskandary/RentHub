// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {
	mapping(uint256 => uint256) public lockedFunds;
	mapping(uint256 => address) public fundOwners;

	event FundsLocked(uint256 agreementId, uint256 amount, address owner);
	event FundsReleased(uint256 agreementId, uint256 amount, address recipient);
	event DepositRefunded(
		uint256 agreementId,
		uint256 amount,
		address recipient
	);

	function lockFunds(uint256 _agreementId, uint256 _amount) external {
		require(lockedFunds[_agreementId] == 0, "Funds already locked");
		require(_amount > 0, "Amount must be greater than 0");

		lockedFunds[_agreementId] = _amount;
		fundOwners[_agreementId] = msg.sender;

		emit FundsLocked(_agreementId, _amount, msg.sender);
	}

	function releaseFunds(
		uint256 _agreementId,
		address _recipient
	) external nonReentrant {
		require(lockedFunds[_agreementId] > 0, "No funds to release");
		require(msg.sender == fundOwners[_agreementId], "Not authorized");

		uint256 amount = lockedFunds[_agreementId];
		lockedFunds[_agreementId] = 0;

		// Logic to transfer funds to the owner would be implemented here
		payable(_recipient).transfer(amount);

		emit FundsReleased(_agreementId, amount, _recipient);
	}

	function refundDeposit(
		uint256 _agreementId,
		address _recipient
	) external nonReentrant {
		require(lockedFunds[_agreementId] > 0, "No funds to refund");
		require(msg.sender == fundOwners[_agreementId], "Not authorized");

		uint256 amount = lockedFunds[_agreementId];
		lockedFunds[_agreementId] = 0;

		// Logic to refund deposit to renter would be implemented here
		payable(_recipient).transfer(amount);

		emit DepositRefunded(_agreementId, amount, _recipient);
	}

	// Allow the contract to receive payments
	receive() external payable {}
}