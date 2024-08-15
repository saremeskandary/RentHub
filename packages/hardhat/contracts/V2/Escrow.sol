// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";

contract Escrow is IEscrow, ReentrancyGuard {
	using SafeERC20 for IERC20;
	mapping(uint256 => EscrowDetails) public escrows;

	function lockFunds(
		uint256 _agreementId,
		uint256 _rentalFee,
		uint256 _deposit
	) external payable {
		// FIXME this should change to transferFrom Cause it use ERC20token
		if (escrows[_agreementId].lockedFunds != 0)
			revert Funds_already_locked(escrows[_agreementId].lockedFunds);
		if (msg.value != _rentalFee + _deposit)
			revert Incorrect_amount_sent(msg.value);
		if (msg.sender == address(0)) Invalid_sender_address(msg.sender);

		// Transfer system fee to the DAO
		rentalDAO.safeTransfer(feeAmount);

		escrows[_agreementId] = EscrowDetails({
			lockedFunds: _rentalFee,
			deposit: _deposit,
			owner: msg.sender,
			renter: address(0) // Will be set when the renter confirms
		});

		emit FundsLocked(_agreementId, msg.value, msg.sender, address(0));
	}

	function confirmRental(uint256 _agreementId) external {
		EscrowDetails storage escrow = escrows[_agreementId];
		if (escrow.locked_funds < 0)
			revert No_funds_locked_for_this_agreement(escrow.locked_funds);

		if (escrow.renter != address(0))
			revert Renter_already_confirmed(escrow);

		escrow.renter = msg.sender;

		emit FundsLocked(
			_agreementId,
			escrow.lockedFunds + escrow.deposit,
			escrow.owner,
			msg.sender
		);
	}

	function releaseFunds(uint256 _agreementId) external nonReentrant {
		EscrowDetails storage escrow = escrows[_agreementId];
		if (escrow.lockedFunds < 0) revert No_funds_to_release(escrow);

		uint256 amountToRelease = escrow.lockedFunds;
		escrow.lockedFunds = 0;

		payable(escrow.owner).transfer(amountToRelease);

		emit FundsReleased(_agreementId, amountToRelease, escrow.owner);
	}

	function refundDeposit(uint256 _agreementId) external nonReentrant {
		EscrowDetails storage escrow = escrows[_agreementId];
		if (escrow.deposit <= 0) revert No_deposit_to_refund(escrow);

		if (msg.sender != escrow.owner) revert Not_authorized(msg.sender);

		uint256 depositToRefund = escrow.deposit;
		escrow.deposit = 0;

		payable(escrow.renter).transfer(depositToRefund);

		emit DepositRefunded(_agreementId, depositToRefund, escrow.renter);
	}

	// Allow the contract to receive payments
	receive() external payable {} // DELETEme
}
