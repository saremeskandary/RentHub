// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RentalDAO is AccessControl, ReentrancyGuard {
    bytes32 public constant DAO_MEMBER_ROLE = keccak256("DAO_MEMBER_ROLE");
    
    uint256 public systemFee; // Fee in basis points (1/100 of a percent)
    uint256 public constant MAX_FEE = 1000; // 10% max fee
    
    event SystemFeeUpdated(uint256 oldFee, uint256 newFee);
    
    constructor(uint256 _initialFee) {
        require(_initialFee <= MAX_FEE, "Fee exceeds maximum");
        systemFee = _initialFee;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DAO_MEMBER_ROLE, msg.sender);
    }
    
    function proposeAndUpdateSystemFee(uint256 _newFee) external onlyRole(DAO_MEMBER_ROLE) {
        require(_newFee <= MAX_FEE, "Proposed fee exceeds maximum");
        uint256 oldFee = systemFee;
        systemFee = _newFee;
        emit SystemFeeUpdated(oldFee, _newFee);
    }
    
    function addDAOMember(address _member) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_member != address(0), "Invalid address");
        grantRole(DAO_MEMBER_ROLE, _member);
    }
    
    function removeDAOMember(address _member) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(DAO_MEMBER_ROLE, _member);
    }
    
    function getSystemFee() external view returns (uint256) {
        return systemFee;
    }
}