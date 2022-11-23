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

        let address_metadata = (<p>loading...</p>);
        if (this.state.tables) {

            function balancesSort(a, b) {
                if (b.quantity === a.quantity) {
                    const mainname_a = a.asset_longname ? a.asset_longname : a.asset;
                    const mainname_b = b.asset_longname ? b.asset_longname : b.asset;
                    if (mainname_a < mainname_b) {
                        return -1;
                    }
                    if (mainname_a > mainname_b) {
                        return 1;
                    }
                    return 0;
                }
                else {
                    return b.quantity - a.quantity;
                }
            };

            const address_balances_element = (
                <>
                    <table>
                        <tbody>
                            {ListElements.getTableRowBalanceAddressHeader()}
                            {this.state.tables.balances.sort(balancesSort).map((balance_row, index) => {
                                // {this.state.tables.balances.sort((a, b) => b.quantity - a.quantity).map((balance_row, index) => {
                                // {this.state.tables.balances.map((balance_row, index) => {
                                return ListElements.getTableRowBalanceAddress(balance_row, index);
                            })}
                        </tbody>
                    </table>
                </>
            );

            const address_broadcasts_element = (
                <>
                    <table>
                        <tbody>
                            {ListElements.getTableRowBroadcastAddressHeader()}
                            {this.state.tables.broadcasts.map((broadcast_row, index) => {
                                return ListElements.getTableRowBroadcastAddress(broadcast_row, index);
                            })}
                        </tbody>
                    </table>
                </>
            );

            address_metadata = (
                <>
                    <h3>Balances (sorted by most units on top, then alphabetically):</h3>
                    {/* <h3>Balances (sorted by most units on top):</h3> */}
                    {/* <h3>Balances:</h3> */}
                    {address_balances_element}

                    <h3>Broadcasts:</h3>
                    {address_broadcasts_element}
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
