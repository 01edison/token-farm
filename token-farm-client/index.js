import { ethers } from "./ethers.esm.min.js";
import {
  tokenFarmAbi,
  tokenFarmAddress,
  dappTokenAbi,
  dappTokenAddress,
  daiTokenAbi,
  daiTokenAddress,
} from "./constants.js";

const connectBtn = document.getElementById("connectButton");
const stakeBtn = document.getElementById("stakeBtn");
const unstakeBtn = document.getElementById("unstakeBtn");
const account = document.querySelector("#account");
const stakingBalanceTag = document.getElementById("stakingBalance");
const dappTokenBalanceTag = document.getElementById("dappTokenBalance");
const daiTokenBalanceTag = document.getElementById("daiTokenBalance");
const stakeInput = document.getElementById("stakeInput");
let currentStakeValue;
let accountAddress;
let daiTokenBalance,
  dappTokenBalance,
  stakingBalance,
  tokenFarm,
  daiToken,
  dappToken;
let loading = false;

connectBtn.addEventListener("click", connect);
setInterval(() => {
  connect();
  getUserData();
}, 200);

stakeBtn.addEventListener("click", stake);
unstakeBtn.addEventListener("click", unstake);
async function tokenFromWei(n) {
  return ethers.utils.formatEther(n);
}

stakeInput.addEventListener("keyup", (e) => {
  currentStakeValue = e.target.value;
});

async function tokenToWei(n) {
  return ethers.utils.parseEther(n);
}

async function connect() {
  if (typeof window.ethereum != undefined) {
    try {
      await ethereum.request({
        method: "eth_requestAccounts",
      });
      connectBtn.innerHTML = "Connected";
      getProviderOrSigner();
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("Please Install metamask");
  }
}

async function getProviderOrSigner(needSigner = false) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    accountAddress = await provider.getSigner().getAddress();
    account.innerHTML = accountAddress;
    if (needSigner) {
      const signer = provider.getSigner();
      return signer;
    }
  } catch (e) {
    console.log(e);
  }
}

async function getContract(address, abi) {
  const signer = await getProviderOrSigner(true);
  const contract = new ethers.Contract(address, abi, signer);

  return contract;
}
async function getUserData() {
  try {
    tokenFarm = await getContract(tokenFarmAddress, tokenFarmAbi);
    daiToken = await getContract(daiTokenAddress, daiTokenAbi);
    dappToken = await getContract(dappTokenAddress, dappTokenAbi);

    const daiTokenBalanceInWei = await daiToken.balanceOf(accountAddress);
    const dappTokenBalanceInWei = await dappToken.balanceOf(accountAddress);
    const stakingBalanceInWei = await tokenFarm.stakingBalance(accountAddress);

    daiTokenBalance = await tokenFromWei(daiTokenBalanceInWei);
    dappTokenBalance = await tokenFromWei(dappTokenBalanceInWei);
    stakingBalance = await tokenFromWei(stakingBalanceInWei);

    // console.log(daiTokenBalance, dappTokenBalance, stakingBalance);
    stakingBalanceTag.innerHTML = `${stakingBalance} mDai`;
    dappTokenBalanceTag.innerHTML = `${dappTokenBalance}`;
    daiTokenBalanceTag.innerHTML = `${daiTokenBalance} DAI`;
  } catch (e) {
    console.log(e);
  }
}

async function stake(e) {
  e.preventDefault();
  console.log(currentStakeValue);
  if (currentStakeValue != "" && currentStakeValue != undefined) {
    try {
      const approveTx = await daiToken.approve(
        tokenFarm.address,
        tokenToWei(`${currentStakeValue}`)
      );
      await approveTx.wait();
      const tx = await tokenFarm.stake(tokenToWei(`${currentStakeValue}`));
      await tx.wait();
      stakeInput.value = ""
    } catch (e) {
      console.log(e);
    }
  }
}

async function unstake(e) {
  e.preventDefault();

  try {
    const tx = await tokenFarm.unstake();
    await tx.wait();
  } catch (e) {
    console.log(e);
  }
}
