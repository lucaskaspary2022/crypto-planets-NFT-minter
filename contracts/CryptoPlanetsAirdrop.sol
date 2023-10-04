// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

// This is just a way I though of doing a free airdrop. The logic doesn't work, because there is no way to keep track of the 
// ownership of the receiver's adresses, as the owners mapping is a private mapping from ERC721

contract CrytpoPlanets is ERC721, Ownable { // check on IERC721

    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    bool public isPublicMintEnabled;
    bool public paused;
    bool public onlyWhitelisted;
    bool public revealed;
    string internal baseTokenUri;
    string public notRevealedURI;
    address private withdrawWallet;
    address[] public whiteListedAdresses;

    constructor() payable ERC721('Crytpo Planets', 'CRYPL') { // check on why this constructor is payable
        mintPrice = 0.02 ether;
        totalSupply = 0;
        maxSupply = 10000;
        maxPerWallet = 3;
        withdrawWallet = 0xb5CE75feeC6C5C9BC057e3B9A00a54faced31231;
        onlyWhitelisted = true;
    }

    function airdrop(address[] memory _receivers) public onlyOwner {
        require(totalSupply + _receivers.length <= maxSupply, 'sold out');
        for (uint8 i = 0; i < _receivers.length; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(_receivers[i], newTokenId);
        }        
    }

    function _baseURI() internal view virtual override returns(string memory) {
        return baseTokenUri;
    }

    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }

    function setRevealed(bool _state) external onlyOwner { // not sure if it's the best alternative to use
        revealed = _state;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner { // use it if erc721 doesn't have it
        baseTokenUri = _baseTokenURI;
    }

    function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedURI = _notRevealedURI;
    }

    function tokenURI(uint256 _tokenId) public view override returns(string memory) { // already in ERC721 contract
        require(_exists(_tokenId), 'Token does not exist!');

        if (revealed) {
            string memory baseURI = _baseURI();
            return string(abi.encodePacked(baseURI, Strings.toString(_tokenId), ".json")); 
        }
        else {
            return notRevealedURI;
        }    
    }

    function withdraw() external onlyOwner { // understand what are the ways of withdrawing the money
        (bool success, ) = withdrawWallet.call{ value: address(this).balance }(''); // try using owner() instead of withdrawWallet
        require(success, 'withdraw failed');
    }

    function isWhitelisted(address _user) public view returns (bool) {
        for (uint256 i = 0; i < whiteListedAdresses.length; i++) {
            if (whiteListedAdresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function mint(uint256 _quantity) public payable {
        require(!paused);
        require(isPublicMintEnabled, 'minting not enabled');
        require(_quantity > 0);
        require(msg.value == _quantity * mintPrice, 'wrong mint value');
        require(totalSupply + _quantity <= maxSupply, 'sold out');
        require(balanceOf(msg.sender) + _quantity <= maxPerWallet, 'exceed max per wallet');

        if (msg.sender != owner()) { // check on this later
            if (onlyWhitelisted == true) {
                require(isWhitelisted(msg.sender), "user is not whitelisted");
            }
        }

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(msg.sender, newTokenId);
        }
    }

}