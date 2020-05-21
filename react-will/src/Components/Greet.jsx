import React from 'react';
import {Container, Header} from 'semantic-ui-react';

const Greet = ({props}) => {
  return (
    <React.Fragment>
      <Container text>
        <Header as="h2">Will Smart Contract</Header>
        <p>
          This is smart contract that you pay ether to and add your will. The
          smart contract then lets you add beneficiaries to whom you provide a
          certain share of your will amount. The amount you sent will be sent to
          the beneficiearies after your will expires. Before your will's
          deadline you are free to edit or even delete your will, wherein the
          amount will be paid back to you.
        </p>
        <Header as="h4">
          To get started, Click the New Will button above !
        </Header>
      </Container>
    </React.Fragment>
  );
};
export default Greet;
