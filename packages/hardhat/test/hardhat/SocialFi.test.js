// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("SocialFi", function () {
//     let SocialFi, socialFi, MockToken, token, owner, user1, user2;

//     beforeEach(async function () {
//         MockToken = await ethers.getContractFactory("MockToken");
//         token = await MockToken.deploy("MockToken", "MTK", 18, ethers.utils.parseEther("1000"));
//         await token.deployed();

//         SocialFi = await ethers.getContractFactory("SocialFi");
//         [owner, user1, user2, _] = await ethers.getSigners();
//         socialFi = await SocialFi.deploy(token.address);
//         await socialFi.deployed();
//     });

//     describe("rewardUser", function () {
//         it("should reward a user with the specified amount", async function () {
//             await socialFi.rewardUser(user1.address, 100);
//             const reward = await socialFi.rewards(user1.address);
//             expect(reward).to.equal(100);
//         });

//         it("should emit the UserRewarded event on rewarding a user", async function () {
//             await expect(socialFi.rewardUser(user1.address, 100))
//                 .to.emit(socialFi, "UserRewarded")
//                 .withArgs(user1.address, 100);
//         });

//         it("should revert if the amount is zero", async function () {
//             await expect(socialFi.rewardUser(user1.address, 0))
//                 .to.be.revertedWith("MustBeGraterThanZero(\"amount\")");
//         });

//         it("should revert if the user address is zero", async function () {
//             await expect(socialFi.rewardUser(ethers.constants.AddressZero, 100))
//                 .to.be.revertedWith("InvalidAddress(\"user\")");
//         });

//         it("should accumulate rewards for the same user", async function () {
//             await socialFi.rewardUser(user1.address, 100);
//             await socialFi.rewardUser(user1.address, 50);
//             const reward = await socialFi.rewards(user1.address);
//             expect(reward).to.equal(150);
//         });
//     });

//     describe("getRewardBalance", function () {
//         it("should return the correct reward balance for a user", async function () {
//             await socialFi.rewardUser(user1.address, 200);
//             const rewardBalance = await socialFi.getRewardBalance(user1.address);
//             expect(rewardBalance).to.equal(200);
//         });

//         it("should revert if the user address is zero", async function () {
//             await expect(socialFi.getRewardBalance(ethers.constants.AddressZero))
//                 .to.be.revertedWith("InvalidAddress(\"user\")");
//         });
//     });

//     describe("claimRewards", function () {
//         beforeEach(async function () {
//             await token.transfer(socialFi.address, ethers.utils.parseEther("100"));
//         });

//         it("should allow a user to claim their rewards", async function () {
//             await socialFi.rewardUser(user1.address, 100);
//             await socialFi.connect(user1).claimRewards();
//             const rewardBalance = await socialFi.getRewardBalance(user1.address);
//             expect(rewardBalance).to.equal(0);

//             const userTokenBalance = await token.balanceOf(user1.address);
//             expect(userTokenBalance).to.equal(100);
//         });

//         it("should emit the RewardClaimed event on claiming rewards", async function () {
//             await socialFi.rewardUser(user1.address, 100);
//             await expect(socialFi.connect(user1).claimRewards())
//                 .to.emit(socialFi, "RewardClaimed")
//                 .withArgs(user1.address, 100);
//         });

//         it("should revert if there are no rewards to claim", async function () {
//             await expect(socialFi.connect(user1).claimRewards())
//                 .to.be.revertedWith("NoRewardsToClaim()");
//         });

//         it("should reset the user's reward balance after claiming", async function () {
//             await socialFi.rewardUser(user1.address, 100);
//             await socialFi.connect(user1).claimRewards();
//             const rewardBalance = await socialFi.getRewardBalance(user1.address);
//             expect(rewardBalance).to.equal(0);
//         });

//         it("should revert if trying to claim rewards twice", async function () {
//             await socialFi.rewardUser(user1.address, 100);
//             await socialFi.connect(user1).claimRewards();
//             await expect(socialFi.connect(user1).claimRewards())
//                 .to.be.revertedWith("NoRewardsToClaim()");
//         });

//         it("should revert if the contract doesn't have enough tokens to fulfill the claim", async function () {
//             await socialFi.rewardUser(user1.address, ethers.utils.parseEther("150"));
//             await expect(socialFi.connect(user1).claimRewards())
//                 .to.be.revertedWith("SafeERC20: low-level call failed");
//         });
//     });
// });
