// Deployment script for the RealEstatePortfolio contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying RealEstatePortfolio contract...");

  // Get the contract factory
  const RealEstatePortfolio = await hre.ethers.getContractFactory("RealEstatePortfolio");
  
  // Deploy the contract
  const realEstatePortfolio = await RealEstatePortfolio.deploy();

  // Wait for deployment to finish
  await realEstatePortfolio.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await realEstatePortfolio.getAddress();
  console.log("RealEstatePortfolio deployed to:", contractAddress);

  console.log("Deployment completed successfully!");
  
  // Return the contract and its address for testing/frontend integration
  return { realEstatePortfolio, contractAddress };
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 