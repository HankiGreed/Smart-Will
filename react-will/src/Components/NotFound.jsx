import React, {Component} from 'react';
import {Message, Container} from 'semantic-ui-react';

class NotFound extends Component {
  render() {
    return (
      <Container textAlign="center">
        <Message
          negative
          size="massive"
          icon="warning sign"
          header="Not Found !"
          content="How did you even get to this page ?"
        />
      </Container>
    );
  }
}
export default NotFound;
