// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";
import { ICommonErrors } from "./interfaces/ICommonErrors.sol";
import { IRentalDAO } from "./interfaces/IRentalDAO.sol";

contract RentalDAO is IRentalDAO, ReentrancyGuard {
	bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");

	uint256 public systemFee; // Fee in basis points (1/100 of a percent)
	uint256 public constant MAX_FEE = 1000; // 10% max fee
	IAccessRestriction public accessRestriction;

	mapping(string => address) private contractAddresses;
 
	modifier onlyDAO() {
		if (!accessRestriction.isDAO(msg.sender)) revert NotDAO(msg.sender);
		_;
	}

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin(msg.sender);
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
		if (_member == address(0)) revert InvalidAddress("member");
		accessRestriction.grantRole(DAO_ROLE, _member);
	}

	function removeDAOMember(address _member) external onlyAdmin {
		if (_member == address(0)) revert InvalidAddress("member");
		accessRestriction.revokeRole(DAO_ROLE, _member);
	}

	function getSystemFee() external view returns (uint256) {
		return systemFee;
	}

	
	function withdrawFees(
		address payable _recipient,
		uint256 _amount
	) external onlyAdmin nonReentrant {
		if (_recipient == address(0)) revert InvalidAddress("recipient");
		if (_amount > address(this).balance)
			revert InsufficientBalance(address(this).balance, _amount);
		if (_amount == 0) revert MustBeGraterThanZero("amount");
		_recipient.transfer(_amount);
		emit Withdrawn(_recipient, _amount);
	}

	function setContractAddress(
		string memory _contractName,
		address _contractAddress
	) external onlyDAO {
		contractAddresses[_contractName] = _contractAddress;
	}

	function getContractAddress(
		string memory _contractName
	) external view returns (address) {
		return contractAddresses[_contractName];
	}
}
