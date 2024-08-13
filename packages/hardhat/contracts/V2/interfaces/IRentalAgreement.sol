// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title IRentalAgreement
 * @dev Interface for the RentalAgreement contract, defining key functions for managing rental agreements
 */
interface IRentalAgreement {
    /**
     * @dev Emitted when a new agreement is created
     * @param agreementId The ID of the newly created agreement
     * @param owner The address of the asset owner
     * @param renter The address of the renter
     */
    event AgreementCreated(uint256 agreementId, address owner, address renter);

    /**
     * @dev Emitted when an agreement is completed
     * @param agreementId The ID of the completed agreement
     */
    event AgreementCompleted(uint256 agreementId);

    /**
     * @dev Emitted when a dispute is raised for an agreement
     * @param agreementId The ID of the agreement in dispute
     */
    event DisputeRaised(uint256 agreementId);

    /**
     * @dev Emitted when an agreement is cancelled
     * @param agreementId The ID of the cancelled agreement
     */
    event AgreementCancelled(uint256 agreementId);

    /**
     * @dev Emitted when an agreement's rental period is extended
     * @param agreementId The ID of the extended agreement
     * @param newRentalPeriod The new rental period
     */
    event AgreementExtended(uint256 agreementId, uint256 newRentalPeriod);

    /**
     * @dev Creates a new rental agreement
     * @param _renter Address of the renter
     * @param _assetId ID of the asset to be rented
     * @param _rentalPeriod Duration of the rental period
     * @param _cost Cost of the rental
     * @param _deposit Deposit amount for the rental
     * @return The ID of the newly created agreement
     */
    function createAgreement(
        address _renter,
        uint256 _assetId,
        uint256 _rentalPeriod,
        uint256 _cost,
        uint256 _deposit
    ) external payable returns (uint256);

    /**
     * @dev Completes an existing agreement
     * @param _agreementId The ID of the agreement to complete
     */
    function completeAgreement(uint256 _agreementId) external;

    /**
     * @dev Raises a dispute for an existing agreement
     * @param _agreementId The ID of the agreement to dispute
     */
    function raiseDispute(uint256 _agreementId) external;

    /**
     * @dev Cancels an existing agreement
     * @param _agreementId The ID of the agreement to cancel
     */
    function cancelAgreement(uint256 _agreementId) external;

    /**
     * @dev Extends the rental period of an existing agreement
     * @param _agreementId The ID of the agreement to extend
     * @param _additionalPeriod The additional rental period
     */
    function extendRentalPeriod(uint256 _agreementId, uint256 _additionalPeriod) external;

    /**
     * @dev Retrieves the parties involved in an agreement
     * @param _agreementId ID of the agreement
     * @return owner Address of the asset owner
     * @return renter Address of the renter
     */
    function getAgreementParties(uint256 _agreementId) external view returns (address owner, address renter);

    /**
     * @dev Updates the address of the DAO contract
     * @param _daoContract New address of the DAO contract
     */
    function updateDAOContract(address _daoContract) external;
}