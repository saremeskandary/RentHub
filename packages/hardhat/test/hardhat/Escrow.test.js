// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Escrow", function () {
//     let Escrow, escrow, MockToken, token, MockRentalDAO, rentalDAO, MockAccessRestriction, accessRestriction;
//     let owner, approvedContract, rentee, renter, user1;

//     beforeEach(async function () {
//         // Deploy the mock contracts
//         MockToken = await ethers.getContractFactory("MockToken");
//         token = await MockToken.deploy("MockToken", "MTK", 18, ethers.utils.parseEther("1000"));
//         await token.deployed();

//         MockRentalDAO = await ethers.getContractFactory("MockRentalDAO");
//         rentalDAO = await MockRentalDAO.deploy();
//         await rentalDAO.deployed();

//         MockAccessRestriction = await ethers.getContractFactory("MockAccessRestriction");
//         accessRestriction = await MockAccessRestriction.deploy();
//         await accessRestriction.deployed();

//         // Deploy the Escrow contract
//         Escrow = await ethers.getContractFactory("Escrow");
//         [owner, approvedContract, rentee, renter, user1] = await ethers.getSigners();
//         escrow = await Escrow.deploy(token.address, rentalDAO.address, accessRestriction.address);
//         await escrow.deployed();

//         // Set up roles in the access restriction mock
//         await accessRestriction.setApprovedContract(approvedContract.address, true);
//     });

//     describe("Constructor", function () {
//         it("should set the correct addresses for dependencies", async function () {
//             const tokenAddress = await escrow.token();
//             const rentalDAOAddress = await escrow.rentalDAO();
//             const accessRestrictionAddress = await escrow.accessRestriction();

//             expect(tokenAddress).to.equal(token.address);
//             expect(rentalDAOAddress).to.equal(rentalDAO.address);
//             expect(accessRestrictionAddress).to.equal(accessRestriction.address);
//         });
//     });

//     describe("lockFunds", function () {
//         it("should allow an approved contract to lock funds", async function () {
//             await token.transfer(approvedContract.address, ethers.utils.parseEther("100"));
//             await token.connect(approvedContract).approve(escrow.address, ethers.utils.parseEther("100"));

//             const systemFee = 10; // 1%
//             await rentalDAO.setSystemFee(systemFee);

//             await escrow.connect(approvedContract).lockFunds(1, ethers.utils.parseEther("50"), ethers.utils.parseEther("50"));
//             const escrowState = await escrow.escrows(1);

//             expect(escrowState).to.be.true;

//             const daoBalance = await token.balanceOf(rentalDAO.address);
//             expect(daoBalance).to.equal(systemFee * ethers.utils.parseEther("100"));
//         });

//         it("should emit FundsLocked event when funds are locked", async function () {
//             await token.transfer(approvedContract.address, ethers.utils.parseEther("100"));
//             await token.connect(approvedContract).approve(escrow.address, ethers.utils.parseEther("100"));

//             await expect(escrow.connect(approvedContract).lockFunds(1, ethers.utils.parseEther("50"), ethers.utils.parseEther("50")))
//                 .to.emit(escrow, "FundsLocked")
//                 .withArgs(1);
//         });

//         it("should revert if funds are already locked for the agreement", async function () {
//             await token.transfer(approvedContract.address, ethers.utils.parseEther("100"));
//             await token.connect(approvedContract).approve(escrow.address, ethers.utils.parseEther("100"));

//             await escrow.connect(approvedContract).lockFunds(1, ethers.utils.parseEther("50"), ethers.utils.parseEther("50"));

//             await expect(
//                 escrow.connect(approvedContract).lockFunds(1, ethers.utils.parseEther("50"), ethers.utils.parseEther("50"))
//             ).to.be.revertedWith("Funds_already_locked()");
//         });

//         it("should revert if called by a non-approved contract", async function () {
//             await expect(
//                 escrow.connect(user1).lockFunds(1, ethers.utils.parseEther("50"), ethers.utils.parseEther("50"))
//             ).to.be.revertedWith(`Not an approved contract`);
//         });
//     });

//     describe("distributeRevenue", function () {
//         it("should distribute revenue correctly between renter and rentee", async function () {
//             await token.transfer(escrow.address, ethers.utils.parseEther("100"));
//             const systemFee = 10; // 1%
//             await rentalDAO.setSystemFee(systemFee);

//             await escrow.connect(approvedContract).distributeRevenue(
//                 1,
//                 ethers.utils.parseEther("50"),
//                 ethers.utils.parseEther("50"),
//                 rentee.address,
//                 renter.address
//             );

//             const renteeBalance = await token.balanceOf(rentee.address);
//             const renterBalance = await token.balanceOf(renter.address);

//             expect(renteeBalance).to.equal(ethers.utils.parseEther("49.5"));
//             expect(renterBalance).to.equal(ethers.utils.parseEther("50"));
//         });

//         it("should emit RevenueDistributed event when revenue is distributed", async function () {
//             await token.transfer(escrow.address, ethers.utils.parseEther("100"));
//             const systemFee = 10; // 1%
//             await rentalDAO.setSystemFee(systemFee);

//             await expect(escrow.connect(approvedContract).distributeRevenue(
//                 1,
//                 ethers.utils.parseEther("50"),
//                 ethers.utils.parseEther("50"),
//                 rentee.address,
//                 renter.address
//             )).to.emit(escrow, "RevenueDistributed")
//                 .withArgs(1, ethers.utils.parseEther("49.5"));
//         });

//         it("should revert if deposit is zero", async function () {
//             await token.transfer(escrow.address, ethers.utils.parseEther("100"));
//             await expect(
//                 escrow.connect(approvedContract).distributeRevenue(
//                     1,
//                     0, // Deposit is zero
//                     ethers.utils.parseEther("50"),
//                     rentee.address,
//                     renter.address
//                 )
//             ).to.be.revertedWith("MustBeGraterThanZero(\"deposit\")");
//         });
//     });

//     describe("refundDeposit", function () {
//         beforeEach(async function () {
//             await token.transfer(escrow.address, ethers.utils.parseEther("100"));
//         });

//         it("should refund deposit correctly", async function () {
//             await escrow.connect(approvedContract).refundDeposit(
//                 1,
//                 ethers.utils.parseEther("50"),
//                 ethers.utils.parseEther("50"),
//                 rentee.address,
//                 renter.address
//             );

//             const renteeBalance = await token.balanceOf(rentee.address);
//             const renterBalance = await token.balanceOf(renter.address);

//             expect(renteeBalance).to.equal(ethers.utils.parseEther("49.5"));
//             expect(renterBalance).to.equal(ethers.utils.parseEther("50"));
//         });

//         it("should emit DepositRefunded event when deposit is refunded", async function () {
//             await expect(escrow.connect(approvedContract).refundDeposit(
//                 1,
//                 ethers.utils.parseEther("50"),
//                 ethers.utils.parseEther("50"),
//                 rentee.address,
//                 renter.address
//             )).to.emit(escrow, "DepositRefunded")
//                 .withArgs(1);
//         });

//         it("should revert if there is no deposit to refund", async function () {
//             await expect(
//                 escrow.connect(approvedContract).refundDeposit(
//                     1,
//                     ethers.utils.parseEther("50"),
//                     ethers.utils.parseEther("50"),
//                     rentee.address,
//                     renter.address
//                 )
//             ).to.be.revertedWith("No_deposit_to_refund()");
//         });

//         it("should revert if called by a non-approved contract", async function () {
//             await expect(
//                 escrow.connect(user1).refundDeposit(
//                     1,
//                     ethers.utils.parseEther("50"),
//                     ethers.utils.parseEther("50"),
//                     rentee.address,
//                     renter.address
//                 )
//             ).to.be.revertedWith(`Not an approved contract`);
//         });
//     });

//     describe("getEarnings", function () {
//         beforeEach(async function () {
//             await token.transfer(escrow.address, ethers.utils.parseEther("100"));
//             const systemFee = 10; // 1%
//             await rentalDAO.setSystemFee(systemFee);

//             await escrow.connect(approvedContract).distributeRevenue(
//                 1,
//                 ethers.utils.parseEther("50"),
//                 ethers.utils.parseEther("50"),
//                 rentee.address,
//                 renter.address
//             );
//         });

//         it("should return the correct earnings for an agreement", async function () {
//             const earnings = await escrow.getEarnings(1);
//             expect(earnings).to.equal(ethers.utils.parseEther("49.5"));
//         });

//         it("should return zero if no earnings have been distributed for an agreement", async function () {
//             const earnings = await escrow.getEarnings(2);
//             expect(earnings).to.equal(0);
//         });
//     });
// });