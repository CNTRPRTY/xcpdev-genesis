import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from 'react-router-dom';

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

            const address_open_dispensers_element = (
                <>
                    <table>
                        <tbody>
                            {ListElements.getTableRowDispensersHeader_addressPage()}
                            {this.state.tables.dispensers.open.map((dispensers_row, index) => {
                                return ListElements.getTableRowDispensers_addressPage(dispensers_row, index);
                            })}
                        </tbody>
                    </table>
                </>
            );

            const address_closed_dispensers_element = (
                <>
                    <table>
                        <tbody>
                            {ListElements.getTableRowDispensersHeader_addressPage()}
                            {this.state.tables.dispensers.closed.map((dispensers_row, index) => {
                                return ListElements.getTableRowDispensers_addressPage(dispensers_row, index);
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


            // this.state.tables.issuances are all valid BUT can include other issuers

            let assets_bag = this.state.tables.issuances.map((issuances_row) => issuances_row.asset);
            const unique_assets_array = Array.from(new Set(assets_bag));

            let genesis_issuances = {};
            for (const asset of unique_assets_array) {

                // assign the minimum tx_index issuance per name
                genesis_issuances[asset] = this.state.tables.issuances
                    .filter(row => row.asset === asset)
                    .reduce(function (prev, curr) {
                        // minimum
                        return prev.tx_index < curr.tx_index ? prev : curr;
                    });

            }

            const issuer_genesis_issuances = [];
            const issuer_transfer_issuances_pre = []; // to later find their transfer issuance
            for (const issuances_row of Object.values(genesis_issuances)) {
                if (issuances_row.issuer === this.state.address) {
                    issuer_genesis_issuances.push(issuances_row);
                }
                else {
                    issuer_transfer_issuances_pre.push(issuances_row);
                }
            }

            const issuer_transfer_issuances = [];
            for (const issuances_row of issuer_transfer_issuances_pre) {

                // assuming asc order
                const transfer_issuance = this.state.tables.issuances
                    .filter(row => row.asset === issuances_row.asset)
                    .find(row => row.issuer === this.state.address);
                issuer_transfer_issuances.push(transfer_issuance);

            }


            const issuer_page = true;
            const issuer_genesis_element = (
                <>
                    <table>
                        <tbody>
                            {ListElements.getTableRowIssuanceEventsAssetHeader(issuer_page)}
                            {issuer_genesis_issuances.sort((a, b) => a.tx_index - b.tx_index).map((issuances_row, index) => {
                                return ListElements.getTableRowIssuanceEventsIssuanceAsset(issuances_row, index, issuances_row.divisible, issuer_page);
                            })}
                        </tbody>
                    </table>
                </>
            );
            const issuer_transfer_element = (
                <>
                    <table>
                        <tbody>
                            {ListElements.getTableRowIssuanceEventsAssetHeader(issuer_page)}
                            {issuer_transfer_issuances.sort((a, b) => a.tx_index - b.tx_index).map((issuances_row, index) => {
                                return ListElements.getTableRowIssuanceEventsIssuanceAsset(issuances_row, index, issuances_row.divisible, issuer_page);
                            })}
                        </tbody>
                    </table>
                </>
            );

            address_metadata = (
                <>
                    <h3>Dispensers:</h3>
                    <h4>Open:</h4>
                    {address_open_dispensers_element}
                    <h4>Closed:</h4>
                    {address_closed_dispensers_element}

                    <h3>Balances:</h3>
                    <p><Link to={`/wallet#${this.state.address}`}>Wallet: {this.state.address}</Link></p>

                    <h3>Broadcasts:</h3>
                    {address_broadcasts_element}

                    <h3>Asset issuances:</h3>
                    <h4>Genesis:</h4>
                    {issuer_genesis_element}
                    <h4>Transfer:</h4>
                    {issuer_transfer_element}
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
