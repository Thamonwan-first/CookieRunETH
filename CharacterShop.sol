// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CharacterNFT.sol";

contract CharacterShop {
    CharacterNFT public nftContract;
    address public owner;

    // Mapping from character ID to Rarity
    enum Rarity { Common, Rare, Epic, Legendary }
    mapping(uint256 => Rarity) public characterRarities;
    
    uint256 public constant TOTAL_CHARACTERS = 16;
    mapping(uint256 => bool) public characterIsSold;

    event CharacterBought(address indexed buyer, uint256 characterId, uint256 tokenId, uint256 timestamp);

    function isCharacterSold(uint256 _characterId) public view returns (bool) {
        return characterIsSold[_characterId];
    }

    constructor(address _nftContractAddress) {
        owner = msg.sender;
        nftContract = CharacterNFT(_nftContractAddress);
        
        // Set Epic
        uint256[8] memory epicIds = [uint256(1), 2, 3, 5, 8, 10, 12, 13];
        for(uint i=0; i<epicIds.length; i++) characterRarities[epicIds[i]] = Rarity.Epic;

        // Set Legendary
        uint256[6] memory legIds = [uint256(4), 6, 7, 9, 14, 15];
        for(uint i=0; i<legIds.length; i++) characterRarities[legIds[i]] = Rarity.Legendary;
        
        // Set Rare
        uint256[1] memory rareIds = [uint256(11)];
        for(uint i=0; i<rareIds.length; i++) characterRarities[rareIds[i]] = Rarity.Rare;
    }

    function getPrice(Rarity _rarity) public pure returns (uint256) {
        if (_rarity == Rarity.Legendary) return 0.005 ether;
        if (_rarity == Rarity.Epic) return 0.003 ether;
        if (_rarity == Rarity.Rare) return 0.002 ether;
        return 0.001 ether; // Common
    }

    function buyCharacter(uint256 _characterId, string memory _tokenURI) public payable {
        require(_characterId < TOTAL_CHARACTERS, "Invalid character ID");
        require(!characterIsSold[_characterId], "This character has already been sold.");
        
        Rarity rarity = characterRarities[_characterId];
        uint256 price = getPrice(rarity);

        require(msg.value >= price, "Insufficient Ether sent");

        characterIsSold[_characterId] = true;
        uint256 tokenId = nftContract.mint(msg.sender, _tokenURI);

        emit CharacterBought(msg.sender, _characterId, tokenId, block.timestamp);
    }
}
