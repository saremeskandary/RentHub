// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";
import { IRentalDAO } from "./interfaces/IRentalDAO.sol";

contract Escrow is IEscrow, ReentrancyGuard {
	using SafeERC20 for IERC20;

	mapping(uint256 => bool) public escrows;
	mapping(uint256 => uint256) public agreementEarnings;

	IERC20 public token;
	IRentalDAO public rentalDAO;
	IAccessRestriction public accessRestriction;

	modifier onlyApprovedContract() {
		accessRestriction.ifApprovedContract(msg.sender);
		_;
	}

	constructor(IERC20 _token, address _rentalDAO, address _accessRestriction) {
		rentalDAO = IRentalDAO(_rentalDAO);
		accessRestriction = IAccessRestriction(_accessRestriction);
		token = _token;
	}

	function lockFunds(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost
	) external onlyApprovedContract nonReentrant {
		if (escrows[_agreementId]) revert Funds_already_locked();

		uint256 systemFee = rentalDAO.getSystemFee();
		uint256 totalAmount = _cost + _deposit;
		uint256 feeAmount = systemFee * totalAmount;

		// Transfer tokens from sender to this contract
		token.safeTransferFrom(msg.sender, address(this), totalAmount);

		// Transfer fee to the DAO
		token.safeTransfer(address(rentalDAO), feeAmount);

		escrows[_agreementId] = true;

		emit FundsLocked(_agreementId);
	}

	function distributeRevenue(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost,
		address _rentee,
		address _renter
	) external {
		if (_deposit <= 0) revert MustBeGraterThanZero("deposit");

		uint256 systemFee = rentalDAO.getSystemFee();
		uint256 renteeEarnings = _cost - systemFee;

		agreementEarnings[_agreementId] = renteeEarnings;

		token.safeTransfer(_renter, _deposit);
		token.safeTransfer(_rentee, renteeEarnings);

		emit RevenueDistributed(_agreementId, renteeEarnings);
	}

	function refundDeposit(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost,
		address _rentee,
		address _renter
	) external onlyApprovedContract nonReentrant {
		if (!escrows[_agreementId]) revert No_deposit_to_refund();

		uint256 systemFee = rentalDAO.getSystemFee();
		uint256 renteeEarnings = _cost - systemFee;

		token.safeTransfer(_renter, _deposit);
		token.safeTransfer(_rentee, renteeEarnings);

		emit DepositRefunded(_agreementId);
	}

	function getEarnings(uint256 _agreementId) external view returns (uint256) {
		return agreementEarnings[_agreementId];
	}
}
