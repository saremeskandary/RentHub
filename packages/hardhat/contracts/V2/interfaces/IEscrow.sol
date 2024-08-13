// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title IEscrow - Interface for the Escrow contract
/// @notice Interface for managing escrow agreements including fund locking, rental confirmation, fund release, and deposit refunds
interface IEscrow {
	/// @notice Locks funds for a specific agreement
	/// @param _agreementId The ID of the agreement for which the funds are being locked
	/// @param _rentalFee The rental fee to be locked
	/// @param _deposit The deposit amount to be locked
	function lockFunds(
		uint256 _agreementId,
		uint256 _rentalFee,
		uint256 _deposit
	) external payable;

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
