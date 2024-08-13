// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Reputation is AccessControl {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    mapping(address => int256) public reputationScores;

    event ReputationUpdated(address user, int256 newScore);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPDATER_ROLE, msg.sender);
    }

    function updateReputation(address _user, int256 _change) external onlyRole(UPDATER_ROLE) {
        require(_user != address(0), "Invalid user address");
        
        reputationScores[_user] += _change;

        emit ReputationUpdated(_user, reputationScores[_user]);
    }

    function getReputation(address _user) external view returns (int256) {
        return reputationScores[_user];
    }

    function addUpdater(address _updater) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_updater != address(0), "Invalid updater address");
        grantRole(UPDATER_ROLE, _updater);
    }

    function removeUpdater(address _updater) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(UPDATER_ROLE, _updater);
    }
}