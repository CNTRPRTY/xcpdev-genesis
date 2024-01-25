import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from 'react-router-dom';

function baseState(address) {
    return {
        address,

        dispensers_loading: true,
        dispensers_open: [],
        dispensers_closed: [],

        broadcasts_loading: true,
        broadcasts: [],

        issuances_loading: true,
        issuances: [],
    };
}

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = baseState(props.router.params.address);
    }

    async fetchData(address) {

        this.setState(baseState(address));

        // TODO? eventually the requests/setstate could be done in parallel async, but not favorable for the current backend

        const dispensers_response = await getCntrprty(`/address/${address}/dispensers`);
        this.setState({
            dispensers_loading: false,
            dispensers_open: dispensers_response.dispensers_open,
            dispensers_closed: dispensers_response.dispensers_closed,
        });

        const broadcasts_response = await getCntrprty(`/address/${address}/broadcasts`);
        this.setState({
            broadcasts_loading: false,
            broadcasts: broadcasts_response.broadcasts,
        });

        const issuances_response = await getCntrprty(`/address/${address}/issuances`);
        this.setState({
            issuances_loading: false,
            issuances: issuances_response.issuances,
        });

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

        let address_open_dispensers_element = (<p>loading...</p>);
        if (!this.state.dispensers_loading) {
            address_open_dispensers_element =
            this.state.dispensers_open && this.state.dispensers_open.length ?
                (
                    <>
                        <table>
                            <tbody>
                                {ListElements.getTableRowDispensersHeader_addressPage()}
                                {this.state.dispensers_open.map((dispensers_row, index) => {
                                    return ListElements.getTableRowDispensers_addressPage(dispensers_row, index);
                                })}
                            </tbody>
                        </table>
                    </>
                )
                : (<p>no open dispensers</p>);
        }

        let address_closed_dispensers_element = (<p>loading...</p>);
        if (!this.state.dispensers_loading) {
            address_closed_dispensers_element =
            this.state.dispensers_closed && this.state.dispensers_closed.length ?
                (
                    <>
                        <table>
                            <tbody>
                                {ListElements.getTableRowDispensersHeader_addressPage()}
                                {this.state.dispensers_closed.map((dispensers_row, index) => {
                                    return ListElements.getTableRowDispensers_addressPage(dispensers_row, index);
                                })}
                            </tbody>
                        </table>
                    </>
                )
                : (<p>no closed dispensers</p>);
        }

        let address_broadcasts_element = (<p>loading...</p>);
        if (!this.state.broadcasts_loading) {
            address_broadcasts_element =
            this.state.broadcasts && this.state.broadcasts.length ?
                (
                    <>
                        <table>
                            <tbody>
                                {ListElements.getTableRowBroadcastAddressHeader()}
                                {this.state.broadcasts.map((broadcast_row, index) => {
                                    return ListElements.getTableRowBroadcastAddress(broadcast_row, index);
                                })}
                            </tbody>
                        </table>
                    </>
                )
                : (<p>no broadcasts</p>);
        }


            // this.state.tables.issuances are all valid BUT can include other issuers

            let assets_bag = this.state.issuances.map((issuances_row) => issuances_row.asset);
            const unique_assets_array = Array.from(new Set(assets_bag));

            let genesis_issuances = {};
            for (const asset of unique_assets_array) {

                // assign the minimum tx_index issuance per name
                genesis_issuances[asset] = this.state.issuances
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
                const transfer_issuance = this.state.issuances
                    .filter(row => row.asset === issuances_row.asset)
                    .find(row => row.issuer === this.state.address);
                issuer_transfer_issuances.push(transfer_issuance);

            }


            const issuer_page = true;

        let issuer_genesis_element = (<p>loading...</p>);
        if (!this.state.issuances_loading) {
            issuer_genesis_element =
                issuer_genesis_issuances.length ?
                    (
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
                    )
                    : (<p>no genesis issuances</p>);
        }

        let issuer_transfer_element = (<p>loading...</p>);
        if (!this.state.issuances_loading) {
            issuer_transfer_element =
                issuer_transfer_issuances.length ?
                    (
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
                    )
                    : (<p>no transfer issuances</p>);
        }

            const address_metadata = (
                <>
                    <h3>Dispensers:</h3>
                    <h4>Open:</h4>
                    {address_open_dispensers_element}
                    <h4>Closed:</h4>
                    {address_closed_dispensers_element}

                    <h3>Balances:</h3>
                    <p><Link to={`/wallet/${this.state.address}`}>xcp.dev/wallet/{this.state.address}</Link></p>
                    {/* <p><Link to={`/wallet#${this.state.address}`}>Wallet: {this.state.address}</Link></p> */}

                    <h3>Broadcasts:</h3>
                    {address_broadcasts_element}

                    <h3>Asset issuances:</h3>
                    <h4>Genesis:</h4>
                    {issuer_genesis_element}
                    <h4>Transfer:</h4>
                    {issuer_transfer_element}
                </>
            );

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
