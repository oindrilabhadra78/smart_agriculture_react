## Smart Agriculture Using Blockchain

### Command for Migration of Smart Contracts:

```
truffle migrate --reset
```

### Command to Run the React App

```
npm run start
```

### Configuring Hyperledger Caliper

#### Install Hyperledger Caliper
```
npm install --only=prod @hyperledger/caliper-cli@0.4.0
```
Install <code>docker</code> and <code>docker-compose</code>

[Reference](https://hyperledger.github.io/caliper/v0.4.2/installing-caliper/)

#### Configure benchmark and network files

- Run ganache-cli.

- Go to the client folder.

- Create the folders “benchmarks” and “networks”.

- In the “networks” folder -
  - Copy all the contents from https://github.com/hyperledger/caliper-benchmarks/tree/main/networks/ethereum/1node-clique directory.
  - Change the <code>networks/ethereum/1node-clique/networkconfig.json</code> file. In “ethereum”:
      - Change to the correct “url” port number
      - Change “contractDeployerAddress”, “fromAddress” to any of the addresses in ganache-cli
      - Change “contractDeployerAddressPrivateKey” to private key of that address in ganache
      - “contractDeployerAddressPassword”: “”
      - “fromAddressPassword”: “” ([Reference](https://hyperledger.github.io/caliper/v0.3.2/ethereum-config/#connection-profile-example))

- In “benchmarks” folder -
  - Add config.yaml file.
  - Change the arguments, module in workload according to requirements.
  - Tests will be done by altering the txNumber and tps.
  - Add readAsset.js file ([Reference](https://hyperledger.github.io/caliper/v0.4.2/fabric-tutorial/tutorials-fabric-existing/#the-complete-workload-module))

- In the json files created after truffle migrate -
  - Add the field “gas”: 6721975 (or any other suitable value)
  - Change the “contractName” field to “name” ([Reference](https://hyperledger.github.io/caliper/v0.3.2/ethereum-config/#contract-definition-file))

[Reference](https://hyperledger.github.io/caliper/v0.4.2/fabric-tutorial/tutorials-fabric-existing/)

### Command to Find Hyperledger Caliper Benchmark Results:
Go to the client folder.

#### Write operation

```
npx caliper launch manager --caliper-workspace . --caliper-benchconfig benchmarks/config.yaml --caliper-networkconfig networks/networkconfig.json --caliper-observer benchmarks/readAsset.js
```

#### Read operation

```
npx caliper launch manager --caliper-workspace . --caliper-benchconfig benchmarks/config2.yaml --caliper-networkconfig networks/networkconfig2.json
```
