require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-laika");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings

    localhost: { url: "http://127.0.0.1:8545" },

    hardhat: {
      chainId: 31337, // This is required for the Chainlink Aggregator to work properly
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    shibarium: {
      url: "https://rpc.shibrpc.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 157,
    },
    crossfit_estnet: {
      url: "https://rpc.testnet.ms",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4157,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.26",
      },
      {
        version: "0.8.0",
        settings: {},
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  mocha: { timeout: 40000000 },

  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice",
    token: "BNB",
  },

  etherscan: {
    apiKey: `${process.env.POLYGON_SCAN_KEY}`,
  },
};
