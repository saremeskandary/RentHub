// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisputeResolution {
    mapping(uint256 => bool) public disputes;

    event DisputeInitiated(uint256 agreementId);
    event DisputeResolved(uint256 agreementId, bool resolvedInFavorOfOwner);

    function initiateDispute(uint256 _agreementId) external {
        require(!disputes[_agreementId], "Dispute already exists");

        disputes[_agreementId] = true;

        emit DisputeInitiated(_agreementId);
    }

    function resolveDispute(uint256 _agreementId, bool _resolvedInFavorOfOwner) external {
        require(disputes[_agreementId], "No active dispute");

        disputes[_agreementId] = false;

        emit DisputeResolved(_agreementId, _resolvedInFavorOfOwner);

        // Logic to resolve the dispute would be implemented here
        // For example, releasing funds or updating reputations
    }
}
