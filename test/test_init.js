const Will = artifacts.require('TestWill');

contract('Will', (accounts) => {
  let will;
  let ONE_ETH = 1e18;

  const NonExistent = 0;
  const Created = 1;
  const Active = 2;
  const PaidOut = 3;

  beforeEach(async () => {
    will = await Will.new({from: accounts[0], gas: 2000000});
    await will.initWill({value: 3 * ONE_ETH, from: accounts[0]});
  });
  it('Should have the right amount and state', async () => {
    let amount = await will.getTotalAmount({from: accounts[0]});
    let etherAmount = web3.utils.toBN('3000000000000000000');
    expect(amount).to.deep.equal(etherAmount);
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(Created);
  });
  it('Should Initialize will and store correct details', async () => {
    let etherAmount = web3.utils.toBN('1000000000000000000');
    await will.editWill(
      [accounts[1], accounts[2], accounts[3]],
      [etherAmount, etherAmount, etherAmount],
      599,
      {from: accounts[0]},
    );

    let beneficiaries = await will.getAllBeneficiaries({from: accounts[0]});
    let shares = await will.getSharesOfBeneficiaries({from: accounts[0]});
    expect(shares[0]).to.deep.equal(etherAmount);
    expect(shares[1]).to.deep.equal(etherAmount);
    expect(shares[2]).to.deep.equal(etherAmount);
    expect(beneficiaries[0]).to.deep.equal(accounts[1]);
    expect(beneficiaries[1]).to.deep.equal(accounts[2]);
    expect(beneficiaries[2]).to.deep.equal(accounts[3]);

    let endDate = await will.getCurrentEndDate({from: accounts[0]});
    expect(Math.floor(endDate.toNumber() / 10)).to.equal(
      Math.floor((Date.now() + 599000) / 10000),
    );
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(Active);
  });

  it('Should let owner make modifications', async () => {
    let etherAmount = web3.utils.toBN('1000000000000000000');
    await will.editWill(
      [accounts[1], accounts[3]],
      [etherAmount, etherAmount],
      899,
      {from: accounts[0]},
    );

    let beneficiaries = await will.getAllBeneficiaries({from: accounts[0]});
    let shares = await will.getSharesOfBeneficiaries({from: accounts[0]});
    expect(shares[0]).to.deep.equal(etherAmount);
    expect(shares[1]).to.deep.equal(etherAmount);
    expect(beneficiaries[0]).to.deep.equal(accounts[1]);
    expect(beneficiaries[1]).to.deep.equal(accounts[3]);

    let endDate = await will.getCurrentEndDate({from: accounts[0]});
    /*Added one second cus there's a gap between EVM's time and 
        system time (System time is one more)*/
    expect(Math.floor(endDate.toNumber() / 10)).to.equal(
      Math.floor((Date.now() + 899000) / 10000),
    );
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(Active);
  });

  it('Should payout wills after deadline', async () => {
    let etherAmount = web3.utils.toBN('1000000000000000000');
    await will.editWill(
      [accounts[1], accounts[3]],
      [etherAmount, etherAmount],
      899,
      {from: accounts[0]},
    );
    await will.setCurrentTime(910, {from: accounts[0]});
    let beforeBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
    await will.payoutExpiredWills({from: accounts[0]});
    let afterBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
    afterBalance.isub(beforeBalance);
    expect(afterBalance).to.deep.equal(etherAmount);
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(PaidOut);
  });

  it('Should let people delete will and get money back', async () => {
    let etherAmount = web3.utils.toBN('1000000000000000000');
    let threeEtherAmount = web3.utils.toBN('3000000000000000000');
    await will.editWill(
      [accounts[1], accounts[3]],
      [etherAmount, etherAmount],
      899,
      {from: accounts[0]},
    );

    let beforeBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
    await will.deleteWill({from: accounts[0]});
    let afterBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
    expect(afterBalance.gt(beforeBalance)).to.equal(true);
    let state = await will.getWillState({from: accounts[0]});
    expect(state.valueOf().toNumber()).to.equal(NonExistent);
  });
});
