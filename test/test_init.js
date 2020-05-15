const Will = artifacts.require('Will');

contract('Will', (accounts) => {
  let will;
  let ONE_ETH = 1e18;

  //const NonExistent = 0;
  const Created = 1;
  const Active = 2;
  //const OverDeadline = 3;
  //const PaidOut = 4;

  beforeEach(async () => {
    will = await Will.new({from: accounts[0], gas: 2000000});
    await will.initWill({value: ONE_ETH, from: accounts[0]});
  });
  it('Should have the right amount and state', async () => {
    let amount = await will.getTotalAmount({from: accounts[0]});
    let etherAmount = web3.utils.toBN('1000000000000000000');
    expect(amount).to.deep.equal(etherAmount);
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(Created);
  });
  it('Should Initialize will and store correct details', async () => {
    await will.editWill(
      [accounts[1], accounts[2], accounts[3]],
      [3000000000000, 3000000000000, 4000000000000],
      599,
      {from: accounts[0]},
    );

    let beneficiaries = await will.getAllBeneficiaries({from: accounts[0]});
    let shares = await will.getSharesOfBeneficiaries({from: accounts[0]});
    expect(shares[0].toNumber()).to.equal(3000000000000);
    expect(shares[1].toNumber()).to.equal(3000000000000);
    expect(shares[2].toNumber()).to.equal(4000000000000);
    expect(beneficiaries[0]).to.deep.equal(accounts[1]);
    expect(beneficiaries[1]).to.deep.equal(accounts[2]);
    expect(beneficiaries[2]).to.deep.equal(accounts[3]);

    let endDate = await will.getCurrentEndDate({from: accounts[0]});
    expect(endDate.toNumber()).to.equal(599);
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(Active);
  });

  it('Should let owner make modifications', async () => {
    await will.editWill(
      [accounts[1], accounts[3]],
      [3000000000000, 3000000000000],
      509,
      {from: accounts[0]},
    );

    let beneficiaries = await will.getAllBeneficiaries({from: accounts[0]});
    let shares = await will.getSharesOfBeneficiaries({from: accounts[0]});
    expect(shares[0].toNumber()).to.equal(3000000000000);
    expect(shares[1].toNumber()).to.equal(3000000000000);
    expect(beneficiaries[0]).to.deep.equal(accounts[1]);
    expect(beneficiaries[1]).to.deep.equal(accounts[3]);

    let endDate = await will.getCurrentEndDate({from: accounts[0]});
    expect(endDate.toNumber()).to.equal(509);
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(Active);
  });
});
