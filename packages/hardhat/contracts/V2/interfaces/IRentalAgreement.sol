// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/**
 * @title IRentalAgreement
 * @dev Interface for the RentalAgreement contract, defining key functions for managing rental agreements
 */
interface IRentalAgreement {
	struct User {
		uint256 validationTime;
		bool isValidated;
		uint256 reputationScore;
		uint256 joinTime;
	}

	struct Collection {
		address collection; // create ERC1155 token contract
		string name;
	}

	struct Asset {
		Collection assetAddress; // 0xsomthing car
		// uint256 tokenId; // bmw would be 0, 2, 3   FIXME we will get this from them mapping
		string name; // bmw, beach, iphonX
		string assetType; // car, home, cellphone
		bool isActive;
		uint256 timesRented;
	}

	struct Agreement {
		User rentee;
		User renter;
		Asset asset;
		uint256 rentalPeriod;
		uint256 cost;
		uint256 deposit;
		uint256 startTime;
		uint256 registrationTime;
		AgreementStatus status;
		bool isDisputed;
	}
	enum AgreementStatus {
		CREATED,
		STARTED,
		COMPLETED,
		CANCELLED
	}

	/**
	 * @dev Thrown if the provided agreement is invalid.
	 */
	error InvalidAgreement();
	/**
	 * @dev Emitted when a new agreement is created
	 * @param agreementId The ID of the newly created agreement
	 * @param rentee The address of the asset rentee
	 * @param renter The address of the renter
	 */
	event AgreementCreated(uint256 agreementId, address rentee, address renter);

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
	 * @dev Emitted when an agreement's arrival period is extended
	 * @param agreementId The ID of the extended agreement
	 * @param newRentalPeriod The new rental period
	 */
	event arrivalAgreement(uint256 agreementId, uint256 newRentalPeriod); // FIXME

	/**
	 * @dev Creates a new rental agreement
	 * @param _renter Address of the renter
	 * @param _tokenId ID of the asset to be rented
	 * @param _rentalPeriod Duration of the rental period
	 * @param _cost Cost of the rental
	 * @param _deposit Deposit amount for the rental
	 * @return The ID of the newly created agreement
	 */
	function createAgreement(
		address _renter,
		uint256 _tokenId,
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
	function extendRentalPeriod(
		uint256 _agreementId,
		uint256 _additionalPeriod
	) external;

	/**
	 * @dev Retrieves the parties involved in an agreement
	 * @param _agreementId ID of the agreement
	 * @return rentee Address of the asset rentee
	 * @return renter Address of the renter
	 */
	function getAgreementParties(
		uint256 _agreementId
	) external view returns (address rentee, address renter);

	/**
	 * @dev Updates the address of the DAO contract
	 * @param _daoContract New address of the DAO contract
	 */
	function updateDAOContract(address _daoContract) external;
}
