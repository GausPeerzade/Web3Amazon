const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { ethers } = require("hardhat"); //you can or cannot use it hardhat have inbuit ether so doesnot matter

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();

    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();

  })

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    })
  })

  describe("Smart Contract Testing", () => {
    let transaction;
    let buyT;
    const ID = 1;
    const NAME = "gaus";
    const CATEGORY = "cloth";
    const IMG = "img";
    const COST = tokens(1);
    const RATING = 4;
    const STOCK = 2;
    beforeEach(async () => {

      transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMG, COST, RATING, STOCK);
      await transaction.wait();

      buyT = await dappazon.connect(buyer).buy(ID, { value: COST });
    })
    it("Returning details", async () => {
      const item = await dappazon.items(1);
      expect(item.id).to.equal(1);
      expect(item.name).to.equal("gaus");
      expect(item.category).to.equal("cloth");
      expect(item.image).to.equal("img");
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(4);
      expect(item.stock).to.equal(1);
    })

    it("deposit the ethereum", async () => {
      const deposit = await ethers.provider.getBalance(dappazon.address);
      //console.log(await ethers.utils.formatEther(deposit.toString())); //converted the wei value to ether
      expect(deposit).to.equal(COST);
    })

    it("Withdraw from the contract", async () => {
      const withdraw = await dappazon.connect(deployer).withdraw();
      let dep = await ethers.provider.getBalance(dappazon.address);
      expect(dep).to.equal(0);
    })

    it("change the owner address", async () => {
      transaction = await dappazon.connect(deployer).changeOwner(buyer.address);
      expect(await dappazon.owner()).to.equal(buyer.address);
    })

  })

})
