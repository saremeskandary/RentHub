// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/// @title IMonetization - Interface for the Monetization contract
/// @notice Interface for distributing revenue and tracking agreement earnings
interface IMonetization {

    /// @notice Distributes revenue for a specific agreement
    /// @param _agreementId The ID of the agreement for which the revenue is being distributed
    /// @param _amount The total amount of revenue to be distributed
    function distributeRevenue(uint256 _agreementId, uint256 _amount) external;

    /// @notice Retrieves the earnings for a specific agreement
    /// @param _agreementId The ID of the agreement to query
    /// @return The earnings associated with the specified agreement
    function getEarnings(uint256 _agreementId) external view returns (uint256);

    /// @notice Retrieves the earnings associated with a specific agreement
    /// @param _agreementId The ID of the agreement to query
    /// @return The earnings associated with the specified agreement
    function agreementEarnings(uint256 _agreementId) external view returns (uint256);
}
