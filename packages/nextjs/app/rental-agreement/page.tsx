"use client";

import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { getAgreementParties } from "../../utils/scaffold-eth/contractInteractions";
import { ContractInput, ContractUI, getInitialFormState } from "../debug/_components/contract";
import { Abi, AbiFunction } from "abitype";
import type { NextPage } from "next";
import { Address as ViemAddress } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
import { Address, InputBase } from "~~/components/scaffold-eth";
import { useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";

const contractName = "RentalAgreement"; // Contract name used in ContractUI

const RentalAgreement: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [agreementParties, setAgreementParties] = useState<{ rentee: ViemAddress; renter: ViemAddress } | null>(null);
  const [agreementId, setAgreementId] = useState<number>(0);
  // const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
  const [txValue, setTxValue] = useState<string | bigint>("");
  const { chain } = useAccount();
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  const { data: result, isPending, writeContractAsync } = useWriteContract();

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
          <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 `}>
            <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                <div className="z-10">
                  <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
                    <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                      <div className="flex items-center justify-center space-x-2">
                        <p className="my-0 text-sm">Write</p>
                      </div>
                    </div>
                    <div className="p-5 divide-y divide-base-300">
                      {/* <ContractInput
                        setForm={function (value: SetStateAction<Record<string, any>>): void {
                          throw new Error("Function not implemented.");
                        }}
                        form={undefined}
                        stateObjectKey={""}
                        paramType={{type:"tuple",name: "sdf"}}
                      /> */}
                      {/* <ContractWriteMethods
                    deployedContractData={deployedContractData}
                    onChange={triggerRefreshDisplayVariables}
                  /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ContractUI contractName={contractName} className={"mt-10"} />
      </div>
    </>
  );
};

export default RentalAgreement;
