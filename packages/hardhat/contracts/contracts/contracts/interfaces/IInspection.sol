// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title IInspection - Interface for the Inspection contract
/// @notice Interface for conducting and recording item inspections
interface IInspection {
	event ItemInspected(uint256 agreementId, bool passed);

	/// @notice Inspects an item and records the result
	/// @param _agreementId The ID of the agreement for which the item is being inspected
	/// @return A boolean indicating whether the item passed inspection
	function inspectItem(uint256 _agreementId) external returns (bool);

	/// @notice Retrieves the inspection result for a given agreement
	/// @param _agreementId The ID of the agreement to query
	/// @return A boolean indicating whether the item passed inspection
	function inspectionResults(
		uint256 _agreementId
	) external view returns (bool);
}
