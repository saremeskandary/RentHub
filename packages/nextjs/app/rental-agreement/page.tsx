"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgreementParties } from "../../utils/scaffold-eth/contractInteractions";
import { ContractUI } from "../debug/_components/contract";
import type { NextPage } from "next";
import { Address as ViemAddress } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const contractName = "RentalAgreement"; // Contract name used in ContractUI

const RentalAgreement: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [agreementParties, setAgreementParties] = useState<{ rentee: ViemAddress; renter: ViemAddress } | null>(null);
  const [agreementId, setAgreementId] = useState<number>(0);

  useEffect(() => {
    const fetchAgreementParties = async () => {
      if (agreementId > 0) {
        const parties = await getAgreementParties(contractName, BigInt(agreementId));
        setAgreementParties(parties);
      }
    };

    fetchAgreementParties();
  }, [agreementId]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Rental Agreement</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
        <div className="mt-8 w-full max-w-lg">
          <input
            type="number"
            value={agreementId}
            onChange={e => setAgreementId(Number(e.target.value))}
            placeholder="Enter Agreement ID"
            className="px-4 py-2 border rounded-md w-full mb-4"
          />
          {agreementParties && (
            <div className="bg-base-100 border border-base-300 p-4 rounded-3xl shadow-lg shadow-base-300">
              <h3 className="text-xl font-bold mb-2">Agreement Details</h3>
              <p>
                <strong>Rentee:</strong> <Address address={agreementParties.rentee} />
              </p>
              <p>
                <strong>Renter:</strong> <Address address={agreementParties.renter} />
              </p>
            </div>
          )}
        </div>
        <ContractUI contractName={contractName} className={"mt-10"} />
      </div>
    </>
  );
};

export default RentalAgreement;
