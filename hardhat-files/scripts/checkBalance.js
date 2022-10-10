const { ethers, getNamedAccounts } = require("hardhat");

async function checkBalance() {
  const { deployer, investor } = await getNamedAccounts();
  const tokenFarm = await ethers.getContract("TokenFarm");
  const dappToken = await ethers.getContract("DappToken");
  const daiToken = await ethers.getContract("DaiToken");

  const balance = await dappToken.balanceOf(tokenFarm.address);
  console.log(ethers.utils.formatUnits(balance, "ether"));
}

checkBalance()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
