var TokenHolder = artifacts.require('TokenHolder.sol');
var Token = artifacts.require('Eticket4Token.sol');

const tests = require("@daonomic/tests-common");
const awaitEvent = tests.awaitEvent;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract("TokenHolder", accounts => {
  let token;

  beforeEach(async function() {
    token = await Token.new();
  });

  function bn(value) {
    return new web3.BigNumber(value);
  }

  it("should transfer tokens from holder", async () => {
    var holder = await TokenHolder.new(token.address);
    await token.mint(holder.address, 3000);

    var address = randomAddress();
    await holder.transfer(address, 1000);

    assert.equal(await token.totalSupply(), 3000);
    assert.equal(await token.balanceOf(address), 1000);
    assert.equal(await token.balanceOf(holder.address), 2000);
  });

  it("should let burn unused tokens", async () => {
    var holder = await TokenHolder.new(token.address);
    await token.mint(holder.address, 3000);

    var address = randomAddress();
    await holder.transfer(address, 1000);
    await holder.burn(2000);

    assert.equal(await token.totalSupply(), 1000);
    assert.equal(await token.balanceOf(address), 1000);
    assert.equal(await token.balanceOf(holder.address), 0);
  });
});
