import React from 'react';
import {Container, Message} from 'semantic-ui-react';

const Greet = ({account}) => {
  return (
    <React.Fragment>
      <Container width={10}>
        <Message
          color="orange"
          size="huge"
          icon="chess"
          header={`Hey ${account} ! `}
        />
        <Message
          color="grey"
          size="massive"
          icon="ethereum"
          header="Will Smart Contract"
          content="This is a smart contract that you pay ether to and register your will. The smart contract then lets you add beneficiaries to whom you provide a certain share of your will amount. The amount you sent will be sent to the beneficiearies after your will expires. Before your will's deadline you are free to edit or even delete your will, wherein the amount will be paid back to you."
        />
        <Message
          color="teal"
          header="Looks Good ?"
          size="huge"
          icon="angle double up"
          content="To get started, Click the New Will button above !"
        />
      </Container>
    </React.Fragment>
  );
};
export default Greet;
