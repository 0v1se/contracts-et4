var Sale = artifacts.require('EthBtcSale.sol');
var Token = artifacts.require('FinalToken.sol');

const tests = require("@daonomic/tests-common");
const awaitEvent = tests.awaitEvent;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract("EthBtcSale", accounts => {
  let token;

  beforeEach(async function() {
    token = await Token.new();
  });

  function bn(value) {
    return new web3.BigNumber(value);
  }

  it("should sell tokens for ether", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 100, now + 86400, 1000000);
    await token.transferOwnership(sale.address);

    await sale.sendTransaction({from: accounts[1], value: 1});
    assert.equal(await token.totalSupply(), 750);
    assert.equal(await token.balanceOf(accounts[1]), 750);
  });

  it("should calculate bonus correctly", async () => {
    async function testBonus(days, sold, testBonus) {
        var diff = -days * 86400;
        var now = new Date().getTime() / 1000;
        var sale = await Sale.new(token.address, 100, now + diff, now + diff + 86400 * 100, 1000000);
        assert(testBonus.equals(await sale.getBonus(sold)));
    }

    await testBonus(0, 100, bn(50));
    await testBonus(10, 100, bn(45));
    await testBonus(50, 100, bn(15));
    await testBonus(100, 100, bn(0));
    await testBonus(100, bn("1000000000000000000000"), bn(0));
    await testBonus(100, bn("2000000000000000000000"), bn("100000000000000000000"));
    await testBonus(100, bn("5000000000000000000000"), bn("250000000000000000000"));
    await testBonus(100, bn("6000000000000000000000"), bn("450000000000000000000"));
    await testBonus(100, bn("12000000000000000000000"), bn("1200000000000000000000"));
    await testBonus(100, bn("18000000000000000000000"), bn("2250000000000000000000"));
    await testBonus(100, bn("50000000000000000000000"), bn("7500000000000000000000"));
  });

  it("should calculate bonus according to custom bonus", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 100, now + 86400 * 100, 1000000);

	assert(bn(500).equals(await sale.getBonus(1000)));
    await sale.setCustomBonus(5);
    assert(bn(5).equals(await sale.getBonus(1000)));
  });

  it("should not sell if ended", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 1000, now - 100, 1000000);
    await token.transferOwnership(sale.address);

	await expectThrow(
	  sale.sendTransaction({from: accounts[1], value: 1})
	);
  });

  it("should transfer token ownership", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 1000, now + 86400, 1000000);
    await token.transferOwnership(sale.address);

	await expectThrow(
      token.mint(randomAddress(), 100)
	);
	await expectThrow(
	  token.mint(accounts[3], 100, {from: accounts[1]})
	);
	await sale.transferTokenOwnership(accounts[1]);
	await token.mint(accounts[3], 100, {from: accounts[1]});
	assert.equal(await token.balanceOf(accounts[3]), 100);
  });

  it("should throw if cap reached", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 100, now + 86400, 500);
    await token.transferOwnership(sale.address);

	await expectThrow(
	  sale.sendTransaction({from: accounts[1], value: 2})
	);
    await sale.sendTransaction({from: accounts[1], value: 1});
	await expectThrow(
	  sale.sendTransaction({from: accounts[1], value: 1})
	);
  });

});
