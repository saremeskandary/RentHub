import { expect } from "chai";
import { ethers } from "hardhat";
import { RatingAndReview } from "../typechain-types";

describe("RatingAndReview", function () {
  let ratingAndReview: RatingAndReview;
  let owner: any;
  let reviewer: any;
  let reviewee: any;

  before(async () => {
    [owner, reviewer, reviewee] = await ethers.getSigners();
    const RatingAndReviewFactory = await ethers.getContractFactory("RatingAndReview");
    ratingAndReview = (await RatingAndReviewFactory.deploy()) as RatingAndReview;
    await ratingAndReview.waitForDeployment();
  });

  describe("Review Operations", function () {
    it("Should submit a review", async function () {
      const rating = 4;
      const comment = "Great service!";

      await expect(ratingAndReview.connect(reviewer).submitReview(reviewee.address, rating, comment))
        .to.emit(ratingAndReview, "ReviewSubmitted")
        .withArgs(reviewer.address, reviewee.address, rating, comment);
    });

    it("Should get reviews for a user", async function () {
      const rating = 5;
      const comment = "Excellent!";

      await ratingAndReview.connect(reviewer).submitReview(reviewee.address, rating, comment);

      const reviews = await ratingAndReview.getReviews(reviewee.address);
      expect(reviews.length).to.equal(2);
      expect(reviews[1].reviewer).to.equal(reviewer.address);
      expect(reviews[1].rating).to.equal(rating);
      expect(reviews[1].comment).to.equal(comment);
    });

    it("Should calculate average rating correctly", async function () {
      const avgRating = await ratingAndReview.getAverageRating(reviewee.address);
      expect(avgRating).to.equal(4); // (4 + 5) / 2 = 4.5, but solidity rounds down
    });
  });
});
