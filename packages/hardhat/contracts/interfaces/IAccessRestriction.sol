// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.26;

import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";
import { ICommonErrors } from "./ICommonErrors.sol";

/**
 * @title AccessRestriction Interface
 * @dev Defines the interface for access control and contract state management.
 * @notice This interface extends OpenZeppelin's IAccessControl with custom roles and state checks.
 */
interface IAccessRestriction is IAccessControl, ICommonErrors {
	// Custom errors
	/// @dev Thrown when a function restricted to owner or admins is called by an unauthorized address.
	error NotAdminOrOwner(address caller);
	/// @dev Thrown when a function restricted to admins or approved contracts is called by an unauthorized address.
	error NotAdminOrApprovedContract(address caller);
	/// @dev Thrown when a function restricted to admins or scripts is called by an unauthorized address.
	error NotAdminOrScript(address caller);
	/// @dev Thrown when a function restricted to approved contracts is called by an unauthorized address.
	error NotApprovedContract(address caller);
	/// @dev Thrown when a function restricted to scripts is called by an unauthorized address.
	error NotScript(address caller);
	/// @dev Thrown when a function restricted to arbiters is called by an unauthorized address.
	error NotArbiter(address caller);
	/// @dev Thrown when a function restricted to the DAO is called by an unauthorized address.
	error NotDAO(address caller);
	error NotVerifiedUser(address caller);
	/// @dev Thrown when trying to execute a function while the contract is paused.
	error ContractPaused();
	/// @dev Thrown when trying to pause an already paused contract.
	error ContractNotPaused();

	/**
	 * @dev Pauses all contract functionality.
	 * @notice This function can only be called by authorized roles.
	 */
	function pause() external;

	/**
	 * @dev Unpauses contract functionality.
	 * @notice This function can only be called by authorized roles.
	 */
	function unpause() external;

	/**
	 * @dev Checks if the given address is the owner.
	 * @param _address The address to check.
	 * @notice Reverts with NotOwner error if the address is not the owner.
	 */
	function ifOwner(address _address) external view;

	/**
	 * @dev Checks if the given address has the admin role.
	 * @param _address The address to check.
	 * @notice Reverts with NotAdmin error if the address is not an admin.
	 */
	function ifAdmin(address _address) external view;

	/**
	 * @dev Checks if the given address is the owner or has the admin role.
	 * @param _address The address to check.
	 * @notice Reverts with NotAdminOrOwner error if the address is neither owner nor admin.
	 */
	function ifOwnerOrAdmin(address _address) external view;

	/**
	 * @dev Checks if the given address is an admin or an approved contract.
	 * @param _address The address to check.
	 * @notice Reverts with NotAdminOrApprovedContract error if the condition is not met.
	 */
	function ifAdminOrApprovedContract(address _address) external view;

	/**
	 * @dev Checks if the given address has the owner role.
	 * @param _address The address to check.
	 * @return bool True if the address has the owner role, false otherwise.
	 */
	function isOwner(address _address) external view returns (bool);

	/**
	 * @dev Checks if the given address has the admin role.
	 * @param _address The address to check.
	 * @return bool True if the address has the admin role, false otherwise.
	 */
	function isAdmin(address _address) external view returns (bool);

	/**
	 * @dev Checks if the given address is an approved contract.
	 * @param _address The address to check.
	 * @notice Reverts with NotApprovedContract error if the address is not an approved contract.
	 */
	function ifApprovedContract(address _address) external view;

	/**
	 * @dev Checks if the given address has the approved contract role.
	 * @param _address The address to check.
	 * @return bool True if the address has the approved contract role, false otherwise.
	 */
	function isApprovedContract(address _address) external view returns (bool);

	/**
	 * @dev Checks if the given address has the script role.
	 * @param _address The address to check.
	 * @return bool True if the address has the script role, false otherwise.
	 */
	function isScript(address _address) external view returns (bool);

	/**
	 * @dev Checks if the given address has the arbiter role.
	 * @param _address The address to check.
	 * @return bool True if the address has the arbiter role, false otherwise.
	 */
	function isArbiter(address _address) external view returns (bool);

	/**
	 * @dev Checks if the given address has the DAO role.
	 * @param _address The address to check.
	 * @return bool True if the address has the DAO role, false otherwise.
	 */
	function isDAO(address _address) external view returns (bool);

	/**
	 * @dev Checks if the given address has the Verified User role.
	 * @param _address The address to check.
	 * @return bool True if the address has the Verified User role, false otherwise.
	 */
	function isVerifiedUser(address _address) external view returns (bool);

	/**
	 * @dev Checks if the given address has the script role.
	 * @param _address The address to check.
	 * @notice Reverts with NotScript error if the address does not have the script role.
	 */
	function ifScript(address _address) external view;

	/**
	 * @dev Checks if the given address has the arbiter role.
	 * @param _address The address to check.
	 * @notice Reverts with NotArbiter error if the address does not have the arbiter role.
	 */
	function ifArbiter(address _address) external view;

	/**
	 * @dev Checks if the given address has the DAO role.
	 * @param _address The address to check.
	 * @notice Reverts with NotDAO error if the address does not have the DAO role.
	 */
	function ifDAO(address _address) external view;

	/**
	 * @dev Checks if the given address has the Verified user role.
	 * @param _address The address to check.
	 * @notice Reverts with NotVerifiedUser error if the address does not have the Verified user role.
	 */
	function ifVerifiedUser(address _address) external view;

	/**
	 * @dev Checks if the given address is an admin or has the script role.
	 * @param _address The address to check.
	 * @notice Reverts with NotAdminOrScript error if the condition is not met.
	 */
	function ifAdminOrScript(address _address) external view;

	/**
	 * @dev Checks if the contract is not paused.
	 * @notice Reverts with ContractPaused error if the contract is paused.
	 */
	function ifNotPaused() external view;

	/**
	 * @dev Checks if the contract is paused.
	 * @notice Reverts with ContractNotPaused error if the contract is not paused.
	 */
	function ifPaused() external view;

	/**
	 * @dev Returns the current pause status of the contract.
	 * @return bool True if the contract is paused, false otherwise.
	 */
	function paused() external view returns (bool);
}
