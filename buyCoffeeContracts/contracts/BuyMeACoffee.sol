// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Deployed on Goerli at 

contract BuyMeACoffee {
  
// This event is emit whenever a new memo is created.
  event NewMemo(
    address indexed from,
    uint256 timestamp,
    string name,
    string message
  );

  // Memo structure
  struct Memo {
    address from;
    uint256 timestamp;
    string name;
    string message;
  }

  Memo[] memos;

  // Contract deployer address 
  address payable owner;

  // constructor
  constructor() {
    owner = payable(msg.sender);
  }

  /*
   * @dev buy coffee for the contract owner
   * @param _name: name of buyer
   * @param _message: msg for the contract owner (from buyer)
   */

  function buyCoffee(string memory _name, string memory _message) public payable {
    require(msg.value > 0, "It can't be zero.");

    memos.push (Memo(
      msg.sender,
      block.timestamp,
      _name,
      _message
    ));

    emit NewMemo(msg.sender, block.timestamp, _name, _message);
  } 

  function withdrawTips() public {
    owner.transfer(address(this).balance);
  }

  function getMemos () public view returns(Memo[] memory){
    return memos;
  }

}
