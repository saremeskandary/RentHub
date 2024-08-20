// "use client"
// import Link from "next/link";
// import { Settings, Wallet } from "lucide-react";
// import styles from "~~/components/profile/Profile.module.scss";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useAccount } from "wagmi";

// export default function Profile() {
//   const { address, isConnected } = useAccount();

//   return (
//     <section className={styles.profile}>
//       <Link href="/settings">
//         <Settings size={24} color="#9095a9" />
//         <span>Settings</span>
//       </Link>

//       <Link href="/wallet">
//         <Wallet size={24} color="#9095a9" />
//         <span>Wallet</span>
//       </Link>
     
//       <ConnectButton />
//     </section>
//   );
// }
"use client";
import Link from "next/link";
import { Settings, Wallet } from "lucide-react";
import { useState } from "react";
import styles from "~~/components/profile/Profile.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [userType, setUserType] = useState<string>('Renter'); // Default to 'Renter'
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for popup visibility

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setUserType(selectedType);
    setShowPopup(true); // Show the popup after selection
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <section className={styles.profile}>
      <div className={styles.profile__dropdown}>
        <label htmlFor="userType" className={styles.profile__label}>
          Select User Type
        </label>
        <select
          id="userType"
          value={userType}
          onChange={handleUserTypeChange}
          className={styles.profile__select} // Same styling for dropdown
        >
          <option value="Renter">Renter</option>
          <option value="Owner">Owner</option>
          <option value="Arbiter">Arbiter</option>
        </select>
      </div>

      <Link href="/settings" className={styles.profile__link}>
        <Settings size={24} color="#9095a9" />
        <span>Settings</span>
      </Link>

      <Link href="/wallet" className={styles.profile__link}>
        <Wallet size={24} color="#9095a9" />
        <span>Wallet</span>
      </Link>

      <ConnectButton />

      {/* Popup Modal */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>Welcome, {userType}!</h2>
            <p className={styles.popupMessage}>
              You have successfully selected the {userType} role.
            </p>
            <button onClick={closePopup} className={styles.popupCloseButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
