// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IDisputeResolution {
	function initiateDispute(uint256 _agreementId) external;
}