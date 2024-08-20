const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const Math = require("../math");

describe("RentalAgreement", function () {
  let RentalAgreement,
    rentalAgreement,
    MockToken,
    token,
    MockEscrow,
    escrow,
    MockInspection,
    inspection,
    rentalDAO,
    MockDisputeResolution,
    disputeResolution,
    MockSocialFi,
    socialFi,
    MockAccessRestriction,
    accessRestriction;
  let owner, admin, distributer, rentee, renter, dao, collection_one, user1;

  const zeroAddress = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [owner, admin, distributer, rentee, renter, dao, collection_one, user1] = await ethers.getSigners();

    // Deploy the mock contracts
    const accessRestrictionContract = await ethers.getContractFactory("AccessRestriction");
    accessRestriction = await accessRestrictionContract.deploy(owner.address);
    await accessRestriction.deployed();

    const mockTokenContract = await ethers.getContractFactory("MockToken");
    token = await mockTokenContract.deploy("MockToken", "MTK", accessRestriction.address); //"MockToken", "MTK", 18, ethers.utils.parseEther("1000")
    await token.deployed();

    const inspectionContract = await ethers.getContractFactory("Inspection");
    inspection = await inspectionContract.deploy(accessRestriction.address);
    await inspection.deployed();

    const socialFiContract = await ethers.getContractFactory("SocialFi");
    socialFi = await socialFiContract.deploy(token.address, accessRestriction.address);
    await socialFi.deployed();

    const disputeResolutionContract = await ethers.getContractFactory("DisputeResolution");
    disputeResolution = await disputeResolutionContract.deploy();
    await disputeResolution.deployed();

    const rentalDAOContract = await ethers.getContractFactory("RentalDAO");
    rentalDAO = await rentalDAOContract.deploy(accessRestriction.address, 10);
    await rentalDAO.deployed();

    const escrowContract = await ethers.getContractFactory("Escrow");
    escrow = await escrowContract.deploy(token.address, rentalDAO.address, accessRestriction.address);
    await escrow.deployed();

    const rentalAgreementContract = await ethers.getContractFactory("RentalAgreement");
    rentalAgreement = await rentalAgreementContract.deploy(
      token.address,
      escrow.address,
      inspection.address,
      disputeResolution.address,
      socialFi.address,
      accessRestriction.address,
    );
    await rentalAgreement.deployed();

    // Set up roles in the access restriction mock
    let ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
    let DAO_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DAO_ROLE"));
    let APPROVED_CONTRACT_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("APPROVED_CONTRACT_ROLE"));
    let DISTRIBUTOR_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DISTRIBUTOR_ROLE"));
    let VERFIED_USER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("VERFIED_USER_ROLE"));

    await accessRestriction.grantRole(DAO_ROLE, dao.address);
    await accessRestriction.grantRole(ADMIN_ROLE, admin.address);
    await accessRestriction.grantRole(DISTRIBUTOR_ROLE, distributer.address);
    await accessRestriction.grantRole(VERFIED_USER_ROLE, rentee.address);
    await accessRestriction.grantRole(VERFIED_USER_ROLE, renter.address);
    await accessRestriction.grantRole(VERFIED_USER_ROLE, user1.address);
    await accessRestriction.grantRole(APPROVED_CONTRACT_ROLE, rentalAgreement.address);

    await rentalDAO.connect(dao).setContractAddress("escrow", escrow.address);
    await rentalDAO.connect(dao).setContractAddress("inspection", inspection.address);
    await rentalDAO.connect(dao).setContractAddress("disputeResolution", disputeResolution.address);
    await rentalDAO.connect(dao).setContractAddress("socialFi", socialFi.address);
    await rentalDAO.connect(dao).setContractAddress("accessRestriction", accessRestriction.address);

    await rentalAgreement.connect(admin).setRentalAsset1155(collection_one.address, 0, true);
    await rentalAgreement.connect(admin).addUser(renter.address);
    await rentalAgreement.connect(admin).addUser(rentee.address);

    await rentalAgreement.connect(admin).addUser(user1.address);

    token.connect(distributer).mint(renter.address, ethers.utils.parseEther("10000"));
    await token.connect(renter).approve(escrow.address, ethers.utils.parseEther("6000"));
  });

  //   describe("Constructor", function () {
  //     it("should set the correct addresses for dependencies", async function () {
  //       const escrowAddress = await rentalDAO.getContractAddress("escrow");
  //       const inspectionAddress = await rentalDAO.getContractAddress("inspection");
  //       const disputeResolutionAddress = await rentalDAO.getContractAddress("disputeResolution");
  //       const socialFiAddress = await rentalDAO.getContractAddress("socialFi");
  //       const accessRestrictionAddress = await rentalDAO.getContractAddress("accessRestriction");

  //       expect(escrowAddress).to.equal(escrow.address);
  //       expect(inspectionAddress).to.equal(inspection.address);
  //       expect(disputeResolutionAddress).to.equal(disputeResolution.address);
  //       expect(socialFiAddress).to.equal(socialFi.address);
  //       expect(accessRestrictionAddress).to.equal(accessRestriction.address);
  //     });

  //     it("should revert if any of the dependency addresses are zero", async function () {
  //       const rentalAgreement_second = await ethers.getContractFactory("RentalAgreement");
  //       await expect(
  //         rentalAgreement_second.deploy(
  //           token.address,
  //           ethers.constants.AddressZero,
  //           inspection.address,
  //           disputeResolution.address,
  //           socialFi.address,
  //           accessRestriction.address,
  //         ),
  //       )
  //         .to.be.revertedWithCustomError(rentalAgreement_second, "InvalidAddress")
  //         .withArgs("escrow");
  //     });
  //   });

  //   describe("createAgreement", function () {
  //     it("should allow a verified user to create an agreement", async function () {
  //       await rentalAgreement.connect(rentee).createAgreement(collection_one.address, 0, 10, 100, 5000);
  //       const agreement = await rentalAgreement.agreements(0);

  //       console.log(renter.address, "renter.address");
  //       console.log(agreement.rentalPeriod, "agreement.rentalPeriod");
  //       expect(agreement.rentee.userAddress).to.equal(rentee.address);
  //       expect(agreement.renter.userAddress).to.equal(zeroAddress);
  //       expect(agreement.rentalPeriod.toNumber()).to.equal(Number(Big(10)));
  //       expect(agreement.cost.toNumber()).to.equal(100);
  //       expect(agreement.deposit.toNumber()).to.equal(5000);
  //       expect(agreement.status).to.equal(0); // CREATED
  //     });

  //     it("should emit an AgreementCreated event when an agreement is created", async function () {
  //       await expect(rentalAgreement.connect(rentee).createAgreement(collection_one.address, 0, 10, 100, 5000))
  //         .to.emit(rentalAgreement, "AgreementCreated")
  //         .withArgs(BigNumber.from(1), collection_one.address, 0, rentee.address, zeroAddress);
  //     });

  //     it("should revert if the caller is not a verified user", async function () {
  //       await expect(rentalAgreement.connect(user1).createAgreement(collection_one.address, 0, 10, 100, 5000))
  //         .to.be.revertedWithCustomError(rentalAgreement, "NotVerifiedUser")
  //         .withArgs(user1.address);
  //     });

  //     it("should revert if the cost, deposit, or rental period is zero", async function () {
  //       await expect(rentalAgreement.connect(rentee).createAgreement(collection_one.address, 0, 0, 100, 5000))
  //         .to.be.revertedWithCustomError(rentalAgreement, "MustBeGraterThanZero")
  //         .withArgs("rentalPeriod");
  //       await expect(rentalAgreement.connect(rentee).createAgreement(collection_one.address, 0, 10, 0, 5000))
  //         .to.be.revertedWithCustomError(rentalAgreement, "MustBeGraterThanZero")
  //         .withArgs("cost");
  //       await expect(rentalAgreement.connect(rentee).createAgreement(collection_one.address, 0, 10, 100, 0))
  //         .to.be.revertedWithCustomError(rentalAgreement, "MustBeGraterThanZero")
  //         .withArgs("deposit");
  //     });

  //     it("should revert if the asset is not active", async function () {
  //       // Assuming assets[1] is not active
  //       await expect(
  //         rentalAgreement.connect(rentee).createAgreement(collection_one.address, 3, 10, 100, 5000),
  //       ).to.be.revertedWithCustomError(rentalAgreement, "AssetIsNotActive");
  //     });
  //   });

  describe("ArrivalAgreement", function () {
    beforeEach(async function () {
      // Create an agreement first
      await rentalAgreement
        .connect(rentee)
        .createAgreement(
          collection_one.address,
          0,
          10,
          ethers.utils.parseUnits("1", 18),
          ethers.utils.parseUnits("5", 18),
        );
    });

    it("should allow the renter to confirm their arrival and start the agreement", async function () {
      let renter_balance_before = await token.balanceOf(renter.address);
      await rentalAgreement.connect(renter).ArrivalAgreement(0);
      const agreement = await rentalAgreement.agreements(0);

      let feeAmount = (10 * ethers.utils.parseUnits("5", 18).add(ethers.utils.parseUnits("1", 18))) / 10000;
      console.log(feeAmount);
      let renter_balance_after = await token.balanceOf(renter.address);
      expect(agreement.renter.userAddress).to.equal(renter.address);
      expect(agreement.status).to.equal(1); // REQUESTED
      expect(await token.balanceOf(rentalDAO.address)).to.equal(feeAmount);
      expect(await token.balanceOf(escrow.address)).to.equal(
        ethers.utils.parseUnits("5", 18).add(ethers.utils.parseUnits("1", 18)).sub(feeAmount),
      );
      expect(renter_balance_after).to.equal(
        renter_balance_before.sub(ethers.utils.parseUnits("5", 18).add(ethers.utils.parseUnits("1", 18))),
      );
    });

    it("should emit an ArrivalAgreementEvent event on arrival confirmation", async function () {
      await expect(rentalAgreement.connect(renter).ArrivalAgreement(0))
        .to.emit(rentalAgreement, "ArrivalAgreementEvent")
        .withArgs(0, rentee.address, renter.address, (await time.latest()) + 1);
    });

    it("should revert if the agreement is not in the correct status", async function () {
      await rentalAgreement.connect(renter).ArrivalAgreement(0);

      // Try confirming arrival again
      await expect(rentalAgreement.connect(renter).ArrivalAgreement(0)).to.be.revertedWithCustomError(
        rentalAgreement,
        "InvalidAgreement",
      );
    });

    it("should revert if the renter has insufficient balance", async function () {
      await expect(rentalAgreement.connect(user1).ArrivalAgreement(0)).to.be.revertedWithCustomError(
        rentalAgreement,
        "InsufficientBalance",
      );
    });

    it("should revert if the asset is no longer active", async function () {
      // Assuming we deactivate the asset here
      await rentalAgreement.connect(admin).setRentalAsset1155(collection_one.address, 0, false);

      await expect(rentalAgreement.connect(renter).ArrivalAgreement(0)).to.be.revertedWithCustomError(
        rentalAgreement,
        "AssetIsNotActive",
      );
    });
  });

  // describe("completeAgreement", function () {
  //     beforeEach(async function () {
  //         // Create and start an agreement first
  //         await rentalAgreement.connect(rentee).createAgreement(renter.address, 1, 10, 100, 50);
  //         await token.transfer(renter.address, ethers.utils.parseEther("200"));
  //         await token.connect(renter).approve(rentalAgreement.address, ethers.utils.parseEther("200"));
  //         await rentalAgreement.connect(renter).ArrivalAgreement(0);
  //     });

  //     it("should allow either party to complete the agreement after the rental period", async function () {
  //         // Simulate the passage of time
  //         await ethers.provider.send("evm_increaseTime", [11]); // Increase time by 11 seconds (or blocks)

  //         await rentalAgreement.connect(rentee).completeAgreement(0);
  //         const agreement = await rentalAgreement.agreements(0);

  //         expect(agreement.status).to.equal(3); // COMPLETED
  //     });

  //     it("should emit an AgreementCompleted event on completion", async function () {
  //         await ethers.provider.send("evm_increaseTime", [11]); // Increase time by 11 seconds (or blocks)

  //         await expect(rentalAgreement.connect(rentee).completeAgreement(0))
  //             .to.emit(rentalAgreement, "AgreementCompleted")
  //             .withArgs(0);
  //     });

  //     it("should revert if the agreement is not in the STARTED status", async function () {
  //         // Assuming agreement[1] is in CREATED status
  //         await expect(rentalAgreement.connect(rentee).completeAgreement(1))
  //             .to.be.revertedWith("AgreementNotActive()");
  //     });

  //     it("should revert if the rental period is not over", async function () {
  //         await expect(rentalAgreement.connect(rentee).completeAgreement(0))
  //             .to.be.revertedWith("RentalPeriodNotOver");
  //     });

  //     it("should revert if the item fails inspection", async function () {
  //         // Assuming inspection fails for this agreement
  //         await inspection.setInspectionResult(0, false);

  //         await ethers.provider.send("evm_increaseTime", [11]); // Increase time by 11 seconds (or blocks)

  //         await expect(rentalAgreement.connect(rentee).completeAgreement(0))
  //             .to.be.revertedWith("InspectionFailed");
  //     });
  // });

  // describe("cancelAgreement", function () {
  //     beforeEach(async function () {
  //         // Create and start an agreement first
  //         await rentalAgreement.connect(rentee).createAgreement(renter.address, 1, 10, 100, 50);
  //         await token.transfer(renter.address, ethers.utils.parseEther("200"));
  //         await token.connect(renter).approve(rentalAgreement.address, ethers.utils.parseEther("200"));
  //         await rentalAgreement.connect(renter).ArrivalAgreement(0);
  //     });

  //     it("should allow the renter to cancel the agreement", async function () {
  //         await rentalAgreement.connect(renter).cancelAgreement(0);
  //         const agreement = await rentalAgreement.agreements(0);

  //         expect(agreement.status).to.equal(4); // CANCELLED
  //     });

  //     it("should emit an AgreementCancelled event on cancellation", async function () {
  //         await expect(rentalAgreement.connect(renter).cancelAgreement(0))
  //             .to.emit(rentalAgreement, "AgreementCancelled")
  //             .withArgs(0);
  //     });

  //     it("should revert if the agreement is not in the STARTED status", async function () {
  //         await rentalAgreement.connect(renter).cancelAgreement(0);

  //         // Try canceling again
  //         await expect(rentalAgreement.connect(renter).cancelAgreement(0))
  //             .to.be.revertedWith("AgreementNotActive()");
  //     });

  //     it("should revert if a non-renter tries to cancel the agreement", async function () {
  //         await expect(rentalAgreement.connect(rentee).cancelAgreement(0))
  //             .to.be.revertedWith("NotAuthorized()");
  //     });
  // });

  // describe("raiseDispute", function () {
  //     beforeEach(async function () {
  //         // Create and start an agreement first
  //         await rentalAgreement.connect(rentee).createAgreement(renter.address, 1, 10, 100, 50);
  //         await token.transfer(renter.address, ethers.utils.parseEther("200"));
  //         await token.connect(renter).approve(rentalAgreement.address, ethers.utils.parseEther("200"));
  //         await rentalAgreement.connect(renter).ArrivalAgreement(0);
  //     });

  //     it("should allow either party to raise a dispute", async function () {
  //         await rentalAgreement.connect(rentee).raiseDispute(0);
  //         const agreement = await rentalAgreement.agreements(0);

  //         expect(agreement.isDisputed).to.be.true;
  //     });

  //     it("should emit a DisputeRaised event when a dispute is raised", async function () {
  //         await expect(rentalAgreement.connect(rentee).raiseDispute(0))
  //             .to.emit(rentalAgreement, "DisputeRaised")
  //             .withArgs(0);
  //     });

  //     it("should revert if the agreement is not in the STARTED status", async function () {
  //         await expect(rentalAgreement.connect(rentee).raiseDispute(1))
  //             .to.be.revertedWith("AgreementNotActive()");
  //     });

  //     it("should revert if a non-party tries to raise a dispute", async function () {
  //         await expect(rentalAgreement.connect(user1).raiseDispute(0))
  //             .to.be.revertedWith("NotAuthorized()");
  //     });
  // });

  // describe("extendRentalPeriod", function () {
  //     beforeEach(async function () {
  //         // Create and start an agreement first
  //         await rentalAgreement.connect(rentee).createAgreement(renter.address, 1, 10, 100, 50);
  //         await token.transfer(renter.address, ethers.utils.parseEther("200"));
  //         await token.connect(renter).approve(rentalAgreement.address, ethers.utils.parseEther("200"));
  //         await rentalAgreement.connect(renter).ArrivalAgreement(0);
  //     });

  //     it("should allow the rentee to extend the rental period and update the cost", async function () {
  //         await rentalAgreement.connect(rentee).extendRentalPeriodRentee(0, 5, 150);
  //         const agreement = await rentalAgreement.agreements(0);

  //         expect(agreement.rentalPeriod).to.equal(15); // Original 10 + 5
  //         expect(agreement.cost).to.equal(150); // Updated cost
  //     });

  //     it("should emit an AgreementExtendedRentee event when the rentee extends the rental period", async function () {
  //         await expect(rentalAgreement.connect(rentee).extendRentalPeriodRentee(0, 5, 150))
  //             .to.emit(rentalAgreement, "AgreementExtendedRentee")
  //             .withArgs(0, 15, 150); // New rental period 15, cost 150
  //     });

  //     it("should revert if a non-rentee tries to extend the rental period", async function () {
  //         await expect(rentalAgreement.connect(renter).extendRentalPeriodRentee(0, 5, 150))
  //             .to.be.revertedWith("NotAuthorized()");
  //     });

  //     it("should allow the renter to extend the rental period without changing the cost", async function () {
  //         await rentalAgreement.connect(renter).extendRentalPeriodRenter(0, 5);
  //         const agreement = await rentalAgreement.agreements(0);

  //         expect(agreement.rentalPeriod).to.equal(15); // Original 10 + 5
  //     });

  //     it("should emit an AgreementExtendedRenter event when the renter extends the rental period", async function () {
  //         await expect(rentalAgreement.connect(renter).extendRentalPeriodRenter(0, 5))
  //             .to.emit(rentalAgreement, "AgreementExtendedRenter")
  //             .withArgs(0, 15); // New rental period 15
  //     });

  //     it("should revert if a non-renter tries to extend the rental period", async function () {
  //         await expect(rentalAgreement.connect(rentee).extendRentalPeriodRenter(0, 5))
  //             .to.be.revertedWith("NotAuthorized()");
  //     });

  //     it("should revert if the agreement is not in the STARTED status", async function () {
  //         await rentalAgreement.connect(rentee).cancelAgreement(0);

  //         await expect(rentalAgreement.connect(rentee).extendRentalPeriodRentee(0, 5, 150))
  //             .to.be.revertedWith("AgreementNotActive()");
  //         await expect(rentalAgreement.connect(renter).extendRentalPeriodRenter(0, 5))
  //             .to.be.revertedWith("AgreementNotActive()");
  //     });
  // });
});
