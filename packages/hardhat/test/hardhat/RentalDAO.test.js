// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("RentalDAO", function () {
//     let RentalDAO, rentalDAO, MockAccessRestriction, accessRestriction, owner, admin, daoMember, nonDAO, user1;

//     beforeEach(async function () {
//         // Deploy the mock AccessRestriction contract
//         MockAccessRestriction = await ethers.getContractFactory("MockAccessRestriction");
//         accessRestriction = await MockAccessRestriction.deploy();
//         await accessRestriction.deployed();

//         // Deploy the RentalDAO contract with the mock AccessRestriction address and initial fee
//         RentalDAO = await ethers.getContractFactory("RentalDAO");
//         [owner, admin, daoMember, nonDAO, user1, _] = await ethers.getSigners();
//         rentalDAO = await RentalDAO.deploy(accessRestriction.address, 500); // Initial fee 5%
//         await rentalDAO.deployed();

//         // Set up roles in the access restriction mock
//         await accessRestriction.setAdmin(admin.address, true);
//         await accessRestriction.setDAO(daoMember.address, true);
//     });

//     describe("Constructor", function () {
//         it("should set the correct accessRestriction address and initial fee", async function () {
//             const accessRestrictionAddress = await rentalDAO.accessRestriction();
//             const systemFee = await rentalDAO.systemFee();
//             expect(accessRestrictionAddress).to.equal(accessRestriction.address);
//             expect(systemFee).to.equal(500); // 5%
//         });

//         it("should revert if the initial fee exceeds the maximum", async function () {
//             await expect(RentalDAO.deploy(accessRestriction.address, 1100))
//                 .to.be.revertedWith("FeeExceedsMaximum(1100)");
//         });
//     });

//     describe("proposeAndUpdateSystemFee", function () {
//         it("should allow DAO members to propose and update the system fee", async function () {
//             await rentalDAO.connect(daoMember).proposeAndUpdateSystemFee(300); // 3%
//             const systemFee = await rentalDAO.systemFee();
//             expect(systemFee).to.equal(300);
//         });

//         it("should emit the SystemFeeUpdated event when the fee is updated", async function () {
//             await expect(rentalDAO.connect(daoMember).proposeAndUpdateSystemFee(300))
//                 .to.emit(rentalDAO, "SystemFeeUpdated")
//                 .withArgs(500, 300); // Old fee: 500 (5%), New fee: 300 (3%)
//         });

//         it("should revert if a non-DAO member tries to propose a new system fee", async function () {
//             await expect(rentalDAO.connect(nonDAO).proposeAndUpdateSystemFee(300))
//                 .to.be.revertedWith(`NotDAO("${nonDAO.address}")`);
//         });

//         it("should revert if the new fee exceeds the maximum allowed", async function () {
//             await expect(rentalDAO.connect(daoMember).proposeAndUpdateSystemFee(1100))
//                 .to.be.revertedWith("FeeExceedsMaximum(1100)");
//         });
//     });

//     describe("addDAOMember", function () {
//         it("should allow the admin to add a new DAO member", async function () {
//             await rentalDAO.connect(admin).addDAOMember(user1.address);
//             const isDAO = await accessRestriction.isDAO(user1.address);
//             expect(isDAO).to.be.true;
//         });

//         it("should revert if a non-admin tries to add a DAO member", async function () {
//             await expect(rentalDAO.connect(nonDAO).addDAOMember(user1.address))
//                 .to.be.revertedWith(`NotAdmin("${nonDAO.address}")`);
//         });

//         it("should revert if trying to add a DAO member with the zero address", async function () {
//             await expect(rentalDAO.connect(admin).addDAOMember(ethers.constants.AddressZero))
//                 .to.be.revertedWith("InvalidAddress(\"member\")");
//         });
//     });

//     describe("removeDAOMember", function () {
//         beforeEach(async function () {
//             await rentalDAO.connect(admin).addDAOMember(user1.address);
//         });

//         it("should allow the admin to remove a DAO member", async function () {
//             await rentalDAO.connect(admin).removeDAOMember(user1.address);
//             const isDAO = await accessRestriction.isDAO(user1.address);
//             expect(isDAO).to.be.false;
//         });

//         it("should revert if a non-admin tries to remove a DAO member", async function () {
//             await expect(rentalDAO.connect(nonDAO).removeDAOMember(user1.address))
//                 .to.be.revertedWith(`NotAdmin("${nonDAO.address}")`);
//         });

//         it("should revert if trying to remove a DAO member with the zero address", async function () {
//             await expect(rentalDAO.connect(admin).removeDAOMember(ethers.constants.AddressZero))
//                 .to.be.revertedWith("InvalidAddress(\"member\")");
//         });
//     });

//     describe("getSystemFee", function () {
//         it("should return the current system fee", async function () {
//             const systemFee = await rentalDAO.getSystemFee();
//             expect(systemFee).to.equal(500); // Initial fee 5%
//         });
//     });

//     describe("withdrawFees", function () {
//         beforeEach(async function () {
//             // Fund the contract with some ETH for withdrawal tests
//             await owner.sendTransaction({
//                 to: rentalDAO.address,
//                 value: ethers.utils.parseEther("10"),
//             });
//         });

//         it("should allow the admin to withdraw fees", async function () {
//             const initialBalance = await ethers.provider.getBalance(admin.address);
//             await rentalDAO.connect(admin).withdrawFees(admin.address, ethers.utils.parseEther("5"));
//             const finalBalance = await ethers.provider.getBalance(admin.address);
//             expect(finalBalance.sub(initialBalance)).to.be.closeTo(ethers.utils.parseEther("5"), ethers.utils.parseEther("0.01")); // Considering gas fees
//         });

//         it("should emit the Withdrawn event on successful withdrawal", async function () {
//             await expect(rentalDAO.connect(admin).withdrawFees(admin.address, ethers.utils.parseEther("5")))
//                 .to.emit(rentalDAO, "Withdrawn")
//                 .withArgs(admin.address, ethers.utils.parseEther("5"));
//         });

//         it("should revert if a non-admin tries to withdraw fees", async function () {
//             await expect(rentalDAO.connect(nonDAO).withdrawFees(nonDAO.address, ethers.utils.parseEther("5")))
//                 .to.be.revertedWith(`NotAdmin("${nonDAO.address}")`);
//         });

//         it("should revert if the recipient address is zero", async function () {
//             await expect(rentalDAO.connect(admin).withdrawFees(ethers.constants.AddressZero, ethers.utils.parseEther("5")))
//                 .to.be.revertedWith("InvalidAddress(\"recipient\")");
//         });

//         it("should revert if the withdrawal amount exceeds the contract balance", async function () {
//             await expect(rentalDAO.connect(admin).withdrawFees(admin.address, ethers.utils.parseEther("15")))
//                 .to.be.revertedWith("InsufficientBalance");
//         });

//         it("should revert if the withdrawal amount is zero", async function () {
//             await expect(rentalDAO.connect(admin).withdrawFees(admin.address, 0))
//                 .to.be.revertedWith("MustBeGraterThanZero(\"amount\")");
//         });
//     });

//     describe("getContractAddress", function () {
//         it("should return the correct contract address for a given contract name", async function () {
//             // Assuming contractAddresses mapping is set correctly in your implementation
//             const contractName = "SomeContract";
//             const contractAddress = user1.address; // Example address

//             // Simulate setting the contract address (this would normally be done in the RentalDAO contract)
//             await rentalDAO.connect(admin).setContractAddress(contractName, contractAddress);

//             const returnedAddress = await rentalDAO.getContractAddress(contractName);
//             expect(returnedAddress).to.equal(contractAddress);
//         });
//     });
// });

