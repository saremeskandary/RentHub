import { createPublicClient, http, parseAbi, Address } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet, // Change this if you're using a different network
  transport: http("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"), // Replace with your Infura or Alchemy endpoint
});

const rentalAgreementAbi = parseAbi([
  "function getAgreementParties(uint256 _agreementId) external view returns (address rentee, address renter)",
  // Add other function signatures as needed
]);

export const getAgreementParties = async (
  contractAddress: Address,
  agreementId: bigint
): Promise<{ rentee: Address; renter: Address } | null> => {
  try {
    const result = await publicClient.readContract({
      address: contractAddress,
      abi: rentalAgreementAbi,
      functionName: "getAgreementParties",
      args: [agreementId],
    });

    return {
      rentee: result[0] as Address,
      renter: result[1] as Address,
    };
  } catch (error) {
    console.error(`Error fetching agreement parties for ID ${agreementId}:`, error);
    return null;
  }
};
