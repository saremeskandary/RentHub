// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RentalAgreement
 * @dev This contract manages rental agreements for items using ERC721 tokens.
 */
contract RentalAgreement is ReentrancyGuard {
    struct Rental {
        address renter;
        address owner;
        uint256 itemId;
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Rental) public rentals;
    uint256 public rentalCount;

    event RentalCreated(uint256 rentalId, address indexed renter, address indexed owner, uint256 itemId, uint256 startTime, uint256 endTime, uint256 price);
    event RentalEnded(uint256 rentalId);

    /**
     * @notice Create a rental agreement for an item
     * @param _owner The address of the item's owner
     * @param _itemId The ID of the item being rented
     * @param _duration The duration of the rental in seconds
     * @param _price The rental price
     */
    function createRental(address _owner, uint256 _itemId, uint256 _duration, uint256 _price) external payable nonReentrant {
        require(msg.value == _price, "Incorrect payment amount");

        uint256 rentalId = rentalCount++;
        rentals[rentalId] = Rental({
            renter: msg.sender,
            owner: _owner,
            itemId: _itemId,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            price: _price,
            isActive: true
        });

        emit RentalCreated(rentalId, msg.sender, _owner, _itemId, block.timestamp, block.timestamp + _duration, _price);
    }

    /**
     * @notice End a rental agreement
     * @param _rentalId The ID of the rental agreement to be ended
     */
    function endRental(uint256 _rentalId) external nonReentrant {
        Rental storage rental = rentals[_rentalId];
        require(msg.sender == rental.owner || msg.sender == rental.renter, "Not authorized");
        require(rental.isActive, "Rental not active");

        rental.isActive = false;
        address owner = rental.owner;
        uint256 price = rental.price;

        (bool success, ) = owner.call{value: price}("");
        require(success, "Failed to transfer funds");

        emit RentalEnded(_rentalId);
    }
}
