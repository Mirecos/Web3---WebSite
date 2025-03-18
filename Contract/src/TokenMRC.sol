// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMRC is ERC20, Ownable, ERC20Permit {
    constructor()
        ERC20("MIRECOS", "MRC")
        Ownable(msg.sender)
        ERC20Permit("MyToken")
    {
        _mint(msg.sender, 1000);
    }

}