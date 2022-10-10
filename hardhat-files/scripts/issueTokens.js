const { ethers } = require("hardhat");

async function issueTokens() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const tokenFarm = await ethers.getContract("TokenFarm", deployer);

  const tx = await tokenFarm.issueTokens();
  await tx.wait();

  console.log("Tokens issued!");
}

issueTokens()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
