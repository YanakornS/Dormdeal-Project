// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Reputation Contract
 * @notice Blockchain-based reputation system for DormDeals
 * @dev Handles immutable rating and penalty logging with on-chain reputation calculation
 */
contract Reputation {
    // Constants
    uint256 public constant PENALTY_AMOUNT = 2e17; // 0.2 (scaled by 1e18 for precision)
    
    // Events
    event RatingLogged(
        address indexed seller,
        address indexed rater,
        uint256 indexed postId,
        uint256 rating,
        uint256 timestamp
    );
    
    event PenaltyLogged(
        address indexed seller,
        uint256 indexed reportId,
        uint256 penaltyAmount,
        uint256 timestamp
    );
    
    // Structs
    struct SellerReputation {
        uint256 ratingSum;      // Sum of all ratings
        uint256 ratingCount;    // Number of ratings
        uint256 penaltySum;     // Total penalties (scaled by 1e18)
    }
    
    // Mappings
    mapping(address => SellerReputation) public sellerReputations;
    
    // Prevent duplicate ratings for the same post
    mapping(address => mapping(uint256 => bool)) public hasRated; // seller => postId => hasRated
    
    // Prevent duplicate penalties for the same report
    mapping(address => mapping(uint256 => bool)) public hasPenalized; // seller => reportId => hasPenalized
    
    // Moderator access control
    mapping(address => bool) public moderators;
    address public owner;
    
    // Modifiers
    modifier onlyModerator() {
        require(moderators[msg.sender] || msg.sender == owner, "Not authorized as moderator");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized as owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        moderators[msg.sender] = true;
    }
    
    /**
     * @notice Add or remove moderator
     * @param moderator Address of the moderator
     * @param isModerator Whether to grant or revoke moderator status
     */
    function setModerator(address moderator, bool isModerator) external onlyOwner {
        moderators[moderator] = isModerator;
    }
    
    /**
     * @notice Log a rating for a seller after a deal is closed
     * @param seller Address of the seller
     * @param postId Unique identifier of the post/listing
     * @param rating Rating value (1-5)
     * @dev Prevents duplicate ratings for the same post
     */
    function logRating(
        address seller,
        uint256 postId,
        uint256 rating
    ) external {
        require(seller != address(0), "Invalid seller address");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        require(!hasRated[seller][postId], "Already rated this post");
        
        // Update seller reputation
        SellerReputation storage rep = sellerReputations[seller];
        rep.ratingSum += rating;
        rep.ratingCount += 1;
        
        // Mark this post as rated
        hasRated[seller][postId] = true;
        
        // Emit event
        emit RatingLogged(seller, msg.sender, postId, rating, block.timestamp);
    }
    
    /**
     * @notice Log a penalty for a seller after moderator confirms a report
     * @param seller Address of the seller
     * @param reportId Unique identifier of the report
     * @dev Can only be called by moderator, prevents duplicate penalties
     */
    function logPenalty(
        address seller,
        uint256 reportId
    ) external onlyModerator {
        require(seller != address(0), "Invalid seller address");
        require(!hasPenalized[seller][reportId], "Penalty already logged for this report");
        
        // Update seller penalty
        SellerReputation storage rep = sellerReputations[seller];
        rep.penaltySum += PENALTY_AMOUNT;
        
        // Mark this report as penalized
        hasPenalized[seller][reportId] = true;
        
        // Emit event
        emit PenaltyLogged(seller, reportId, PENALTY_AMOUNT, block.timestamp);
    }
    
    /**
     * @notice Calculate and return average rating for a seller
     * @param seller Address of the seller
     * @return Average rating (scaled by 1e18)
     */
    function getAverageRating(address seller) external view returns (uint256) {
        SellerReputation memory rep = sellerReputations[seller];
        if (rep.ratingCount == 0) {
            return 0;
        }
        // Return rating as fixed-point number (scaled by 1e18)
        return (rep.ratingSum * 1e18) / rep.ratingCount;
    }
    
    /**
     * @notice Get total penalty for a seller
     * @param seller Address of the seller
     * @return Total penalty (scaled by 1e18)
     */
    function getTotalPenalty(address seller) external view returns (uint256) {
        return sellerReputations[seller].penaltySum;
    }
    
    /**
     * @notice Calculate reputation score: AverageRating - TotalPenalty
     * @param seller Address of the seller
     * @return Reputation score (scaled by 1e18)
     */
    function getReputation(address seller) external view returns (uint256) {
        SellerReputation memory rep = sellerReputations[seller];
        
        uint256 averageRating = 0;
        if (rep.ratingCount > 0) {
            averageRating = (rep.ratingSum * 1e18) / rep.ratingCount;
        }
        
        // Reputation = Average Rating - Total Penalty
        if (averageRating >= rep.penaltySum) {
            return averageRating - rep.penaltySum;
        } else {
            return 0; // Reputation cannot be negative
        }
    }
    
    /**
     * @notice Get detailed reputation information
     * @param seller Address of the seller
     * @return ratingSum Sum of all ratings
     * @return ratingCount Number of ratings
     * @return penaltySum Total penalties
     * @return averageRating Average rating (scaled by 1e18)
     * @return reputation Final reputation score (scaled by 1e18)
     */
    function getReputationDetails(address seller) external view returns (
        uint256 ratingSum,
        uint256 ratingCount,
        uint256 penaltySum,
        uint256 averageRating,
        uint256 reputation
    ) {
        SellerReputation memory rep = sellerReputations[seller];
        
        ratingSum = rep.ratingSum;
        ratingCount = rep.ratingCount;
        penaltySum = rep.penaltySum;
        
        if (rep.ratingCount > 0) {
            averageRating = (rep.ratingSum * 1e18) / rep.ratingCount;
        } else {
            averageRating = 0;
        }
        
        if (averageRating >= rep.penaltySum) {
            reputation = averageRating - rep.penaltySum;
        } else {
            reputation = 0;
        }
    }
}








