// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IUserIdentity.sol";
import "./interfaces/IEscrow.sol";
import "./interfaces/IInspection.sol";
import "./interfaces/ISocialFi.sol";
import "./interfaces/IMonetization.sol";
import "./interfaces/IReputation.sol";
import "./interfaces/IDisputeResolution.sol";
import "./interfaces/IRentalDAO.sol";

contract RentalAgreement is ReentrancyGuard, Ownable {
	struct User {
		uint256 validationTime;
		bool isValidated;
		uint256 reputationScore;
		uint256 joinTime;
	}

	struct Asset {
		address assetAddress; // 0xsomthing
		uint256 tokenId; // bmw would be 0, 2, 3
		string name; // bmw, beach, iphonX
		string assetType; // car, home, cellphone
		bool isActive;
		uint256 timesRented;
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
	enum AgreementStatus {
		Created,
		Started,
		Completed,
		Cancelled
	}

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
	address public daoContract;

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
		address _userIdentityContract,
		address _daoContract
	) {
		require(
			_escrowContract != address(0),
			"Invalid escrow contract address"
		);
		require(
			_inspectionContract != address(0),
			"Invalid inspection contract address"
		);
		require(
			_reputationContract != address(0),
			"Invalid reputation contract address"
		);
		require(
			_disputeResolutionContract != address(0),
			"Invalid dispute resolution contract address"
		);
		require(
			_socialFiContract != address(0),
			"Invalid social fi contract address"
		);
		require(
			_monetizationContract != address(0),
			"Invalid monetization contract address"
		);
		require(
			_userIdentityContract != address(0),
			"Invalid user identity contract address"
		);
		require(_daoContract != address(0), "Invalid DAO contract address");
		escrowContract = _escrowContract;
		inspectionContract = _inspectionContract;
		reputationContract = _reputationContract;
		disputeResolutionContract = _disputeResolutionContract;
		socialFiContract = _socialFiContract;
		monetizationContract = _monetizationContract;
		userIdentityContract = _userIdentityContract;
		daoContract = _daoContract;
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
		require(_renter != address(0), "Invalid renter address");
		require(_cost > 0, "Cost must be greater than zero");
		require(_deposit > 0, "Deposit must be greater than zero");

		uint256 systemFee = IRentalDAO(daoContract).getSystemFee();
		uint256 feeAmount = (_cost * systemFee) / 10000;
		uint256 totalAmount = _cost + _deposit + feeAmount;

		require(msg.value == totalAmount, "Incorrect amount sent");

		agreementCounter++;
		Asset storage asset = assets[_assetId]; //FIXME Undeclared identifier. Did you mean "asset", "Asset" or "assert"?
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
		IEscrow(escrowContract).lockFunds{ value: _cost + _deposit }(
			agreementCounter,
			_cost,
			_deposit
		);

		// Transfer system fee to the DAO contract
		payable(daoContract).transfer(feeAmount);

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

	function updateDAOContract(address _daoContract) external onlyOwner {
		require(_daoContract != address(0), "Invalid DAO contract address");
		daoContract = _daoContract;
	}
}
