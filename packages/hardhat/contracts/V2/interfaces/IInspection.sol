// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IInspection {
	function inspectItem(uint256 _agreementId) external returns (bool);
}
