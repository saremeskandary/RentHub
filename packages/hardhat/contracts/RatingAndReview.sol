// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RatingAndReview {
    struct Review {
        address reviewer;
        address reviewee;
        uint8 rating;
        string comment;
        uint256 timestamp;
    }

    mapping(address => Review[]) public userReviews;

    event ReviewSubmitted(address indexed reviewer, address indexed reviewee, uint8 rating, string comment);

    function submitReview(address _reviewee, uint8 _rating, string memory _comment) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        Review memory newReview = Review({
            reviewer: msg.sender,
            reviewee: _reviewee,
            rating: _rating,
            comment: _comment,
            timestamp: block.timestamp
        });

        userReviews[_reviewee].push(newReview);

        emit ReviewSubmitted(msg.sender, _reviewee, _rating, _comment);
    }

    function getReviews(address _user) external view returns (Review[] memory) {
        return userReviews[_user];
    }

    function getAverageRating(address _user) external view returns (uint8) {
        Review[] memory reviews = userReviews[_user];
        if (reviews.length == 0) return 0;

        uint256 totalRating = 0;
        for (uint i = 0; i < reviews.length; i++) {
            totalRating += reviews[i].rating;
        }

        return uint8(totalRating / reviews.length);
    }
}