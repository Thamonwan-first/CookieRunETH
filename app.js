// Replace this with your deployed contract address!
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; 

// Simple ABI for the contract functions we need
const CONTRACT_ABI = [
    "function buyCharacter(uint256 _characterId) public payable",
    "function getPurchases() public view returns (tuple(address buyer, uint256 characterId, uint256 timestamp)[])",
    "event CharacterBought(address indexed buyer, uint256 characterId, uint256 timestamp)"
];

const characters = [
    // Original 6
    { id: 0, name: "GingerBrave", price: "0.002", image: "Cookie_gingerbrave_card.webp" },
    { id: 1, name: "Strawberry Cookie", price: "0.002", image: "0e4c6b77631700c3f13fdadac59fc713.jpg" },
    { id: 2, name: "Wizard Cookie", price: "0.002", image: "0e4d5b6905e561205c6fb5e4c8a8ebfb.jpg" },
    { id: 3, name: "Chili Pepper Cookie", price: "0.002", image: "10cd039cf868455a03bfa7c0adeef8c7.jpg" },
    { id: 4, name: "Custard Cookie III", price: "0.002", image: "1493c2644e65d7956ee46129c9219e13.jpg" },
    { id: 5, name: "Clover Cookie", price: "0.002", image: "14e97bbca651d9c03f48a1e8a548c3ae.jpg" },
    // New additions
    { id: 6, name: "Adventurer Cookie", price: "0.002", image: "1cd420cca74674b70edbfcfea7cf0dc7.jpg" },
    { id: 7, name: "Blackberry Cookie", price: "0.002", image: "4c6d3333e83b9ceb255bdac6ce6404d4.jpg" },
    { id: 8, name: "Gumball Cookie", price: "0.002", image: "4c78aa264e5962f315318f56fe013563.jpg" },
    { id: 9, name: "Cherry Cookie", price: "0.002", image: "72f968518a4fb3a233bf071c3ba72a0e.jpg" },
    { id: 10, name: "Alchemist Cookie", price: "0.002", image: "a18c2bf3740714b98fad412d74f29852.jpg" },
    { id: 11, name: "Onion Cookie", price: "0.002", image: "c1e305e756efe1df54757c29f864a655.jpg" },
    { id: 12, name: "Pancake Cookie", price: "0.002", image: "cfe5d86453b18b5939ac66fde54932ce.jpg" },
    { id: 13, name: "Muscle Cookie", price: "0.002", image: "da322faf41a9adc64e99bafa5aa66b35.jpg" },
    { id: 14, name: "Ninja Cookie", price: "0.002", image: "download.jpg" },
    { id: 15, name: "Angel Cookie", price: "0.002", image: "fd2e1b1331eac5d13b7e4aea9fdef8e4.jpg" }
];

let provider;
let signer;
let contract;

async function init() {
    renderCharacters();
    
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Check if already connected
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            await connectWallet();
        }
    } else {
        showStatus("Please install MetaMask to use this DApp!", "danger");
    }
    
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);

    if (CONTRACT_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE") {
        showStatus("⚠️ <strong>Configuration Needed:</strong> Please deploy the smart contract and update `CONTRACT_ADDRESS` in <code>app.js</code>.", "warning");
    }
}

function showStatus(message, type = "info") {
    const statusEl = document.getElementById('statusMessage');
    statusEl.innerHTML = message;
    statusEl.className = `alert alert-${type}`;
    statusEl.classList.remove('d-none');
}

function renderCharacters() {
    const container = document.getElementById('character-list');
    container.innerHTML = '';
    
    characters.forEach(char => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${char.image}" class="card-img-top" alt="${char.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${char.name}</h5>
                    <p class="card-text">A brave cookie ready for adventure!</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="price-tag">${char.price} ETH</span>
                        <button class="btn btn-primary buy-btn" onclick="buyCharacter(${char.id})">Buy</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

async function connectWallet() {
    if (!provider) return;
    
    try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        
        document.getElementById('userAddress').innerText = `Connected: ${address.substring(0, 6)}...${address.substring(38)}`;
        document.getElementById('connectWalletBtn').style.display = 'none';
        
        if (CONTRACT_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE") {
            showStatus("Cannot connect: Contract address not set in app.js", "danger");
            return;
        }

        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        loadHistory();
        
        // Listen for new events to update table in real-time
        contract.on("CharacterBought", (buyer, charId, timestamp) => {
            console.log("New purchase detected!");
            loadHistory();
        });

    } catch (error) {
        console.error("Connection error:", error);
    }
}

async function buyCharacter(id) {
    if (!contract) {
        alert("Please connect wallet and configure contract address first!");
        return;
    }

    const char = characters.find(c => c.id === id);
    if (!char) return;

    try {
        const tx = await contract.buyCharacter(id, {
            value: ethers.utils.parseEther(char.price)
        });
        
        showStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`, "info");
        await tx.wait();
        showStatus(`✅ Successfully bought ${char.name}!`, "success");
        loadHistory();
        
    } catch (error) {
        console.error("Purchase failed:", error);
        showStatus("Purchase failed: " + (error.data?.message || error.message), "danger");
    }
}

async function loadHistory() {
    if (!contract) return;
    
    try {
        const purchases = await contract.getPurchases();
        const tbody = document.getElementById('history-table-body');
        tbody.innerHTML = '';
        
        // Reverse to show newest first
        [...purchases].reverse().forEach((p, index) => {
            const char = characters.find(c => c.id === p.characterId.toNumber());
            const charName = char ? char.name : "Unknown Cookie";
            const date = new Date(p.timestamp.toNumber() * 1000).toLocaleString();
            
            const row = `
                <tr>
                    <td>${purchases.length - index}</td>
                    <td>${p.buyer}</td>
                    <td>${charName}</td>
                    <td>${date}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
    } catch (error) {
        console.error("Error loading history:", error);
    }
}

// Initialize on load
window.addEventListener('load', init);
