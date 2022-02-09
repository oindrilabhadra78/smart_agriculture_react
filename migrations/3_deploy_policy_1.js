//truffle migrate -f 3 --to 3

var FarmerContract = artifacts.require("./FarmerContract.sol");
var StorePolicy = artifacts.require("./StorePolicy.sol");
var Policy_1 = artifacts.require("./Policy_1.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Policy_1, FarmerContract.address, StorePolicy.address);
};
