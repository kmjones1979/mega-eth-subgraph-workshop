# MEGAETH Subgraph Workshop

This repo is an example full stack dapp that can be easily deployed to MEGAETH. It comes with an example contract (ERC20) configured for deployment with Harhat, a frontend integration with React (NextJS) and a working Subgraph which can all be deployed locally or directly to MEGAETH's Testnet.

## 🎯 Project Overview

This workshop toolkit provides everything you need to build and deploy a full-stack decentralized application (dapp) with:

-   Smart contract development and deployment
-   Frontend integration with Next.js
-   Subgraph integration for efficient blockchain data querying
-   Local development environment
-   Production deployment capabilities

## 📚 Table of Contents

-   [About The Graph](#about-the-graph)
-   [About Scaffold-ETH 2](#-about-scaffold-eth-2)
-   [Project Structure](#-project-structure)
-   [Requirements](#requirements)
-   [Quickstart](#quickstart)
-   [Development Workflow](#-development-workflow)
-   [The Graph Integration](#-setup-the-graph-integration)
-   [Deployment Guide](#-deployment-guide)
-   [Troubleshooting](#-troubleshooting)
-   [Contributing](#contributing-to-scaffold-eth-2)

## About The Graph

The Graph is a protocol that organizes and indexes blockchain data, enabling developers to easily query and access this data for building decentralized applications (dapps) without needing to run their own data servers or indexing infrastructure.

### Key Benefits

-   Efficient data querying
-   Real-time updates
-   Cost-effective data access
-   Decentralized infrastructure

## 🏗 About Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

## 📁 Project Structure

```
mega-eth-subgraph-workshop/
├── packages/
│   ├── hardhat/          # Smart contract development
│   ├── nextjs/           # Frontend application
│   └── subgraph/         # Graph protocol integration
├── .github/              # GitHub workflows and templates
├── .husky/               # Git hooks
└── .yarn/                # Yarn package management
```

## Requirements

Before you begin, you need to install the following tools:

-   [Node (>= v20.18.3)](https://nodejs.org/en/download/)
-   Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
-   [Git](https://git-scm.com/downloads)
-   [Docker](https://docs.docker.com/get-started/get-docker/)

## Customizing the token

Edit your smart contract located in `packages/hardhat/contracts/YourToken.sol`

Optionally modify the constructor with your own token name and symbol.

```
    constructor(address _owner) ERC20("YourToken", "YT") Ownable(_owner) {
        _mint(_owner, 21000000000000000000000000);
    }
```

Optionally, modify the deploy script to take ownership of the contract.

```
  const owner = "0x0000000000000000000000000000000000000000"; // add your address here

  await deploy("YourToken", {
    from: deployer,
    // Contract constructor arguments
    args: [owner], // use the owner variable to set who owns the contract during deployment
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
```

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone the repository:

```bash
git clone https://github.com/your-org/mega-eth-subgraph-workshop.git
cd mega-eth-subgraph-workshop
```

2. Install dependencies:

```bash
yarn install
```

3. Run a local network in the first terminal:

```bash
yarn chain
```

4. On a second terminal, deploy the test contract:

```bash
yarn deploy
```

5. On a third terminal, start your NextJS app:

```bash
yarn start
```

Visit your app on: `http://localhost:3000`

## 🚀 Setup The Graph Integration

Now that we have spun up our blockchain, started our frontend application and deployed our smart contract, we can start setting up our subgraph and utilize The Graph!

> Before following these steps be sure Docker is running!

#### ✅ Step 1: Clean up any old data and spin up our docker containers ✅

First run the following to clean up any old data. Do this if you need to reset everything.

```
yarn subgraph:clean-node
```

> We can now spin up a graph node by running the following command… 🧑‍🚀

```
yarn subgraph:run-node
```

This will spin up all the containers for The Graph using docker-compose. You will want to keep this window open at all times so that you can see log output from Docker.

> As stated before, be sure to keep this window open so that you can see any log output from Docker. 🔎

> NOTE FOR LINUX USERS: If you are running Linux you will need some additional changes to the project.

##### Linux Only

**For hardhat**

Update your package.json in packages/hardhat with the following command line option for the hardhat chain.

```
"chain": "hardhat node --network hardhat --no-deploy --hostname 0.0.0.0"
```

You might also need to add a firewall exception for port 8432. As an example for Ubuntu... run the following command.

```
sudo ufw allow 8545/tcp
```

#### ✅ Step 2: Create and ship our subgraph ✅

Now we can open up a fifth window to finish setting up The Graph. 😅 In this fifth window we will create our local subgraph!

> Note: You will only need to do this once.

```
yarn subgraph:create-local
```

> You should see some output stating your subgraph has been created along with a log output on your graph-node inside docker.

Next we will ship our subgraph! You will need to give your subgraph a version after executing this command. (e.g. 0.0.1).

```
yarn subgraph:local-ship
```

> This command does the following all in one… 🚀🚀🚀

-   Copies the contracts ABI from the hardhat/deployments folder
-   Generates the networks.json file
-   Generates AssemblyScript types from the subgraph schema and the contract ABIs.
-   Compiles and checks the mapping functions.
-   … and deploy a local subgraph!

> If you get an error ts-node you can install it with the following command

```
npm install -g ts-node
```

You should get a build completed output along with the address of your Subgraph endpoint.

```
Deployed to http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql

Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/scaffold-eth/your-contract
```

#### ✅ Step 3: Test your Subgraph ✅

Go ahead and head over to your subgraph endpoint and take a look!

> Here is an example query…

```
query MyQuery {
  transfers(first: 10, orderBy: id, orderDirection: asc) {
    blockNumber
    blockTimestamp
    from
    id
    to
    transactionHash
    value
  }
}
```

> If all is well and you've sent a transaction to your smart contract then you will see a similar data output!

```
{
  "data": {
    "transfers": [
      {
        "blockNumber": "3",
        "blockTimestamp": "1743789408",
        "from": "0x0000000000000000000000000000000000000000",
        "id": "0x0c15fcaf5e6948686c0c98d9066a1539bf0642db25e06460a3eafb7c08dfca6501000000",
        "to": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "transactionHash": "0x0c15fcaf5e6948686c0c98d9066a1539bf0642db25e06460a3eafb7c08dfca65",
        "value": "21000000000000000000000000"
      }
    ]
  }
}
```

## Deploying to MEGA ETH Testnet

1. Generate a deployer key

```
yarn generate
```

2. Fund the deployer

A MEGA ETH faucet can be found on the [MEGA ETH Testnet Website](https://testnet.megaeth.com/)

If you need to add the chain to Metamask, you can do so by going [here](https://www.megaexplorer.xyz/) and clicking the Metamask MegaETH Testnet icon on the bottom right of the explorer.

```
yarn account
```

3. Deploy to MEGA ETH Testnet

```
yarn deploy --network megaTestnet
```

[Here](https://www.megaexplorer.xyz/address/0x9C61D2Ac8e57554cB09c1dbF7B591a520dD54d5C) is an example deployment of the contract which comes with this repo.

> A note about contract verification, currently this is not very easy to do on MEGA ETH Testnet so we don't recommend it. We will update this workshop once the steps are more easily defined.

## Shipping to Subgraph Studio 🚀

> NOTE: This step requires [deployment of contract](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts) to live network. Checkout list of [supported networks](https://thegraph.com/docs/networks).

1. Update the `packages/subgraph/subgraph.yaml` file with your contract address, network name, start block number(optional) :

    ```diff
    ...
    -     network: localhost
    +     network: megaeth-testnet
          source:
            abi: YourToken
    +       address: "0x9C61D2Ac8e57554cB09c1dbF7B591a520dD54d5C"
    +       startBlock: 0
    ...
    ```

    TIP: For `startBlock` you can use block number of your deployed contract, which can be found by visiting deployed transaction hash in block explorer.

2. Create a new subgraph on [Subgraph Studio](https://thegraph.com/studio) and get "SUBGRAPH SLUG" and "DEPLOY KEY".

3. Authenticate with the graph CLI:

    ```sh
    yarn graph auth <DEPLOY KEY>
    ```

4. Codegen and build

    ```sh
    yarn graph codegen
    ```

    ```sh
    yarn graph build
    ```

5. Deploy the subgraph to TheGraph Studio:

    ```sh
    yarn graph deploy <SUBGRAPH SLUG>
    ```

    Once deployed, the CLI should output the Subgraph endpoints. Copy the HTTP endpoint and test your queries.

6. Update `packages/nextjs/components/ScaffoldEthAppWithProviders.tsx` to use the above HTTP subgraph endpoint:
    ```diff
    - const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
    + const subgraphUri = 'YOUR_SUBGRAPH_ENDPOINT';
    ```

## 🔄 Development Workflow

### Smart Contract Development

-   Edit contracts in `packages/hardhat/contracts`
-   Run tests with `yarn hardhat:test`
-   Deploy with `yarn deploy`

### Frontend Development

-   Edit pages in `packages/nextjs/app`
-   Configure routing in `packages/nextjs/app/page.tsx`
-   Customize UI components in `packages/nextjs/components`

### Subgraph Development

-   Define schema in `packages/subgraph/schema.graphql`
-   Write mappings in `packages/subgraph/src/mappings`
-   Test locally with `yarn subgraph:local-ship`

## 🚀 Deployment Guide

### Local Deployment

1. Start local blockchain: `yarn chain`
2. Deploy contracts: `yarn deploy`
3. Start frontend: `yarn start`
4. Deploy subgraph: `yarn subgraph:local-create` (only need to do this once)
5. Deploy subgraph: `yarn subgraph:local-ship`

### Testnet Deployment

1. Deploy contracts to MEGAETH Testnet
2. Update subgraph configuration (details below)
3. Deploy subgraph to The Graph Network
4. Deploy frontend to your preferred hosting service

## A list of all available root commands

### graph

```sh
yarn graph
```

Shortcut to run `@graphprotocol/graph-cli` scoped to the subgraph package.

### run-node

```sh
yarn subgraph:run-node
```

Spin up a local graph node (requires Docker).

### stop-node

```sh
yarn subgraph:stop-node
```

Stop the local graph node.

### clean-node

```sh
yarn clean-node
```

Remove the data from the local graph node.

### local-create

```sh
yarn subgraph:create-local
```

Create your local subgraph (only required once).

### local-remove

```sh
yarn subgraph:remove-local
```

Delete a local subgprah.

### abi-copy

```sh
yarn subgraph:abi-copy
```

Copy the contracts ABI from the hardhat/deployments folder. Generates the networks.json file too.

### codegen

```sh
yarn subgraph:codegen
```

Generates AssemblyScript types from the subgraph schema and the contract ABIs.

### build

```sh
yarn subgraph:build
```

Compile and check the mapping functions.

### local-deploy

```sh
yarn subgraph:deploy-local
```

Deploy a local subgraph.

### local-ship

```sh
yarn subgraph:local-ship
```

Run all the required commands to deploy a local subgraph (abi-copy, codegen, build and local-deploy).

### deploy

```sh
yarn subgraph:deploy
```

Deploy a subgraph to The Graph Network.

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.

## 🔧 Troubleshooting

### Common Issues

1. **Docker Issues**

    - Ensure Docker is running
    - Check port availability (8545, 8000, 8020, 8030)
    - Try restarting Docker service

2. **Contract Deployment Issues**

    - Check network configuration
    - Verify contract compilation
    - Ensure sufficient test ETH

3. **Subgraph Issues**
    - Check Docker logs
    - Verify contract addresses
    - Ensure proper schema definition

### Getting Help

-   Check [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
-   Join our [Discord Community](https://discord.gg/scaffold-eth)
-   Open an [Issue](https://github.com/your-org/mega-eth-subgraph-workshop/issues)
