import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.router.params.address,
            address_not_found: null,
            tables: null,
        };
    }

    async fetchData(address) {

        let address_response = {};
        try {
            address_response = await getCntrprty(`/address/${address}`);
        }
        catch (e) {
            address_response.tables = null;
        }

        // console.log(`rrr1`);
        // console.log(JSON.stringify(address_response));
        // console.log(`rrr2`);

        if (!address_response.tables) {
            this.setState({
                address,
                address_not_found: true,
                tables: null,
            });
        }
        else {
            this.setState({
                address,
                address_not_found: null,
                tables: address_response.tables,
            });
        }

    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData(this.state.address);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.address;
        if (updatedProp !== prevProps.router.params.address) {
            // not awaiting it
            this.fetchData(updatedProp);
        }
    }

    render() {

        let address_metadata = null;
        if (this.state.tables) {
            address_metadata = (
                <>
                    <h3>Balances:</h3>
                    <table>
                        <tbody>
                            {ListElements.getTableRowBalanceAddressHeader()}
                            {this.state.tables.balances.map((balance_row, index) => {
                                return ListElements.getTableRowBalanceAddress(balance_row, index);
                            })}
                        </tbody>
                    </table>
                </>
            );
        }

        const address_element = (
            <>
                <h2>Address: {this.state.address}</h2>
                {address_metadata}
            </>
        );

        return OneElements.getFullPageForRouteElement(address_element);

    }

}

export default withRouter(Address);