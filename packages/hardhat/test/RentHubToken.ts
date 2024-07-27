import { expect } from "chai";
import { ethers } from "hardhat";
import { RentHubToken } from "../typechain-types";

describe("RentHubToken", function () {
  let rentHubToken: RentHubToken;
  let owner: any;
  let addr1: any;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();
    const RentHubTokenFactory = await ethers.getContractFactory("RentHubToken");
    rentHubToken = (await RentHubTokenFactory.deploy()) as RentHubToken;
    await rentHubToken.waitForDeployment();
  });

  describe("Token Operations", function () {
    it("Should have correct initial supply", async function () {
      const initialSupply = ethers.parseEther("1000000");
      expect(await rentHubToken.totalSupply()).to.equal(initialSupply);
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await rentHubToken.mint(addr1.address, mintAmount);
      expect(await rentHubToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should allow users to burn tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      await rentHubToken.transfer(addr1.address, burnAmount);
      await rentHubToken.connect(addr1).burn(burnAmount);
      expect(await rentHubToken.balanceOf(addr1.address)).to.equal(0);
    });
  });
});
