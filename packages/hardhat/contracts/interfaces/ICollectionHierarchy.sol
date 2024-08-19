// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

interface ICollectionHierarchy is ICommonErrors {
	struct Collection {
		string name;
		address tokenAddress;
		uint256 parentId;
	}

	error InvalidParentToken();

	event CollectionCreated(
		uint256 indexed id,
		string name,
		address tokenAddress,
		uint256 parentId
	);
}
