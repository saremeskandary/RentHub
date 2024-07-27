import { expect } from "chai";
import { ethers } from "hardhat";
import { RentalAgreement } from "../typechain-types";

describe("RentalAgreement", function () {
  let rentalAgreement: RentalAgreement;
  let owner: any;
  let renter: any;

  before(async () => {
    [owner, renter] = await ethers.getSigners();
    const RentalAgreementFactory = await ethers.getContractFactory("RentalAgreement");
    rentalAgreement = (await RentalAgreementFactory.deploy()) as RentalAgreement;
    await rentalAgreement.waitForDeployment();
  });

  describe("Rental Operations", function () {
    it("Should create a rental", async function () {
      const itemId = 1;
      const duration = 86400; // 1 day
      const price = ethers.parseEther("1");

      await expect(
        rentalAgreement.connect(renter).createRental(owner.address, itemId, duration, price, { value: price }),
      )
        .to.emit(rentalAgreement, "RentalCreated")
        .withArgs(
          0,
          renter.address,
          owner.address,
          itemId,
          await ethers.provider.getBlock("latest").then(b => b!.timestamp),
          await ethers.provider.getBlock("latest").then(b => b!.timestamp! + duration),
          price,
        );
    });

    it("Should end a rental", async function () {
      const itemId = 2;
      const duration = 86400; // 1 day
      const price = ethers.parseEther("1");

      await rentalAgreement.connect(renter).createRental(owner.address, itemId, duration, price, { value: price });

      await expect(rentalAgreement.connect(owner).endRental(1)).to.emit(rentalAgreement, "RentalEnded").withArgs(1);
    });
  });
});
