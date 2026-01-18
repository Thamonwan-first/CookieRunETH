# Cookie Run Character Shop - Project Report

## Project Overview
โปรเจกต์นี้คือร้านค้าตัวละครจากเกม Cookie Run บนบล็อกเชน (Ethereum Testnet) ที่ผู้ใช้สามารถเชื่อมต่อกระเป๋าเงิน (MetaMask) เพื่อเลือกซื้อตัวละครในรูปแบบของ Non-Fungible Tokens (NFTs) โดยตัวละครแต่ละแบบจะมี **เพียง 1 ชิ้นในโลก (1-of-1 NFT)** เท่านั้น หากมีคนซื้อไปแล้ว ตัวละครนั้นจะหมดไปจากร้านค้าถาวร

---

## Smart Contracts

### 1. CharacterNFT.sol
- **Type:** ERC721 NFT Contract
- **Token:** CookieeRunCharacter (CRC)
- **หน้าที่:** สร้างและจัดการ NFT ตัวละคร
- **ฟังก์ชันหลัก:** `mint()` - สร้าง NFT ใหม่ให้ผู้ซื้อ

### 2. CharacterShop.sol
- **Type:** Shop Controller
- **หน้าที่:** จัดการการซื้อขาย, ราคา, และตรวจสอบสถานะตัวละคร
- **ฟังก์ชันหลัก:** 
  - `buyCharacter()` - ซื้อตัวละคร
  - `isCharacterSold()` - เช็คว่าขายแล้วหรือยัง
  - `getPrice()` - คำนวณราคาตาม Rarity

---

## Pricing Model
| Rarity | Price |
|--------|-------|
| Legendary | 0.005 ETH |
| Epic | 0.003 ETH |
| Rare | 0.002 ETH |
| Common | 0.001 ETH |

---

## Web Application Features
- **Wallet Connection:** เชื่อมต่อ MetaMask
- **Character Display:** แสดงตัวละคร 16 ตัว พร้อม Rarity Badge
- **Buy System:** กดซื้อแล้วส่ง Transaction
- **Sold Out:** แสดงสถานะตัวละครที่ขายแล้ว
- **History Table:** แสดงประวัติการซื้อ

---

## Technology Stack
| Layer | Technology |
|-------|------------|
| Smart Contract | Solidity ^0.8.20, OpenZeppelin |
| Frontend | HTML, Bootstrap 5, jQuery |
| Blockchain | Ethers.js v6 |
| Wallet | MetaMask |

