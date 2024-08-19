// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { RentalCollection1155 } from "./RentalCollection1155.sol";
import { ICollectionHierarchy } from "./interfaces/ICollectionHierarchy.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract CollectionHierarchy is ICollectionHierarchy {
	mapping(uint256 => Collection) public collections;
	uint256 public nextCollectionId;
	IAccessRestriction public accessRestriction;

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin(msg.sender);
		_;
	}

	function createTopLevelCollection(
		string memory name,
		string memory uri
	) external onlyAdmin {
		_createCollection(name, uri, 0);
	}

	function createSubCollection(
		string memory name,
		string memory uri,
		uint256 parentId
	) external {
		if (collections[parentId].tokenAddress == address(0))
			revert InvalidParentToken();

		if (parentId == 0) {
			if (!accessRestriction.isAdmin(msg.sender))
				revert NotAdmin(msg.sender);
		} else if (collections[parentId].parentId == 0) {
			if (!accessRestriction.isAdmin(msg.sender))
				revert NotAdmin(msg.sender);
		}

		_createCollection(name, uri, parentId);
	}

	function _createCollection(
		string memory name,
		string memory uri,
		uint256 parentId
	) internal {
		uint256 collectionId = nextCollectionId++;
		RentalCollection1155 newCollection = new RentalCollection1155(
			name,
			name,
			uri,
			address(accessRestriction),
			address(this)
		);

		collections[collectionId] = Collection({
			name: name,
			tokenAddress: address(newCollection),
			parentId: parentId
		});

		emit CollectionCreated(
			collectionId,
			name,
			address(newCollection),
			parentId
		);
	}
}
