// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract Escrow is IEscrow, ReentrancyGuard, IAccessRestriction {
	using SafeERC20 for IERC20;

	mapping(uint256 => bool) public escrows;
	mapping(uint256 => uint256) public agreementEarnings;

	IERC20 public token;
	address public rentalDAO;
	uint256 public feeAmount;
	IAccessRestriction public accessRestriction;

	modifier onlyApprovedContract() {
		accessRestriction.ifApprovedContract(msg.sender);
		_;
	}

	constructor(
		IERC20 _token,
		address _rentalDAO,
		uint256 _feeAmount,
		address _accessRestriction
	) {
		token = _token;
		rentalDAO = _rentalDAO;
		feeAmount = _feeAmount;
		feeAmount = _feeAmount;
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	function lockFunds(
		uint256 _agreementId,
		uint256 _deposit,
		uint256 _cost
	) external onlyApprovedContract nonReentrant {
		if (escrows[_agreementId]) revert Funds_already_locked();

		uint256 systemFee = rentalDAO.getSystemFee();
		uint256 totalAmount = _cost + _deposit;
		// Transfer tokens from sender to this contract
		token.safeTransferFrom(msg.sender, address(this), totalAmount);

		// Transfer fee to the DAO
		token.safeTransfer(rentalDAO, feeAmount);

		// escrows[_agreementId] = EscrowDetails({
		// 	lockedFunds: _cost,
		// 	deposit: _deposit,
		// 	owner: msg.sender,
		// 	renter: address(0) // Will be set when the renter confirms
		// });
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
		if (_deposit <= 0) revert AmountMustBeGreaterThanZero();

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

	function releaseFunds(uint256 _agreementId) external nonReentrant {
		EscrowDetails storage escrow = escrows[_agreementId];
		if (escrow.lockedFunds == 0) revert No_funds_to_release();

		uint256 amountToRelease = escrow.lockedFunds;
		escrow.lockedFunds = 0;

		token.safeTransfer(escrow.owner, amountToRelease);

		emit FundsReleased(_agreementId, amountToRelease, escrow.owner);
	}
}
