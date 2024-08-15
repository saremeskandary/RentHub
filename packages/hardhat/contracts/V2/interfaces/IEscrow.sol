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
	event RevenueDistributed(uint256 agreementId, uint256 amount);
	event FundsLocked(uint256 agreementId);
	event FundsReleased(uint256 agreementId, uint256 amount, address recipient);
	event DepositRefunded(uint256 agreementId);

	// Custom errors
	error Funds_already_locked();
	error Incorrect_amount_sent();
	error Invalid_sender_address();
	error No_funds_locked_for_this_agreement();
	error No_funds_to_release();
	error Renter_already_confirmed();
	error No_deposit_to_refund();
	error Not_authorized();
	error AmountMustBeGreaterThanZero();

	function lockFunds(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost
	) external;

	/// @notice Confirms the rental agreement by the renter
	/// @param _agreementId The ID of the agreement to be confirmed
	// function confirmRental(uint256 _agreementId) external;

	/// @notice Releases the locked funds to the owner
	/// @param _agreementId The ID of the agreement for which the funds are being released
	function releaseFunds(uint256 _agreementId) external;

	/// @notice Refunds the deposit to the renter
	/// @param _agreementId The ID of the agreement for which the deposit is being refunded
	function refundDeposit(uint256 _agreementId) external;

	function distributeRevenue(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost,
		address _rentee,
		address _renter
	) external;

	/// @notice Retrieves the earnings for a specific agreement
	/// @param _agreementId The ID of the agreement to query
	/// @return The earnings associated with the specified agreement
	function getEarnings(uint256 _agreementId) external view returns (uint256);

	/// @notice Retrieves the earnings associated with a specific agreement
	/// @param _agreementId The ID of the agreement to query
	/// @return The earnings associated with the specified agreement
	function agreementEarnings(
		uint256 _agreementId
	) external view returns (uint256);
}
