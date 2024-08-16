# User Journey Documentation

## 1. User Registration and Verification

1. User signs up for the platform.
2. User provides necessary documentation for identity verification.
3. Platform admin or authorized verifier calls `verifyUser()` in the UserIdentity contract.
4. User is now verified and can participate in rental agreements.

## 2. Creating a Rental Agreement

1. Asset owner initiates a new rental agreement by calling `createAgreement()` in the RentalAgreement contract.
2. Owner specifies the renter, asset ID, rental period, cost, and deposit.
3. The function checks if both parties are verified users.
4. System fee is calculated based on the current fee set in the RentalDAO contract.
5. Funds (cost + deposit + fee) are transferred to the contract.
6. Agreement is created and stored in the contract.
7. Funds are locked in the Escrow contract.
8. System fee is transferred to the RentalDAO contract.

## 3. During the Rental Period

1. Renter uses the asset for the agreed period.
2. If needed, either party can call `extendRentalPeriod()` to lengthen the rental duration.

## 4. Completing the Agreement

1. Once the rental period is over, either party can call `completeAgreement()`.
2. The function checks if the rental period has ended and performs a final inspection.
3. If successful:
   - Rewards are distributed through the SocialFi contract.
   - Revenue is distributed via the Monetization contract.
   - Funds are released from the Escrow contract.
   - User reputations are updated in the Reputation contract.

## 5. Dispute Resolution

1. If a dispute arises, either party can call `raiseDispute()` in the RentalAgreement contract.
2. This initiates the dispute resolution process in the DisputeResolution contract.
3. Arbiters vote on the dispute by calling `voteOnDispute()`.
4. Once voting is complete, an arbiter calls `resolveDispute()`.
5. The resolution updates user reputations and may revoke user validation if reputation falls below a threshold.
6. Penalties may be applied to the losing party (e.g., forfeiting deposit).

## 6. System Management

1. DAO members can propose and update the system fee by calling `proposeAndUpdateSystemFee()` in the RentalDAO contract.
2. Admins can withdraw accumulated system fees using `withdrawFees()`.
3. Contract addresses can be updated as needed using `updateContractAddress()`.

## 7. User Reputation

1. User reputations are automatically updated based on successful completions of agreements and dispute resolutions.
2. Users can check their reputation score at any time.
3. If a user's reputation falls below a certain threshold, their verification may be revoked, preventing them from participating in new agreements until re-verified.

This user journey provides a high-level overview of the main interactions users and administrators have with the rental platform. It covers the key processes from user registration to agreement completion or dispute resolution, as well as system management tasks.