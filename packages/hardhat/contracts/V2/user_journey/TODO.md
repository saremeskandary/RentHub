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
