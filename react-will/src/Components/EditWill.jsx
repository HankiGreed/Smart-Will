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
import MenuBar from './Menu.jsx';

class EditWill extends Component {
  constructor(props) {
    window.ethereum.enable();
    super(props);
    this.state = {
      color: 'teal',
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
      dateError: false,
      saveDisabled: true,
      modalOpen: false,
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
      willAmount: willAmount,
    });
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
        const remaining = web3.utils
          .toBN(this.state.willAmount)
          .isub(web3.utils.toBN(shareInWei))
          .toString();
        this.setState({
          beneficiaries: [...this.state.beneficiaries, this.state.beneficiary],
          shares: [
            ...this.state.shares,
            web3.utils.toWei(this.state.share, 'ether'),
          ],
          willAmount: remaining,
        });
        this.setState({beneficiary: '', share: ''});
        if (remaining === '0') {
          this.setState({saveDisabled: false, color: 'red'});
        }
      }
    }
  };

  handleSave = async () => {
    if (new Date(this.state.willEnd).getTime() < new Date().getTime()) {
      this.setState({dateError: true});
    } else if (this.state.saveDisabled === true) {
      this.setState({modalOpen: true});
    } else {
      const Will = await createContract(contractAddress);
      const dateinUnix = Math.floor(
        new Date(this.state.willEnd).getTime() / 1000,
      );
      await Will.methods
        .editWill(this.state.beneficiaries, this.state.shares, dateinUnix)
        .send({from: this.state.account});
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
      willAmount: web3.utils
        .toBN(this.state.willAmount)
        .iadd(web3.utils.toBN(this.state.shares[i]))
        .toString(),
      saveDisabled: true,
      color: 'teal',
    });
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
    this.setState({
      beneficiaryError: false,
      shareError: false,
      dateError: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <MenuBar
            address={this.state.address}
            willStatButton={'2'}
            condition={this.state.saveDisabled}
          />
        </Container>
        <Divider />
        <Grid columns={1}>
          <Grid.Row>
            <Container textAlign="center">
              <Statistic color={this.state.color} size="small">
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
                    size="small"
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
                    size="small"
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
                  disabled={!this.state.saveDisabled}
                  size="medium"
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
          <Grid.Row>
            <Container>
              <Form fullWidth colspan="2">
                <Form.Group widths="equal">
                  <Form.Input
                    error={this.state.dateError}
                    type="date"
                    fluid
                    label="Will Payout Date"
                    name="willEnd"
                    onChange={this.onChange}
                    required
                    min={new Date(0)}
                  />
                </Form.Group>
                <Button
                  fluid
                  type="submit"
                  icon
                  labelPosition="right"
                  color="youtube"
                  onClick={this.handleSave}>
                  <Icon name="save" />
                  Save The Will !
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
