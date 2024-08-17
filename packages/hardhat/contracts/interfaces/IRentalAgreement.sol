// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

/**
 * @title IRentalAgreement
 * @notice Interface for managing rental agreements in a decentralized rental system
 * @dev Defines key functions and structures for creating, managing, and resolving rental agreements
 */
interface IRentalAgreement is ICommonErrors {
	/**
	 * @dev Represents a user in the rental system
	 * @param userAddress The Ethereum address of the user
	 * @param validationTime Timestamp of when the user was validated
	 * @param isValidated Boolean indicating if the user is validated
	 * @param reputationScore The user's reputation score
	 * @param joinTime Timestamp of when the user joined the system
	 */
	struct User {
		address userAddress;
		uint256 validationTime;
		bool isValidated;
		uint256 reputationScore;
		uint256 joinTime;
	}

	/**
	 * @dev Represents a collection of assets
	 * @param collection Address of the ERC1155 token contract for the collection
	 * @param name Name of the collection
	 */
	struct Collection {
		address collection;
		string name;
	}

	/**
	 * @dev Represents an individual asset available for rent
	 * @param assetAddress The collection to which this asset belongs
	 * @param name Name of the asset
	 * @param assetType Type of the asset (e.g., car, home, cellphone)
	 * @param isActive Whether the asset is currently available for rent
	 * @param timesRented Number of times this asset has been rented
	 */
	struct Asset {
		Collection assetAddress;
		string name;
		string assetType;
		bool isActive;
		uint256 timesRented;
	}

	/**
	 * @dev Represents a rental agreement
	 * @param rentee The user renting out the asset
	 * @param renter The user renting the asset
	 * @param asset The asset being rented
	 * @param rentalPeriod Duration of the rental in time units
	 * @param cost Cost of the rental
	 * @param deposit Deposit amount for the rental
	 * @param startTime Timestamp when the rental period starts
	 * @param registrationTime Timestamp when the agreement was registered
	 * @param status Current status of the agreement
	 * @param isDisputed Whether the agreement is under dispute
	 */
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

	/**
	 * @dev Enum representing the possible statuses of an agreement
	 */
	enum AgreementStatus {
		CREATED,
		REQUESTED,
		STARTED,
		COMPLETED,
		CANCELLED
	}

	// Custom errors
	error InvalidAgreement();
	error Asset_is_not_active();
	error UserNotVerified(address user);
	error AssetIsNotActive();
	error AgreementNotActive();
	error RentalPeriodNotOver(uint256 currentTime, uint256 endTime);
	error InspectionFailed(bool itemCondition, address rentee, address renter);
	error InvalidDAOAddress(address daoAddress);

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
	 * @dev Emitted when a rentee extends an agreement
	 * @param _agreementId The ID of the extended agreement
	 * @param _rentalPeriod The new total rental period
	 * @param _newCost The new total cost
	 */
	event AgreementExtendedRentee(
		uint256 _agreementId,
		uint256 _rentalPeriod,
		uint256 _newCost
	);

	/**
	 * @dev Emitted when a renter extends an agreement
	 * @param _agreementId The ID of the extended agreement
	 * @param _rentalPeriod The new total rental period
	 */
	event AgreementExtendedRenter(uint256 _agreementId, uint256 _rentalPeriod);

	/**
	 * @dev Emitted when a renter arrives to collect the rented asset
	 * @param agreementId The ID of the agreement
	 * @param rentee The address of the rentee
	 * @param renter The address of the renter
	 * @param arrivalTime The timestamp of the renter's arrival
	 */
	event ArrivalAgreementEvent(
		uint256 agreementId,
		address rentee,
		address renter,
		uint256 arrivalTime
	);

	/**
	 * @notice Creates a new rental agreement
	 * @dev Validates inputs and creates a new agreement
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
	) external returns (uint256);

	/**
	 * @notice Records the arrival of the renter to collect the asset
	 * @param _agreementId The ID of the agreement
	 */
	function ArrivalAgreement(uint256 _agreementId) external;

	/**
	 * @notice Completes an existing agreement
	 * @param _agreementId The ID of the agreement to complete
	 */
	function completeAgreement(uint256 _agreementId) external;

	/**
	 * @notice Cancels an existing agreement
	 * @param _agreementId The ID of the agreement to cancel
	 */
	function cancelAgreement(uint256 _agreementId) external;

	/**
	 * @notice Raises a dispute for an existing agreement
	 * @param _agreementId The ID of the agreement to dispute
	 */
	function raiseDispute(uint256 _agreementId) external;

	/**
	 * @notice Extends the rental period of an existing agreement (called by rentee)
	 * @param _agreementId The ID of the agreement to extend
	 * @param _additionalPeriod The additional rental period
	 * @param _newCost The new total cost for the extended period
	 */
	function extendRentalPeriodRentee(
		uint256 _agreementId,
		uint256 _additionalPeriod,
		uint256 _newCost
	) external;

	/**
	 * @notice Extends the rental period of an existing agreement (called by renter)
	 * @param _agreementId The ID of the agreement to extend
	 * @param _additionalPeriod The additional rental period
	 */
	function extendRentalPeriodRenter(
		uint256 _agreementId,
		uint256 _additionalPeriod
	) external;

	/**
	 * @notice Updates the address of the Escrow contract
	 * @param _escrow The new address of the Escrow contract
	 */
	function updateEscrow(address _escrow) external;

	/**
	 * @notice Updates the address of the Inspection contract
	 * @param _inspection The new address of the Inspection contract
	 */
	function updateInspection(address _inspection) external;

	/**
	 * @notice Updates the address of the Reputation contract
	 * @param _reputation The new address of the Reputation contract
	 */
	function updateReputation(address _reputation) external;

	/**
	 * @notice Updates the address of the DisputeResolution contract
	 * @param _disputeResolution The new address of the DisputeResolution contract
	 */
	function updateDisputeResolution(address _disputeResolution) external;

	/**
	 * @notice Updates the address of the SocialFi contract
	 * @param _socialFi The new address of the SocialFi contract
	 */
	function updateSocialFi(address _socialFi) external;

	/**
	 * @notice Updates the address of the UserIdentity contract
	 * @param _userIdentity The new address of the UserIdentity contract
	 */
	function updateUserIdentity(address _userIdentity) external;

	/**
	 * @notice Updates the address of the DAO contract
	 * @param _rentalDAO The new address of the DAO contract
	 */
	function updateDAO(address _rentalDAO) external;

	/**
	 * @notice Retrieves the parties involved in an agreement
	 * @param _agreementId ID of the agreement
	 * @return rentee Address of the asset rentee
	 * @return renter Address of the renter
	 */
	function getAgreementParties(
		uint256 _agreementId
	) external view returns (address rentee, address renter);
}
