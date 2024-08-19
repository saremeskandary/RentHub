// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";
import { IRentalCollection1155 } from "./interfaces/IRentalCollection1155.sol";

contract RentalCollection1155 is IRentalCollection1155, ERC1155, ERC1155Supply {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;

	string public override name;
	string public override symbol;
	IAccessRestriction public accessRestriction;
	address public collectionHierarchy;

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin(msg.sender);
		_;
	}

	constructor(
		string memory _name,
		string memory _symbol,
		string memory uri,
		address _accessRestriction,
		address _collectionHierarchy
	) ERC1155(uri) {
		name = _name;
		symbol = _symbol;
		accessRestriction = IAccessRestriction(_accessRestriction);
		collectionHierarchy = _collectionHierarchy;
	}

    function mint(
        address account,
        uint256 amount,
        bytes memory data
    ) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(account, tokenId, amount, data);
    }

	function mintBatch(
		address to,
		uint256[] memory ids,
		uint256[] memory amounts,
		bytes memory data
	) public {
		_mintBatch(to, ids, amounts, data);
	}

	function burn(
		address account,
		uint256 id,
		uint256 amount
	) public onlyAdmin {
		_burn(account, id, amount);
	}

	function burnBatch(
		address account,
		uint256[] memory ids,
		uint256[] memory amounts
	) public onlyAdmin {
		_burnBatch(account, ids, amounts);
	}

	// The following functions are overrides required by Solidity.

	function _beforeTokenTransfer(
		address operator,
		address from,
		address to,
		uint256[] memory ids,
		uint256[] memory amounts,
		bytes memory data
	) internal override(ERC1155, ERC1155Supply) {
		super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
	}
}
