// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title RentalAgreement
 * @dev This contract manages rental agreements for items using ERC721 tokens.
 */
contract RentalAgreement is ReentrancyGuard {
	using SafeERC20 for IERC20;
	struct Rental {
		address renter;
		address owner;
		uint256 itemId;
		uint256 startTime;
		uint256 endTime;
		uint256 price;
		uint256 collateral;
		bool isActive;
	}

	mapping(uint256 => Rental) public rentals;
	uint256 public rentalCount;

	IERC721 public erc721Contract;
	IERC20 public collateralToken;

	event RentalCreated(
		uint256 rentalId,
		address indexed renter,
		address indexed owner,
		uint256 itemId,
		uint256 startTime,
		uint256 endTime,
		uint256 price,
		uint256 collateral
	);
	event RentalEnded(uint256 rentalId);
	event CollateralReturned(
		uint256 rentalId,
		address indexed recipient,
		uint256 amount
	);

	constructor(address _erc721Contract, address _collateralToken) {
		erc721Contract = IERC721(_erc721Contract);
		collateralToken = IERC20(_collateralToken);
	}

	/**
	 * @notice Create a rental agreement for an item
	 * @param _owner The address of the item's owner
	 * @param _itemId The ID of the item being rented
	 * @param _duration The duration of the rental in seconds
	 * @param _price The rental price
	 * @param _collateral The collateral amount
	 */
	function createRental(
		address _owner,
		uint256 _itemId,
		uint256 _duration,
		uint256 _price,
		uint256 _collateral
	) external payable nonReentrant {
		require(msg.value == _price, "Incorrect payment amount");
		require(_collateral > 0, "Collateral amount must be greater than 0");

		uint256 rentalId = rentalCount++;
		rentals[rentalId] = Rental({
			renter: msg.sender,
			owner: _owner,
			itemId: _itemId,
			startTime: block.timestamp,
			endTime: block.timestamp + _duration,
			price: _price,
			collateral: _collateral,
			isActive: true
		});

		// Transfer the collateral from the renter to the contract
		collateralToken.safeTransferFrom(
			msg.sender,
			address(this),
			_collateral
		);

		emit RentalCreated(
			rentalId,
			msg.sender,
			_owner,
			_itemId,
			block.timestamp,
			block.timestamp + _duration,
			_price,
			_collateral
		);
	}

	/**
	 * @notice End a rental agreement
	 * @param _rentalId The ID of the rental agreement to be ended
	 */
	function endRental(uint256 _rentalId) external nonReentrant {
		Rental storage rental = rentals[_rentalId];
		require(
			msg.sender == rental.owner || msg.sender == rental.renter,
			"Not authorized"
		);
		require(rental.isActive, "Rental not active");

		// Effect: Update the contract's state before making external calls
		rental.isActive = false;
		address owner = rental.owner;
		uint256 price = rental.price;
		uint256 collateral = rental.collateral;

		// Interaction: External call to transfer the rental price to the owner
		(bool success, ) = owner.call{ value: price }(""); // wake-disable-line
		require(success, "Failed to transfer rental price to owner");

		// Interaction: Return the collateral to the renter
		collateralToken.safeTransfer(rental.renter, collateral);
		emit CollateralReturned(_rentalId, rental.renter, collateral);

		emit RentalEnded(_rentalId);
	}
}
