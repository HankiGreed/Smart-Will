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

class App extends Component {
  constructor() {
    super();
    this.state = {
      account: 'none',
      willExists: false,
      willDetails: {},
    };
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
            {this.state.willExists ? (
              <Route exact path="/" component={Greet} />
            ) : (
              <Route exact path="/" component={ViewWill} />
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
