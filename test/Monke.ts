import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { ethers } from "hardhat";
import { expect } from "chai";

describe("Monke", function () {

  async function deployMonkeFixture() {
    const MonkeFactory = await ethers.getContractFactory("Monke");
    const [owner, addr1] = await ethers.getSigners();

    const monke = await MonkeFactory.deploy("MonkeNFT", "MNFT");

    return { monke, owner, addr1 };
  }

  it("Should deploy the contract with the correct name and symbol", async function () {
    const { monke } = await loadFixture(deployMonkeFixture);

    expect(await monke.name()).to.equal("MonkeNFT");
    expect(await monke.symbol()).to.equal("MNFT");
  });

  it("Should mint a new NFT with metadata", async function () {
    const { monke, addr1, owner } = await loadFixture(deployMonkeFixture);

    const validTill = Math.floor(Date.now() / 1000) + 86400; // valid for 1 day
    const url = "https://example.com/nft/1";

    // Mint an NFT for addr1
    const mintTx = await monke.connect(owner).mintNFT(addr1.address, validTill, url);
    await mintTx.wait();

    // Check that the owner of the token is addr1
    expect(await monke.ownerOf(1)).to.equal(addr1.address);

    // Retrieve the metadata
    const metadata = await monke.getTokenMetadata(1);
    expect(metadata[0]).to.equal(validTill);
    expect(metadata[1]).to.equal(url);
  });

  it("Should revert when trying to retrieve metadata for a non-existent token", async function () {
    const { monke } = await loadFixture(deployMonkeFixture);

    await expect(monke.getTokenMetadata(2)).to.be.revertedWith("Token does not exist");
  });

  it("Should verify that a token exists", async function () {
    const { monke, owner, addr1 } = await loadFixture(deployMonkeFixture);

    const validTill = Math.floor(Date.now() / 1000) + 86400; // valid for 1 day
    const url = "https://example.com/nft/1";

    // Mint an NFT for addr1
    const mintTx = await monke.connect(owner).mintNFT(addr1.address, validTill, url);
    await mintTx.wait();

    expect(await monke.ownerOf(1)).to.equal(addr1.address);
    expect(await monke.ownerOf(1)).to.not.equal(owner.address);
  });

  it("Should return correct validity and URL for minted tokens", async function () {
    const { monke, owner, addr1 } = await loadFixture(deployMonkeFixture);

    const validTill = Math.floor(Date.now() / 1000) + 86400; // valid for 1 day
    const url = "https://example.com/nft/1";

    // Mint an NFT for addr1
    const mintTx = await monke.connect(owner).mintNFT(addr1.address, validTill, url);
    await mintTx.wait();

    const metadata = await monke.getTokenMetadata(1);
    expect(metadata[1]).to.equal(url);
    expect(metadata[0]).to.be.closeTo(validTill, 100); // Time difference margin
  });
});
