// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharacterShop {

    struct Purchase {
        address buyer;
        uint256 characterId;
        uint256 timestamp;
    }

    Purchase[] public purchases;
    
    // Mapping from character ID to price (in Wei)
    mapping(uint256 => uint256) public characterPrices;
    
    uint256 public constant TOTAL_CHARACTERS = 16;

    event CharacterBought(address indexed buyer, uint256 characterId, uint256 timestamp);

    constructor() {
        // Initialize prices dynamically based on ID
        // Flat price of 0.002 ETH for all characters
        for (uint256 i = 0; i < TOTAL_CHARACTERS; i++) {
            characterPrices[i] = 0.002 ether;
        }
    }

    function buyCharacter(uint256 _characterId) public payable {
        require(_characterId < TOTAL_CHARACTERS, "Invalid character ID");
        require(msg.value >= characterPrices[_characterId], "Insufficient Ether sent");

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
