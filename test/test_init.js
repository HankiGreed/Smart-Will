const Will = artifacts.require('Will');

contract('Will', (accounts) => {
  let will;
  let ONE_ETH = 1e18;
  beforeEach(async () => {
    will = await Will.new({from: accounts[0], gas: 2000000});
  });
  it('Should create a will in correct state and amount', async () => {
    await will.initWill({value: ONE_ETH, from: accounts[0]});
    let etherAmount = web3.utils.toBN('1000000000000000000');
    let amount = await will.getTotalAmount({from: accounts[0]});
    expect(amount).to.deep.equal(etherAmount);
  });
});
