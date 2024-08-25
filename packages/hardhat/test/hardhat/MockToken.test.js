// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("MockToken", function () {
//     let MockToken, token, owner, user1, user2;

//     beforeEach(async function () {
//         // Deploy the MockToken contract
//         MockToken = await ethers.getContractFactory("MockToken");
//         [owner, user1, user2, _] = await ethers.getSigners();
//         token = await MockToken.deploy();
//         await token.deployed();
//     });

//     describe("Constructor", function () {
//         it("should set the correct name and symbol", async function () {
//             const name = await token.name();
//             const symbol = await token.symbol();

//             expect(name).to.equal("MockToken");
//             expect(symbol).to.equal("MTK");
//         });

//         it("should set the initial total supply to zero", async function () {
//             const totalSupply = await token.totalSupply();
//             expect(totalSupply).to.equal(0);
//         });
//     });

//     describe("Minting", function () {
//         it("should allow minting of tokens", async function () {
//             await token.mint(user1.address, 1000);
//             const balance = await token.balanceOf(user1.address);
//             expect(balance).to.equal(1000);
//         });

//         it("should increase the total supply when tokens are minted", async function () {
//             await token.mint(user1.address, 1000);
//             const totalSupply = await token.totalSupply();
//             expect(totalSupply).to.equal(1000);
//         });

//         it("should emit a Transfer event on mint", async function () {
//             await expect(token.mint(user1.address, 1000))
//                 .to.emit(token, "Transfer")
//                 .withArgs(ethers.constants.AddressZero, user1.address, 1000);
//         });

//         it("should allow multiple minting operations", async function () {
//             await token.mint(user1.address, 1000);
//             await token.mint(user2.address, 2000);

//             const balance1 = await token.balanceOf(user1.address);
//             const balance2 = await token.balanceOf(user2.address);
//             const totalSupply = await token.totalSupply();

//             expect(balance1).to.equal(1000);
//             expect(balance2).to.equal(2000);
//             expect(totalSupply).to.equal(3000);
//         });
//     });

//     describe("ERC20 Functionality", function () {
//         beforeEach(async function () {
//             await token.mint(user1.address, 1000);
//         });

//         it("should allow transfers of tokens", async function () {
//             await token.connect(user1).transfer(user2.address, 500);
//             const balance1 = await token.balanceOf(user1.address);
//             const balance2 = await token.balanceOf(user2.address);

//             expect(balance1).to.equal(500);
//             expect(balance2).to.equal(500);
//         });

//         it("should emit a Transfer event on transfer", async function () {
//             await expect(token.connect(user1).transfer(user2.address, 500))
//                 .to.emit(token, "Transfer")
//                 .withArgs(user1.address, user2.address, 500);
//         });

//         it("should revert if trying to transfer more tokens than balance", async function () {
//             await expect(token.connect(user1).transfer(user2.address, 1500))
//                 .to.be.revertedWith("ERC20: transfer amount exceeds balance");
//         });

//         it("should allow approvals and transfers via transferFrom", async function () {
//             await token.connect(user1).approve(user2.address, 500);
//             await token.connect(user2).transferFrom(user1.address, user2.address, 500);

//             const balance1 = await token.balanceOf(user1.address);
//             const balance2 = await token.balanceOf(user2.address);

//             expect(balance1).to.equal(500);
//             expect(balance2).to.equal(500);
//         });

//         it("should emit an Approval event on approval", async function () {
//             await expect(token.connect(user1).approve(user2.address, 500))
//                 .to.emit(token, "Approval")
//                 .withArgs(user1.address, user2.address, 500);
//         });

//         it("should revert if trying to transferFrom without sufficient allowance", async function () {
//             await expect(token.connect(user2).transferFrom(user1.address, user2.address, 500))
//                 .to.be.revertedWith("ERC20: transfer amount exceeds allowance");
//         });
//     });

//     describe("ERC20Permit Functionality", function () {
//         it("should allow permit approvals using a valid signature", async function () {
//             const nonce = await token.nonces(owner.address);
//             const deadline = ethers.constants.MaxUint256;
//             const value = 500;
//             const domain = {
//                 name: "MockToken",
//                 version: "1",
//                 chainId: await ethers.provider.getNetwork().then((n) => n.chainId),
//                 verifyingContract: token.address,
//             };
//             const types = {
//                 Permit: [
//                     { name: "owner", type: "address" },
//                     { name: "spender", type: "address" },
//                     { name: "value", type: "uint256" },
//                     { name: "nonce", type: "uint256" },
//                     { name: "deadline", type: "uint256" },
//                 ],
//             };
//             const signature = await owner._signTypedData(domain, types, {
//                 owner: owner.address,
//                 spender: user1.address,
//                 value,
//                 nonce,
//                 deadline,
//             });

//             const { v, r, s } = ethers.utils.splitSignature(signature);
//             await token.permit(owner.address, user1.address, value, deadline, v, r, s);

//             const allowance = await token.allowance(owner.address, user1.address);
//             expect(allowance).to.equal(value);
//         });

//         it("should revert permit if signature is invalid", async function () {
//             const nonce = await token.nonces(owner.address);
//             const deadline = ethers.constants.MaxUint256;
//             const value = 500;
//             const fakeValue = 1000; // A different value to create an invalid signature
//             const domain = {
//                 name: "MockToken",
//                 version: "1",
//                 chainId: await ethers.provider.getNetwork().then((n) => n.chainId),
//                 verifyingContract: token.address,
//             };
//             const types = {
//                 Permit: [
//                     { name: "owner", type: "address" },
//                     { name: "spender", type: "address" },
//                     { name: "value", type: "uint256" },
//                     { name: "nonce", type: "uint256" },
//                     { name: "deadline", type: "uint256" },
//                 ],
//             };
//             const signature = await owner._signTypedData(domain, types, {
//                 owner: owner.address,
//                 spender: user1.address,
//                 value: fakeValue, // Use the fake value
//                 nonce,
//                 deadline,
//             });

//             const { v, r, s } = ethers.utils.splitSignature(signature);
//             await expect(
//                 token.permit(owner.address, user1.address, value, deadline, v, r, s)
//             ).to.be.revertedWith("ERC20Permit: invalid signature");
//         });

//         it("should revert permit if deadline has passed", async function () {
//             const nonce = await token.nonces(owner.address);
//             const deadline = (await ethers.provider.getBlock("latest")).timestamp - 1; // Expired deadline
//             const value = 500;
//             const domain = {
//                 name: "MockToken",
//                 version: "1",
//                 chainId: await ethers.provider.getNetwork().then((n) => n.chainId),
//                 verifyingContract: token.address,
//             };
//             const types = {
//                 Permit: [
//                     { name: "owner", type: "address" },
//                     { name: "spender", type: "address" },
//                     { name: "value", type: "uint256" },
//                     { name: "nonce", type: "uint256" },
//                     { name: "deadline", type: "uint256" },
//                 ],
//             };
//             const signature = await owner._signTypedData(domain, types, {
//                 owner: owner.address,
//                 spender: user1.address,
//                 value,
//                 nonce,
//                 deadline,
//             });

//             const { v, r, s } = ethers.utils.splitSignature(signature);
//             await expect(
//                 token.permit(owner.address, user1.address, value, deadline, v, r, s)
//             ).to.be.revertedWith("ERC20Permit: expired deadline");
//         });
//     });
// });
