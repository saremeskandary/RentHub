// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { IUserIdentity, IEscrow, IInspection, ISocialFi, IMonetization, IEscrow, IReputation, IDisputeResolution } from "./interfaces";

contract RentalAgreement is ReentrancyGuard, Ownable {
	    struct User {
        uint256 validationTime;
        bool isValidated;
        uint256 reputationScore;
        uint256 joinTime;
    }

	// struct Asset { // FIXME add types and move it to interface
	// 	assetAddress; // 0xsomthing
	// 	tokenId; // bmw would be 0, 2, 3
	// 	name; // bmw, beach, iphonX
	// 	assetType; // car, home, cellphone
	// 	isActive;
	// }
	struct Asset {
        address assetAddress;
        uint256 tokenId;
        string name;
        string assetType;
        bool isActive;
        uint256 timesRented;
    }

	struct Agreement { // FIXME move it to interface
		address owner; // FIXME this should be type User
		address renter; // FIXME this should be type User
		Asset asset; // TODO create asset struct
		uint256 rentalPeriod;
		uint256 cost;
		uint256 deposit;
		uint256 startTime; // FIXME change this to rentTime and create another time for registration.
		bool isActive; // FIXME change this to status including started , completed , rented , canceled  
		bool isDisputed = false; // then true when dipute resolotion occured is active would be false.
	}
	struct Agreement {
        User owner;
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
	enum AgreementStatus { Created, Started, Completed, Cancelled }

    mapping(address => User) public users;
    mapping(uint256 => Agreement) public agreements;
    uint256 public agreementCounter;

	address public escrowContract;
	address public inspectionContract;
	address public reputationContract;
	address public disputeResolutionContract;
	address public socialFiContract;
	address public monetizationContract;
	address public userIdentityContract;

	event AgreementCreated(uint256 agreementId, address owner, address renter);
	event AgreementCompleted(uint256 agreementId);
	event DisputeRaised(uint256 agreementId);
	event AgreementCancelled(uint256 agreementId);
	event AgreementExtended(uint256 agreementId, uint256 newRentalPeriod);

	constructor(
		address _escrowContract,
		address _inspectionContract,
		address _reputationContract,
		address _disputeResolutionContract,
		address _socialFiContract,
		address _monetizationContract,
		address _userIdentityContract
	) {
		escrowContract = _escrowContract;
		inspectionContract = _inspectionContract;
		reputationContract = _reputationContract;
		disputeResolutionContract = _disputeResolutionContract;
		socialFiContract = _socialFiContract;
		monetizationContract = _monetizationContract;
		userIdentityContract = _userIdentityContract;
	}

	modifier onlyVerifiedUser(address _user) {
		require(
			IUserIdentity(userIdentityContract).isVerifiedUser(_user),
			"User not verified"
		);
		_;
	}

    function createAgreement(
		address _renter,
		uint256 _assetId,
		uint256 _rentalPeriod,
		uint256 _cost,
		uint256 _deposit
	)
		external
		payable
		nonReentrant
		onlyVerifiedUser(msg.sender)
		onlyVerifiedUser(_renter)
		returns (uint256)
	{
		require(msg.value == _cost + _deposit, "Incorrect amount sent");

		agreementCounter++;
		Asset storage asset = assets[_assetId];
		require(asset.isActive, "Asset is not active");

		agreements[agreementCounter] = Agreement({
			owner: users[msg.sender],
			renter: users[_renter],
			asset: asset,
			rentalPeriod: _rentalPeriod,
			cost: _cost,
			deposit: _deposit,
			startTime: 0,
			registrationTime: block.timestamp,
			status: AgreementStatus.Created,
			isDisputed: false
		});

		asset.timesRented++;

		// Lock funds in the Escrow contract
		IEscrow(escrowContract).lockFunds{value: msg.value}(agreementCounter, _cost, _deposit);

		emit AgreementCreated(agreementCounter, msg.sender, _renter);

		return agreementCounter;
	}
	function completeAgreement(uint256 _agreementId) external nonReentrant {
		Agreement storage agreement = agreements[_agreementId];
		require(
			msg.sender == agreement.owner || msg.sender == agreement.renter,
			"Not authorized"
		);
		require(agreement.isActive, "Agreement not active");
		require(
			block.timestamp >= agreement.startTime + agreement.rentalPeriod,
			"Rental period not over"
		);

		// Optionally, perform inspection before completion
		bool isItemInGoodCondition = IInspection(inspectionContract)
			.inspectItem(_agreementId);
		// Consider using a better inspection mechanism or allow mutual agreement by both parties.
		require(
			isItemInGoodCondition ||
				(msg.sender == agreement.owner &&
					agreement.renter == address(0)),
			"Inspection failed"
		);

		agreement.isActive = false;
		agreement.isCompleted = true;

		// require(agreement.isActive == false, "agreement is active"); FIXME do we need this when we have nonReentrant?
		// require(agreement.isCompleted == true, "agreement is not completed"); FIXME do we need this when we have nonReentrant?
		// Reward users via SocialFi contract
		ISocialFi(socialFiContract).rewardUser(agreement.owner, 100); // Example reward
		ISocialFi(socialFiContract).rewardUser(agreement.renter, 100);

		// Distribute revenue via Monetization contract
		IMonetization(monetizationContract).distributeRevenue(
			_agreementId,
			agreement.cost
		);

		emit AgreementCompleted(_agreementId);

		IEscrow(escrowContract).releaseFunds(_agreementId);
		IReputation(reputationContract).updateReputations(
			_agreementId,
			agreement.owner,
			agreement.renter,
			true
		);
	}

	function raiseDispute(uint256 _agreementId) external {
		Agreement storage agreement = agreements[_agreementId];
		require(
			msg.sender == agreement.owner || msg.sender == agreement.renter,
			"Not authorized"
		);
		require(agreement.isActive, "Agreement not active");

		emit DisputeRaised(_agreementId);

		IDisputeResolution(disputeResolutionContract).initiateDispute(
			_agreementId
		);
	}

	function cancelAgreement(uint256 _agreementId) external nonReentrant {
		Agreement storage agreement = agreements[_agreementId];
		require(
			msg.sender == agreement.owner || msg.sender == agreement.renter,
			"Not authorized"
		);
		require(agreement.isActive, "Agreement not active");

		agreement.isActive = false;

		emit AgreementCancelled(_agreementId);

		// Refund the deposit back to the renter
		IEscrow(escrowContract).refundDeposit(_agreementId);
	}

	function extendRentalPeriod(
		uint256 _agreementId,
		uint256 _additionalPeriod
	) external nonReentrant {
		Agreement storage agreement = agreements[_agreementId];
		require(
			msg.sender == agreement.owner || msg.sender == agreement.renter,
			"Not authorized"
		);
		require(agreement.isActive, "Agreement not active");

		agreement.rentalPeriod += _additionalPeriod;

		emit AgreementExtended(_agreementId, agreement.rentalPeriod);

		// Optionally lock additional funds in escrow if required
	}

	function updateEscrowContract(address _escrowContract) external onlyOwner {
		escrowContract = _escrowContract;
	}

	function updateInspectionContract(
		address _inspectionContract
	) external onlyOwner {
		inspectionContract = _inspectionContract;
	}

	function updateReputationContract(
		address _reputationContract
	) external onlyOwner {
		reputationContract = _reputationContract;
	}

	function updateDisputeResolutionContract(
		address _disputeResolutionContract
	) external onlyOwner {
		disputeResolutionContract = _disputeResolutionContract;
	}

	function updateSocialFiContract(
		address _socialFiContract
	) external onlyOwner {
		socialFiContract = _socialFiContract;
	}

	function updateMonetizationContract(
		address _monetizationContract
	) external onlyOwner {
		monetizationContract = _monetizationContract;
	}

	function updateUserIdentityContract(
		address _userIdentityContract
	) external onlyOwner {
		userIdentityContract = _userIdentityContract;
	}
}
