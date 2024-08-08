// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RevenueSharing
 * @dev This contract manages the distribution of revenue, allowing the owner to set a platform fee and a K9 Finance DAO fee.
 */
contract RevenueSharing is Ownable {
    uint256 public platformFee = 50; // 5% platform fee
    uint256 public k9FinanceDAOFee = 25; // 2.5% K9 Finance DAO fee
    uint256 public constant DENOMINATOR = 1000;

    IERC20 public k9Token;

    event RevenuePaid(address indexed recipient, uint256 amount);
    event K9FinanceDAORevenuePaid(uint256 amount);

    constructor(address _k9Token) {
        k9Token = IERC20(_k9Token);
    }

    /**
     * @notice Distribute revenue to the recipient after deducting the platform fee and the K9 Finance DAO fee
     * @param _recipient The address of the recipient
     */
    function distributeRevenue(address _recipient) external payable {
        uint256 platformAmount = (msg.value * platformFee) / DENOMINATOR;
        uint256 k9FinanceDAOAmount = (msg.value * k9FinanceDAOFee) / DENOMINATOR;
        uint256 recipientAmount = msg.value - platformAmount - k9FinanceDAOAmount;

        payable(owner()).transfer(platformAmount);
        k9Token.transfer(address(0x123456789012345678901234567890ab), k9FinanceDAOAmount); // K9 Finance DAO address
        payable(_recipient).transfer(recipientAmount);

        emit RevenuePaid(_recipient, recipientAmount);
        emit K9FinanceDAORevenuePaid(k9FinanceDAOAmount);
    }

    /**
     * @notice Set a new platform fee
     * @param _newPlatformFee The new platform fee (in basis points, where 100 basis points = 10%)
     */
    function setPlatformFee(uint256 _newPlatformFee) external onlyOwner {
        require(_newPlatformFee <= 100, "Platform fee too high"); // Max 10%
        platformFee = _newPlatformFee;
    }

    /**
     * @notice Set a new K9 Finance DAO fee
     * @param _newK9FinanceDAOFee The new K9 Finance DAO fee (in basis points, where 100 basis points = 10%)
     */
    function setK9FinanceDAOFee(uint256 _newK9FinanceDAOFee) external onlyOwner {
        require(_newK9FinanceDAOFee <= 100, "K9 Finance DAO fee too high"); // Max 10%
        k9FinanceDAOFee = _newK9FinanceDAOFee;
    }
}