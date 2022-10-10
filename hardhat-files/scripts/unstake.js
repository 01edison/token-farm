const { ethers } = require("hardhat");

async function unstake() {
  const accounts = await ethers.getSigners();
  const tokenFarm = await ethers.getContract("TokenFarm");
  const daiToken = await ethers.getContract("DaiToken");

  
}

unstake()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
