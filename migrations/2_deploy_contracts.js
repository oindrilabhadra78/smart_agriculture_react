var Roles = artifacts.require("./Roles.sol");
var FarmerContract = artifacts.require("./FarmerContract.sol");
var DistributorContract = artifacts.require("./DistributorContract");
var RetailerContract = artifacts.require("./RetailerContract");
var ConsumerContract = artifacts.require("./ConsumerContract");
var ColdStorageContract = artifacts.require("./ColdStorageContract.sol");
var GovernmentContract = artifacts.require("./GovernmentContract.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");
var SupplyChain2 = artifacts.require("./SupplyChain2.sol");
var DistanceOptimizer = artifacts.require("./DistanceOptimizer.sol");
var StorePolicy = artifacts.require("./StorePolicy.sol");
var PolicyContract = artifacts.require("./PolicyContract.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Roles);
  await deployer.deploy(FarmerContract, Roles.address);
  await deployer.deploy(DistributorContract, Roles.address);
  await deployer.deploy(RetailerContract, Roles.address);
  await deployer.deploy(ConsumerContract, Roles.address);
  await deployer.deploy(ColdStorageContract, Roles.address);

  await deployer.deploy(
    GovernmentContract, 
    Roles.address, 
    FarmerContract.address, 
    DistributorContract.address, 
    RetailerContract.address,
    ColdStorageContract.address
    );

  await deployer.deploy(
    SupplyChain,
    Roles.address
    );

  await deployer.deploy(
    SupplyChain2,
    Roles.address,
    SupplyChain.address,
    FarmerContract.address
    );

  await deployer.deploy(
    DistanceOptimizer,
    Roles.address,
    FarmerContract.address,
    DistributorContract.address,
    RetailerContract.address,
    ColdStorageContract.address
    );

  await deployer.deploy(StorePolicy);

  await deployer.deploy(
    PolicyContract,
    StorePolicy.address,
    Roles.address
    );
};
