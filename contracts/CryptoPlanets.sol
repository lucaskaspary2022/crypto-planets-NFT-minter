// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

    // The ERC721 already does pretty much all of the hard work
    // ownerOf function and _owners mapping
    // _safeMint() function
    // balanceOf() function

    // IMPORTANT:
    // Check on how I can save mor gas: but using the ERC721 functions and variables or just creating my own for my contract

    // Later on check on how a whiteList contract works and what should I add to this contract to make it a pre sale contract

    // IMPORTANT: (not sure if it is actually this) if the user mints the max ammount and then transfers one of of his 
    // NFTs for another account, he gains an extra mint => see if the owner of the collection cares about this or not

contract CryptoPlanets is ERC721, Ownable {

    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    bool public isPublicMintEnabled;
    bool public paused;
    string internal baseTokenUri; // use it if erc721 doesn't have it => maybe make it private
    // mapping(address => uint256) public walletMints; // compare this mapping with the balanceOf() function of the ERC721
    address private withdrawWallet;

    constructor() payable ERC721('Crytpo Planets', 'CRYPL') { // check on why this constructor is payable
        mintPrice = 0.02 ether;
        totalSupply = 0;
        maxSupply = 10000;
        maxPerWallet = 3;
        withdrawWallet = 0xb5CE75feeC6C5C9BC057e3B9A00a54faced31231;
    }

    function _baseURI() internal view virtual override returns(string memory) {
        return baseTokenUri;
    }

    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner { // use it if erc721 doesn't have it
        baseTokenUri = _baseTokenURI;
    }

    function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner {
        baseTokenUri = _baseTokenUri;
    }   

    function tokenURI(uint256 _tokenId) public view override returns(string memory) { // already in ERC721 contract
        require(_exists(_tokenId), 'Token does not exist!');

        return string(abi.encodePacked(baseTokenUri, Strings.toString(_tokenId), ".json"));
    }

    function withdraw() external onlyOwner { // understand what are the ways of withdrawing the money
        (bool success, ) = withdrawWallet.call{ value: address(this).balance }('');
        require(success, 'withdraw failed');
    }

    function mint(uint256 _quantity) public payable {
        require(!paused);
        require(isPublicMintEnabled, 'minting not enabled');
        require(msg.value == _quantity * mintPrice, 'wrong mint value');
        require(totalSupply + _quantity <= maxSupply, 'sold out');
        require(balanceOf(msg.sender) + _quantity <= maxPerWallet, 'exceed max per wallet');
        // require(walletMints[msg.sender] + _quantity <= maxPerWallet, 'exceed max wallet');

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            // walletMints[msg.sender]++; // _safeMint() already adds the quantity to the user balance
            _safeMint(msg.sender, newTokenId);
        }
    }

}