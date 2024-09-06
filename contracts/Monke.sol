// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Monke is ERC721 {

    uint256 private _currentTokenId;

    struct NFTMetadata {
        uint256 valid_till;
        string url; 
    }

    mapping(uint256 => NFTMetadata) private _tokenMetadata;

    mapping(uint256 => address) private _owners;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _currentTokenId = 0;  // Initialize the token ID counter
    }

    function mintNFT(address recipient, uint256 valid_till, string memory url) public returns (uint256) {
        _currentTokenId++;
        uint256 newItemId = _currentTokenId;
        _mint(recipient, newItemId);

        _owners[newItemId] = recipient;

        _tokenMetadata[newItemId] = NFTMetadata({
            valid_till: valid_till,
            url: url
        });

        return newItemId;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function getTokenMetadata(uint256 tokenId) public view returns (uint256, string memory) {
        require(_exists(tokenId), "Token does not exist");
        NFTMetadata memory metadata = _tokenMetadata[tokenId];
        return (metadata.valid_till, metadata.url);
    }
}
