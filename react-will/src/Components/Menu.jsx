import React from 'react';
import {Icon, Menu, Popup} from 'semantic-ui-react';
import history from '../history';
import web3 from '../Ethereum/web3';
import createContract from '../Ethereum/WillContract';
import contractAddress from '../Ethereum/contractAddress';

const buttonSelector = (state, address, clickHandler, condition) => {
  if (state === '1' || state === '2') {
    return (
      <Menu.Item
        name="Edit Will"
        onClick={() =>
          history.push(`/createwill/${address}`, {address: address})
        }
        as="a">
        <Icon name="edit" color="green" />
        Edit Will
      </Menu.Item>
    );
  } else {
    return (
      <Menu.Item
        name="New Will"
        onClick={() => history.push(`/createwill/${address}`)}
        as="a">
        <Icon name="plus" color="blue" />
        New Will
      </Menu.Item>
    );
  }
};

const payoutExpiredWill = async (address) => {
  console.log('called');
  let Will = await createContract(contractAddress);
  await Will.methods.payoutExpiredWills().send({from: address});
};

const MenuBar = ({address, willStatButton, condition}) => {
  return (
    <React.Fragment>
      <Menu icon="labeled">
        <Menu.Menu>
          {buttonSelector(willStatButton, address, condition)}
          <Popup
            content="This button pays-out all the wills that are expired"
            trigger={
              <Menu.Item onclick={() => payoutExpiredWill(address)} as="a">
                <Icon name="share" color="olive" />
                Payout Wills
              </Menu.Item>
            }
          />
        </Menu.Menu>
        <Menu.Item
          name="Home"
          onClick={() => history.push('/')}
          position="right">
          <Icon name="home" />
          Home
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
};

export default MenuBar;
