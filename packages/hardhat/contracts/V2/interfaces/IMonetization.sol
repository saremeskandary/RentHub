// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IMonetization {
	function distributeRevenue(uint256 _agreementId, uint256 _amount) external;
}