import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from 'react-router-dom';

function baseState(address) {
    return {
        address,

        dispensers_open_loading: true,
        dispensers_open_loading_error: null,
        dispensers_open: [],

        dispensers_closed_loading: true,
        dispensers_closed_loading_error: null,
        dispensers_closed: [],

        broadcasts_loading: true,
        broadcasts_loading_error: null,
        broadcasts: [],

        issuances_loading: true,
        issuances_loading_error: null,
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

        try {
            const dispensers_open_response = await getCntrprty(`/address/${address}/dispensers/open`);
            this.setState({
                dispensers_open_loading: false,
                dispensers_open: dispensers_open_response.dispensers_open,
            });
        }
        catch (err) {
            this.setState({
                dispensers_open_loading_error: err,
            });
        }

        try {
            const dispensers_closed_response = await getCntrprty(`/address/${address}/dispensers/closed`);
            this.setState({
                dispensers_closed_loading: false,
                dispensers_closed: dispensers_closed_response.dispensers_closed,
            });
        }
        catch (err) {
            this.setState({
                dispensers_closed_loading_error: err,
            });
        }

        try {
            const broadcasts_response = await getCntrprty(`/address/${address}/broadcasts`);
            this.setState({
                broadcasts_loading: false,
                broadcasts: broadcasts_response.broadcasts,
            });
        }
        catch (err) {
            this.setState({
                broadcasts_loading_error: err,
            });
        }

        try {
            const issuances_response = await getCntrprty(`/address/${address}/issuances`);
            this.setState({
                issuances_loading: false,
                issuances: issuances_response.issuances,
            });
        }
        catch (err) {
            this.setState({
                issuances_loading_error: err,
            });
        }

    }

    async componentDidMount() {
        await this.fetchData(this.state.address);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.address;
        if (updatedProp !== prevProps.router.params.address) {
            await this.fetchData(updatedProp);
        }
    }

    render() {

        let address_open_dispensers_element = (<p>loading...</p>);
        if (this.state.dispensers_open_loading_error) {
            address_open_dispensers_element = (<p>{`${this.state.dispensers_open_loading_error}`}</p>);
        }
        else if (!this.state.dispensers_open_loading) {
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
        if (this.state.dispensers_closed_loading_error) {
            address_closed_dispensers_element = (<p>{`${this.state.dispensers_closed_loading_error}`}</p>);
        }
        else if (!this.state.dispensers_closed_loading) {
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
        if (this.state.broadcasts_loading_error) {
            address_broadcasts_element = (<p>{`${this.state.broadcasts_loading_error}`}</p>);
        }
        else if (!this.state.broadcasts_loading) {
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
                    : (
                        // TODO alignment when empty has not been done (at all?)
                        <p>no broadcasts</p>
                    );
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
        if (this.state.issuances_loading_error) {
            issuer_genesis_element = (<p>{`${this.state.issuances_loading_error}`}</p>);
        }
        else if (!this.state.issuances_loading) {
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
        if (this.state.issuances_loading_error) {
            issuer_transfer_element = (<p>{`${this.state.issuances_loading_error}`}</p>);
        }
        else if (!this.state.issuances_loading) {
            issuer_transfer_element =
                issuer_transfer_issuances.length ?
                    (
                        <>
                            <table>
                                <tbody>
                                    {ListElements.getTableRowIssuanceTransferHeader()}
                                    {/* {ListElements.getTableRowIssuanceEventsAssetHeader(issuer_page)} */}
                                    {issuer_transfer_issuances.sort((a, b) => a.tx_index - b.tx_index).map((issuances_row, index) => {
                                        return ListElements.getTableRowIssuanceTransfer(issuances_row, index);
                                        // return ListElements.getTableRowIssuanceEventsIssuanceAsset(issuances_row, index, issuances_row.divisible, issuer_page);
                                    })}
                                </tbody>
                            </table>
                        </>
                    )
                    : (<p>no transfer issuances</p>);
        }

        const route_element = (
            <div class="py-2 my-2">
                <h2 class="font-bold text-xl mb-1">
                    Address: {this.state.address}
                </h2>

                <div class="py-1 mt-1 mb-4">
                    {/* <div class="py-1 my-1"> */}
                    <span class="font-bold">
                        Balances:
                    </span>
                    {/* <h3 class="font-bold">
                        Balances:
                    </h3> */}
                    {/* <p> */}
                    {' '}
                    <Link to={`/wallet/${this.state.address}`}>xcp.dev/wallet/{this.state.address}</Link>
                    {/* </p> */}
                </div>

                <div class="py-1 my-1">
                    <h3 class="font-bold">
                        Dispensers:
                    </h3>
                    <div class="py-1 my-1">
                        <strong>Open:</strong>
                        {/* <h4>Open:</h4> */}
                        <div class="py-1 my-1">
                            {address_open_dispensers_element}
                        </div>
                    </div>
                    <div class="py-1 my-1">
                        <strong>Closed:</strong>
                        {/* <h4>Closed:</h4> */}
                        <div class="pt-1 mt-1">
                        {/* <div class="py-1 my-1"> */}
                            {address_closed_dispensers_element}
                        </div>
                    </div>
                </div>

                {/* <div class="py-1 my-1">
                    <h3 class="font-bold">
                        Balances:
                    </h3>
                    <p><Link to={`/wallet/${this.state.address}`}>xcp.dev/wallet/{this.state.address}</Link></p>
                </div> */}

                <div class="py-1 my-1">
                    <h3 class="font-bold">
                        Broadcasts:
                    </h3>
                    <div class="py-1 my-1">
                        {address_broadcasts_element}
                    </div>
                </div>

                <div class="py-1 my-1">
                    <h3 class="font-bold">
                        Asset issuances:
                    </h3>
                    <div class="py-1 my-1">
                        <strong>Genesis:</strong>
                        {/* <h4>Genesis:</h4> */}
                        <div class="py-1 my-1">
                            {issuer_genesis_element}
                        </div>
                    </div>
                    <div class="pt-1 mt-1">
                        {/* <div class="py-1 my-1"> */}
                        <strong>Transfer:</strong>
                        {/* <h4>Transfer:</h4> */}
                        <div class="pt-1 mt-1">
                            {/* <div class="py-1 my-1"> */}
                            {issuer_transfer_element}
                        </div>
                    </div>
                </div>
            </div>
        );

        return OneElements.getFullPageForRouteElement(route_element);

    }

}

export default withRouter(Address);
