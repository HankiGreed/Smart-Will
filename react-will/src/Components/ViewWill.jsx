import React, {Component} from 'react';
import {Container, Table, Button, Divider} from 'semantic-ui-react';
import createContract from '../Ethereum/WillContract.js';
import web3 from '../Ethereum/web3.js';
import contractAddress from '../Ethereum/contractAddress.js';
import MenuBar from './Menu.jsx';

class ViewWill extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      willAmount: 0,
      willState: 0,
      beneficiaries: [],
      shares: [],
      state: 0,
    };
  }
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const Will = await createContract(contractAddress);
    const willAmount = await Will.methods
      .getTotalAmount()
      .call({from: this.state.account});
    const beneficiaries = await Will.methods
      .getAllBeneficiaries()
      .call({from: this.state.account})
      .catch((error) => console.log(error));
    const shares = await Will.methods
      .getSharesOfBeneficiaries()
      .call({from: this.state.account})
      .catch((error) => console.log(error));
    const stateOfWill = await Will.methods
      .getWillState()
      .call({from: this.state.account});
    this.setState({
      account: accounts[0],
      beneficiaries: beneficiaries,
      shares: shares,
      willAmount: willAmount,
      willState: stateOfWill,
    });
  }

  deleteWill = async () => {
    let Will = await createContract(contractAddress);
    await Will.methods.deleteWill().send({from: this.state.account});
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <MenuBar
            address={this.state.account}
            willStatButton={this.state.willState}
          />
        </Container>
        <Divider />
        <Container>
          <Table color="blue" celled>
            <Table.Header>
              <Table.HeaderCell content="Beneficiary" />
              <Table.HeaderCell content="Share" />
            </Table.Header>
            <Table.Body>
              {this.state.beneficiaries.map((beneficiary, index) => {
                return (
                  <Table.Row>
                    <Table.Cell>{beneficiary}</Table.Cell>
                    <Table.Cell>{this.state.shares[index]}</Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row active>
                <Table.Cell>Total Will Amount :</Table.Cell>
                <Table.Cell>{this.state.willAmount}</Table.Cell>
              </Table.Row>
            </Table.Body>
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colspan="2">
                  <Button
                    icon="bin"
                    content="Delete Will"
                    fluid
                    color="red"
                    onClick={this.deleteWill}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Container>
      </React.Fragment>
    );
  }
}
export default ViewWill;
