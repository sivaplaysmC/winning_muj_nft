import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VerifiedModule", (m) => {
  const monke = m.contract("Verified", ["MonkeNFT", "MNFT"])
  return { monke }
})

