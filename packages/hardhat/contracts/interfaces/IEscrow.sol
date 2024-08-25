// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

/**
 * @title IEscrow
 * @notice Interface for managing escrow agreements including fund locking, revenue distribution, and deposit refunds
 * @dev This interface defines the structure and functions for handling financial transactions in rental agreements
 */
interface IEscrow is ICommonErrors {
	/**
	 * @dev Struct representing the details of an escrow agreement
	 * @param lockedFunds The amount of funds locked in the escrow
	 * @param deposit The amount of deposit paid by the renter
	 * @param owner The address of the rentee (owner of the rented item)
	 * @param renter The address of the renter
	 */
	struct EscrowDetails {
		uint256 lockedFunds;
		uint256 deposit;
		address owner;
		address renter;
	}

	/**
	 * @dev Emitted when revenue is distributed for an agreement
	 * @param agreementId The ID of the agreement
	 * @param amount The amount of revenue distributed
	 */
	event RevenueDistributed(uint256 agreementId, uint256 amount);

	/**
	 * @dev Emitted when funds are locked in escrow for an agreement
	 * @param agreementId The ID of the agreement
	 */
	event FundsLocked(uint256 agreementId);

	/**
	 * @dev Emitted when funds are released from escrow
	 * @param agreementId The ID of the agreement
	 * @param amount The amount of funds released
	 * @param recipient The address receiving the funds
	 */
	event FundsReleased(uint256 agreementId, uint256 amount, address recipient);

	/**
	 * @dev Emitted when a deposit is refunded
	 * @param agreementId The ID of the agreement
	 */
	event DepositRefunded(uint256 agreementId);

	// Custom errors
	error Funds_already_locked();
	error No_funds_locked_for_this_agreement();
	error No_funds_to_release();
	error Renter_already_confirmed();
	error No_deposit_to_refund();

	/**
	 * @notice Locks funds in escrow for a specific agreement
	 * @dev This function should be called to initiate an escrow agreement
	 * @param _agreementId The ID of the agreement
	 * @param _deposit The amount of deposit to be locked
	 * @param _cost The cost of the rental
	 */
	function lockFunds(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost
	) external;

	/**
	 * @notice Distributes the revenue for a completed rental agreement
	 * @dev This function should be called when a rental agreement is successfully completed
	 * @param _agreementId The ID of the agreement
	 * @param _deposit The amount of deposit paid
	 * @param _cost The cost of the rental
	 * @param _rentee The address of the rentee (owner)
	 * @param _renter The address of the renter
	 */
	function distributeRevenue(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost,
		address _rentee,
		address _renter
	) external;

	/**
	 * @notice Refunds the deposit to the renter
	 * @dev This function should be called when a rental agreement is cancelled or when the deposit needs to be returned
	 * @param _agreementId The ID of the agreement
	 * @param _deposit The amount of deposit to be refunded
	 * @param _cost The cost of the rental (may be used for partial refunds)
	 * @param _rentee The address of the rentee (owner)
	 * @param _renter The address of the renter
	 */
	function refundDeposit(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost,
		address _rentee,
		address _renter
	) external;

	/**
	 * @notice Retrieves the earnings for a specific agreement
	 * @dev This function is an alias for agreementEarnings
	 * @param _agreementId The ID of the agreement to query
	 * @return The earnings associated with the specified agreement
	 */
	function getEarnings(uint256 _agreementId) external view returns (uint256);

	/**
	 * @notice Retrieves the earnings associated with a specific agreement
	 * @param _agreementId The ID of the agreement to query
	 * @return The earnings associated with the specified agreement
	 */
	function agreementEarnings(
		uint256 _agreementId
	) external view returns (uint256);
}
