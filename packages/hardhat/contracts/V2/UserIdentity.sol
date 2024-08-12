// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract UserIdentity {
	mapping(address => bool) public verifiedUsers;
	address public admin;

	event UserVerified(address indexed user);
	event UserRevoked(address indexed user);

	modifier onlyAdmin() {
		require(msg.sender == admin, "Only admin can perform this action");
		_;
	}

	constructor() {
		admin = msg.sender;
	}

	function verifyUser(address _user) external onlyAdmin {
		require(!verifiedUsers[_user], "User is already verified");
		verifiedUsers[_user] = true;

		emit UserVerified(_user);
	}

	function revokeUser(address _user) external onlyAdmin {
		require(verifiedUsers[_user], "User is not verified");
		verifiedUsers[_user] = false;

		emit UserRevoked(_user);
	}

	function isVerifiedUser(address _user) external view returns (bool) {
		return verifiedUsers[_user];
	}

	function transferAdmin(address _newAdmin) external onlyAdmin {
		require(
			_newAdmin != address(0),
			"New admin cannot be the zero address"
		);
		admin = _newAdmin;
	}
}
