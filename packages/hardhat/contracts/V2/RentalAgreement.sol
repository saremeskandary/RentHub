// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

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

	IEscrow public escrow;
	IInspection public inspection;
	IReputation public reputation;
	IDisputeResolution public disputeResolution;
	ISocialFi public socialFi;
	IMonetization public monetization;
	IUserIdentity public userIdentity;
	IRentalDAO public rentalDAO;

	modifier onlyVerifiedUser(address _user) {
		require(
			_user != address(0) &&
				IUserIdentity(userIdentity).isVerifiedUser(_user),
			"User not verified"
		);
		_;
	}

	constructor(
		address _escrow,
		address _inspection,
		address _reputation,
		address _disputeResolution,
		address _socialFi,
		address _monetization,
		address _userIdentity,
		address _rentalDAO
	) {
		require(_escrow != address(0), "Invalid escrow  address");
		require(_inspection != address(0), "Invalid inspection  address");
		require(_reputation != address(0), "Invalid reputation  address");
		require(
			_disputeResolution != address(0),
			"Invalid dispute resolution  address"
		);
		require(_socialFi != address(0), "Invalid social fi  address");
		require(_monetization != address(0), "Invalid monetization  address");
		require(_userIdentity != address(0), "Invalid user identity  address");
		require(_rentalDAO != address(0), "Invalid DAO  address");

		escrow = IEscrow(_escrow);
		inspection = IInspection(_inspection);
		reputation = IReputation(_reputation);
		disputeResolution = IDisputeResolution(_disputeResolution);
		socialFi = ISocialFi(_socialFi);
		monetization = IMonetization(_monetization);
		userIdentity = IUserIdentity(_userIdentity);
		rentalDAO = IRentalDAO(_rentalDAO);
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

		uint256 systemFee = rentalDAO.getSystemFee();
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

		// Lock funds in the Escrow
		IEscrow(escrow).lockFunds{ value: _cost + _deposit }(
			agreementCounter,
			_cost,
			_deposit
		);

		// Transfer system fee to the DAO
		payable(rentalDAO).transfer(feeAmount);

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
		bool isItemInGoodCondition = IInspection(inspection).inspectItem(
			_agreementId
		);
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
		// Reward users via SocialFi
		ISocialFi(socialFi).rewardUser(agreement.rentee, 100); // Example reward
		ISocialFi(socialFi).rewardUser(agreement.renter, 100);

		// Distribute revenue via Monetization
		IMonetization(monetization).distributeRevenue(
			_agreementId,
			agreement.cost
		);

		emit AgreementCompleted(_agreementId);

		IEscrow(escrow).releaseFunds(_agreementId);
		IReputation(reputation).updateReputations(
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

		IDisputeResolution(disputeResolution).initiateDispute(_agreementId);
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
		IEscrow(escrow).refundDeposit(_agreementId);
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

	function updateEscrow(address _escrow) external onlyOwner {
		escrow = _escrow;
	}

	function updateInspection(address _inspection) external onlyOwner {
		inspection = _inspection;
	}

	function updateReputation(address _reputation) external onlyOwner {
		reputation = _reputation;
	}

	function updateDisputeResolution(
		address _disputeResolution
	) external onlyOwner {
		disputeResolution = _disputeResolution;
	}

	function updateSocialFi(address _socialFi) external onlyOwner {
		socialFi = _socialFi;
	}

	function updateMonetization(address _monetization) external onlyOwner {
		monetization = _monetization;
	}

	function updateUserIdentity(address _userIdentity) external onlyOwner {
		userIdentity = _userIdentity;
	}

	function updateDAO(address _rentalDAO) external onlyOwner {
		require(_rentalDAO != address(0), "Invalid DAO  address");
		rentalDAO = _rentalDAO;
	}
}
