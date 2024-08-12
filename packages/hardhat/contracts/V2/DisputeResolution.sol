// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract DisputeResolution {
	mapping(uint256 => bool) public disputes;

	event DisputeInitiated(uint256 agreementId);
	event DisputeResolved(uint256 agreementId, bool resolvedInFavorOfOwner);

	function initiateDispute(uint256 _agreementId) external {
		require(!disputes[_agreementId], "Dispute already exists");

		disputes[_agreementId] = true;

		emit DisputeInitiated(_agreementId);
	}

	function resolveDispute(
		uint256 _agreementId,
		bool _resolvedInFavorOfOwner
	) external {
		require(disputes[_agreementId], "No active dispute");

		disputes[_agreementId] = false;

		emit DisputeResolved(_agreementId, _resolvedInFavorOfOwner);

		// updating reputations
		// TODO if User negative vote is more than average number of the dao users then user validation would be revoked.
		// TODO if user negative vobe is more thatn one third of dao users then remove the user reputations score. 

		// releasing funds
		// TODO if renter is the loser the it's reposit fond, 10% of reposit found, 10% developer fee.
		
		// TODO renees penlaty is that no rental fee has been transfer to him
	}
}
