//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourToken is Ownable, ERC20 {
    // State Variables

    // Events: a way to emit log statements from smart contract that can be listened to by external parties
    event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);

    // Constructor: Called once on contract deployment
    // Check packages/hardhat/deploy/00_deploy_your_contract.ts
    constructor(address _owner) ERC20("YourToken", "YT") Ownable(_owner) {
        _mint(_owner, 21000000000000000000000000);
    }
    /**
     * Function that allows the owner to withdraw all the Ether in the contract
     * The function can only be called by the owner of the contract as defined by the isOwner modifier
     */
    function withdraw() public onlyOwner {
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
