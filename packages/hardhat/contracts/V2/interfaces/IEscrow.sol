// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IEscrow {
	function lockFunds(uint256 _agreementId, uint256 _amount) external;

	function releaseFunds(uint256 _agreementId) external;

	function refundDeposit(uint256 _agreementId) external;
}