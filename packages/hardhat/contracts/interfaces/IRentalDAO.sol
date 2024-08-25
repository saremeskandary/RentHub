// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

/**
 * @title IRentalDAO
 * @dev Interface for the RentalDAO contract, defining key functions for system fee management and contract address updates
 */
interface IRentalDAO is ICommonErrors {
	/**
	 * @dev Emitted when the system fee is updated
	 * @param oldFee The previous system fee
	 * @param newFee The new system fee
	 */
	event SystemFeeUpdated(uint256 oldFee, uint256 newFee);

	/**
	 * @dev Emitted when fees are withdrawn from the contract
	 * @param recipient The address receiving the withdrawn fees
	 * @param amount The amount of fees withdrawn
	 */
	event FeesWithdrawn(address recipient, uint256 amount);

	/**
	 * @dev Emitted when a contract address is updated
	 * @param contractName The name of the contract being updated
	 * @param newAddress The new address of the contract
	 */
	event ContractAddressUpdated(string contractName, address newAddress);

	event Withdrawn(address recipient, uint256 amount);

	// Custom errors
	error FeeExceedsMaximum(uint256 fee);
	error Unauthorized();
	error OnlyAdmin();
	error NotDAO(address caller);

	/**
	 * @dev Proposes and updates the system fee
	 * @param _newFee The proposed new fee (in basis points)
	 */
	function proposeAndUpdateSystemFee(uint256 _newFee) external;

	/**
	 * @dev Adds a new DAO member
	 * @param _member The address of the new member to be added
	 */
	function addDAOMember(address _member) external;

	

	/**
	 * @dev Removes a DAO member
	 * @param _member The address of the member to be removed
	 */
	function removeDAOMember(address _member) external;

	/**
	 * @dev Retrieves the current system fee
	 * @return The current system fee in basis points
	 */
	function getSystemFee() external view returns (uint256);

	/**
	 * @dev Withdraws accumulated fees from the contract
	 * @param _recipient The address to receive the withdrawn fees
	 * @param _amount The amount of fees to withdraw
	 */
	function withdrawFees(address payable _recipient, uint256 _amount) external;

	/**
	 * @dev Retrieves the address of a contract in the system
	 * @param _contractName The name of the contract
	 * @return The address of the specified contract
	 */
	function getContractAddress(
		string memory _contractName
	) external view returns (address);

}
