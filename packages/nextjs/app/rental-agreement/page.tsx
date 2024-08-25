"use client";

import { useReducer, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { BasicWriteOnlyFunctionForm } from "~~/components/scaffold-eth/form/BasicWriteOnlyFunctionForm";
import { useDeployedContractInfo, useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";

const contractName = "RentalAgreement"; // Contract name used in ContractUI

const RentalAgreement: NextPage = () => {
  const { targetNetwork } = useTargetNetwork();
  const { address: connectedAddress } = useAccount();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

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
                    {/* <ContractVariables
                    refreshDisplayVariables={refreshDisplayVariables}
                    deployedContractData={deployedContractData}
                  /> */}
                    <div className="p-5 divide-y divide-base-300">
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"setRentalAsset1155"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"addUser"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"createAgreement"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"ArrivalAgreement"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"completeAgreement"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"cancelAgreement"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"raiseDispute"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                      <BasicWriteOnlyFunctionForm
                        contract={deployedContractData}
                        name={"extendRentalPeriodRenter"}
                        onChange={triggerRefreshDisplayVariables}
                        contractAddress={deployedContractData.address}
                        inheritedFrom={undefined} // Adjust as necessary
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalAgreement;
