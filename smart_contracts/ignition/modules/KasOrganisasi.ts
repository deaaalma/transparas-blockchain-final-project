import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const KasOrganisasiModule = buildModule("KasOrganisasiModule", (m) => {
  const kasOrganisasi = m.contract("KasOrganisasi");

  return { kasOrganisasi };
});

export default KasOrganisasiModule;
