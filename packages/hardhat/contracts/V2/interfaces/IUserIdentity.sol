// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IUserIdentity {
	function isVerifiedUser(address _user) external view returns (bool);
}