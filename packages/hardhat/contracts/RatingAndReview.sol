// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title RatingAndReview
 * @dev This contract allows users to submit and view reviews.
 */
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

    /**
     * @notice Submit a review for a user
     * @param _reviewee The address of the user being reviewed
     * @param _rating The rating given to the user (1-5)
     * @param _comment The comment provided by the reviewer
     */
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

    /**
     * @notice Get all reviews of a user
     * @param _user The address of the user whose reviews are being retrieved
     * @return An array of Review structs containing the user's reviews
     */
    function getReviews(address _user) external view returns (Review[] memory) {
        return userReviews[_user];
    }

    /**
     * @notice Get the average rating of a user
     * @param _user The address of the user whose average rating is being calculated
     * @return The average rating of the user
     */
    function getAverageRating(address _user) external view returns (uint8) {
        uint256 totalRating = 0;
        uint256 reviewCount = userReviews[_user].length;

        for (uint i = 0; i < reviewCount; i++) {
            totalRating += userReviews[_user][i].rating;
        }

        return reviewCount == 0 ? 0 : uint8(totalRating / reviewCount);
    }
}
