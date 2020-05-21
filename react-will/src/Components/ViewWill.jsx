import React, {Component} from 'react';
import {Container, Table} from 'semantic-ui-react';

class ViewWill extends Component {
  constructor() {
    super();
    this.state = {
      willAmount: 0,
      beneficiaries: [],
      shares: [],
      state: 0,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Table color="blue" striped>
            <Table.Header>
              <Table.HeaderCell content="Beneficiary" />
              <Table.HeaderCell content="Share" />
              {this.state.beneficiaries.map((beneficiary, index) => {
                return (
                  <Table.Row>
                    <Table.Cell>{beneficiary}</Table.Cell>
                    <Table.Cell>{this.shares[index]}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Header>
          </Table>
        </Container>
      </React.Fragment>
    );
  }
}
export default ViewWill;
