// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IUserIdentity } from "./interfaces/IUserIdentity.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { IInspection } from "./interfaces/IInspection.sol";
import { ISocialFi } from "./interfaces/ISocialFi.sol";
import { IDisputeResolution } from "./interfaces/IDisputeResolution.sol";
import { IRentalAgreement } from "./interfaces/IRentalAgreement.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

contract RentalAgreement is IRentalAgreement {
	using SafeERC20 for IERC20;

	mapping(address => User) public users;
	mapping(uint256 => Agreement) public agreements;
	mapping(uint256 => Asset) public assets;
	uint256 public agreementCounter;

	IERC20 public token;

	IEscrow public escrow;
	IInspection public inspection;
	IDisputeResolution public disputeResolution;
	ISocialFi public socialFi;
	IUserIdentity public userIdentity;
	IAccessRestriction public accessRestriction;

	modifier onlyVerifiedUser(address _user) {
		if (_user == address(0) || !userIdentity.isVerifiedUser(_user)) {
			revert UserNotVerified(_user);
		}
		_;
	}

	constructor(
		IERC20 _token,
		address _escrow,
		address _inspection,
		address _disputeResolution,
		address _socialFi,
		address _userIdentity
	) {
		// Pass msg.sender to Ownable constructor
		if (_escrow == address(0)) revert InvalidAddress("escrow");
		if (_inspection == address(0)) revert InvalidAddress("inspection");
		if (_disputeResolution == address(0))
			revert InvalidAddress("disputeResolution");
		if (_socialFi == address(0)) revert InvalidAddress("socialFi");
		if (_userIdentity == address(0)) revert InvalidAddress("userIdentity");
		token = _token;
		escrow = IEscrow(_escrow);
		inspection = IInspection(_inspection);
		disputeResolution = IDisputeResolution(_disputeResolution);
		socialFi = ISocialFi(_socialFi);
		userIdentity = IUserIdentity(_userIdentity);
	}

	/**
	 * @dev Modifier to restrict access to the owner.
	 */
	modifier onlyOwner() {
		accessRestriction.ifOwner(msg.sender);
		_;
	}

	function createAgreement(
		address _renter,
		uint256 _tokenId,
		uint256 _rentalPeriod,
		uint256 _cost,
		uint256 _deposit
	)
		external
		onlyVerifiedUser(msg.sender)
		onlyVerifiedUser(_renter)
		returns (uint256)
	{
		if (_cost <= 0) revert MustBeGraterThanZero("cost");
		if (_deposit <= 0) revert MustBeGraterThanZero("deposit");
		if (_rentalPeriod <= 0) revert MustBeGraterThanZero("rentalPeriod");

		Asset storage asset = assets[_tokenId];
		if (!asset.isActive) revert AssetIsNotActive();

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

		uint256 totalAmount = agreement.cost + agreement.deposit;

		if (IERC20(token).balanceOf(msg.sender) < totalAmount)
			revert InsufficientBalance(
				IERC20(token).balanceOf(msg.sender),
				totalAmount
			);
		if (!agreement.asset.isActive) revert AssetIsNotActive();

		// Lock funds in the Escrow
		escrow.lockFunds(_agreementId, agreement.cost, agreement.deposit);

		agreement.asset.timesRented++;
		agreement.renter = users[msg.sender];
		agreement.startTime = block.timestamp;
		agreement.status = AgreementStatus.REQUESTED;

		emit ArrivalAgreementEvent(
			_agreementId,
			agreement.rentee.userAddress,
			agreement.renter.userAddress,
			block.timestamp
		);
	}

	function completeAgreement(uint256 _agreementId) external {
		Agreement storage agreement = agreements[_agreementId];
		if (
			msg.sender != agreement.rentee.userAddress &&
			msg.sender != agreement.renter.userAddress
		) {
			revert NotAuthorized();
		}
		if (agreement.status != AgreementStatus.STARTED)
			revert AgreementNotActive();
		if (block.timestamp <= agreement.startTime + agreement.rentalPeriod)
			revert RentalPeriodNotOver(
				block.timestamp,
				agreement.startTime + agreement.rentalPeriod
			);

		bool isItemInGoodCondition = inspection.inspectItem(_agreementId);
		if (!isItemInGoodCondition)
			revert InspectionFailed(
				isItemInGoodCondition,
				agreement.rentee.userAddress,
				agreement.renter.userAddress
			);

		agreement.status = AgreementStatus.COMPLETED;

		socialFi.rewardUser(agreement.rentee.userAddress, 100);
		socialFi.rewardUser(agreement.renter.userAddress, 100);

		escrow.distributeRevenue(
			_agreementId,
			agreement.deposit,
			agreement.cost,
			agreement.rentee.userAddress,
			agreement.renter.userAddress
		);

		emit AgreementCompleted(_agreementId);

		escrow.refundDeposit(
			_agreementId,
			agreement.deposit,
			agreement.cost,
			agreement.rentee.userAddress,
			agreement.renter.userAddress
		);
	}

	function cancelAgreement(uint256 _agreementId) external {
		Agreement storage agreement = agreements[_agreementId];
		if (msg.sender != agreement.renter.userAddress) {
			revert NotAuthorized();
		}
		if (agreement.status != AgreementStatus.STARTED)
			revert AgreementNotActive();

		agreement.status = AgreementStatus.CANCELLED;

		emit AgreementCancelled(_agreementId);

		escrow.refundDeposit(
			_agreementId,
			agreement.deposit,
			agreement.cost,
			agreement.rentee.userAddress,
			agreement.renter.userAddress
		);
	}

	function raiseDispute(uint256 _agreementId) external {
		Agreement storage agreement = agreements[_agreementId];
		if (
			msg.sender != agreement.rentee.userAddress &&
			msg.sender != agreement.renter.userAddress
		) revert NotAuthorized();

		if (agreement.status != AgreementStatus.STARTED)
			revert AgreementNotActive();

		emit DisputeRaised(_agreementId);

		disputeResolution.initiateDispute(_agreementId);
	}

	function extendRentalPeriodRentee(
		uint256 _agreementId,
		uint256 _additionalPeriod,
		uint256 _newCost
	) external {
		Agreement storage agreement = agreements[_agreementId];
		if (msg.sender != agreement.rentee.userAddress) {
			revert NotAuthorized();
		}
		if (agreement.status != AgreementStatus.STARTED) {
			revert AgreementNotActive();
		}

		agreement.rentalPeriod += _additionalPeriod;
		agreement.cost = _newCost;

		emit AgreementExtendedRentee(
			_agreementId,
			agreement.rentalPeriod,
			_newCost
		);
	}

	function extendRentalPeriodRenter(
		uint256 _agreementId,
		uint256 _additionalPeriod
	) external {
		Agreement storage agreement = agreements[_agreementId];
		if (msg.sender != agreement.renter.userAddress) {
			revert NotAuthorized();
		}
		if (agreement.status != AgreementStatus.STARTED) {
			revert AgreementNotActive();
		}

		agreement.rentalPeriod += _additionalPeriod;

		emit AgreementExtendedRenter(_agreementId, agreement.rentalPeriod);
	}

	function getAgreementParties(
		uint256 _agreementId
	) external view returns (address rentee, address renter) {}
}
