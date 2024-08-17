import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const network = hre.network.name;

  // Example of setting TOKEN_ADDRESS based on the network
  let tokenAddress: string;

  // If deploying on local networks, deploy a mock USDT
  if (["hardhat", "localhost", "anvil", "truffleDashboard"].includes(network)) {
    const mockToken = await deploy("MockToken", {
      from: deployer,
      log: true,
    });
    tokenAddress = mockToken.address;
  } else if (network === "mainnet") {
    tokenAddress = process.env.USDT_ADDRESS || "0xYourMainnetUSDTAddress"; // CHANGEME
  } else if (network === "crossfiTestnet") {
    tokenAddress = process.env.USDT_ADDRESS || "0xYourMainnetUSDTAddress"; // CHANGEME
  } else if (network === "k9") {
    tokenAddress = process.env.USDT_ADDRESS || "0xYourMainnetUSDTAddress"; // CHANGEME
  } else if (network === "shibarium") {
    tokenAddress = process.env.USDT_ADDRESS || "0xYourMainnetUSDTAddress"; // CHANGEME
  } else if (network === "polygon") {
    tokenAddress = process.env.USDT_ADDRESS || "0xYourPolygonUSDTAddress"; // CHANGEME
  } else {
    throw new Error("You need to choose your network.");
  }

  // Now deploy the contracts
  const accessRestriction = await deploy("AccessRestriction", {
    from: deployer,
    args: [deployer],
    log: true,
  });

  const reputation = await deploy("Reputation", {
    from: deployer,
    args: [accessRestriction.address],
    log: true,
  });

  const socialFi = await deploy("SocialFi", {
    from: deployer,
    args: [tokenAddress],
    log: true,
  });

  const inspection = await deploy("Inspection", {
    from: deployer,
    log: true,
  });

  const rentalDAO = await deploy("RentalDAO", {
    from: deployer,
    args: [accessRestriction.address, 100],
    log: true,
  });

  const escrow = await deploy("Escrow", {
    from: deployer,
    args: [tokenAddress, rentalDAO.address, accessRestriction.address],
    log: true,
  });

  const disputeResolution = await deploy("DisputeResolution", {
    from: deployer,
    args: [],
    log: true,
  });

  const rentalAgreement = await deploy("RentalAgreement", {
    from: deployer,
    args: [
      tokenAddress,
      escrow.address,
      inspection.address,
      disputeResolution.address,
      socialFi.address,
      rentalDAO.address,
    ],
    log: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const disputeResolutionContract = await hre.ethers.getContract<Contract>("DisputeResolution", deployer);
  console.log(
    "👋 Initiate Dispute Resolution Contract",
    await disputeResolutionContract.init(rentalAgreement.address, reputation.address, accessRestriction.address),
  );
};

export default deployContracts;
deployContracts.tags = ["All"];
