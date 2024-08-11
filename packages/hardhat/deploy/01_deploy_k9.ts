import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployK9Contracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy RatingAndReview contract
  await deploy("RatingAndReview", {
    from: deployer,
    args: [],
    log: true,
  });
  await hre.ethers.getContract<Contract>("RatingAndReview", deployer);

  // Deploy RevenueSharing contract
  await deploy("RentHubToken", {
    from: deployer,
    args: [],
    log: true,
  });
  const rentHubToken = await hre.ethers.getContract<Contract>("RentHubToken", deployer);

  const k9FinanceDAO = "0x..."; // Replace with the actual K9 Finance DAO address
  await deploy("RevenueSharing", {
    from: deployer,
    args: [rentHubToken.address, k9FinanceDAO],
    log: true,
  });
  await hre.ethers.getContract<Contract>("RevenueSharing", deployer);

  // Deploy RentalAgreement contract
  const erc721Contract = "0x..."; // FIXME Replace with the actual ERC721 contract address
  const collateralToken = "0x..."; // FIXME Replace with the actual collateral token address
  await deploy("RentalAgreement", {
    from: deployer,
    args: [erc721Contract, collateralToken],
    log: true,
  });
  await hre.ethers.getContract<Contract>("RentalAgreement", deployer);
};

export default deployK9Contracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags deployK9Contracts
deployK9Contracts.tags = ["deployK9Contracts"];
