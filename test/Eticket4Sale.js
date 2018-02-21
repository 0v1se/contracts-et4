var Sale = artifacts.require('PreSale.sol');
var Token = artifacts.require('Eticket4Token.sol');

const tests = require("@daonomic/tests-common");
const awaitEvent = tests.awaitEvent;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract("Eticket4Sale", accounts => {
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
    assert.equal(await token.totalSupply(), 1400);
    assert.equal(await token.balanceOf(accounts[1]), 1400);
  });

  it("should transfer tokens sold some other way (with bonus)", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 100, now + 86400, 1000000);
    await token.transferOwnership(sale.address);

	var address = randomAddress();
    await sale.transferWithBonus(address, 1000);

    assert.equal((await token.totalSupply()).toNumber(), 1400);
    assert.equal((await token.balanceOf(address)).toNumber(), 1400);
    assert.equal(await sale.cap(), 1000000 - 1000);
  });

  it("should transfer tokens sold some other way (no bonus)", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now + 1000, now + 86400, 1000000);
    await token.transferOwnership(sale.address);

	var address = randomAddress();
    await sale.transfer(address, 1000);

    assert.equal((await token.totalSupply()).toNumber(), 1000);
    assert.equal((await token.balanceOf(address)).toNumber(), 1000);
    assert.equal(await sale.cap(), 1000000 - 1000);
  });

  it("should sell tokens for btc", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, accounts[5], now - 100, now + 86400, bn("1000000000000000000000000"));
    await token.transferOwnership(sale.address);

	await sale.onTokenTransfer(0, bn("100000000"), accounts[1], {from: accounts[5]});
    assert(bn("14000000000000000000000").equals(await token.totalSupply()));
    assert(bn("14000000000000000000000").equals(await token.balanceOf(accounts[1])));
  });

  it("should change eth/btc rate", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, accounts[5], now - 100, now + 86400, bn("1000000000000000000000000"));
    await token.transferOwnership(sale.address);

	await sale.setBtcEthRate(bn("50000000000"));
	await sale.onTokenTransfer(0, bn("100000000"), accounts[1], {from: accounts[5]});
    assert(bn("7000000000000000000000").equals(await token.totalSupply()));
    assert(bn("7000000000000000000000").equals(await token.balanceOf(accounts[1])));
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
    var sale = await Sale.new(token.address, 100, now - 100, now + 86400, 1500);
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
