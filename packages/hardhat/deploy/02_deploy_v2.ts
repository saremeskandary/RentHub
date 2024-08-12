import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  // Deploy UserIdentity contract
  const userIdentity = await deploy("UserIdentity", {
    from: deployer,
    log: true,
  });

  // Deploy Reputation contract
  const reputation = await deploy("Reputation", {
    from: deployer,
    log: true,
  });

  // Deploy Monetization contract
  const monetization = await deploy("Monetization", {
    from: deployer,
    log: true,
  });

  // Deploy SocialFi contract
  const socialFi = await deploy("SocialFi", {
    from: deployer,
    log: true,
  });

  // Deploy Inspection contract
  const inspection = await deploy("Inspection", {
    from: deployer,
    log: true,
  });

  // Deploy DisputeResolution contract
  const disputeResolution = await deploy("DisputeResolution", {
    from: deployer,
    log: true,
  });

  // Deploy Escrow contract
  const escrow = await deploy("Escrow", {
    from: deployer,
    log: true,
  });

  // Deploy RentalAgreement contract and pass the addresses of the other contracts to the constructor
  await deploy("RentalAgreement", {
    from: deployer,
    args: [
      escrow.address,
      inspection.address,
      reputation.address,
      disputeResolution.address,
      socialFi.address,
      monetization.address,
      userIdentity.address,
    ],
    log: true,
  });
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags deployK9Contracts
deployContracts.tags = ["RentalAgreement"];
