import React, {Component} from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import history from './history';
import Greet from './Components/Greet';
import ViewWill from './Components/ViewWill';
import EditWill from './Components/EditWill';
import NotFound from './Components/NotFound';
import MenuBar from './Components/Menu';
import 'semantic-ui-css/semantic.min.css';
import {Container} from 'semantic-ui-react';
import CreateWill from './Components/CreateWill';
import contractAddress from './Ethereum/contractAddress.js';
import createContract from './Ethereum/WillContract.js';
import web3 from './Ethereum/web3.js';

class App extends Component {
  constructor() {
    super();
    window.ethereum.enable();
    this.state = {
      account: 'none',
      willState: 0,
      willDetails: {},
    };
  }

  async componentDidMount() {
    let Will = await createContract(contractAddress);
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });
    const willState = await Will.methods
      .getWillState()
      .call({from: this.state.account});
    this.setState({willState: willState});
  }

  navigateToHome = (e) => {
    e.preventDefault();
    history.push('/');
  };

  navigationHandler = (e) => {
    e.preventDefault();
    this.state.willExists
      ? history.push(`/editwill/${this.state.account}`)
      : history.push(`/createwill/${this.state.account}`);
  };

  render() {
    return (
      <Router history={history}>
        <Container>
          <MenuBar
            showNewWill={this.state.willExists}
            homeHandler={this.navigateToHome}
            clickHandler={this.navigationHandler}
          />
          <Switch>
            {this.state.willState !== '0' ? (
              <Route exact path="/" component={ViewWill} />
            ) : (
              <Route exact path="/">
                <Greet account={this.state.account} />
              </Route>
            )}
            <Route exact path="/createwill/:address" component={CreateWill} />
            <Route exact path="/editwill/:address" component={EditWill} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Router>
    );
  }
}

export default App;
