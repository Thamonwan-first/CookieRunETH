// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharacterShop {

    address public owner;

    struct Purchase {
        address buyer;
        uint256 characterId;
        uint256 timestamp;
    }

    Purchase[] public purchases;
    
    // Mapping from character ID to Rarity
    enum Rarity { Common, Rare, Epic, Legendary }
    mapping(uint256 => Rarity) public characterRarities;
    
    uint256 public constant TOTAL_CHARACTERS = 16;

    event CharacterBought(address indexed buyer, uint256 characterId, uint256 timestamp);

    constructor() {
        owner = msg.sender;
        
        // Set Epic
        uint256[8] memory epicIds = [uint256(1), 2, 3, 5, 8, 10, 12, 13];
        for(uint i=0; i<epicIds.length; i++) characterRarities[epicIds[i]] = Rarity.Epic;

        // Set Legendary
        uint256[6] memory legIds = [uint256(4), 6, 7, 9, 14, 15];
        for(uint i=0; i<legIds.length; i++) characterRarities[legIds[i]] = Rarity.Legendary;
        
        // Set Rare
        uint256[1] memory rareIds = [uint256(11)];
        for(uint i=0; i<rareIds.length; i++) characterRarities[rareIds[i]] = Rarity.Rare;
        
        // *ที่เหลือจะเป็น Common โดยอัตโนมัติ (ค่า Default ของ enum คือ 0)*
    }

    function getPrice(Rarity _rarity) public pure returns (uint256) {
        if (_rarity == Rarity.Legendary) return 0.005 ether;
        if (_rarity == Rarity.Epic) return 0.003 ether;
        if (_rarity == Rarity.Rare) return 0.002 ether;
        return 0.001 ether; // Common
    }

    function buyCharacter(uint256 _characterId) public payable {
        require(_characterId < TOTAL_CHARACTERS, "Invalid character ID");
        
        Rarity rarity = characterRarities[_characterId];
        uint256 price = getPrice(rarity);

        require(msg.value >= price, "Insufficient Ether sent");

        purchases.push(Purchase({
            buyer: msg.sender,
            characterId: _characterId,
            timestamp: block.timestamp
        }));

        emit CharacterBought(msg.sender, _characterId, block.timestamp);
    }

    function getPurchases() public view returns (Purchase[] memory) {
        return purchases;
    }
    
    function getPurchaseCount() public view returns (uint256) {
        return purchases.length;
    }
}
