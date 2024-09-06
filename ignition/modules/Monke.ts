import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MonkeModule", (m) => {
  const monke = m.contract("Monke", ["MonkeNFT", "MNFT"])
  return { monke }
})

