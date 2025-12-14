const hre = require("hardhat");

async function main() {
  console.log("Deploying Contract...");

  const Reputation = await hre.ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy();

  await reputation.waitForDeployment();
  const address = await reputation.getAddress();

  console.log("Contract deployed to:", address);
  console.log("\nPlease update your .env file with:");
  console.log(`REPUTATION_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });








