# Createing collections and tokens
1. Deploy the AccessRestriction contract (not provided, but assumed to exist for admin management).

2. Deploy the CollectionHierarchy contract:
   - Pass the address of the AccessRestriction contract to the constructor.

3. Create the "car" collection (top-level, admin only):
   - An admin calls `createTopLevelCollection("car", "<car_uri>")`.
   - This creates a new RentalCollection1155 contract for "car" with ID 0.

4. Create the "bmw" collection (second-level, admin only):
   - An admin calls `createSubCollection("bmw", "<bmw_uri>", 0)`.
   - The parentId is 0, referring to the "car" collection.
   - This creates a new RentalCollection1155 contract for "bmw" with ID 1.

5. Create the "m3" collection (third-level, anyone can create):
   - Any user can call `createSubCollection("m3", "<m3_uri>", 1)`.
   - The parentId is 1, referring to the "bmw" collection.
   - This creates a new RentalCollection1155 contract for "m3" with ID 2.

6. Minting tokens:
   - For each collection, users can mint tokens by calling the `mint` function on the respective RentalCollection1155 contract.
   - For example, to mint an "m3" token:
     - Get the address of the "m3" RentalCollection1155 contract from `collections[2].tokenAddress`.
     - Call `mint(recipient_address, amount, data)` on that contract.

Important notes:
- The CollectionHierarchy contract manages the hierarchy and creates new RentalCollection1155 contracts.
- Each collection (car, bmw, m3) is a separate RentalCollection1155 contract.
- The hierarchy is maintained in the CollectionHierarchy contract using the `collections` mapping.
- Only admins can create top-level and second-level collections.
- Anyone can create third-level collections.
- Minting is unrestricted in the current implementation. If you want to restrict minting, you'll need to add access control to the `mint` function in RentalCollection1155.


# Creating users


# Working with rentalAggrement







1. create the home or car as an NFT.

home page:
1. see the we need to see list of categoris. 
2. user will choose one of them.
3. user can filter things on the categoris based on x parameters.

admin create a list of collection (car)
admin will create (pride and bmw) with calling mint function

# IFPS structure
for each tokenId in IPFS we can have different tokenId


registeration process
in rentalAggrement onlyScrpt will call addUser 

rentee will call createAgreement
renter will call ArrivalAgreement


renter
4. map should be as a botton that user with pressing it will see list of renting things in their selected region.

my rentees

rentee
rentee need to create or mint something with calling the mint function in the RentalCollection1155 contract. 

add the collectino to the rentalAggrement.

then rentee will call createAgreement will pass	address _renter, uint256 _tokenId, uint256 _rentalPeriod, uint256 _cost, uint256 _deposit