// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { IReputation } from "./interfaces/IReputation.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract Reputation is IReputation {
	bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
	IAccessRestriction public accessRestriction;

	mapping(address => int256) public reputationScores;

	modifier onlyApprovedContract() {
		accessRestriction.ifApprovedContract(msg.sender);
		_;
	}

	constructor(address _accessRestriction) {
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	function updateReputation(
		uint256 _agreementId,
		address _user,
		int256 _change
	) external onlyApprovedContract {
		if (_user == address(0)) revert InvalidAddress("user");

		reputationScores[_user] += _change;

		emit ReputationUpdated(
			_agreementId,
			_user,
			_change,
			reputationScores[_user]
		);
	}

	function getReputation(address _user) external view returns (int256) {
		return reputationScores[_user];
	}
}
