// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { IEscrow } from "./interfaces/IEscrow.sol";
import { IInspection } from "./interfaces/IInspection.sol";
import { ISocialFi } from "./interfaces/ISocialFi.sol";
import { IReputation } from "./interfaces/IReputation.sol";
import { IDisputeResolution } from "./interfaces/IDisputeResolution.sol";
import { IRentalDAO } from "./interfaces/IRentalDAO.sol";
import { IRentalAgreement } from "./interfaces/IRentalAgreement.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract DisputeResolution is IDisputeResolution {
	bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
	bytes32 public constant VERFIED_USER_ROLE = keccak256("VERFIED_USER_ROLE");
	mapping(uint256 => Dispute) public disputes;

	IRentalAgreement public rentalAgreement;
	IReputation public reputation;
	IAccessRestriction public accessRestriction;

	uint256 public constant REPUTATION_PENALTY = 50;
	uint256 public constant VALIDATION_REVOCATION_THRESHOLD = 3;

	modifier onlyArbiter() {
		if (!accessRestriction.isAdmin(msg.sender))
			revert NotArbiter(msg.sender);
		_;
	}

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin(msg.sender);
		_;
	}

	constructor() {}

	function init(
		address _rentalAgreement,
		address _reputation,
		address _accessRestriction
	) public {
		if (_rentalAgreement == address(0))
			revert InvalidAddress("rental agreement");
		if (_reputation == address(0)) revert InvalidAddress("reputation");
		if (_accessRestriction == address(0))
			revert InvalidAddress("access restriction");

		rentalAgreement = IRentalAgreement(_rentalAgreement);
		reputation = IReputation(_reputation);
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	function initiateDispute(uint256 _agreementId) external {
		if (disputes[_agreementId].isActive)
			revert DisputeAlreadyExists(_agreementId);

		disputes[_agreementId].isActive = true;
		emit DisputeInitiated(_agreementId);
	}

	function voteOnDispute(
		uint256 _agreementId,
		bool _voteForRentee
	) external onlyArbiter {
		Dispute storage dispute = disputes[_agreementId];
		if (!dispute.isActive) revert NoActiveDispute(_agreementId);
		if (dispute.hasVoted[msg.sender])
			revert ArbiterAlreadyVoted(msg.sender, _agreementId);

		if (_voteForRentee) {
			dispute.votesForRentee++;
		} else {
			dispute.votesForRenter++;
		}

		dispute.hasVoted[msg.sender] = true;

		emit ArbitersVoted(_agreementId, msg.sender, _voteForRentee);
	}

	function resolveDispute(uint256 _agreementId) external onlyArbiter {
		Dispute storage dispute = disputes[_agreementId];
		if (!dispute.isActive) revert NoActiveDispute(_agreementId);

		(address rentee, address renter) = rentalAgreement.getAgreementParties(
			_agreementId
		);

		address winner;
		address loser;

		if (dispute.votesForRentee > dispute.votesForRenter) {
			winner = rentee;
			loser = renter;
		} else {
			winner = renter;
			loser = rentee;
		}

		// Update reputations
		reputation.updateReputation(
			_agreementId,
			winner,
			int256(REPUTATION_PENALTY)
		);
		reputation.updateReputation(
			_agreementId,
			loser,
			-int256(REPUTATION_PENALTY)
		);

		// Check for validation revocation
		if (
			reputation.getReputation(loser) <=
			-int256(VALIDATION_REVOCATION_THRESHOLD * REPUTATION_PENALTY)
		) {
			accessRestriction.revokeRole(VERFIED_USER_ROLE, loser);
		}

		dispute.isActive = false;

		emit DisputeResolved(_agreementId, winner, loser);
	}

	function addArbiter(address _arbiter) external onlyAdmin {
		if (_arbiter == address(0)) revert InvalidAddress("arbiter");
		accessRestriction.grantRole(ARBITER_ROLE, _arbiter);
	}

	function removeArbiter(address _arbiter) external onlyAdmin {
		accessRestriction.revokeRole(ARBITER_ROLE, _arbiter);
	}

	function getDispute(
		uint256 _disputeId
	) external view returns (bool, uint256, uint256) {
		Dispute storage dispute = disputes[_disputeId];
		return (
			dispute.isActive,
			dispute.votesForRentee,
			dispute.votesForRenter
		);
	}
}
