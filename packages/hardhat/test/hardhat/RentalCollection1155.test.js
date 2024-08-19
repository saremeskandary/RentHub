// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("RentalCollection1155", function () {
//     let RentalCollection1155, collection, MockAccessRestriction, accessRestriction, owner, admin, user1, user2;

//     beforeEach(async function () {
//         // Deploy the mock AccessRestriction contract
//         MockAccessRestriction = await ethers.getContractFactory("MockAccessRestriction");
//         accessRestriction = await MockAccessRestriction.deploy();
//         await accessRestriction.deployed();

//         // Deploy the RentalCollection1155 contract with the mock AccessRestriction address
//         RentalCollection1155 = await ethers.getContractFactory("RentalCollection1155");
//         [owner, admin, user1, user2, _] = await ethers.getSigners();
//         collection = await RentalCollection1155.deploy("TestCollection", "TST", "https://example.com", accessRestriction.address);
//         await collection.deployed();

//         // Set up roles in the access restriction mock
//         await accessRestriction.setAdmin(admin.address, true);
//     });

//     describe("Constructor", function () {
//         it("should set the correct name, symbol, and access restriction", async function () {
//             const name = await collection.name();
//             const symbol = await collection.symbol();
//             const accessRestrictionAddress = await collection.accessRestriction();

//             expect(name).to.equal("TestCollection");
//             expect(symbol).to.equal("TST");
//             expect(accessRestrictionAddress).to.equal(accessRestriction.address);
//         });

//         it("should set the correct URI", async function () {
//             const uri = await collection.uri(0); // URI is the same for all tokens in ERC1155
//             expect(uri).to.equal("https://example.com");
//         });
//     });

//     describe("Minting", function () {
//         it("should allow the admin to mint tokens", async function () {
//             await collection.connect(admin).mint(user1.address, 10, "0x");
//             const balance = await collection.balanceOf(user1.address, 0); // Token ID 0 as it's the first one
//             expect(balance).to.equal(10);
//         });

//         it("should increment the token ID for each mint", async function () {
//             await collection.connect(admin).mint(user1.address, 10, "0x");
//             await collection.connect(admin).mint(user1.address, 20, "0x");

//             const balance0 = await collection.balanceOf(user1.address, 0);
//             const balance1 = await collection.balanceOf(user1.address, 1);

//             expect(balance0).to.equal(10);
//             expect(balance1).to.equal(20);
//         });

//         it("should emit a TransferSingle event on mint", async function () {
//             await expect(collection.connect(admin).mint(user1.address, 10, "0x"))
//                 .to.emit(collection, "TransferSingle")
//                 .withArgs(admin.address, ethers.constants.AddressZero, user1.address, 0, 10);
//         });

//         it("should revert if a non-admin tries to mint", async function () {
//             await expect(collection.connect(user1).mint(user1.address, 10, "0x"))
//                 .to.be.revertedWith(`NotAdmin("${user1.address}")`);
//         });
//     });

//     describe("Minting Batch", function () {
//         it("should allow the admin to mint tokens in batch", async function () {
//             const ids = [0, 1, 2];
//             const amounts = [10, 20, 30];
//             await collection.connect(admin).mintBatch(user1.address, ids, amounts, "0x");

//             const balance0 = await collection.balanceOf(user1.address, 0);
//             const balance1 = await collection.balanceOf(user1.address, 1);
//             const balance2 = await collection.balanceOf(user1.address, 2);

//             expect(balance0).to.equal(10);
//             expect(balance1).to.equal(20);
//             expect(balance2).to.equal(30);
//         });

//         it("should emit a TransferBatch event on mintBatch", async function () {
//             const ids = [0, 1, 2];
//             const amounts = [10, 20, 30];
//             await expect(collection.connect(admin).mintBatch(user1.address, ids, amounts, "0x"))
//                 .to.emit(collection, "TransferBatch")
//                 .withArgs(admin.address, ethers.constants.AddressZero, user1.address, ids, amounts);
//         });

//         it("should revert if a non-admin tries to mint in batch", async function () {
//             const ids = [0, 1, 2];
//             const amounts = [10, 20, 30];
//             await expect(collection.connect(user1).mintBatch(user1.address, ids, amounts, "0x"))
//                 .to.be.revertedWith(`NotAdmin("${user1.address}")`);
//         });
//     });

//     describe("Burning", function () {
//         beforeEach(async function () {
//             await collection.connect(admin).mint(user1.address, 10, "0x");
//         });

//         it("should allow the admin to burn tokens", async function () {
//             await collection.connect(admin).burn(user1.address, 0, 5);
//             const balance = await collection.balanceOf(user1.address, 0);
//             expect(balance).to.equal(5);
//         });

//         it("should emit a TransferSingle event on burn", async function () {
//             await expect(collection.connect(admin).burn(user1.address, 0, 5))
//                 .to.emit(collection, "TransferSingle")
//                 .withArgs(admin.address, user1.address, ethers.constants.AddressZero, 0, 5);
//         });

//         it("should revert if a non-admin tries to burn tokens", async function () {
//             await expect(collection.connect(user1).burn(user1.address, 0, 5))
//                 .to.be.revertedWith(`NotAdmin("${user1.address}")`);
//         });
//     });

//     describe("Burning Batch", function () {
//         beforeEach(async function () {
//             const ids = [0, 1, 2];
//             const amounts = [10, 20, 30];
//             await collection.connect(admin).mintBatch(user1.address, ids, amounts, "0x");
//         });

//         it("should allow the admin to burn tokens in batch", async function () {
//             const ids = [0, 1, 2];
//             const amounts = [5, 10, 15];
//             await collection.connect(admin).burnBatch(user1.address, ids, amounts);

//             const balance0 = await collection.balanceOf(user1.address, 0);
//             const balance1 = await collection.balanceOf(user1.address, 1);
//             const balance2 = await collection.balanceOf(user1.address, 2);

//             expect(balance0).to.equal(5);
//             expect(balance1).to.equal(10);
//             expect(balance2).to.equal(15);
//         });

//         it("should emit a TransferBatch event on burnBatch", async function () {
//             const ids = [0, 1, 2];
//             const amounts = [5, 10, 15];
//             await expect(collection.connect(admin).burnBatch(user1.address, ids, amounts))
//                 .to.emit(collection, "TransferBatch")
//                 .withArgs(admin.address, user1.address, ethers.constants.AddressZero, ids, amounts);
//         });

//         it("should revert if a non-admin tries to burn tokens in batch", async function () {
//             const ids = [0, 1, 2];
//             const amounts = [5, 10, 15];
//             await expect(collection.connect(user1).burnBatch(user1.address, ids, amounts))
//                 .to.be.revertedWith(`NotAdmin("${user1.address}")`);
//         });
//     });

//     describe("Edge Cases", function () {
//         it("should revert if trying to mint with an amount of zero", async function () {
//             await expect(collection.connect(admin).mint(user1.address, 0, "0x"))
//                 .to.be.revertedWith("ERC1155: mint amount must be greater than zero");
//         });

//         it("should revert if trying to burn more tokens than owned", async function () {
//             await expect(collection.connect(admin).burn(user1.address, 0, 20))
//                 .to.be.revertedWith("ERC1155: burn amount exceeds balance");
//         });

//         it("should revert if minting batch with mismatched ids and amounts", async function () {
//             const ids = [0, 1];
//             const amounts = [10];
//             await expect(collection.connect(admin).mintBatch(user1.address, ids, amounts, "0x"))
//                 .to.be.revertedWith("ERC1155: ids and amounts length mismatch");
//         });

//         it("should revert if burning batch with mismatched ids and amounts", async function () {
//             const ids = [0, 1];
//             const amounts = [10];
//             await expect(collection.connect(admin).burnBatch(user1.address, ids, amounts))
//                 .to.be.revertedWith("ERC1155: ids and amounts length mismatch");
//         });
//     });

//     describe("Transfer Functionality", function () {
//         beforeEach(async function () {
//             await collection.connect(admin).mint(user1.address, 10, "0x");
//         });

//         it("should allow users to transfer their tokens", async function () {
//             await collection.connect(user1).safeTransferFrom(user1.address, user2.address, 0, 5, "0x");
//             const balanceUser1 = await collection.balanceOf(user1.address, 0);
//             const balanceUser2 = await collection.balanceOf(user2.address, 0);

//             expect(balanceUser1).to.equal(5);
//             expect(balanceUser2).to.equal(5);
//         });

//         it("should emit a TransferSingle event on transfer", async function () {
//             await expect(collection.connect(user1).safeTransferFrom(user1.address, user2.address, 0, 5, "0x"))
//                 .to.emit(collection, "TransferSingle")
//                 .withArgs(user1.address, user1.address, user2.address, 0, 5);
//         });

//         it("should revert if trying to transfer more tokens than owned", async function () {
//             await expect(collection.connect(user1).safeTransferFrom(user1.address, user2.address, 0, 15, "0x"))
//                 .to.be.revertedWith("ERC1155: insufficient balance for transfer");
//         });
//     });
// });
