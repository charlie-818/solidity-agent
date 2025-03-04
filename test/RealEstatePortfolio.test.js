const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstatePortfolio", function () {
  let realEstatePortfolio;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    // Get contract factories and signers
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy contract
    const RealEstatePortfolio = await ethers.getContractFactory("RealEstatePortfolio");
    realEstatePortfolio = await RealEstatePortfolio.deploy();
    await realEstatePortfolio.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await realEstatePortfolio.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await realEstatePortfolio.name()).to.equal("Real Estate Portfolio");
      expect(await realEstatePortfolio.symbol()).to.equal("REP");
    });
  });

  describe("Property Registration", function () {
    it("Should allow owner to register a property", async function () {
      // Register a property
      const tx = await realEstatePortfolio.registerProperty(
        addr1.address,
        "123 Main St, City, State, Zip",
        500000, // Purchase price
        550000, // Current value
        2000, // Square footage
        "Residential",
        2010, // Year built
        "ipfs://QmHash", // Token URI
        "3 bed, 2 bath" // Additional details
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Find the PropertyRegistered event
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "PropertyRegistered"
      );
      
      // Get the tokenId from the event
      const tokenId = event.args[0];
      
      // Check property ownership
      expect(await realEstatePortfolio.ownerOf(tokenId)).to.equal(addr1.address);
      
      // Check property details
      const property = await realEstatePortfolio.getPropertyDetails(tokenId);
      expect(property.propertyAddress).to.equal("123 Main St, City, State, Zip");
      expect(property.purchasePrice).to.equal(500000);
      expect(property.currentValue).to.equal(550000);
      expect(property.propertyType).to.equal("Residential");
      expect(property.isRented).to.equal(false);
    });

    it("Should prevent non-owners from registering properties", async function () {
      // Try to register a property as non-owner
      await expect(
        realEstatePortfolio.connect(addr1).registerProperty(
          addr1.address,
          "456 Oak St, City, State, Zip",
          400000,
          420000,
          1800,
          "Residential",
          2005,
          "ipfs://QmHash2",
          "2 bed, 2 bath"
        )
      ).to.be.revertedWithCustomError(realEstatePortfolio, "OwnableUnauthorizedAccount");
    });
  });

  describe("Property Management", function () {
    let tokenId;

    beforeEach(async function () {
      // Register a property
      const tx = await realEstatePortfolio.registerProperty(
        addr1.address,
        "123 Main St, City, State, Zip",
        500000,
        550000,
        2000,
        "Residential",
        2010,
        "ipfs://QmHash",
        "3 bed, 2 bath"
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "PropertyRegistered"
      );
      tokenId = event.args[0];
    });

    it("Should allow property owner to update property details", async function () {
      // Update property as property owner
      await realEstatePortfolio.connect(addr1).updateProperty(
        tokenId,
        600000, // New current value
        "3 bed, 2 bath, newly renovated" // Updated details
      );
      
      // Check updated property details
      const property = await realEstatePortfolio.getPropertyDetails(tokenId);
      expect(property.currentValue).to.equal(600000);
      expect(property.additionalDetails).to.equal("3 bed, 2 bath, newly renovated");
    });

    it("Should allow setting rental status", async function () {
      // Set property as rented
      await realEstatePortfolio.connect(addr1).setRentalStatus(
        tokenId,
        true, // Is rented
        2500 // Rental income
      );
      
      // Check rental status
      const property = await realEstatePortfolio.getPropertyDetails(tokenId);
      expect(property.isRented).to.equal(true);
      expect(property.rentalIncome).to.equal(2500);
    });

    it("Should allow property transfer and emit PropertySold event", async function () {
      // Approve transfer
      await realEstatePortfolio.connect(addr1).approve(owner.address, tokenId);
      
      // Transfer property
      await expect(
        realEstatePortfolio.connect(owner).transferFrom(addr1.address, addr2.address, tokenId)
      )
        .to.emit(realEstatePortfolio, "PropertySold")
        .withArgs(tokenId, addr1.address, addr2.address, 550000);
      
      // Check new owner
      expect(await realEstatePortfolio.ownerOf(tokenId)).to.equal(addr2.address);
    });
  });
}); 