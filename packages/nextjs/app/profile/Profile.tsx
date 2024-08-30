"use client";

import { useState } from "react";
import Link from "next/link";
import { File, Settings, Upload, Wallet } from "lucide-react";

export default function Profile() {
  const [userType, setUserType] = useState<string>("Renter");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setUserType(selectedType);
    setShowPopup(true);
  };

  return (
    <section className="flex flex-[1_1_100%] flex-col items-center justify-center gap-5">
      <div className="flex flex-col">
        <label htmlFor="userType">Select User Type</label>
        <select
          id="userType"
          value={userType}
          onChange={handleUserTypeChange}
          className="w-[200px] rounded border bg-white px-5 py-2 text-sm outline-none"
        >
          <option value="Renter">Renter</option>
          <option value="Owner">Owner</option>
          <option value="Arbiter">Arbiter</option>
        </select>
      </div>

      <div className="flex gap-5">
        <Link
          href="/settings"
          className="flex w-[150px] items-center justify-center gap-2 rounded bg-white px-5 py-3 font-semibold text-[#9095a9] shadow-md"
        >
          <Settings size={20} color="#9095a9" />
          <span>Settings</span>
        </Link>

        <Link
          href="/wallet"
          className="flex w-[150px] items-center justify-center gap-2 rounded bg-white px-5 py-3 font-semibold text-[#9095a9] shadow-md"
        >
          <Wallet size={20} color="#9095a9" />
          <span>Wallet</span>
        </Link>
      </div>

      <div>
        <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
        <label
          htmlFor="file-upload"
          className="flex cursor-pointer items-center gap-3 rounded bg-blue-500 px-5 py-2 text-white transition hover:bg-blue-600"
        >
          <Upload color="#fff" size={18} />
          <span>ZK Upload ID</span>
        </label>
        {file?.name && (
          <div className="mt-1 flex items-center justify-center gap-2">
            <File size={16} />
            <span className="text-center text-sm font-semibold">{file.name}</span>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[999] flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-[400px] rounded bg-white p-5 text-center">
            <button
              className="absolute right-2 top-0 text-2xl text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold">Welcome, {userType}!</h2>
            <p className="text-sm text-gray-400">You have successfully selected the {userType} role.</p>
          </div>
        </div>
      )}
    </section>
  );
}
