// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MockToken is ERC20, ERC20Permit {
    constructor()
        ERC20("MockToken", "MTK")
        ERC20Permit("MockToken")
    {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
