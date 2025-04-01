// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketPlace is ReentrancyGuard, Ownable {
    struct Auction {
        address seller;
        address highestBidder;
        uint256 highestBid;
        uint256 endTime;
        bool ended;
    }

    // ERC20 token used for bidding
    IERC20 public paymentToken;

    constructor()
    Ownable(msg.sender)
    {
        paymentToken = IERC20(0x4ce2beA5E62c2EDBfEf2048598C4dA5570B6B889);
    }

    mapping(address => mapping(uint256 => Auction)) public auctions;

    event AuctionStarted(address indexed nftContract, uint256 indexed tokenId, uint256 endTime);
    event BidPlaced(address indexed nftContract, uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionEnded(address indexed nftContract, uint256 indexed tokenId, address indexed winner, uint256 amount);

    function startAuction(address nftContract, uint256 tokenId, uint256 duration) external nonReentrant {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(auctions[nftContract][tokenId].endTime == 0, "Auction already started");

        nft.transferFrom(msg.sender, address(this), tokenId);

        auctions[nftContract][tokenId] = Auction({
            seller: msg.sender,
            highestBidder: address(0),
            highestBid: 0,
            endTime: block.timestamp + duration,
            ended: false
        });

        emit AuctionStarted(nftContract, tokenId, block.timestamp + duration);
    }

    function placeBid(address nftContract, uint256 tokenId, uint256 bidAmount) external payable nonReentrant {
        Auction storage auction = auctions[nftContract][tokenId];
        require(block.timestamp < auction.endTime, "Auction already ended");
        require(bidAmount > auction.highestBid, "There already is a higher bid");
        
        // Check if bidder has enough tokens
        require(paymentToken.balanceOf(msg.sender) >= bidAmount, "Insufficient token balance");
        
        // Transfer tokens from bidder to contract
        require(paymentToken.transferFrom(msg.sender, address(this), bidAmount), "Token transfer failed");
        // Return previous bid if exists

        if (auction.highestBidder != address(0)) {
            paymentToken.transfer(auction.highestBidder, auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = bidAmount;

        emit BidPlaced(nftContract, tokenId, msg.sender, bidAmount);
    }

    function endAuction(address nftContract, uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[nftContract][tokenId];
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            IERC721(nftContract).transferFrom(address(this), auction.highestBidder, tokenId);
            require(paymentToken.transfer(auction.seller, auction.highestBid), "Failed to pay seller");
        } else {
            IERC721(nftContract).transferFrom(address(this), auction.seller, tokenId);
        }

        emit AuctionEnded(nftContract, tokenId, auction.highestBidder, auction.highestBid);
    }

    function getAuctionInfo(address nftContract, uint256 tokenId) external view returns (address seller, address highestBidder, uint256 highestBid, uint256 endTime, bool ended) {
        Auction storage auction = auctions[nftContract][tokenId];
        return (auction.seller, auction.highestBidder, auction.highestBid, auction.endTime, auction.ended);
    }
}