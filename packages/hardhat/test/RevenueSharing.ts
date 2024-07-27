import { expect } from "chai";
import { ethers } from "hardhat";
import { RevenueSharing } from "../typechain-types";

describe("RevenueSharing", function () {
  let revenueSharing: RevenueSharing;
  let owner: any;
  let recipient: any;

  before(async () => {
    [owner, recipient] = await ethers.getSigners();
    const RevenueSharingFactory = await ethers.getContractFactory("RevenueSharing");
    revenueSharing = (await RevenueSharingFactory.deploy()) as RevenueSharing;
    await revenueSharing.waitForDeployment();
  });

  describe("Revenue Distribution", function () {
    it("Should distribute revenue correctly", async function () {
      const revenue = ethers.parseEther("1");
      const platformFee = await revenueSharing.platformFee();
      const platformAmount = (revenue * BigInt(platformFee)) / BigInt(1000);
      const recipientAmount = revenue - platformAmount;

      await expect(() =>
        revenueSharing.distributeRevenue(recipient.address, { value: revenue }),
      ).to.changeEtherBalances([owner, recipient], [platformAmount, recipientAmount]);
    });

    it("Should allow owner to set platform fee", async function () {
      const newFee = 60; // 6%
      await revenueSharing.setPlatformFee(newFee);
      expect(await revenueSharing.platformFee()).to.equal(newFee);
    });
  });
});
