// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IRentalDAO } from "./interfaces/IRentalDAO.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract RentalDAO is IRentalDAO, ReentrancyGuard {
	bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");

	uint256 public systemFee; // Fee in basis points (1/100 of a percent)
	uint256 public constant MAX_FEE = 1000; // 10% max fee
	IAccessRestriction public accessRestriction;

	mapping(string => address) private contractAddresses;

	modifier onlyDAO() {
		if (!accessRestriction.isDAO(msg.sender)) revert notDAO();
		_;
	}

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin();
		_;
	}

	constructor(address _accessRestriction, uint256 _initialFee) {
		if (_initialFee > MAX_FEE) revert FeeExceedsMaximum(_initialFee);
		systemFee = _initialFee;
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	function proposeAndUpdateSystemFee(uint256 _newFee) external onlyDAO {
		if (_newFee > MAX_FEE) revert FeeExceedsMaximum(_newFee);
		uint256 oldFee = systemFee;
		systemFee = _newFee;
		emit SystemFeeUpdated(oldFee, _newFee);
	}

	function addDAOMember(address _member) external onlyAdmin {
		if (_member == address(0)) revert InvalidAddress();
		accessRestriction.grantRole(DAO_ROLE, _member);
	}

	function removeDAOMember(address _member) external onlyAdmin {
		if (_member == address(0)) revert InvalidAddress();
		accessRestriction.revokeUser(DAO_ROLE, _member);
	}

	function getSystemFee() external view returns (uint256) {
		return systemFee;
	}

	function withdrawFees(
		address payable _recipient,
		uint256 _amount
	) external onlyAdmin nonReentrant {
		if (_recipient == address(0)) revert InvalidAddress();
		if (_amount > address(this).balance)
			revert InsufficientBalance(address(this).balance, _amount);
		_recipient.transfer(_amount);
	}

	function updateContractAddress(
		string memory _contractName,
		address _newAddress
	) external onlyAdmin {
		if (_newAddress == address(0)) revert InvalidAddress();
		contractAddresses[_contractName] = _newAddress;
	}

	function getContractAddress(
		string memory _contractName
	) external view returns (address) {
		return contractAddresses[_contractName];
	}
}
