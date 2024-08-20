// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { IInspection } from "./interfaces/IInspection.sol";
import { ISocialFi } from "./interfaces/ISocialFi.sol";
import { IDisputeResolution } from "./interfaces/IDisputeResolution.sol";
import { IRentalAgreement } from "./interfaces/IRentalAgreement.sol";
import { IAccessRestriction } from "./interfaces/IAccessRestriction.sol";

import "hardhat/console.sol";

contract RentalAgreement is IRentalAgreement {
	using SafeERC20 for IERC20;

	bytes32 public constant VERFIED_USER_ROLE = keccak256("VERFIED_USER_ROLE");

	mapping(address => User) public users;
	mapping(uint256 => Agreement) public agreements;
	mapping(address => mapping(uint256 => Asset))
		public
		override rentalAsset1155s;
	uint256 public agreementCounter;

	IERC20 public token;

	IEscrow public escrow;
	IInspection public inspection;
	IDisputeResolution public disputeResolution;
	ISocialFi public socialFi;
	IAccessRestriction public accessRestriction;

	modifier onlyVerifiedUser(address _user) {
		if (!accessRestriction.isVerifiedUser(_user))
			revert NotVerifiedUser(_user);
		_;
	}

	constructor(
		address _token,
		address _escrow,
		address _inspection,
		address _disputeResolution,
		address _socialFi,
		address _accessRestriction
	) {
		// Pass msg.sender to Ownable constructor
		if (_escrow == address(0)) revert InvalidAddress("escrow");
		if (_inspection == address(0)) revert InvalidAddress("inspection");
		if (_disputeResolution == address(0))
			revert InvalidAddress("disputeResolution");
		if (_socialFi == address(0)) revert InvalidAddress("socialFi");
		if (_accessRestriction == address(0))
			revert InvalidAddress("accessRestriction");
		token = IERC20(_token);
		escrow = IEscrow(_escrow);
		inspection = IInspection(_inspection);
		disputeResolution = IDisputeResolution(_disputeResolution);
		socialFi = ISocialFi(_socialFi);
		accessRestriction = IAccessRestriction(_accessRestriction);
	}

	/**
	 * @dev Modifier to restrict access to the owner.
	 */
	modifier onlyOwner() {
		accessRestriction.ifOwner(msg.sender);
		_;
	}

	modifier onlyAdmin() {
		if (!accessRestriction.isAdmin(msg.sender)) revert NotAdmin(msg.sender);
		_;
	}

	function setRentalAsset1155(
		address _collection,
		uint256 _tokenId,
		bool _isActive
	) external override onlyAdmin {
		if (_collection == address(0)) revert InvalidAddress("collection");
		Asset storage asset = rentalAsset1155s[_collection][_tokenId];
		asset.isActive = _isActive;
		// Emit an event upon successful validation status update.
		emit RentalAsset1155Added(_collection, _tokenId, _isActive);
	}

	function addUser(address _user) external override onlyAdmin {
		if (_user == address(0)) revert InvalidAddress("user");

		users[_user] = User({
			userAddress: _user,
			validationTime: 0,
			isValidated: true,
			reputationScore: 0,
			joinTime: block.timestamp
		});

		// accessRestriction.grantRole(VERFIED_USER_ROLE, _user);
		emit UserAdded(_user);
	}

	function createAgreement(
		// address _renter,
		address _collection,
		uint256 _tokenId,
		uint256 _rentalPeriod,
		uint256 _cost,
		uint256 _deposit
	)
		external
		onlyVerifiedUser(msg.sender)
		returns (
			// onlyVerifiedUser(_renter)
			uint256
		)
	{
		if (_cost <= 0) revert MustBeGraterThanZero("cost");
		if (_deposit <= 0) revert MustBeGraterThanZero("deposit");
		if (_rentalPeriod <= 0) revert MustBeGraterThanZero("rentalPeriod");

		Asset storage asset = rentalAsset1155s[_collection][_tokenId];
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

		emit AgreementCreated(
			agreementCounter,
			_collection,
			_tokenId,
			msg.sender,
			address(0) //_renter
		);

		return agreementCounter;
	}

	function ArrivalAgreement(
		uint256 _agreementId
	) external onlyVerifiedUser(msg.sender) {
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

		// console.log(asset.isActive);
		// Lock funds in the Escrow
		escrow.lockFunds(
			msg.sender,
			_agreementId,
			agreement.cost,
			agreement.deposit
		);

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
