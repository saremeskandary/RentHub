// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IReputation {
	function updateReputations(
		uint256 _agreementId,
		address _owner,
		address _renter,
		bool _successful
	) external;
}