import React from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import history from '../history';

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

const MenuBar = ({address, willStatButton, condition}) => {
  return (
    <React.Fragment>
      <Menu icon="labeled">
        <Menu.Menu>
          {buttonSelector(willStatButton, address, condition)}
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
