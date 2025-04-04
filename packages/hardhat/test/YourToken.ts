import { expect } from "chai";
import { ethers } from "hardhat";
import { YourToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("YourToken", function () {
  let token: YourToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  const initialSupply = ethers.parseEther("21000000");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("YourToken");
    token = await Token.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
      expect(ownerBalance).to.equal(initialSupply);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("YourToken");
      expect(await token.symbol()).to.equal("YT");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await token.transfer(addr1.address, 50);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(token.connect(addr1).transfer(owner.address, 1)).to.be.revertedWithCustomError(
        token,
        "ERC20InsufficientBalance",
      );

      // Owner balance shouldn't have changed
      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1
      await token.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2
      await token.transfer(addr2.address, 50);

      // Check balances
      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("ETH Handling", function () {
    it("Should receive ETH", async function () {
      const amount = ethers.parseEther("1.0");
      await owner.sendTransaction({
        to: await token.getAddress(),
        value: amount,
      });
      expect(await ethers.provider.getBalance(await token.getAddress())).to.equal(amount);
    });

    it("Should allow owner to withdraw ETH", async function () {
      const amount = ethers.parseEther("1.0");
      await owner.sendTransaction({
        to: await token.getAddress(),
        value: amount,
      });

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      const tx = await token.withdraw();
      const receipt = await tx.wait();
      if (!receipt) throw new Error("No receipt");
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance + amount - gasUsed);
      expect(await ethers.provider.getBalance(await token.getAddress())).to.equal(0);
    });

    it("Should prevent non-owner from withdrawing ETH", async function () {
      const amount = ethers.parseEther("1.0");
      await owner.sendTransaction({
        to: await token.getAddress(),
        value: amount,
      });

      await expect(token.connect(addr1).withdraw()).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await token.transferOwnership(addr1.address);
      expect(await token.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owner from transferring ownership", async function () {
      await expect(token.connect(addr1).transferOwnership(addr2.address)).to.be.revertedWithCustomError(
        token,
        "OwnableUnauthorizedAccount",
      );
    });
  });
});
