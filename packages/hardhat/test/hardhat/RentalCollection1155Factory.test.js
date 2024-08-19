// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("RentalCollection1155Factory", function () {
//     let RentalCollection1155Factory, factory, owner, user1;

//     beforeEach(async function () {
//         RentalCollection1155Factory = await ethers.getContractFactory("RentalCollection1155Factory");
//         [owner, user1, _] = await ethers.getSigners();
//         factory = await RentalCollection1155Factory.deploy();
//         await factory.deployed();
//     });

//     it("should create a new rental collection", async function () {
//         await factory.connect(owner).createCollection("Collection 1", "COL1");
//         const collections = await factory.getCollections();
//         expect(collections.length).to.equal(1);
//     });

//     it("should link created collection with factory", async function () {
//         await factory.connect(owner).createCollection("Collection 1", "COL1");
//         const collections = await factory.getCollections();
//         expect(collections[0].name).to.equal("Collection 1");
//         expect(collections[0].symbol).to.equal("COL1");
//     });

//     it("should not allow unauthorized users to create a collection", async function () {
//         await expect(
//             factory.connect(user1).createCollection("Collection 2", "COL2")
//         ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("should manage multiple collections", async function () {
//         await factory.connect(owner).createCollection("Collection 1", "COL1");
//         await factory.connect(owner).createCollection("Collection 2", "COL2");
//         const collections = await factory.getCollections();
//         expect(collections.length).to.equal(2);
//         expect(collections[1].name).to.equal("Collection 2");
//     });
// });
