// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenNFTMRC is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Array to keep track of all tokens
    uint256[] private _allTokens;

    constructor(address initialOwner)
        ERC721("MIRECOS NFT", "MRNFT")
        Ownable(initialOwner)
    {
        // Mint 5 NFTs to the initial owner
        for (uint256 i = 0; i < 5; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(initialOwner, tokenId);
            _allTokens.push(tokenId);
        }
    }
    
    // Function to mint new NFTs (only owner)
    function mint(address to, string memory tokenUR) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUR);
        _allTokens.push(tokenId);
        return tokenId;
    }
    
    // Function to get total supply
    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }
    
    // Function to get token by index
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < _allTokens.length, "Index out of bounds");
        return _allTokens[index];
    }
    
    // Function to get all tokens
    function getAllTokens() public view returns (uint256[] memory) {
        return _allTokens;
    }

    // Function to get the token URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }
}