const { ethers, getNamedAccounts, deployments } = require("hardhat");
const { assert, expect } = require("chai");

describe("Token Farm", () => {
  let tokenFarm, daiToken, dappToken, accounts;
  const token = (n) => ethers.utils.parseEther(n);
  beforeEach(async () => {
    await deployments.fixture("all");
    accounts = await ethers.getSigners();
    tokenFarm = await ethers.getContract("TokenFarm");
    daiToken = await ethers.getContract("DaiToken");
    dappToken = await ethers.getContract("DappToken");
  });

  describe("stake", () => {
    it("should correctly update staking balance", async () => {
      const { investor } = await getNamedAccounts();
      const investorDaiToken = daiToken.connect(accounts[1]);
      const investorTokenFarm = tokenFarm.connect(accounts[1]);

      const approveTx = await investorDaiToken.approve(
        investorTokenFarm.address,
        token("10")
      );
      await approveTx.wait();

      const stakeTx = await investorTokenFarm.stake(token("10"));
      await stakeTx.wait();

      const stakingBalanceOfInvestor = await investorTokenFarm.stakingBalance(
        investor
      );
      const daiTokenBalanceOfInvestor = await investorDaiToken.balanceOf(
        investor
      );
      const daiTokenBalanceOfFarm = await investorDaiToken.balanceOf(
        tokenFarm.address
      );
      assert.equal(ethers.utils.formatEther(stakingBalanceOfInvestor), "10.0");
      assert.equal(ethers.utils.formatEther(daiTokenBalanceOfInvestor), "90.0");
      assert.equal(ethers.utils.formatEther(daiTokenBalanceOfFarm), "10.0");

    });
  });

  describe("unstake", () => {
    it("should update the necessaries", async () => {
      const { investor } = await getNamedAccounts();
      const investorDaiToken = daiToken.connect(accounts[1]);
      const investorTokenFarm = tokenFarm.connect(accounts[1]);

      const approveTx = await investorDaiToken.approve(
        investorTokenFarm.address,
        token("10")
      );
      await approveTx.wait();

      const stakeTx = await investorTokenFarm.stake(token("10"));
      await stakeTx.wait();

      const stakingBalanceBeforeUnstake =
        await investorTokenFarm.stakingBalance(investor);
      const daiTokenBalanceOfInvestorBeforeUnstake =
        await investorDaiToken.balanceOf(investor);

      const daiTokenBalanceOfFarmBeforeUnstake =
        await investorDaiToken.balanceOf(tokenFarm.address);

      const unstakeTx = await investorTokenFarm.unstake();
      await unstakeTx.wait();

      const stakingBalanceAfterUnstake = await investorTokenFarm.stakingBalance(
        investor
      );
      const daiTokenBalanceOfInvestorAfterUnstake =
        await investorDaiToken.balanceOf(investor);

      const daiTokenBalanceOfFarmAfterUnstake =
        await investorDaiToken.balanceOf(tokenFarm.address);

      assert.equal(
        ethers.utils.formatEther(stakingBalanceBeforeUnstake),
        "10.0"
      );
      assert.equal(
        ethers.utils.formatEther(daiTokenBalanceOfInvestorBeforeUnstake),
        "90.0"
      );
      assert.equal(
        ethers.utils.formatEther(daiTokenBalanceOfFarmBeforeUnstake),
        "10.0"
      );
      assert.equal(ethers.utils.formatEther(stakingBalanceAfterUnstake), "0.0");
      assert.equal(
        ethers.utils.formatEther(daiTokenBalanceOfInvestorAfterUnstake),
        "100.0"
      );
      assert.equal(
        ethers.utils.formatEther(daiTokenBalanceOfFarmAfterUnstake),
        "0.0"
      );
    });
  });
});
