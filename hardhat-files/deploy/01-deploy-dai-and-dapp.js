module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying Dapp token and Mock DAI");

  await deploy("DaiToken", {
    from: deployer,
    args: [],
    log: true,
  });

  log("Dai deployed successfully");

  await deploy("DappToken", {
    from: deployer,
    args: [],
    log: true,
  });

  log("Dapp token deployed successfully");
};

module.exports.tags = ["all", "tokens"];
