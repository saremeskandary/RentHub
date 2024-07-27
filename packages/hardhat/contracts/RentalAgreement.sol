// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

    event RentalCreated(uint256 rentalId, address renter, address owner, uint256 itemId, uint256 startTime, uint256 endTime, uint256 price);
    event RentalEnded(uint256 rentalId);

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