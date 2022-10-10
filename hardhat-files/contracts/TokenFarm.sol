// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "./Dai.sol";
import "./DappToken.sol";

contract TokenFarm {
    DaiToken public daiToken;
    DappToken public dappToken;
    address public owner;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => bool) public hasStaked;

    constructor(DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller must be the owner");
        _;
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Cannot stake Zero");
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
            isStaking[msg.sender] = true;
        }
    }

    function issueTokens() public onlyOwner {
        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint256 balance = stakingBalance[staker];
            if (balance > 0) {
                dappToken.transfer(staker, balance);
            }
        }
    }

    function unstake() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "You havent staked anything");

        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}
