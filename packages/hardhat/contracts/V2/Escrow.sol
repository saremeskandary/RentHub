// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Escrow is ReentrancyGuard {
	using SafeERC20 for IERC20;
	struct EscrowDetails {
		uint256 lockedFunds;
		uint256 deposit;
		address owner;
		address renter;
	}

	mapping(uint256 => EscrowDetails) public escrows;

	event FundsLocked(
		uint256 agreementId,
		uint256 amount,
		address owner,
		address renter
	);
	event FundsReleased(uint256 agreementId, uint256 amount, address recipient);
	event DepositRefunded(
		uint256 agreementId,
		uint256 amount,
		address recipient
	);

	function lockFunds(
		uint256 _agreementId,
		uint256 _rentalFee,
		uint256 _deposit
	) external payable { // FIXME this should change to transferFrom Cause it use ERC20token
		require(escrows[_agreementId].lockedFunds == 0, "Funds already locked");
		require(msg.value == _rentalFee + _deposit, "Incorrect amount sent");
		require(msg.sender != address(0), "Invalid sender address");

		// Transfer system fee to the DAO
		rentalDAO.safeTransfer(feeAmount);
		
		escrows[_agreementId] = EscrowDetails({
			lockedFunds: _rentalFee,
			deposit: _deposit,
			owner: msg.sender,
			renter: address(0) // Will be set when the renter confirms
		});

		emit FundsLocked(_agreementId, msg.value, msg.sender, address(0));
	}

	function confirmRental(uint256 _agreementId) external {
		EscrowDetails storage escrow = escrows[_agreementId];
		require(escrow.lockedFunds > 0, "No funds locked for this agreement");
		require(escrow.renter == address(0), "Renter already confirmed");

		escrow.renter = msg.sender;

		emit FundsLocked(
			_agreementId,
			escrow.lockedFunds + escrow.deposit,
			escrow.owner,
			msg.sender
		);
	}

	function releaseFunds(uint256 _agreementId) external nonReentrant {
		EscrowDetails storage escrow = escrows[_agreementId];
		require(escrow.lockedFunds > 0, "No funds to release");

		uint256 amountToRelease = escrow.lockedFunds;
		escrow.lockedFunds = 0;

		payable(escrow.owner).transfer(amountToRelease);

		emit FundsReleased(_agreementId, amountToRelease, escrow.owner);
	}

	function refundDeposit(uint256 _agreementId) external nonReentrant {
		EscrowDetails storage escrow = escrows[_agreementId];
		require(escrow.deposit > 0, "No deposit to refund");
		require(msg.sender == escrow.owner, "Not authorized");

		uint256 depositToRefund = escrow.deposit;
		escrow.deposit = 0;

		payable(escrow.renter).transfer(depositToRefund);

		emit DepositRefunded(_agreementId, depositToRefund, escrow.renter);
	}

	// Allow the contract to receive payments
	receive() external payable {} // DELETEme
}
