import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("KasOrganisasi", function () {
  async function deployKasOrganisasiFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const KasOrganisasi = await ethers.getContractFactory("KasOrganisasi");
    const kasOrganisasi = await KasOrganisasi.deploy();
    return { kasOrganisasi, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { kasOrganisasi, owner } = await loadFixture(deployKasOrganisasiFixture);
      expect(await kasOrganisasi.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should add income transaction correctly", async function () {
      const { kasOrganisasi, owner } = await loadFixture(deployKasOrganisasiFixture);
      
      await expect(kasOrganisasi.addTransaction("Dana Punia", 500000, true))
        .to.emit(kasOrganisasi, "TransactionAdded")
        .withArgs(1, "Dana Punia", 500000, true, (val: any) => val > 0);

      const balance = await kasOrganisasi.getBalance();
      expect(balance.income).to.equal(500000);
      expect(balance.expense).to.equal(0);
      expect(balance.balance).to.equal(500000);
      
      const count = await kasOrganisasi.getTransactionCount();
      expect(count).to.equal(1);
    });

    it("Should add past transaction correctly with custom timestamp", async function () {
      const { kasOrganisasi } = await loadFixture(deployKasOrganisasiFixture);
      
      const currentBlock = await ethers.provider.getBlock("latest");
      const pastTime = currentBlock!.timestamp - 86400 * 30; // 30 days ago
      
      await expect(kasOrganisasi.addPastTransaction("Dana Punia Lama", 1000000, true, pastTime))
        .to.emit(kasOrganisasi, "TransactionAdded")
        .withArgs(1, "Dana Punia Lama", 1000000, true, pastTime);

      const count = await kasOrganisasi.getTransactionCount();
      expect(count).to.equal(1);
    });

    it("Should revert past transaction if timestamp is in the future", async function () {
      const { kasOrganisasi } = await loadFixture(deployKasOrganisasiFixture);
      
      const currentBlock = await ethers.provider.getBlock("latest");
      const futureTime = currentBlock!.timestamp + 86400; // 1 day in the future
      
      await expect(kasOrganisasi.addPastTransaction("Future Income", 1000000, true, futureTime))
        .to.be.revertedWith("Tanggal tidak boleh di masa depan");
    });

    it("Should add expense transaction correctly if sufficient balance", async function () {
      const { kasOrganisasi } = await loadFixture(deployKasOrganisasiFixture);
      
      await kasOrganisasi.addTransaction("Dana Punia", 1000000, true);
      await kasOrganisasi.addTransaction("Beli Banten", 300000, false);

      const balance = await kasOrganisasi.getBalance();
      expect(balance.income).to.equal(1000000);
      expect(balance.expense).to.equal(300000);
      expect(balance.balance).to.equal(700000);
    });

    it("Should revert expense transaction if insufficient balance", async function () {
      const { kasOrganisasi } = await loadFixture(deployKasOrganisasiFixture);
      
      await kasOrganisasi.addTransaction("Dana Punia", 500000, true);
      
      await expect(kasOrganisasi.addTransaction("Beli Banten", 600000, false))
        .to.be.revertedWith("Saldo tidak mencukupi");
    });

    it("Should revert if non-owner tries to add transaction", async function () {
      const { kasOrganisasi, otherAccount } = await loadFixture(deployKasOrganisasiFixture);
      
      await expect(kasOrganisasi.connect(otherAccount).addTransaction("Hack", 10000, true))
        .to.be.revertedWith("Akses ditolak: hanya bendahara");
    });
    
    it("Should revert if description is empty", async function () {
        const { kasOrganisasi } = await loadFixture(deployKasOrganisasiFixture);
        
        await expect(kasOrganisasi.addTransaction("", 500000, true))
          .to.be.revertedWith("Keterangan tidak boleh kosong");
    });

    it("Should revert if nominal is zero", async function () {
        const { kasOrganisasi } = await loadFixture(deployKasOrganisasiFixture);
        
        await expect(kasOrganisasi.addTransaction("Test", 0, true))
          .to.be.revertedWith("Nominal harus lebih dari 0");
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership correctly", async function () {
      const { kasOrganisasi, owner, otherAccount } = await loadFixture(deployKasOrganisasiFixture);
      
      await expect(kasOrganisasi.transferOwnership(otherAccount.address))
        .to.emit(kasOrganisasi, "OwnershipTransferred")
        .withArgs(owner.address, otherAccount.address);
        
      expect(await kasOrganisasi.owner()).to.equal(otherAccount.address);
    });

    it("Should prevent non-owner from transferring ownership", async function () {
      const { kasOrganisasi, otherAccount } = await loadFixture(deployKasOrganisasiFixture);
      const thirdAccount = ethers.Wallet.createRandom().address;
      
      await expect(kasOrganisasi.connect(otherAccount).transferOwnership(thirdAccount))
        .to.be.revertedWith("Akses ditolak: hanya bendahara");
    });
  });
});
