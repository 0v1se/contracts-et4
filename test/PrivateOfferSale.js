var Sale = artifacts.require('PrivateOfferSale.sol');
var Token = artifacts.require('Eticket4Token.sol');

const tests = require("@daonomic/tests-common");
const awaitEvent = tests.awaitEvent;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract("PrivateOfferSale", accounts => {
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

  it("should calculate bonus correctly", async () => {
    async function testBonus(days, sold, testBonus) {
        var diff = -days * 86400;
        var now = new Date().getTime() / 1000;
        var sale = await Sale.new(token.address, 100, now + diff, now + diff + 86400 * 100, 1000000);
        assert(testBonus.equals(await sale.getBonus(sold)));
    }

    await testBonus(0, 100, bn(40));
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
