const Will = artifacts.require('Will');

contract('Will', (accounts) => {
  let will;
  let ONE_ETH = 1e18;
  beforeEach(async () => {
    will = await Will.new({from: accounts[0], gas: 2000000});
    await will.initWill({value: ONE_ETH, from: accounts[0]});
  });
  it('Should create a will in correct state and amount', async () => {
    let amount = await will.getTotalAmount({from: accounts[0]});
    let etherAmount = web3.utils.toBN('1000000000000000000');
    expect(amount).to.deep.equal(etherAmount);

    //await will.editWill(
    //[accounts[1], accounts[2], accounts[3]],
    //[3e17, 3e17, 4e17],
    //{from: accounts[0]},
    //);

    //let beneficiaries = await will.getAllBeneficiaries({from: accounts[0]});
    //expect(beneficiaries[0]).to.deep.equal(accounts[1]);
    //expect(beneficiaries[1]).to.deep.equal(accounts[2]);
    //expect(beneficiaries[2]).to.deep.equal(accounts[3]);
  });
});
