// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//Deployed pn goerli network at 0x803B6840E5981950dB4e2bb8bEe7c4A191dE2Ecc
contract BuyGrocery{
  address payable owner;
  
  // This event is emit whenever new memo is created.
  event NewMemo(
    address indexed from,
    uint256 timestamp,
    string name,
    string message,
    string item
  );

  // This event is emit whenever new grocery is created.
  event NewGroceries(    
    string item,
    uint256 cost
  );  

  //Memo struct
  struct Memo{
    address from;
    uint256 timestamp;
    string name;
    string message;
    string item;
  }

  struct Groceries{
    string item;
    uint256 cost;
  }

  Memo[] memos;
  Groceries[] grocery;
  
  //Constructor
  constructor(){
    owner = payable(msg.sender);
    grocery.push(Groceries("Tip", 0));
    grocery.push(Groceries("Coffee", 346));    
  }

  /*
   * @dev buy coffee for the contract owner
   * @param _name: name of buyer
   * @param _message: msg for the contract owner (from buyer)
   */

  function buyGrocery(string memory _name, string memory _message, uint256 _item) public payable{
    require(_item < grocery.length, "Please select a legit option!");
    require(msg.value > 0, "Hey, you can't transfer zero!");
    
    if(_item > 0)
      require(grocery[_item].cost == (msg.value));    

    memos.push (Memo(
      msg.sender,
      block.timestamp,
      _name,
      _message,
      grocery[_item].item
    ));
    
    emit NewMemo(msg.sender, block.timestamp, _name, _message, grocery[_item].item);
  }

  /*
   * @dev add new item in grocery
   * @param _item: name of the new grocery item 
   * @param _cost: msg for the contract owner (from buyer)
   */

  function addGrocery(string memory _item, uint256 _cost) public {
    require(payable(msg.sender) == owner, "Only owner can add a grocery.");      
    grocery.push(Groceries(_item, _cost));
    emit NewGroceries(_item, _cost);
  }

  /*
   * @dev Transfer the balance of contract to owner.
   */

  function withdrawTips() public {
    require(address(this).balance > 0, "Cannot transfer nil balance.");
    owner.transfer(address(this).balance);
  }

  /*
   * @dev get all the memos
   */

  function getMemos () public view returns(Memo[] memory){
    return memos;
  }

  /*
   * @dev get all the grocery
   */

  function getGrocery () public view returns(Groceries[] memory){
    return grocery;
  }
}