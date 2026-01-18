# Cookiee Run Character Shop - Project Report

## Project Overview
โปรเจกต์นี้คือร้านค้าตัวละครจากเกม Cookie Run บนบล็อกเชน (Ethereum Testnet) ที่ผู้ใช้สามารถเชื่อมต่อกระเป๋าเงิน (MetaMask) เพื่อเลือกซื้อตัวละครในรูปแบบของ Non-Fungible Tokens (NFTs) โดยตัวละครแต่ละแบบจะมี **เพียง 1 ชิ้นในโลก (1-of-1 NFT)** เท่านั้น หากมีคนซื้อไปแล้ว ตัวละครนั้นจะหมดไปจากร้านค้าถาวร

## Smart Contract Details
โปรเจกต์ประกอบด้วย Smart Contract หลัก 2 ตัวที่ทำงานร่วมกัน:

### 1. CharacterNFT.sol
- **Type:** ERC721 (NFT)
- **Inherits from:** OpenZeppelin's `ERC721URIStorage`, `Ownable`
- **Purpose:** เป็นสัญญาสำหรับสร้างและจัดการตัวละครในรูปแบบ NFT โดยแต่ละ Token จะมี Metadata (ชื่อ, รูปภาพ, Rarity) ที่เป็นของตัวเอง
- **Key Function:**
  - `mint(address to, string memory uri)`: สร้าง NFT ใหม่ให้กับผู้ซื้อ มีเพียง `owner` (ซึ่งก็คือ `CharacterShop`) เท่านั้นที่สามารถเรียกฟังก์ชันนี้ได้

### 2. CharacterShop.sol
- **Type:** Shop/Controller
- **Purpose:** เป็นสัญญาหน้าร้านที่ผู้ใช้มีปฏิสัมพันธ์ด้วย จัดการตรรกะการซื้อ, ราคา, และตรวจสอบว่าตัวละครถูกขายไปแล้วหรือยัง
- **Key Functions:**
  - `buyCharacter(uint256 _characterId, string memory _tokenURI)`: รับชำระเงิน, ตรวจสอบว่าตัวละครนั้นยังไม่เคยถูกใครซื้อ, และสั่งให้ `CharacterNFT` สร้าง NFT ให้กับผู้ซื้อ
  - `getPrice(Rarity _rarity)`: คำนวณราคาตามระดับความหายาก
  - `characterIsSold(uint256 characterId)`: ตรวจสอบว่าตัวละคร ID นั้นเคยถูกซื้อไปแล้วหรือยัง
- **Contract Address:** ต้อง Deploy ใหม่ทุกครั้ง (ดู `app.js` สำหรับการตั้งค่า)

### Ownership Model
`CharacterShop` จะต้องเป็น "เจ้าของ" (Owner) ของ `CharacterNFT` เพื่อให้สามารถเรียกใช้ฟังก์ชัน `mint` ได้ ดังนั้นหลังจากการ Deploy จะต้องมีการเรียก `transferOwnership` ใน `CharacterNFT` เพื่อโอนสิทธิ์ให้กับ `CharacterShop` เสมอ

## Pricing Model (Rarity based)
1. **Legendary:** 0.005 ETH
2. **Epic:** 0.003 ETH
3. **Rare:** 0.002 ETH
4. **Common:** 0.001 ETH

## Web Application Features
- **Wallet Connection:** เชื่อมต่อกับ MetaMask โดยใช้ Ethers.js (v6)
- **Character Display:** แสดงรายการตัวละคร 16 ตัว พร้อมระบุระดับความหายากและราคา
- **Buying System:** เมื่อผู้ใช้กดซื้อ ระบบจะส่ง Transaction ไปยัง `CharacterShop`
- **Sold Out UI:** หน้าเว็บจะตรวจสอบว่าตัวละครใดถูกขายไปแล้วบ้าง และจะเปลี่ยนปุ่ม "Buy" เป็น "Sold Out"
- **History Table:** แสดงตารางประวัติการซื้อล่าสุด โดยดึงข้อมูลจาก Event `CharacterBought`

## Technology Stack
- **Smart Contract:** Solidity (^0.8.20), OpenZeppelin Contracts
- **Frontend:** HTML, CSS (Bootstrap), JavaScript (jQuery)
- **Blockchain Library:** Ethers.js v6
