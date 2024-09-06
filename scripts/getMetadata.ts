import { ethers } from "hardhat";

async function getNFTMetadataFromTxHash(txHash: string) {
  const monke = await ethers.getContractAt("Monke", "0x5FbDB2315678afecb367f032d93F642f64180aa3"); // Replace with your actual contract address

  // Fetch the transaction receipt
  console.log(txHash)
  const txReceipt = await ethers.provider.getTransactionReceipt(txHash);

  // ABI for Transfer event
  const abi = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
  ];

  // Create an interface to parse the log
  const iface = new ethers.Interface(abi);

  // Filter the logs from the receipt to find the Transfer event

  const fnl = await monke.getAddress()

  const log = txReceipt!.logs.find(log => log.address === fnl);
  if (!log) {
    throw new Error("Transfer event not found in this transaction.");
  }

  const parsedLog = iface.parseLog(log);
  const tokenId = parsedLog!.args.tokenId;

  // Get the metadata for the token ID
  const metadata = await monke.getTokenMetadata(tokenId);
  console.log("Token ID:", tokenId.toString());
  console.log("URL:", metadata[1]);  // URL is the second value in the metadata struct
}

// Example usage
const txHash = "0xb04f2bb4d802d5025ebe72354cba9a5f7ee761599d5fb90dbacde33d6049153c"

getNFTMetadataFromTxHash(txHash)
  .then(() => console.log("Success"))
  .catch((error) => console.error("Error:", error));
