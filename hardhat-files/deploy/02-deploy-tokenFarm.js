const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer, investor } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const dappToken = await ethers.getContract("DappToken");
  const daiToken = await ethers.getContract("DaiToken");

  const token = (n) => ethers.utils.parseEther(n);

  await deploy("TokenFarm", {
    from: deployer,
    args: [daiToken.address, dappToken.address],
    log: true,
  });

  log("Token Farm deployed successfully");

  const tokenFarm = await ethers.getContract("TokenFarm");
  const transferTx = await dappToken.transfer(
    tokenFarm.address,
    token("1000000")
  );
  await transferTx.wait();
  const transferTx2 = await daiToken.transfer(investor, token("100"));
  await transferTx2.wait();
};

module.exports.tags = ["all", "tokenFarm"];
