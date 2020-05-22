import React, {Component} from 'react';
import {
  Icon,
  Container,
  Button,
  Form,
  Table,
  Divider,
  Statistic,
  Grid,
} from 'semantic-ui-react';
import contractAddress from '../Ethereum/contractAddress.js';
import createContract from '../Ethereum/WillContract.js';
import web3 from '../Ethereum/web3';

class EditWill extends Component {
  constructor(props) {
    window.ethereum.enable();
    super(props);
    this.state = {
      account: '',
      willState: 0,
      willAmount: 0,
      willEnd: new Date(0),
      beneficiaries: [],
      shares: [],
      beneficiary: '',
      share: '',
      beneficiaryError: false,
      shareError: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteBeneficiary = this.deleteBeneficiary.bind(this);
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const Will = await createContract(contractAddress);
    const stateOfWill = await Will.methods
      .getWillState()
      .call({from: this.state.account});
    const willAmount = web3.utils
      .toBN(
        await Will.methods.getTotalAmount().call({from: this.state.account}),
      )
      .toString(10);
    const beneficiaries = await Will.methods
      .getAllBeneficiaries()
      .call({from: this.state.account})
      .catch((error) => console.log(error));
    const shares = await Will.methods
      .getSharesOfBeneficiaries()
      .call({from: this.state.account})
      .catch((error) => console.log(error));
    const willEnd = await Will.methods
      .getCurrentEndDate()
      .call({from: this.state.account})
      .catch((error) => console.log(error));
    this.setState({
      beneficiaries: beneficiaries,
      shares: shares,
      willState: stateOfWill,
      willEnd: willEnd,
      willAmount: willAmount.toString(),
    });
    console.log('Did Mount ', accounts, stateOfWill, willEnd);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.beneficiary === '') this.setState({beneficiaryError: true});
    if (this.state.share === '') this.setState({shareError: true});
    if (this.state.beneficiary !== '' && this.state.share !== '') {
      const shareInWei = web3.utils.toWei(this.state.share, 'ether');
      if (
        web3.utils.toBN(this.state.willAmount).gte(web3.utils.toBN(shareInWei))
      ) {
        this.setState({
          beneficiaries: [...this.state.beneficiaries, this.state.beneficiary],
          shares: [
            ...this.state.shares,
            web3.utils.toWei(this.state.share, 'ether'),
          ],
          willAmount: this.state.willAmount - shareInWei,
        });
        this.setState({beneficiary: '', share: ''});
      }
    }
  };

  deleteBeneficiary = (i) => {
    const newBeneficiaries = this.state.beneficiaries.filter(
      (item, j) => i !== j,
    );
    const newShares = this.state.shares.filter((item, j) => i !== j);
    this.setState({
      beneficiaries: newBeneficiaries,
      shares: newShares,
      willAmount: this.state.willAmount + parseInt(this.state.shares[i]),
    });
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
    this.setState({beneficiaryError: false, shareError: false});
  };

  render() {
    return (
      <React.Fragment>
        <Grid columns={1}>
          <Grid.Row>
            <Container textAlign="center">
              <Statistic>
                <Statistic.Label>Remaining Will Amount In Wei</Statistic.Label>
                <Statistic.Value>
                  <Icon name="ethereum" />
                  {this.state.willAmount}
                </Statistic.Value>
              </Statistic>
            </Container>
          </Grid.Row>
          <Grid.Row>
            <Container>
              <Table color="blue" celled structured>
                <Table.Header>
                  <Table.HeaderCell content="Beneficiary" />
                  <Table.HeaderCell content="Share" colspan="2" />
                </Table.Header>
                {this.state.beneficiaries.length === 0 ? (
                  <Table.Footer fullWidth>
                    <Table.Row active>
                      <Table.HeaderCell colspan="2">
                        You Don't have any beneficiaries, Add Below !
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                ) : (
                  <Table.Body>
                    {this.state.beneficiaries.map((beneficiary, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{beneficiary}</Table.Cell>
                          <Table.Cell>{this.state.shares[index]}</Table.Cell>
                          <Table.Cell>
                            <Button
                              primary
                              position="right"
                              onClick={() => this.deleteBeneficiary(index)}>
                              Delete
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                )}
              </Table>
            </Container>
          </Grid.Row>
          <Divider horizontal content="Add Beneficiary" />
          <Grid.Row>
            <Container>
              <Form fullWidth colspan="2">
                <Form.Group widths="equal">
                  <Form.Input
                    error={this.state.beneficiaryError}
                    onChange={this.onChange}
                    name="beneficiary"
                    required
                    value={this.state.beneficiary}
                    fluid
                    label="Beneficiary Address"
                    placeholder="0x...."
                  />
                  <Form.Input
                    error={this.state.shareError}
                    onChange={this.onChange}
                    fluid
                    required
                    value={this.state.share}
                    name="share"
                    label="Share In Amount"
                    placeholder="In Eth"
                  />
                </Form.Group>
                <Button
                  disabled={this.state.willAmount === 0}
                  size="big"
                  fluid
                  type="submit"
                  content="Add"
                  icon
                  labelPosition="right"
                  color="teal"
                  onClick={this.handleSubmit}>
                  <Icon name="plus" />
                  Add Beneficiary !
                </Button>
              </Form>
            </Container>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}
export default EditWill;
