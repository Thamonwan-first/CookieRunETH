import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.15.0/ethers.min.js";

const CONTRACT_ADDRESS = "0x2c4976737d475dc16e13973b737b7B5A6f2cb602"; // ใส่ที่อยู่สัญญาของคุณ

const CONTRACT_ABI = [
    "function buyCharacter(uint256 _characterId) public payable",
    "function getPurchases() public view returns (tuple(address buyer, uint256 characterId, uint256 timestamp)[])",
    "event CharacterBought(address indexed buyer, uint256 characterId, uint256 timestamp)"
];

const characters = [
    { id: 0, name: "GingerBrave", price: "0.002", image: "Cookie_gingerbrave_card.webp" },
    { id: 1, name: "Strawberry Cookie", price: "0.002", image: "0e4c6b77631700c3f13fdadac59fc713.jpg" },
    { id: 2, name: "Wizard Cookie", price: "0.002", image: "0e4d5b6905e561205c6fb5e4c8a8ebfb.jpg" },
    { id: 3, name: "Chili Pepper Cookie", price: "0.002", image: "10cd039cf868455a03bfa7c0adeef8c7.jpg" },
    { id: 4, name: "Custard Cookie III", price: "0.002", image: "1493c2644e65d7956ee46129c9219e13.jpg" },
    { id: 5, name: "Clover Cookie", price: "0.002", image: "14e97bbca651d9c03f48a1e8a548c3ae.jpg" },
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

let signer = null;
let provider, contract;
let currentAccount = null;

// ===Connecting to MetaMask (สไตล์อาจารย์)===
async function loadWeb3() {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            await handleAccountsChanged(accounts);
        } catch (error) {
            if (error.code === 4001) {
                showStatus("Please connect to MetaMask.", "warning");
            } else {
                console.error(error);
            }
        }
    } else {
        showStatus("MetaMask is not installed!", "danger");
    }
}

if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
}

async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showStatus("Please connect to MetaMask.", "warning");
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        $("#userAddress").text(`Connected: ${address.substring(0, 6)}...${address.substring(38)}`);
        
        if (CONTRACT_ADDRESS !== "YOUR_CONTRACT_ADDRESS_HERE") {
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            loadHistory();
        }
    }
}

async function load() {
    renderCharacters();
    await loadWeb3();
    updateStatus('Ready!');
}

function updateStatus(status) {
    $("#status").text(status);
}

function showStatus(message, type = "info") {
    const statusEl = document.getElementById('statusMessage');
    statusEl.innerHTML = message;
    statusEl.className = `alert alert-${type}`;
    statusEl.classList.remove('d-none');
}

function renderCharacters() {
    const container = $("#character-list");
    container.empty();
    
    characters.forEach(char => {
        const col = $(`
            <div class="col-md-4">
                <div class="card character-card h-100">
                    <img src="${char.image}" class="card-img-top" alt="${char.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${char.name}</h5>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="price-tag">${char.price} ETH</span>
                            <button class="btn btn-primary buy-btn" data-id="${char.id}">Buy</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        col.find('.buy-btn').click(() => buyCharacter(char.id));
        container.append(col);
    });
}

async function buyCharacter(id) {
    if (!contract) {
        alert("Please connect wallet first!");
        return;
    }

    const char = characters.find(c => c.id === id);
    try {
        const amount = ethers.parseEther(char.price); // v6 ใช้ ethers.parseEther
        const tx = await contract.buyCharacter(id, { value: amount });
        
        showStatus(`Transaction Sent: ${tx.hash}`, "info");
        await tx.wait();
        showStatus(`✅ Successfully bought ${char.name}!`, "success");
        loadHistory();
    } catch (error) {
        console.error(error);
        showStatus("Error: " + (error.reason || error.message), "danger");
    }
}

async function loadHistory() {
    if (!contract) return;
    try {
        const purchases = await contract.getPurchases();
        const tbody = $("#history-table-body");
        tbody.empty();
        
        [...purchases].reverse().forEach((p, index) => {
            const char = characters.find(c => c.id === Number(p.characterId)); // v6 ใช้ Number()
            const date = new Date(Number(p.timestamp) * 1000).toLocaleString();
            tbody.append(`
                <tr>
                    <td>${purchases.length - index}</td>
                    <td>${p.buyer}</td>
                    <td>${char ? char.name : 'Unknown'}</td>
                    <td>${date}</td>
                </tr>
            `);
        });
    } catch (error) {
        console.error("History Error:", error);
    }
}

// เริ่มต้นทำงานเมื่อโหลดหน้าเสร็จ
$(document).ready(function() {
    console.log("Document ready, loading app...");
    load();
});