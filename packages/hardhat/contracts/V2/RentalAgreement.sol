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
		if (_user == address(0) || !userIdentity.isVerifiedUser(_user)) {
			revert UserNotVerified(_user);
		}
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
		if (_escrow == address(0)) revert InvalidAddress("escrow");
		if (_inspection == address(0)) revert InvalidAddress("inspection");
		if (_reputation == address(0)) revert InvalidAddress("reputation");
		if (_disputeResolution == address(0))
			revert InvalidAddress("dispute resolution");
		if (_socialFi == address(0)) revert InvalidAddress("social fi");
		if (_monetization == address(0)) revert InvalidAddress("monetization");
		if (_userIdentity == address(0)) revert InvalidAddress("user identity");
		if (_rentalDAO == address(0)) revert InvalidAddress("DAO");

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
		if (_cost <= 0) revert CostMustBeGreaterThanZero(_cost);
		if (_deposit <= 0) revert DepositMustBeGreaterThanZero(_deposit);
		if (_rentalPeriod <= 0)
			revert RentalPeriodMustBeGreaterThanZero(_rentalPeriod);

		Asset storage asset = assets[_tokenId];
		if (!asset.isActive) revert AssetIsNotActive(asset.isActive);

		agreements[agreementCounter] = Agreement({
			rentee: users[msg.sender],
			renter: users[address(0)],
			asset: asset,
			rentalPeriod: _rentalPeriod,
			cost: _cost,
			deposit: _deposit,
			startTime: 0,
			registrationTime: block.timestamp,
			status: AgreementStatus.CREATED,
			isDisputed: false
		});

		agreementCounter++;

		emit AgreementCreated(agreementCounter, msg.sender, _renter);

		return agreementCounter;
	}

	function ArrivalAgreement(uint256 _agreementId) external {
		Agreement storage agreement = agreements[_agreementId];
		if (
			agreement.renter.userAddress != address(0) ||
			agreement.isDisputed ||
			agreement.status != AgreementStatus.CREATED
		) {
			revert InvalidAgreement();
		}

		uint256 systemFee = rentalDAO.getSystemFee();
		uint256 feeAmount = (agreement.cost * systemFee) / 10000;
		uint256 totalAmount = agreement.cost + agreement.deposit;

		if (msg.value < totalAmount)
			revert IncorrectAmountSent(msg.value, totalAmount);
		if (!agreement.asset.isActive)
			revert AssetIsNotActive(agreement.asset.isActive);

		// Lock funds in the Escrow
		escrow.lockFunds(_agreementId, agreement.cost, agreement.deposit);

		agreement.asset.timesRented++;
		agreement.renter = users[msg.sender];
		agreement.startTime = block.timestamp;
		agreement.status = AgreementStatus.STARTED;

		emit ArrivalAgreementEvent(
			_agreementId,
			agreement.rentee.userAddress,
			agreement.renter.userAddress,
			block.timestamp
		);
	}

	function completeAgreement(uint256 _agreementId) external nonReentrant {
		Agreement storage agreement = agreements[_agreementId];
		if (
			msg.sender != agreement.rentee.userAddress &&
			msg.sender != agreement.renter.userAddress
		) {
			revert NotAuthorized(msg.sender);
		}
		if (!agreement.isActive) revert AgreementNotActive(agreement.isActive);
		if (block.timestamp <= agreement.startTime + agreement.rentalPeriod) {
			revert RentalPeriodNotOver(
				block.timestamp,
				agreement.startTime + agreement.rentalPeriod
			);
		}

		bool isItemInGoodCondition = inspection.inspectItem(_agreementId);
		if (!isItemInGoodCondition) {
			revert InspectionFailed(
				isItemInGoodCondition,
				agreement.rentee.userAddress,
				agreement.renter.userAddress
			);
		}

		agreement.isActive = false;
		agreement.isCompleted = true;

		socialFi.rewardUser(agreement.rentee.userAddress, 100);
		socialFi.rewardUser(agreement.renter.userAddress, 100);

		monetization.distributeRevenue(_agreementId, agreement.cost);

		emit AgreementCompleted(_agreementId);

		escrow.releaseFunds(_agreementId);
		reputation.updateReputations(
			_agreementId,
			agreement.rentee.userAddress,
			agreement.renter.userAddress,
			true
		);
	}

	function raiseDispute(uint256 _agreementId) external {
		Agreement storage agreement = agreements[_agreementId];
		if (
			msg.sender != agreement.rentee.userAddress &&
			msg.sender != agreement.renter.userAddress
		) {
			revert NotAuthorized(msg.sender);
		}
		if (!agreement.isActive) revert AgreementNotActive(agreement.isActive);

		emit DisputeRaised(_agreementId);

		disputeResolution.initiateDispute(_agreementId);
	}

	function cancelAgreement(uint256 _agreementId) external nonReentrant {
		Agreement storage agreement = agreements[_agreementId];
		if (
			msg.sender != agreement.rentee.userAddress &&
			msg.sender != agreement.renter.userAddress
		) {
			revert NotAuthorized(msg.sender);
		}
		if (!agreement.isActive) revert AgreementNotActive(agreement.isActive);

		agreement.isActive = false;

		emit AgreementCancelled(_agreementId);

		escrow.refundDeposit(_agreementId);
	}

	function extendRentalPeriod(
		uint256 _agreementId,
		uint256 _additionalPeriod
	) external nonReentrant {
		Agreement storage agreement = agreements[_agreementId];
		if (
			msg.sender != agreement.rentee.userAddress &&
			msg.sender != agreement.renter.userAddress
		) {
			revert NotAuthorized(msg.sender);
		}
		if (!agreement.isActive) revert AgreementNotActive(agreement.isActive);

		agreement.rentalPeriod += _additionalPeriod;

		emit AgreementExtended(_agreementId, agreement.rentalPeriod);
	}

	function updateEscrow(address _escrow) external onlyOwner {
		if (_escrow == address(0)) revert InvalidAddress("escrow");
		escrow = IEscrow(_escrow);
	}

	function updateInspection(address _inspection) external onlyOwner {
		if (_inspection == address(0)) revert InvalidAddress("inspection");
		inspection = IInspection(_inspection);
	}

	function updateReputation(address _reputation) external onlyOwner {
		if (_reputation == address(0)) revert InvalidAddress("reputation");
		reputation = IReputation(_reputation);
	}

	function updateDisputeResolution(
		address _disputeResolution
	) external onlyOwner {
		if (_disputeResolution == address(0))
			revert InvalidAddress("dispute resolution");
		disputeResolution = IDisputeResolution(_disputeResolution);
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
        if (_rentalDAO == address(0)) revert InvalidDAOAddress(_rentalDAO);
        rentalDAO = _rentalDAO;
    }
}
