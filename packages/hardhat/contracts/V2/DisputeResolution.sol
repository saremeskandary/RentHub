// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

import { IUserIdentity } from "./interfaces/IUserIdentity.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { IInspection } from "./interfaces/IInspection.sol";
import { ISocialFi } from "./interfaces/ISocialFi.sol";
import { IMonetization } from "./interfaces/IMonetization.sol";
import { IReputation } from "./interfaces/IReputation.sol";
import { IDisputeResolution } from "./interfaces/IDisputeResolution.sol";
import { IRentalDAO } from "./interfaces/IRentalDAO.sol";
import { IRentalAgreement } from "./interfaces/IRentalAgreement.sol";
import { IDisputeResolution } from "./interfaces/IDisputeResolution.sol";

contract DisputeResolution is IDisputeResolution, AccessControl {
	bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");

	mapping(uint256 => Dispute) public disputes;

	IRentalAgreement public rentalAgreement;
	IReputation public reputation;
	IUserIdentity public userIdentity;

	uint256 public constant REPUTATION_PENALTY = 50;
	uint256 public constant VALIDATION_REVOCATION_THRESHOLD = 3;

	constructor(
		address _rentalAgreement,
		address _reputation,
		address _userIdentity
	) {
		if (_rentalAgreement == address(0))
			revert InvalidAddress("rental agreement");
		if (_reputation == address(0)) revert InvalidAddress("reputation");
		if (_userIdentity == address(0)) revert InvalidAddress("user identity");

		rentalAgreement = IRentalAgreement(_rentalAgreement);
		reputation = IReputation(_reputation);
		userIdentity = IUserIdentity(_userIdentity);

		_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_setupRole(ARBITER_ROLE, msg.sender);
	}

	function initiateDispute(uint256 _agreementId) external {
		if (disputes[_agreementId].isActive)
			revert DisputeAlreadyExists(_agreementId);

		disputes[_agreementId].isActive = true;
		emit DisputeInitiated(_agreementId);
	}

	function voteOnDispute(
		uint256 _agreementId,
		bool _voteForOwner
	) external onlyRole(ARBITER_ROLE) {
		Dispute storage dispute = disputes[_agreementId];
		if (!dispute.isActive) revert NoActiveDispute(_agreementId);
		if (dispute.hasVoted[msg.sender])
			revert ArbiterAlreadyVoted(msg.sender, _agreementId);

		if (_voteForOwner) {
			dispute.votesForOwner++;
		} else {
			dispute.votesForRenter++;
		}

		dispute.hasVoted[msg.sender] = true;

		emit ArbitersVoted(_agreementId, msg.sender, _voteForOwner);
	}

	function resolveDispute(
		uint256 _agreementId
	) external onlyRole(ARBITER_ROLE) {
		Dispute storage dispute = disputes[_agreementId];
		if (!dispute.isActive) revert NoActiveDispute(_agreementId);

		(address owner, address renter) = rentalAgreement.getAgreementParties(
			_agreementId
		);

		address winner;
		address loser;

		if (dispute.votesForOwner > dispute.votesForRenter) {
			winner = owner;
			loser = renter;
		} else {
			winner = renter;
			loser = owner;
		}

		// Update reputations
		reputation.updateReputation(winner, int256(REPUTATION_PENALTY));
		reputation.updateReputation(loser, -int256(REPUTATION_PENALTY));

		// Check for validation revocation
		if (
			reputation.getReputation(loser) <=
			-int256(VALIDATION_REVOCATION_THRESHOLD * REPUTATION_PENALTY)
		) {
			userIdentity.revokeUser(loser);
		}

		dispute.isActive = false;

		emit DisputeResolved(_agreementId, winner, loser);

		// Implement penalties for the loser (e.g., forfeit deposit)
		// This would typically involve calling a function on the Escrow contract
		// IEscrow(escrowContract).applyPenalty(_agreementId, loser);
	}

	function addArbiter(
		address _arbiter
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		if (_arbiter == address(0)) revert InvalidAddress("arbiter");
		grantRole(ARBITER_ROLE, _arbiter);
	}

	function removeArbiter(
		address _arbiter
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		revokeRole(ARBITER_ROLE, _arbiter);
	}

	function getDispute(
		uint256 _disputeId
	) external view returns (bool, uint256, uint256) {
		Dispute storage dispute = disputes[_disputeId];
		return (
			dispute.isActive,
			dispute.votesForOwner,
			dispute.votesForRenter
		);
	}
}
