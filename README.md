## Smart Agriculture Using Blockchain

<br />

### Command for Migration of Smart Contracts:

```
truffle migrate --reset
```

<br />

### Command to Run the React App

```
npm run start
```

<br />

### Command to Find Hyperledger Caliper Benchmark Results:

#### Write operation

```
npx caliper launch manager --caliper-workspace . --caliper-benchconfig benchmarks/config.yaml --caliper-networkconfig networks/networkconfig.json --caliper-observer benchmarks/readAsset.js
```

#### Read operation

```
npx caliper launch manager --caliper-workspace . --caliper-benchconfig benchmarks/config2.yaml --caliper-networkconfig networks/networkconfig2.json
```
