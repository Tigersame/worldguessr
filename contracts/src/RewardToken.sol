// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC20 token contract for farcastbase game rewards
 * Total Supply: 10,000,000,000,000,000 tokens (10^16)
 * Decimals: 18
 * Network: Base
 */
contract RewardToken is ERC20, ERC20Burnable, Ownable {
    uint256 private constant TOTAL_SUPPLY = 10000000000000000 * 10**18; // 10^16 tokens with 18 decimals
    
    /**
     * @dev Constructor that mints the total supply to the deployer
     * @param initialOwner The address that will own the contract and receive the initial supply
     */
    constructor(address initialOwner) ERC20("Farcastbase Reward Token", "FCRT") Ownable(initialOwner) {
        _mint(initialOwner, TOTAL_SUPPLY);
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in wei, 18 decimals)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Batch mint tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of token amounts (in wei, 18 decimals)
     */
    function batchMint(address[] memory recipients, uint256[] memory amounts) public onlyOwner {
        require(recipients.length == amounts.length, "RewardToken: arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Get the total supply cap
     * @return The maximum total supply of tokens
     */
    function maxSupply() public pure returns (uint256) {
        return TOTAL_SUPPLY;
    }
}

