// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RealEstatePortfolio
 * @dev Contract for managing a portfolio of real estate properties as NFTs
 */
contract RealEstatePortfolio is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Property struct to store detailed information about each property
    struct Property {
        string propertyAddress;
        uint256 purchasePrice;
        uint256 currentValue;
        uint256 squareFootage;
        string propertyType; // Residential, Commercial, Industrial, etc.
        uint256 yearBuilt;
        bool isRented;
        uint256 rentalIncome;
        string additionalDetails;
        uint256 lastUpdated;
    }

    // Mapping from token ID to Property
    mapping(uint256 => Property) public properties;
    
    // Events
    event PropertyRegistered(uint256 indexed tokenId, address indexed owner, string propertyAddress);
    event PropertyUpdated(uint256 indexed tokenId, uint256 currentValue, bool isRented);
    event PropertyRented(uint256 indexed tokenId, uint256 rentalIncome);
    event PropertySold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 salePrice);

    constructor() ERC721("Real Estate Portfolio", "REP") Ownable(msg.sender) {}

    /**
     * @dev Registers a new property in the portfolio
     * @param to The address that will own the property
     * @param propertyAddress Physical address of the property
     * @param purchasePrice Purchase price of the property
     * @param currentValue Current estimated value of the property
     * @param squareFootage Size of the property in square feet
     * @param propertyType Type of property (Residential, Commercial, etc.)
     * @param yearBuilt Year the property was built
     * @param tokenURI URI for property metadata (including images, documents)
     * @param additionalDetails Additional details or notes about the property
     * @return The ID of the newly registered property
     */
    function registerProperty(
        address to,
        string memory propertyAddress,
        uint256 purchasePrice,
        uint256 currentValue,
        uint256 squareFootage,
        string memory propertyType,
        uint256 yearBuilt,
        string memory tokenURI,
        string memory additionalDetails
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        properties[newTokenId] = Property({
            propertyAddress: propertyAddress,
            purchasePrice: purchasePrice,
            currentValue: currentValue,
            squareFootage: squareFootage,
            propertyType: propertyType,
            yearBuilt: yearBuilt,
            isRented: false,
            rentalIncome: 0,
            additionalDetails: additionalDetails,
            lastUpdated: block.timestamp
        });

        emit PropertyRegistered(newTokenId, to, propertyAddress);
        return newTokenId;
    }

    /**
     * @dev Updates property information
     * @param tokenId ID of the property to update
     * @param currentValue New estimated value of the property
     * @param additionalDetails Updated additional details
     */
    function updateProperty(
        uint256 tokenId,
        uint256 currentValue,
        string memory additionalDetails
    ) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized to update property");
        
        Property storage property = properties[tokenId];
        property.currentValue = currentValue;
        property.additionalDetails = additionalDetails;
        property.lastUpdated = block.timestamp;

        emit PropertyUpdated(tokenId, currentValue, property.isRented);
    }

    /**
     * @dev Sets rental status for a property
     * @param tokenId ID of the property
     * @param isRented Boolean indicating if property is rented
     * @param rentalIncome Monthly rental income (if applicable)
     */
    function setRentalStatus(
        uint256 tokenId,
        bool isRented,
        uint256 rentalIncome
    ) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized to update property");
        
        Property storage property = properties[tokenId];
        property.isRented = isRented;
        property.rentalIncome = rentalIncome;
        property.lastUpdated = block.timestamp;

        emit PropertyRented(tokenId, rentalIncome);
    }

    /**
     * @dev Get all details for a property
     * @param tokenId ID of the property
     * @return Property details
     */
    function getPropertyDetails(uint256 tokenId) public view returns (Property memory) {
        require(_exists(tokenId), "Property does not exist");
        return properties[tokenId];
    }

    /**
     * @dev Override transfer function to record property sales
     */
    function transferFrom(address from, address to, uint256 tokenId) public override {
        super.transferFrom(from, to, tokenId);
        emit PropertySold(tokenId, from, to, properties[tokenId].currentValue);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        super.safeTransferFrom(from, to, tokenId);
        emit PropertySold(tokenId, from, to, properties[tokenId].currentValue);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        super.safeTransferFrom(from, to, tokenId, data);
        emit PropertySold(tokenId, from, to, properties[tokenId].currentValue);
    }
} 