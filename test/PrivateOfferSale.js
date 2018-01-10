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

  it("should calculate bonus correctly", async () => {
    async function testBonus(days, sold, testBonus) {
        var diff = -days * 86400;
        var now = new Date().getTime() / 1000;
        var sale = await Sale.new(token.address, 100, now + diff, now + diff + 86400 * 100, 1000000);
        assert(testBonus.equals(await sale.getBonus(sold)));
    }

    await testBonus(0, 100, bn(40));
  });
});
