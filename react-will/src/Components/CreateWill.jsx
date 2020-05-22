import React, {Component} from 'react';
import {Container, Input, Message} from 'semantic-ui-react';
import contractAddress from '../Ethereum/contractAddress';
import createContract from '../Ethereum/WillContract';
import web3 from '../Ethereum/web3.js';
import history from '../history.js';

class CreateWill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      amount: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.setState({account: this.props.match.params['address']});
  }
  handleClick = async () => {
    let Will = await createContract(contractAddress);

    await Will.methods.initWill().send({
      from: this.state.account,
      value: web3.utils.toWei(this.state.amount, 'ether'),
    });
    history.push(`/editwill/${this.state.account}`);
  };
  onChange = (e) => {
    e.preventDefault();
    this.setState({amount: e.target.value});
  };
  render() {
    return (
      <React.Fragment>
        <Container textAlign="center">
          <Input
            size="huge"
            name="amount"
            action={{color: 'blue', content: 'Send', onClick: this.handleClick}}
            actionPosition="right"
            placeholder="Will Amount .."
            label="ETH"
            labelPosition="left"
            type="number"
            min={1}
            onChange={this.onChange}
          />
          <Message
            size="huge"
            icon="ethereum"
            header="Pay Some Ether"
            content="By paying some ether you create a will to which you can add benficiaries next."
          />
        </Container>
      </React.Fragment>
    );
  }
}
export default CreateWill;
