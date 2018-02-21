var Sale = artifacts.require('PublicSale.sol');
var Token = artifacts.require('Eticket4Token.sol');

const tests = require("@daonomic/tests-common");
const awaitEvent = tests.awaitEvent;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract("PublicSale", accounts => {
  let token;

  beforeEach(async function() {
    token = await Token.new();
  });

  function bn(value) {
    return new web3.BigNumber(value);
  }

  it("should calculate bonus correctly", async () => {
    async function testBonus(days, sold, testBonus) {
        var diff = -days * 86400;
        var now = new Date().getTime() / 1000;
        var sale = await Sale.new(token.address, 100, now + diff, now + diff + 86400 * 100, 1000000);
        var result = await sale.getBonus(sold);
        assert(testBonus.equals(result), testBonus.toNumber() + " != " + result.toNumber());
    }

    await testBonus(0, 100, bn(6));
    await testBonus(6, 100, bn(4));
    await testBonus(11, 100, bn(3));
    await testBonus(18, 100, bn(3));
    await testBonus(21, 100, bn(1));
    await testBonus(100, bn("1000000000000000000000"), bn("10000000000000000000"));
    await testBonus(100, bn("2000000000000000000000"), bn("120000000000000000000"));
    await testBonus(100, bn("6000000000000000000000"), bn("660000000000000000000"));
    await testBonus(100, bn("11000000000000000000000"), bn("1760000000000000000000"));
    await testBonus(100, bn("16000000000000000000000"), bn("3360000000000000000000"));
    await testBonus(100, bn("50000000000000000000000"), bn("13000000000000000000000"));
  });

  it("should sell < 10000 tokens without whitelisting", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 100, now + 86400, 1000000);
    await token.transferOwnership(sale.address);

    await sale.sendTransaction({from: accounts[5], value: bn(99)});
    assert.equal(await token.totalSupply(), 106000);
    assert.equal(await token.balanceOf(accounts[5]), 106000);
  });

  it("should sell >= 10000 tokens only for whitelisted", async () => {
    var now = new Date().getTime() / 1000;
    var sale = await Sale.new(token.address, 100, now - 100, now + 86400, bn("1000000000000000000000000"));
    await sale.transferRole("operator", accounts[0]);
    await token.transferOwnership(sale.address);

    await expectThrow(
        sale.sendTransaction({from: accounts[6], value: bn("9900000000000000000")})
    );
    await sale.setWhitelist(accounts[6], true);
    await sale.sendTransaction({from: accounts[6], value: bn("9900000000000000000")})
    assert(bn("11600000000000000000000").equals(await token.totalSupply()));
    assert(bn("11600000000000000000000").equals(await token.balanceOf(accounts[6])));
  });

});
