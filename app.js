import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.15.0/ethers.min.js";

const CONTRACT_ADDRESS = "0x9b184cf9891b0c24159d6780141daa916dfc06ba"; // ใส่ที่อยู่สัญญา CharacterShop ของคุณ

const CONTRACT_ABI = [
    
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nftContractAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "characterId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CharacterBought",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "TOTAL_CHARACTERS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_characterId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_tokenURI",
				"type": "string"
			}
		],
		"name": "buyCharacter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "characterRarities",
		"outputs": [
			{
				"internalType": "enum CharacterShop.Rarity",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum CharacterShop.Rarity",
				"name": "_rarity",
				"type": "uint8"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftContract",
		"outputs": [
			{
				"internalType": "contract CharacterNFT",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}

];

const characters = [

    { id: 0, name: "GingerBrave", image: "images/Cookie_gingerbrave_card.webp", rarity: "Common" },
    { id: 1, name: "Pancake Cookie", image: "images/PancakeCookie.jpg", rarity: "Epic" },
    { id: 2, name: "Matcha Cookie", image: "images/MatchaCookie.jpg", rarity: "Epic" },
    { id: 3, name: "Strawberry Crepe Cookie", image: "images/StrawberryCrepeCookie.jpg", rarity: "Epic" },
    { id: 4, name: "Sugar Swan Cookie", image: "images/SugarSwanCookie.jpg", rarity: "Legendary" },
    { id: 5, name: "Blue Slushy Cookie", image: "images/BlueSlushyCookie.jpg", rarity: "Epic" },
    { id: 6, name: "Fire Spirit Cookie", image: "images/FireSpiritCookie.jpg", rarity: "Legendary" },
    { id: 7, name: "Dreamweaver Cookie", image: "images/DreamweaverCookie.jpg", rarity: "Legendary" },
    { id: 8, name: "Beet Cookie", image: "images/BeetCookie.jpg", rarity: "Epic" },
    { id: 9, name: "Wind Archer Cookie", image: "images/WindArcherCookie.jpg", rarity: "Legendary" },
    { id: 10, name: "Butterbear Cookie", image: "images/ButterbearCookie.jpg", rarity: "Epic" },
    { id: 11, name: "Angel Cookie", image: "images/AngelCookie.jpg", rarity: "Rare" },
    { id: 12, name: "Poison Mushroom Cookie", image: "images/PoisonMushroomCookie.jpg", rarity: "Epic" },
    { id: 13, name: "Dreamjelly Cookie", image: "images/DreamjellyCookie.jpg", rarity: "Epic" },
    { id: 14, name: "Moonlight Cookie", image: "images/MoonlightCookie.jpg", rarity: "Legendary" },
    { id: 15, name: "Dark Enchantress Cookie", image: "images/DarkEnchantressCookie.jpg", rarity: "Legendary" }
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

        if (CONTRACT_ADDRESS !== "YOUR_CHARACTER_SHOP_ADDRESS") {
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

function createTokenUri(character) {
    const metadata = {
        name: character.name,
        description: `A ${character.rarity} character from CookieeRun.`,
        image: `${window.location.origin}/${character.image}`,
        attributes: [
            {
                trait_type: "Rarity",
                value: character.rarity
            }
        ]
    };
    return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
}

async function buyCharacter(id) {
    if (!contract) {
        alert("Please connect wallet first!");
        return;
    }

    const char = characters.find(c => c.id === id);
    try {
        const priceString = getPriceByRarity(char.rarity);
        const amount = ethers.parseEther(priceString);
        const tokenURI = createTokenUri(char);
        const tx = await contract.buyCharacter(id, tokenURI, { value: amount });
        
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
        const filter = contract.filters.CharacterBought();
        const events = await contract.queryFilter(filter);
        const tbody = $("#history-table-body");
        tbody.empty();
        
        [...events].reverse().forEach((event, index) => {
            const char = characters.find(c => c.id === Number(event.args.characterId));
            const date = new Date(Number(event.args.timestamp) * 1000).toLocaleString();
            tbody.append(`
                <tr>
                    <td>${events.length - index}</td>
                    <td>${event.args.buyer}</td>
                    <td>${char ? char.name : 'Unknown'}</td>
                    <td>${Number(event.args.tokenId)}</td>
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