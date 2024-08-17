// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/security/Pausable.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract AccessRestriction is AccessControl, Pausable, IAccessRestriction {
	// Roles
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
	bytes32 public constant SCRIPT_ROLE = keccak256("SCRIPT_ROLE");
	bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
	bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
	bytes32 public constant VERFIED_USER_ROLE = keccak256("VERFIED_USER_ROLE");
	bytes32 public constant APPROVED_CONTRACT_ROLE =
		keccak256("APPROVED_CONTRACT_ROLE");

	/** MODIFIER
	 * @dev Checks if message sender has admin role
	 */
	modifier onlyOwner() {
		if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
			revert NotOwner(msg.sender);
		}
		_;
	}

	constructor(address _deployer) {
		if (!hasRole(DEFAULT_ADMIN_ROLE, _deployer)) {
			_grantRole(DEFAULT_ADMIN_ROLE, _deployer);
		}
	}

	/**
	 * @dev Pauses contract functionality
	 */
	function pause() external override onlyOwner {
		_pause();
	}

	/**
	 * @dev Unpauses contract functionality
	 */
	function unpause() external override onlyOwner {
		_unpause();
	}

	/**
	 * @dev Checks if given address is owner
	 * @param _address Address to check
	 */
	function ifOwner(address _address) external view override {
		if (!isOwner(_address)) {
			revert NotOwner(_address);
		}
	}

	/**
	 * @dev Checks if given address has admin role
	 * @param _address Address to check
	 */
	function ifAdmin(address _address) external view override {
		if (!isAdmin(_address)) {
			revert NotAdmin(_address);
		}
	}

	/**
	 * @dev Checks if given address is admin or owner
	 * @param _address Address to check
	 */
	function ifOwnerOrAdmin(address _address) external view override {
		if (!isOwner(_address) && !isAdmin(_address)) {
			revert NotAdminOrOwner(_address);
		}
	}

	/**
	 * @dev Checks if given address is admin or approved contract
	 * @param _address Address to check
	 */
	function ifAdminOrApprovedContract(
		address _address
	) external view override {
		if (!isApprovedContract(_address) && !isAdmin(_address)) {
			revert NotAdminOrApprovedContract(_address);
		}
	}

	/**
	 * @dev Checks if given address is admin or has script role
	 * @param _address Address to check
	 */
	function ifAdminOrScript(address _address) external view override {
		if (!isScript(_address) && !isAdmin(_address)) {
			revert NotAdminOrScript(_address);
		}
	}

	/**
	 * @dev Checks if given address is approved contract
	 * @param _address Address to check
	 */
	function ifApprovedContract(address _address) external view override {
		if (!isApprovedContract(_address)) {
			revert NotApprovedContract(_address);
		}
	}

	/**
	 * @dev Checks if given address has script role
	 * @param _address Address to check
	 */
	function ifScript(address _address) external view override {
		if (!isScript(_address)) {
			revert NotScript(_address);
		}
	}

	function ifArbiter(address _address) external view override {
		if (!isArbiter(_address)) {
			revert NotArbiter(_address);
		}
	}

	function ifDAO(address _address) external view override {
		if (!isDAO(_address)) {
			revert NotDAO(_address);
		}
	}

	function ifVerifiedUser(address _address) external view override {
		if (!isVerifiedUser(_address)) {
			revert NotVerifiedUser(_address);
		}
	}

	/**
	 * @dev Checks if contract is not paused
	 */
	function ifNotPaused() external view override {
		if (paused()) {
			revert ContractPaused();
		}
	}

	/**
	 * @dev Checks if contract is paused
	 */
	function ifPaused() external view override {
		if (!paused()) {
			revert ContractNotPaused();
		}
	}

	/**
	 * @dev Returns pause status of contract
	 */
	function paused()
		public
		view
		virtual
		override(Pausable, IAccessRestriction)
		returns (bool)
	{
		return super.paused();
	}

	/**
	 * @dev Checks if given address has owner role
	 * @param _address Address to check
	 * @return bool true if address has owner role
	 */
	function isOwner(address _address) public view override returns (bool) {
		return hasRole(DEFAULT_ADMIN_ROLE, _address);
	}

	/**
	 * @dev Checks if given address has admin role
	 * @param _address Address to check
	 * @return bool true if address has admin role
	 */
	function isAdmin(address _address) public view override returns (bool) {
		return hasRole(ADMIN_ROLE, _address);
	}

	/**
	 * @dev Checks if given address has approved contract role
	 * @param _address Address to check
	 * @return bool true if address has approved contract role
	 */
	function isApprovedContract(
		address _address
	) public view override returns (bool) {
		return hasRole(APPROVED_CONTRACT_ROLE, _address);
	}

	/**
	 * @dev Checks if given address has script role
	 * @param _address Address to check
	 * @return bool true if address has script role
	 */
	function isScript(address _address) public view override returns (bool) {
		return hasRole(SCRIPT_ROLE, _address);
	}

	function isArbiter(address _address) public view override returns (bool) {
		return hasRole(ARBITER_ROLE, _address);
	}

	function isDAO(address _address) public view override returns (bool) {
		return hasRole(DAO_ROLE, _address);
	}

	function isVerifiedUser(
		address _address
	) public view override returns (bool) {
		return hasRole(VERFIED_USER_ROLE, _address);
	}
}
