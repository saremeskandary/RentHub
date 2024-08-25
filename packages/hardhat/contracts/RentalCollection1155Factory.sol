// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./RentalCollection1155.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";
import { IRentalCollection1155Factory } from "./interfaces/IRentalCollection1155Factory.sol";
import { IRentalCollection1155 } from "./interfaces/IRentalCollection1155.sol";
import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";

contract RentalCollection1155Factory is IRentalCollection1155Factory {
	IAccessRestriction public accessRestriction;
	IRentalCollection1155 public rentalCollection1155;

	address public override collectionAddress;

	uint256 private _cloneId;

	mapping(uint256 => address) public override rentalCollectionClones;
	mapping(address => address) public override rentalCollectionCreators;
	mapping(bytes32 => bool) public override isUsedCollection;

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin(msg.sender);
		_;
	}

	constructor(address _accessRestriction) {
		accessRestriction = IAccessRestriction(_accessRestriction);
		_cloneId = 0;
	}

	function setCollectionAddress(
		address _collectionAddress
	) external override onlyAdmin {
		if (_collectionAddress == address(0))
			revert InvalidAddress("collection Address");
		rentalCollection1155 = IRentalCollection1155(_collectionAddress);
		emit UpdatedCollectionAddress(_collectionAddress);
	}

	function createCollection(
		string memory _name,
		string memory _symbol,
		string memory _uri
	) public onlyAdmin returns (address) {
		if (isUsedCollection[keccak256(abi.encodePacked(_name))] == true)
			revert DuplicateCollectionName();
		if (collectionAddress == address(0))
			revert InvalidAddress("collection Address");

		rentalCollection1155 = IRentalCollection1155(
			Clones.clone(collectionAddress)
		);

		RentalCollection1155 newCollection = new RentalCollection1155(
			_name,
			_symbol,
			_uri,
			address(accessRestriction)
		);

		rentalCollectionClones[_cloneId] = address(newCollection);
		rentalCollectionCreators[address(newCollection)] = msg.sender;

		_cloneId++;

		isUsedCollection[keccak256(abi.encodePacked(_name))] = true;

		emit CollectionCreated(msg.sender, address(newCollection));
		return address(newCollection);
	}
}
