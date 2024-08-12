// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Reputation {
	mapping(address => uint256) public reputationScores;
	// FIXME chane that to this: mapping(address => User) public reputationScores;

	event ReputationUpdated(address user, uint256 newScore);

	function updateReputations(
		address _owner,
		address _renter,
		bool _successful
	) external {
		if (_successful) {
			reputationScores[_owner] += 10;
			reputationScores[_renter] += 10;
		} else {
			reputationScores[_owner] -= 10;
			reputationScores[_renter] -= 10;
		}

		emit ReputationUpdated(_owner, reputationScores[_owner]);
		emit ReputationUpdated(_renter, reputationScores[_renter]);
	}
}
