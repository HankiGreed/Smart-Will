import React from 'react';
import {Icon, Menu} from 'semantic-ui-react';

const MenuBar = ({showNewWill, homeHandler, clickHandler}) => {
  console.log(showNewWill);
  return (
    <React.Fragment>
      <Menu icon="labeled">
        <Menu.Item name="Home" onClick={homeHandler}>
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Menu position="right">
          {!showNewWill ? (
            <Menu.Item name="New Will" onClick={clickHandler} as="a">
              <Icon name="plus" color="blue" />
              New Will
            </Menu.Item>
          ) : (
            <Menu.Item name="Edit Will" onClick={clickHandler} as="a">
              <Icon name="edit" color="green" />
              Edit Will
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>
    </React.Fragment>
  );
};

export default MenuBar;
