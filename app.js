import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.15.0/ethers.min.js";

const CONTRACT_ADDRESS = "0x2c4976737d475dc16e13973b737b7B5A6f2cb602"; // ใส่ที่อยู่สัญญาของคุณ

const CONTRACT_ABI = [
    "function buyCharacter(uint256 _characterId) public payable",
    "function getPurchases() public view returns (tuple(address buyer, uint256 characterId, uint256 timestamp)[])",
    "event CharacterBought(address indexed buyer, uint256 characterId, uint256 timestamp)"
];

const characters = [

    { id: 0, name: "GingerBrave", price: "0.001", image: "Cookie_gingerbrave_card.webp", rarity: "Common" },
    { id: 1, name: "Pancake Cookie", price: "0.003", image: "PancakeCookie.jpg", rarity: "Epic" },
    { id: 2, name: "Matcha Cookie", price: "0.003", image: "MatchaCookie.jpg", rarity: "Epic" },
    { id: 3, name: "Strawberry Crepe Cookie", price: "0.003", image: "StrawberryCrepeCookie.jpg", rarity: "Epic" },
    { id: 4, name: "Sugar Swan Cookie", price: "0.002", image: "SugarSwanCookie.jpg", rarity: "Legendary" },
    { id: 5, name: "Blue Slushy Cookie", price: "0.003", image: "BlueSlushyCookie.jpg", rarity: "Epic" },
    { id: 6, name: "Fire Spirit Cookie", price: "0.002", image: "FireSpiritCookie.jpg", rarity: "Legendary" },
    { id: 7, name: "Dreamweaver Cookie", price: "0.002", image: "DreamweaverCookie.jpg", rarity: "Legendary" },
    { id: 8, name: "Beet Cookie", price: "0.003", image: "BeetCookie.jpg", rarity: "Epic" },
    { id: 9, name: "Wind Archer Cookie", price: "0.002", image: "WindArcherCookie.jpg", rarity: "Legendary" },
    { id: 10, name: "Butterbear Cookie", price: "0.003", image: "ButterbearCookie.jpg", rarity: "Epic" },
    { id: 11, name: "Angel Cookie", price: "0.002", image: "AngelCookie.jpg", rarity: "Rare" },
    { id: 12, name: "Poison Mushroom Cookie", price: "0.003", image: "PoisonMushroomCookie.jpg", rarity: "Epic" },
    { id: 13, name: "Dreamjelly Cookie", price: "0.003", image: "DreamjellyCookie.jpg", rarity: "Epic" },
    { id: 14, name: "Moonlight Cookie", price: "0.002", image: "MoonlightCookie.jpg", rarity: "Legendary" },
    { id: 15, name: "Dark Enchantress Cookie", price: "0.002", image: "DarkEnchantressCookie.jpg", rarity: "Legendary" }
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

function getPriceByRarity(rarity) {
    switch (rarity) {
        case "Legendary": return "0.005";
        case "Epic":      return "0.003";
        case "Rare":      return "0.002";
        default:          return "0.001"; // Common
    }
}

function renderCharacters() {
    const container = $("#character-list");
    container.empty();
    
    characters.forEach(char => {
        const priceETH = getPriceByRarity(char.rarity);
        const rarityClass = `rarity-${char.rarity.toLowerCase()}`;

        const col = $(`
            <div class="col-md-4">
                <div class="card character-card h-100">
                    <span class="rarity-badge ${rarityClass}">${char.rarity}</span>
                    <img src="${char.image}" class="card-img-top" alt="${char.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${char.name}</h5>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="price-tag">${priceETH} ETH</span> 
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
        const priceString = getPriceByRarity(char.rarity);
        const amount = ethers.parseEther(priceString); // v6 ใช้ ethers.parseEther
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