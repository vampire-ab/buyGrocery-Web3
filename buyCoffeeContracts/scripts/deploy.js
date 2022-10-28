// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address) {
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

async function printBalances(addresses) {
  let index = 0;
  for (const address of addresses) {
    console.log(`Address ${index} balance: `, await getBalance(address));
    ++index;
  }
}

async function printMemos(memos) {
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: ${message}`);
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  
  //Get contract to deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to: ", buyMeACoffee.address);

  // const addresses = [owner.address, tipper.address, buyMeACoffee.address];

  // console.log("===INITIATE===");
  // await printBalances(addresses);

  // const tip = {value: hre.ethers.utils.parseEther("1")};
  // await buyMeACoffee.connect(tipper).buyCoffee("Ab", "Hello", tip);
  // await buyMeACoffee.connect(tipper2).buyCoffee("vampire", "This is just for fun!", tip);
  // await buyMeACoffee.connect(tipper3).buyCoffee("vampireAb", "Well, lets see.", tip);

  // console.log("===COFFEE BOUGHT===");
  // await printBalances(addresses);

  // console.log("===WITHDRAWING TO OWNER===");
  // await buyMeACoffee.connect(owner).withdrawTips();

  // console.log("===WITHDRAWN===");
  // await printBalances(addresses);

  // console.log("===Memos===");
  // const memos = await buyMeACoffee.getMemos();
  // printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
