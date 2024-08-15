// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title IEscrow - Interface for the Escrow contract
/// @notice Interface for managing escrow agreements including fund locking, rental confirmation, fund release, and deposit refunds
interface IEscrow {
	struct EscrowDetails {
		uint256 lockedFunds;
		uint256 deposit;
		address owner;
		address renter;
	}

	event FundsLocked(
		uint256 agreementId,
		uint256 amount,
		address owner,
		address renter
	);
	event FundsReleased(uint256 agreementId, uint256 amount, address recipient);
	event DepositRefunded(
		uint256 agreementId,
		uint256 amount,
		address recipient
	);

	error Funds_already_locked(uint locked_funds);
	error Incorrect_amount_sent(uint value);
	error Invalid_sender_address(address sender);
	error No_funds_locked_for_this_agreement(uint lockedFuns);
	error No_funds_to_release(EscrowDetails escrow);
	error Renter_already_confirmed(EscrowDetails escrow);
	error No_deposit_to_refund(EscrowDetails escrow);
	error Not_authorized(address escrow_owner);

	/// @notice Locks funds for a specific agreement
	/// @param _agreementId The ID of the agreement for which the funds are being locked
	/// @param _rentalFee The rental fee to be locked
	/// @param _deposit The deposit amount to be locked
	function lockFunds(
		uint256 _agreementId,
		uint256 _rentalFee,
		uint256 _deposit
	) external;

	/// @notice Confirms the rental agreement by the renter
	/// @param _agreementId The ID of the agreement to be confirmed
	function confirmRental(uint256 _agreementId) external;

	/// @notice Releases the locked funds to the owner
	/// @param _agreementId The ID of the agreement for which the funds are being released
	function releaseFunds(uint256 _agreementId) external;

	/// @notice Refunds the deposit to the renter
	/// @param _agreementId The ID of the agreement for which the deposit is being refunded
	function refundDeposit(uint256 _agreementId) external;
}
