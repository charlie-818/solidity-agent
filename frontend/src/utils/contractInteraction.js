import { ethers } from 'ethers';
import RealEstatePortfolioABI from '../contracts/RealEstatePortfolio.json';

/**
 * Class to handle interaction with the RealEstatePortfolio smart contract
 */
class ContractInteraction {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the contract connection
   * @param {string} contractAddress - The address of the deployed contract
   * @returns {boolean} - Whether initialization was successful
   */
  async initialize(contractAddress) {
    try {
      // Check if ethereum is available (MetaMask or other provider)
      if (window.ethereum) {
        // Connect to the Ethereum provider
        this.provider = new ethers.BrowserProvider(window.ethereum);
        
        // Get the signer (user's account)
        this.signer = await this.provider.getSigner();
        
        // Store the contract address
        this.contractAddress = contractAddress;
        
        // Create a contract instance
        this.contract = new ethers.Contract(
          contractAddress,
          RealEstatePortfolioABI.abi,
          this.signer
        );
        
        this.isInitialized = true;
        return true;
      } else {
        console.error('Ethereum provider not found. Please install MetaMask or another wallet.');
        return false;
      }
    } catch (error) {
      console.error('Error initializing contract:', error);
      return false;
    }
  }

  /**
   * Register a new property in the portfolio
   * @param {Object} propertyData - The property data
   * @returns {Object} - Transaction receipt or error
   */
  async registerProperty(propertyData) {
    if (!this.isInitialized) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }

    try {
      const tx = await this.contract.registerProperty(
        propertyData.ownerAddress,
        propertyData.propertyAddress,
        propertyData.purchasePrice,
        propertyData.currentValue,
        propertyData.squareFootage,
        propertyData.propertyType,
        propertyData.yearBuilt,
        propertyData.tokenURI,
        propertyData.additionalDetails
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Parse the PropertyRegistered event to get the tokenId
      const event = receipt.logs.find(
        (log) => {
          try {
            return this.contract.interface.parseLog(log).name === 'PropertyRegistered';
          } catch (e) {
            return false;
          }
        }
      );
      
      if (event) {
        const parsedEvent = this.contract.interface.parseLog(event);
        const tokenId = parsedEvent.args[0];
        return { success: true, tokenId, receipt };
      }
      
      return { success: true, receipt };
    } catch (error) {
      console.error('Error registering property:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all details for a property
   * @param {number} tokenId - The token ID of the property
   * @returns {Object} - Property details
   */
  async getPropertyDetails(tokenId) {
    if (!this.isInitialized) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }

    try {
      const property = await this.contract.getPropertyDetails(tokenId);
      return {
        success: true,
        property: {
          propertyAddress: property.propertyAddress,
          purchasePrice: ethers.formatUnits(property.purchasePrice, 0),
          currentValue: ethers.formatUnits(property.currentValue, 0),
          squareFootage: ethers.formatUnits(property.squareFootage, 0),
          propertyType: property.propertyType,
          yearBuilt: ethers.formatUnits(property.yearBuilt, 0),
          isRented: property.isRented,
          rentalIncome: ethers.formatUnits(property.rentalIncome, 0),
          additionalDetails: property.additionalDetails,
          lastUpdated: new Date(Number(property.lastUpdated) * 1000).toLocaleString()
        }
      };
    } catch (error) {
      console.error('Error getting property details:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update property information
   * @param {number} tokenId - The token ID of the property
   * @param {number} currentValue - New estimated value
   * @param {string} additionalDetails - Updated details
   * @returns {Object} - Transaction receipt or error
   */
  async updateProperty(tokenId, currentValue, additionalDetails) {
    if (!this.isInitialized) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }

    try {
      const tx = await this.contract.updateProperty(
        tokenId,
        currentValue,
        additionalDetails
      );
      
      const receipt = await tx.wait();
      return { success: true, receipt };
    } catch (error) {
      console.error('Error updating property:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Set rental status for a property
   * @param {number} tokenId - The token ID of the property
   * @param {boolean} isRented - Is the property rented
   * @param {number} rentalIncome - Monthly rental income
   * @returns {Object} - Transaction receipt or error
   */
  async setRentalStatus(tokenId, isRented, rentalIncome) {
    if (!this.isInitialized) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }

    try {
      const tx = await this.contract.setRentalStatus(
        tokenId,
        isRented,
        rentalIncome
      );
      
      const receipt = await tx.wait();
      return { success: true, receipt };
    } catch (error) {
      console.error('Error setting rental status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Transfer property ownership
   * @param {number} tokenId - The token ID of the property
   * @param {string} toAddress - Address to transfer to
   * @returns {Object} - Transaction receipt or error
   */
  async transferProperty(tokenId, toAddress) {
    if (!this.isInitialized) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }

    try {
      const tx = await this.contract.transferFrom(
        await this.signer.getAddress(),
        toAddress,
        tokenId
      );
      
      const receipt = await tx.wait();
      return { success: true, receipt };
    } catch (error) {
      console.error('Error transferring property:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get the connected wallet address
   * @returns {string} - The connected wallet address
   */
  async getConnectedAddress() {
    if (!this.isInitialized) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }
    
    return await this.signer.getAddress();
  }
}

// Export a singleton instance
const contractInteraction = new ContractInteraction();
export default contractInteraction; 