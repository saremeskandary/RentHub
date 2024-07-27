// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RevenueSharing is Ownable {
    uint256 public platformFee = 50; // 5% platform fee
    uint256 public constant DENOMINATOR = 1000;

    event RevenuePaid(address recipient, uint256 amount);

    function distributeRevenue(address _recipient) external payable {
        uint256 platformAmount = (msg.value * platformFee) / DENOMINATOR;
        uint256 recipientAmount = msg.value - platformAmount;

        payable(owner()).transfer(platformAmount);
        payable(_recipient).transfer(recipientAmount);

        emit RevenuePaid(_recipient, recipientAmount);
    }

    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 100, "Fee too high"); // Max 10%
        platformFee = _newFee;
    }
}