// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { IUserIdentity } from "./interfaces/IUserIdentity.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract UserIdentity is IUserIdentity {
	mapping(address => bool) public verifiedUsers;
	address public admin;
	IAccessRestriction public accessRestriction;

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin(msg.sender);
		_;
	}

	constructor(address _accessRestriction) {
		admin = msg.sender;
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	function verifyUser(address _user) external onlyAdmin {
		if (verifiedUsers[_user]) revert UserAlreadyVerified(_user);
		verifiedUsers[_user] = true;

		emit UserVerified(_user);
	}

	function revokeUser(address _user) external onlyAdmin {
		if (!verifiedUsers[_user]) revert UserNotVerified(_user);
		verifiedUsers[_user] = false;

		emit UserRevoked(_user);
	}

	function isVerifiedUser(address _user) external view returns (bool) {
		return verifiedUsers[_user];
	}

	function transferAdmin(address _newAdmin) external onlyAdmin {
		if (_newAdmin == address(0)) revert InvalidAddress("_newAdmin");
		admin = _newAdmin;
	}
}
