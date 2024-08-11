// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Monetization {
    mapping(uint256 => uint256) public agreementEarnings;

    event RevenueDistributed(uint256 agreementId, uint256 amount);

    function distributeRevenue(uint256 _agreementId, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");

        // Example logic: 10% fee, 90% to owner
        uint256 platformFee = (_amount * 10) / 100;
        uint256 ownerEarnings = _amount - platformFee;

        agreementEarnings[_agreementId] = ownerEarnings;

        emit RevenueDistributed(_agreementId, ownerEarnings);

        // TODO Logic to distribute funds
        // Example: transfer ownerEarnings to the agreement owner
        // and platformFee to the platform treasury.
    }

    function getEarnings(uint256 _agreementId) external view returns (uint256) {
        return agreementEarnings[_agreementId];
    }

    // Allow the contract to receive payments
    receive() external payable {}
}
