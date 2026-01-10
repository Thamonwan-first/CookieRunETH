# Cookie Run Character Shop DApp

This is a decentralized application (DApp) that allows users to purchase Cookie Run characters using Ethereum (Testnet).

## Prerequisites

1.  **MetaMask Wallet:** Install the [MetaMask browser extension](https://metamask.io/).
2.  **Testnet ETH:** You need some test Ether (e.g., Sepolia or Goerli) to pay for gas and characters.
3.  **Local Web Server:** A simple server to host the frontend (e.g., Python, VS Code Live Server).

## Setup Instructions

### 1. Deploy the Smart Contract

You need to deploy the `CharacterShop.sol` contract to an Ethereum Testnet. The easiest way is using [Remix IDE](https://remix.ethereum.org/).

1.  Go to [Remix IDE](https://remix.ethereum.org/).
2.  Create a new file `CharacterShop.sol` and paste the content of the `CharacterShop.sol` file from this project.
3.  Compile the contract (Solidity Compiler tab).
4.  Go to the "Deploy & Run Transactions" tab.
5.  Select "Injected Provider - MetaMask" as the Environment.
6.  Click "Deploy".
7.  Confirm the transaction in MetaMask.
8.  Once deployed, copy the **Contract Address** (from the "Deployed Contracts" section).

### 2. Configure the Frontend

1.  Open `app.js` in a text editor.
2.  Find the line:
    ```javascript
    const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
    ```
3.  Replace `"YOUR_CONTRACT_ADDRESS_HERE"` with your actual deployed contract address.
    ```javascript
    const CONTRACT_ADDRESS = "0x1234..."; // Your address here
    ```
4.  Save the file.

### 3. Run the Application

To avoid browser security restrictions with local files, serve the folder using a local web server.

**Option A: Python (if installed)**
Run this command in the project folder:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B: VS Code Live Server**
If using VS Code, install the "Live Server" extension, right-click `index.html`, and choose "Open with Live Server".

## Usage

1.  Open the web app.
2.  Click **Connect Wallet** to connect your MetaMask.
3.  Browse the characters and click **Buy** to purchase one.
4.  Confirm the transaction in MetaMask.
5.  Wait for the transaction to be mined. The "Ownership History" table will update automatically!