```
change require to if condition to make the gass less.
e.g:
Using require:

require(balance >= amount, "Insufficient balance");

to Using if with custom error:

error InsufficientBalance(uint256 available, uint256 required);

if (balance < amount) {
    revert InsufficientBalance(balance, amount);
}
```

DAO
AI
ERC1155
Natspec
Test
Deploy
Code Cleaning

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { ERC1155Holder, ERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";