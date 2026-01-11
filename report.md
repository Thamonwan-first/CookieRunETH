# Cookiee Run Character Shop - Project Report

## Project Overview
โปรเจกต์นี้คือร้านค้าตัวละครจากเกม Cookie Run บนบล็อกเชน (Ethereum/Polygon) ที่อนุญาตให้ผู้ใช้เชื่อมต่อกระเป๋าเงิน (MetaMask) เพื่อเลือกซื้อตัวละครตามระดับความหายาก (Rarity) โดยข้อมูลการซื้อจะถูกบันทึกไว้ใน Smart Contract อย่างถาวร

## Smart Contract Details
- **Contract Name:** CharacterShop
- **Contract Address:** `0x2c4976737d475dc16e13973b737b7B5A6f2cb602`
- **Functions:** 
  - `buyCharacter(uint256 _characterId)`: รับชำระเงินและบันทึกข้อมูลการซื้อ
  - `getPrice(Rarity _rarity)`: คำนวณราคาตามระดับความหายาก
  - `getPurchases()`: ดึงประวัติการซื้อทั้งหมด

## Pricing Model (Rarity based)
ราคาของตัวละครแต่ละตัวจะถูกกำหนดโดยระดับความหายากใน Smart Contract ดังนี้:
1. **Legendary:** 0.005 ETH
2. **Epic:** 0.003 ETH
3. **Rare:** 0.002 ETH
4. **Common:** 0.001 ETH

## Web Application Features
- **Wallet Connection:** เชื่อมต่อกับ MetaMask โดยใช้ Ethers.js (v6)
- **Character Display:** แสดงรายการตัวละคร 16 ตัว พร้อมระบุระดับความหายากและราคาที่ดึงข้อมูลให้สอดคล้องกับ Contract
- **Buying System:** เมื่อผู้ใช้กดซื้อ ระบบจะคำนวณราคาที่ถูกต้องและส่ง Transaction ไปยัง Smart Contract
- **History Table:** แสดงตารางประวัติการซื้อล่าสุด โดยดึงข้อมูลโดยตรงจากบล็อกเชน (Event & Public Variable)

## Technology Stack
- **Smart Contract:** Solidity (^0.8.0)
- **Frontend:** HTML, CSS (Bootstrap), JavaScript (jQuery)
- **Blockchain Library:** Ethers.js v6
