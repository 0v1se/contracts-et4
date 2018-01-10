var Sale = artifacts.require('PreSale.sol');
var Token = artifacts.require('Eticket4Token.sol');

const tests = require("@daonomic/tests-common");
const awaitEvent = tests.awaitEvent;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract("PreSale", accounts => {
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

    await testBonus(0, 100, bn(15));
    await testBonus(6, 100, bn(12));
    await testBonus(11, 100, bn(10));
    await testBonus(18, 100, bn(10));
    await testBonus(21, 100, bn(8));
    await testBonus(100, bn("1000000000000000000000"), bn("80000000000000000000"));
    await testBonus(100, bn("2000000000000000000000"), bn("360000000000000000000"));
    await testBonus(100, bn("6000000000000000000000"), bn("1380000000000000000000"));
    await testBonus(100, bn("11000000000000000000000"), bn("3080000000000000000000"));
    await testBonus(100, bn("16000000000000000000000"), bn("5280000000000000000000"));
    await testBonus(100, bn("50000000000000000000000"), bn("19000000000000000000000"));
  });

});
