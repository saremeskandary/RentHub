// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

interface IRentalCollection1155Factory is ICommonErrors {
	error DuplicateCollectionName();

	event CollectionCreated(address indexed owner, address collectionAddress);
	event UpdatedCollectionAddress(address collectionAddress);

	function collectionAddress() external view returns (address);

	function rentalCollectionClones(
		uint256 cloneId
	) external view returns (address);

	function rentalCollectionCreators(
		address collection
	) external view returns (address);

	function isUsedCollection(
		bytes32 collectionHash
	) external view returns (bool);

	function setCollectionAddress(address _collectionAddress) external;

	function createCollection(
		string memory _name,
		string memory _symbol,
		string memory _uri
	) external returns (address);
}
