// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IRentalDAO } from "./interfaces/IRentalDAO.sol";

contract RentalDAO is IRentalDAO, AccessControl, ReentrancyGuard {
	bytes32 public constant DAO_MEMBER_ROLE = keccak256("DAO_MEMBER_ROLE");

	uint256 public systemFee; // Fee in basis points (1/100 of a percent)
	uint256 public constant MAX_FEE = 1000; // 10% max fee

	mapping(string => address) private contractAddresses;

	constructor(uint256 _initialFee) {
		if (_initialFee > MAX_FEE) revert FeeExceedsMaximum(_initialFee);
		systemFee = _initialFee;
	}

	function proposeAndUpdateSystemFee(
		uint256 _newFee
	) external onlyRole(DAO_MEMBER_ROLE) {
		if (_newFee > MAX_FEE) revert FeeExceedsMaximum(_newFee);
		uint256 oldFee = systemFee;
		systemFee = _newFee;
		emit SystemFeeUpdated(oldFee, _newFee);
	}

	function addDAOMember(
		address _member
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		if (_member == address(0)) revert InvalidAddress();
		grantRole(DAO_MEMBER_ROLE, _member);
	}

	function removeDAOMember(
		address _member
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		if (_member == address(0)) revert InvalidAddress();
		revokeRole(DAO_MEMBER_ROLE, _member);
	}

	function getSystemFee() external view returns (uint256) {
		return systemFee;
	}

	function withdrawFees(
		address payable _recipient,
		uint256 _amount
	) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
		if (_recipient == address(0)) revert InvalidAddress();
		if (_amount > address(this).balance)
			revert InsufficientBalance(address(this).balance, _amount);
		_recipient.transfer(_amount);
	}

	function updateContractAddress(
		string memory _contractName,
		address _newAddress
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		if (_newAddress == address(0)) revert InvalidAddress();
		contractAddresses[_contractName] = _newAddress;
	}

	function getContractAddress(
		string memory _contractName
	) external view returns (address) {
		return contractAddresses[_contractName];
	}
}
