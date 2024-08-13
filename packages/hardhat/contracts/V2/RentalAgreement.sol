// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IUserIdentity } from "./interfaces/IUserIdentity.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { IInspection } from "./interfaces/IInspection.sol";
import { ISocialFi } from "./interfaces/ISocialFi.sol";
import { IMonetization } from "./interfaces/IMonetization.sol";
import { IReputation } from "./interfaces/IReputation.sol";
import { IDisputeResolution } from "./interfaces/IDisputeResolution.sol";
import { IRentalDAO } from "./interfaces/IRentalDAO.sol";
import { IRentalAgreement } from "./interfaces/IRentalAgreement.sol";

contract RentalAgreement is IRentalAgreement, ReentrancyGuard, Ownable {
	mapping(address => User) public users;
	mapping(uint256 => Agreement) public agreements;
	mapping(uint256 => Asset) public assets;
	uint256 public agreementCounter;

	address public escrowContract;
	address public inspectionContract;
	address public reputationContract;
	address public disputeResolutionContract;
	address public socialFiContract;
	address public monetizationContract;
	address public userIdentityContract;
	address public daoContract;

	modifier onlyVerifiedUser(address _user) {
		require(
			_user != address(0) &&
				IUserIdentity(userIdentityContract).isVerifiedUser(_user),
			"User not verified"
		);
		_;
	}

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

		escrowContract = IEscrow(_escrowContract);
		inspectionContract = IInspection(_inspectionContract);
		reputationContract = IReputation(_reputationContract);
		disputeResolutionContract = IDisputeResolution(
			_disputeResolutionContract
		);
		socialFiContract = ISocialFi(_socialFiContract);
		monetizationContract = IMonetization(_monetizationContract);
		userIdentityContract = IU(_userIdentityContract);
		daoContract = IRentalDAO(_daoContract);
	}

	function createAgreement(
		address _renter,
		uint256 _tokenId,
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
		require(_cost > 0, "Cost must be greater than zero");
		require(_deposit > 0, "Deposit must be greater than zero");
		require(_rentalPeriod > 0, "Rental Period must be greater than zero");

		uint256 systemFee = daoContract.getSystemFee();
		uint256 feeAmount = (_cost * systemFee) / 10000;
		uint256 totalAmount = _cost + _deposit + feeAmount;

		require(msg.value == totalAmount, "Incorrect amount sent");

		agreementCounter++;
		Asset storage asset = assets[_tokenId]; // FIXME Undeclared identifier. Did you mean "asset", "Asset" or "assert"?
		require(asset.isActive, "Asset is not active");

		agreements[agreementCounter] = Agreement({
			rentee: users[msg.sender],
			renter: users[_renter],
			asset: asset,
			rentalPeriod: _rentalPeriod,
			cost: _cost,
			deposit: _deposit,
			startTime: 0,
			registrationTime: block.timestamp,
			status: AgreementStatus.CREATED,
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
			msg.sender == agreement.rentee || msg.sender == agreement.renter,
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
				(msg.sender == agreement.rentee &&
					agreement.renter == address(0)),
			"Inspection failed"
		);

		agreement.isActive = false;
		agreement.isCompleted = true;

		// require(agreement.isActive == false, "agreement is active"); FIXME do we need this when we have nonReentrant?
		// require(agreement.isCompleted == true, "agreement is not completed"); FIXME do we need this when we have nonReentrant?
		// Reward users via SocialFi contract
		ISocialFi(socialFiContract).rewardUser(agreement.rentee, 100); // Example reward
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
			agreement.rentee,
			agreement.renter,
			true
		);
	}

	function raiseDispute(uint256 _agreementId) external {
		Agreement storage agreement = agreements[_agreementId];
		require(
			msg.sender == agreement.rentee || msg.sender == agreement.renter,
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
			msg.sender == agreement.rentee || msg.sender == agreement.renter,
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
			msg.sender == agreement.rentee || msg.sender == agreement.renter,
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
