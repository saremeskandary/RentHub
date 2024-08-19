// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract MockToken is ERC20, ERC20Permit {

	IAccessRestriction public accessRestriction;



 modifier onlyDistributor() {
        accessRestriction.ifDistributor(msg.sender);
        _;
    }

    constructor(address _accessRestriction)
        ERC20("MockToken", "MTK")
        ERC20Permit("MockToken")
    {
        accessRestriction = IAccessRestriction(_accessRestriction);
    }

    function mint(address to, uint256 amount) public onlyDistributor{
        _mint(to, amount);
    }
}
