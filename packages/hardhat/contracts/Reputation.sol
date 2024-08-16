// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";
import { IReputation } from "./interfaces/IReputation.sol";

contract Reputation is IReputation, AccessControl {
	bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

	mapping(address => int256) public reputationScores;

	function updateReputation(
		uint256 _agreementId,
		address _user,
		int256 _change
	) external onlyRole(UPDATER_ROLE) {
		if (_user == address(0)) revert InvalidUserAddress(_user);

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

	function addUpdater(
		address _updater
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		if (_updater == address(0)) revert InvalidUpdaterAddress(_updater);
		grantRole(UPDATER_ROLE, _updater);
	}

	function removeUpdater(
		address _updater
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		revokeRole(UPDATER_ROLE, _updater);
	}
}
