// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

import "hardhat/console.sol";

contract MockToken is ERC20 {
	IAccessRestriction public accessRestriction;

	modifier onlyDistributor() {
		accessRestriction.ifDistributor(msg.sender);
		_;
	}

	constructor(
		string memory _name,
		string memory _symbol,
		address _accessRestriction
	) ERC20(_name, _symbol) {
		_mint(msg.sender, 10000 * (10 ** decimals()));
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	function mint(address to, uint256 amount) external {
		_mint(to, amount);
	}

	function decimals() public pure override returns (uint8) {
		return 18; // Set the desired number of decimal places here
	}
}
