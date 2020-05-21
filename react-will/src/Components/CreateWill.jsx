import React, {Component} from 'react';
import {Container, Input} from 'semantic-ui-react';

class CreateWill extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = () => {
    console.log();
  };
  render() {
    return (
      <React.Fragment>
        <Container textAlign="center">
          <Input
            action={{color: 'blue', content: 'Send', onClick: this.handleClick}}
            actionPosition="left"
            placeholder="Will Amount .."
            label="ETH"
            labelPosition="right"
          />
        </Container>
      </React.Fragment>
    );
  }
}
export default CreateWill;
