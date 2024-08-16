// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.26;

import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title AccessRestriction interface
 */
interface IAccessRestriction is IAccessControl {
	// Custom errors
	error NotOwner(address caller);
	error NotAdmin(address caller);
	error NotAdminOrOwner(address caller);
	error NotAdminOrApprovedContract(address caller);
	error NotAdminOrScript(address caller);
	error NotApprovedContract(address caller);
	error NotScript(address caller);
	error NotArbiter(address caller);
	error NotDAO(address caller);
	error ContractPaused();
	error ContractNotPaused();

	/**
	 * @dev Pauses contract functionality
	 */
	function pause() external;

	/**
	 * @dev Unpauses contract functionality
	 */
	function unpause() external;

	/**
	 * @dev Checks if given address is owner
	 * @param _address Address to check
	 */
	function ifOwner(address _address) external view;

	/**
	 * @dev Checks if given address has admin role
	 * @param _address Address to check
	 */
	function ifAdmin(address _address) external view;

	/**
	 * @dev Checks if given address is admin or owner
	 * @param _address Address to check
	 */
	function ifOwnerOrAdmin(address _address) external view;

	/**
	 * @dev Checks if given address is admin or approved contract
	 * @param _address Address to check
	 */
	function ifAdminOrApprovedContract(address _address) external view;

	/**
	 * @dev Checks if given address has owner role
	 * @param _address Address to check
	 * @return bool true if address has owner role
	 */
	function isOwner(address _address) external view returns (bool);

	/**
	 * @dev Checks if given address has admin role
	 * @param _address Address to check
	 * @return bool true if address has admin role
	 */
	function isAdmin(address _address) external view returns (bool);

	/**
	 * @dev Checks if given address is approved contract
	 * @param _address Address to check
	 */
	function ifApprovedContract(address _address) external view;

	/**
	 * @dev Checks if given address has approved contract role
	 * @param _address Address to check
	 * @return bool true if address has approved contract role
	 */
	function isApprovedContract(address _address) external view returns (bool);

	/**
	 * @dev Checks if given address has script role
	 * @param _address Address to check
	 * @return bool true if address has script role
	 */
	function isScript(address _address) external view returns (bool);

	function isArbiter(address _address) external view returns (bool);

	function isDAO(address _address) external view returns (bool);

	/**
	 * @dev Checks if given address has script role
	 * @param _address Address to check
	 */
	function ifScript(address _address) external view;

	function ifArbiter(address _address) external view;

	function ifDAO(address _address) external view;

	/**
	 * @dev Checks if given address is admin or has script role
	 * @param _address Address to check
	 */
	function ifAdminOrScript(address _address) external view;

	/**
	 * @dev Checks if contract is not paused
	 */
	function ifNotPaused() external view;

	/**
	 * @dev Checks if contract is paused
	 */
	function ifPaused() external view;

	/**
	 * @dev Returns if contract is paused
	 * @return bool true if paused
	 */
	function paused() external view returns (bool);
}
