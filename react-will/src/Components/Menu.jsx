import React from 'react';
import {Icon, Menu} from 'semantic-ui-react';

const MenuBar = ({showNewWill, homeHandler, clickHandler}) => {
  console.log(showNewWill);
  return (
    <React.Fragment>
      <Menu icon="labeled">
        <Menu.Menu>
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
        <Menu.Item name="Home" onClick={homeHandler} position="right">
          <Icon name="home" />
          Home
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
};

export default MenuBar;
