// hre = Hardhat Runtime Environment
const hre = require("hardhat");

async function getBalance(address){
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

async function printBalances(addresses){
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    ++idx;
  }
}

async function printMemos(memos){
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const item = memo.item; 
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: ${message} and bought ${item}`);
  }  
}

async function printGrocery(groceries){
  for(const grocery of groceries){
    const item = grocery.item;
    const cost = grocery.cost;
    console.log(`${item} : ${cost}`);
  }  
}

async function main(){
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyGrocery = await hre.ethers.getContractFactory("BuyGrocery");
  const buyGrocery = await BuyGrocery.deploy();
  await buyGrocery.deployed();
  console.log("BuyGrocery deployed to: ", buyGrocery.address);

  const addresses = [owner.address, tipper1.address, buyGrocery.address];

  console.log("===INITIATE===");
  await printBalances(addresses);

  await buyGrocery.connect(owner).addGrocery("Cappuchino", 10);
  const tip = {value: hre.ethers.utils.parseEther("0.000000000000000001")};
  const tip2 = {value: hre.ethers.utils.parseEther("0.000000000000000010")};
  await buyGrocery.connect(tipper1).buyGrocery("Ab", "Hello", 0, tip);
  await buyGrocery.connect(tipper2).buyGrocery("vampire", "This is just for fun!", 1, tip);
  await buyGrocery.connect(tipper3).buyGrocery("vampireAb", "Well, lets see.", 2, tip2);

  console.log("===Grocery BOUGHT===");
  await printBalances(addresses);

  console.log("===WITHDRAWING TO OWNER===");
  await buyGrocery.connect(owner).withdrawTips();

  console.log("===WITHDRAWN===");
  await printBalances(addresses);

  console.log("===Memos===");
  const memos = await buyGrocery.getMemos();
  printMemos(memos);

  console.log("Adding new Grocery");
  

  console.log("===Groceries===");
  const groceries = await buyGrocery.getGrocery();
  printGrocery(groceries);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});