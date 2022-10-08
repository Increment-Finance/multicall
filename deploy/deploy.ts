import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import {
  HardhatRuntimeEnvironment,
  HttpNetworkHDAccountsConfig,
} from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

async function getDeployerWallet(
  hre: HardhatRuntimeEnvironment
): Promise<Deployer> {
  // get mnemonic from hardhat config
  const mnemonic = (<HttpNetworkHDAccountsConfig>(
    hre.config.networks.hardhat.accounts
  )).mnemonic;

  if (!mnemonic) {
    throw new Error("mnemonic not found");
  }
  // get zk wallet from mnemonic
  const wallet = Wallet.fromMnemonic(mnemonic);
  const deployerZk = new Deployer(hre, wallet);
  return deployerZk;
}

async function deployContract(deployer: Deployer, contractName: string) {
  const artifact = await deployer.loadArtifact(contractName);
  const contract = await deployer.deploy(artifact);

  // Show the contract info.
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = await getDeployerWallet(hre);

  await deployContract(deployer, "Multicall", []);
  await deployContract(deployer, "Multicall2", []);
  await deployContract(deployer, "Multicall3", []);
}
