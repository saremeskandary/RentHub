// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ICommonErrors } from "./ICommonErrors.sol";

interface IRentalCollection1155 is ICommonErrors {
	error DuplicateCollectionName();

	function name() external view returns (string memory);

	function symbol() external view returns (string memory);

	function mint(address account, uint256 amount, bytes memory data) external;

	function mintBatch(
		address to,
		uint256[] memory ids,
		uint256[] memory amounts,
		bytes memory data
	) external;

	function burn(address account, uint256 id, uint256 amount) external;

	function burnBatch(
		address account,
		uint256[] memory ids,
		uint256[] memory amounts
	) external;
}
