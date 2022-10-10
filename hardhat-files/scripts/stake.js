const { ethers, getNamedAccounts } = require("hardhat");

async function stake() {
  const { investor } = await getNamedAccounts();
  const accounts = await ethers.getSigners();
  const daiToken = await ethers.getContract("DaiToken");
  const tokenFarm = await ethers.getContract("TokenFarm");
  const token = (n) => ethers.utils.parseEther(n);

  const investorDaiToken = daiToken.connect(accounts[1]);
  const investorTokenFarm = tokenFarm.connect(accounts[1]);

  const approveTx = await investorDaiToken.approve(
    investorTokenFarm.address,
    token("10")
  );

  await approveTx.wait();
  const stakeTx = await investorTokenFarm.stake(token("10"));
  await stakeTx.wait();

  console.log((await investorTokenFarm.stakingBalance(investor)).toString());
  console.log(await investorTokenFarm.stakers(0));
}

stake()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
