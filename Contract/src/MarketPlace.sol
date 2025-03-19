// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;


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

    constructor()
        Ownable(msg.sender)
    {}

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

    function placeBid(address nftContract, uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[nftContract][tokenId];
        require(block.timestamp < auction.endTime, "Auction already ended");
        require(msg.value > auction.highestBid, "There already is a higher bid");

        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit BidPlaced(nftContract, tokenId, msg.sender, msg.value);
    }

    function endAuction(address nftContract, uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[nftContract][tokenId];
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            IERC721(nftContract).transferFrom(address(this), auction.highestBidder, tokenId);
            payable(auction.seller).transfer(auction.highestBid);
        } else {
            IERC721(nftContract).transferFrom(address(this), auction.seller, tokenId);
        }

        emit AuctionEnded(nftContract, tokenId, auction.highestBidder, auction.highestBid);
    }

    function currentBid(address nftContract, uint256 tokenId) external view returns (uint256) {
        return auctions[nftContract][tokenId].highestBid;
    }
}