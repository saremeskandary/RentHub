// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";

contract Escrow is IEscrow, ReentrancyGuard {
	using SafeERC20 for IERC20;

	mapping(uint256 => EscrowDetails) public escrows;
	IERC20 public token;
	address public rentalDAO;
	uint256 public feeAmount;

	constructor(IERC20 _token, address _rentalDAO, uint256 _feeAmount) {
		token = _token;
		rentalDAO = _rentalDAO;
		feeAmount = _feeAmount;
	}

	function lockFunds(
		uint256 _agreementId,
		uint256 _rentalFee,
		uint256 _deposit
	) external {
		if (escrows[_agreementId].lockedFunds != 0)
			revert Funds_already_locked(escrows[_agreementId].lockedFunds);
		if (msg.sender == address(0)) revert Invalid_sender_address(msg.sender);

		uint256 totalAmount = _rentalFee + _deposit + feeAmount;

		// Transfer tokens from sender to this contract
		token.safeTransferFrom(msg.sender, address(this), totalAmount);

		// Transfer fee to the DAO
		token.safeTransfer(rentalDAO, feeAmount);

		escrows[_agreementId] = EscrowDetails({
			lockedFunds: _rentalFee,
			deposit: _deposit,
			owner: msg.sender,
			renter: address(0) // Will be set when the renter confirms
		});

		emit FundsLocked(_agreementId, totalAmount, msg.sender, address(0));
	}

	function confirmRental(uint256 _agreementId) external {
		EscrowDetails storage escrow = escrows[_agreementId];
		if (escrow.lockedFunds == 0)
			revert No_funds_locked_for_this_agreement(escrow.lockedFunds);

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
		if (escrow.lockedFunds == 0) revert No_funds_to_release(escrow);

		uint256 amountToRelease = escrow.lockedFunds;
		escrow.lockedFunds = 0;

		token.safeTransfer(escrow.owner, amountToRelease);

		emit FundsReleased(_agreementId, amountToRelease, escrow.owner);
	}

	function refundDeposit(uint256 _agreementId) external nonReentrant {
		EscrowDetails storage escrow = escrows[_agreementId];
		if (escrow.deposit == 0) revert No_deposit_to_refund(escrow);

		if (msg.sender != escrow.owner) revert Not_authorized(msg.sender);

		uint256 depositToRefund = escrow.deposit;
		escrow.deposit = 0;

		token.safeTransfer(escrow.renter, depositToRefund);

		emit DepositRefunded(_agreementId, depositToRefund, escrow.renter);
	}
}
