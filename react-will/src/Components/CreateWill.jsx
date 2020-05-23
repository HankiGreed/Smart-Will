import React, {Component} from 'react';
import {Container, Input, Message, Divider} from 'semantic-ui-react';
import contractAddress from '../Ethereum/contractAddress';
import createContract from '../Ethereum/WillContract';
import web3 from '../Ethereum/web3.js';
import history from '../history.js';
import MenuBar from './Menu.jsx';

class CreateWill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      willState: 0,
      account: '',
      amount: 0,
      endDate: new Date(0),
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const Will = await createContract(contractAddress);
    console.log('Prop Address : ', this.props.match.params['address']);
    let willState = await Will.methods
      .getWillState()
      .call({from: this.props.match.params['address']});
    if (willState !== '0') {
      history.push(`/editwill/${this.props.match.params['address']}`);
    }
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
    this.setState({[e.target.name]: e.target.value});
  };
  render() {
    return (
      <React.Fragment>
        <Container>
          <MenuBar />
        </Container>
        <Divider />
        <Container textAlign="center">
          <Input
            size="big"
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
          <Divider />
          <Message
            size="big"
            icon="ethereum"
            header="Pay Some Ether "
            content="By paying some ether you create a will to which you can add benficiaries next."
          />
        </Container>
      </React.Fragment>
    );
  }
}
export default CreateWill;
