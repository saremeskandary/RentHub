// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Inspection", function () {
//     let Inspection, inspection, owner, inspector, renter;

//     beforeEach(async function () {
//         Inspection = await ethers.getContractFactory("Inspection");
//         [owner, inspector, renter, _] = await ethers.getSigners();
//         inspection = await Inspection.deploy();
//         await inspection.deployed();
//     });

//     it("should allow creating an inspection report", async function () {
//         await inspection.connect(inspector).createInspection(renter.address, "Report details", 10);
//         const report = await inspection.inspections(0);
//         expect(report.details).to.equal("Report details");
//         expect(report.renter).to.equal(renter.address);
//     });

//     it("should allow updating an inspection report", async function () {
//         await inspection.connect(inspector).createInspection(renter.address, "Report details", 10);
//         await inspection.connect(inspector).updateInspection(0, "Updated report details", 20);
//         const report = await inspection.inspections(0);
//         expect(report.details).to.equal("Updated report details");
//     });

//     it("should not allow unauthorized updates to inspection reports", async function () {
//         await inspection.connect(inspector).createInspection(renter.address, "Report details", 10);
//         await expect(
//             inspection.connect(renter).updateInspection(0, "Unauthorized update", 20)
//         ).to.be.revertedWith("Only inspector can update");
//     });

//     it("should allow approving inspection reports", async function () {
//         await inspection.connect(inspector).createInspection(renter.address, "Report details", 10);
//         await inspection.connect(renter).approveInspection(0);
//         const approved = await inspection.isApproved(0);
//         expect(approved).to.be.true;
//     });

//     it("should not allow double approval of inspection reports", async function () {
//         await inspection.connect(inspector).createInspection(renter.address, "Report details", 10);
//         await inspection.connect(renter).approveInspection(0);
//         await expect(
//             inspection.connect(renter).approveInspection(0)
//         ).to.be.revertedWith("Inspection already approved");
//     });
// });
