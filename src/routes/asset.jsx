import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from 'react-router-dom';
import { timeIsoFormat, quantityWithDivisibility } from '../utils';

class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asset_name: props.router.params.assetName,
            asset_btc_xcp: false,
            asset_not_found: null,
            asset_row: null,
            issuances: [],
            destructions: [],
            // tables: null,
        };
    }

    async fetchData(asset_name) {

        let asset_response = {};
        try {
            asset_response = await getCntrprty(`/asset/${asset_name}`);
        }
        catch (e) {
            asset_response.asset_row = null;
        }

        // console.log(`rrr1`);
        // console.log(JSON.stringify(asset_response));
        // console.log(`rrr2`);

        if (['BTC', 'XCP'].includes(asset_name)) {
            this.setState({
                asset_name,
                asset_btc_xcp: true,
                asset_not_found: false,
                asset_row: asset_response.asset_row,
                issuances: [],
                destructions: [],
                // tables: null,
            });
        }
        else if (!asset_response.asset_row) {
            // if (!asset_response.asset_row) {
            this.setState({
                asset_name,
                asset_btc_xcp: false,
                asset_not_found: true,
                asset_row: null,
                issuances: [],
                destructions: [],
                // tables: null,
            });
        }
        else {
            this.setState({
                asset_name,
                asset_btc_xcp: false,
                asset_not_found: null,
                asset_row: asset_response.asset_row,
                issuances: asset_response.issuances,
                destructions: asset_response.destructions,
                // tables: asset_response.tables,
            });
        }

    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData(this.state.asset_name);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.asset_name;
        if (updatedProp !== prevProps.router.params.asset_name) {
            // not awaiting it
            this.fetchData(updatedProp);
        }
    }

    render() {

        // let asset_metadata = null;
        let asset_metadata = (<p>loading...</p>);
        if (this.state.asset_not_found) {
            // if (!this.state.asset_row) {
            asset_metadata = (
                <p>asset not found (or genesis issuance is still in the mempool...)</p>
                // <p>asset not found (or is still in the mempool...)</p>
                // <p>asset not found (maybe is still in the mempool...)</p>
                // <p>asset not found</p>
            );
        }
        else if (this.state.asset_btc_xcp) {
            // TODO when the backend is ready maybe elaborate...
            asset_metadata = (
                <>
                    <h3>Protocol asset: {this.state.asset_name}</h3>
                    <ul>
                        <li>asset_id: {this.state.asset_row.asset_id}</li>
                        <li>divisible: true</li>
                    </ul>
                </>
            );
        }
        else if (this.state.asset_row) {
            // else {

            const all_issuance_events = [
                ...this.state.issuances.map((obj) => {
                    obj.issuance_event_type = 'issuance';
                    // obj.issuance_event_type = 'issuances';
                    return obj;
                }),
                ...this.state.destructions.map((obj) => {
                    obj.issuance_event_type = 'destroy';
                    // obj.issuance_event_type = 'destructions';
                    return obj;
                })
            ];
            all_issuance_events.sort((a, b) => a.block_index - b.block_index);

            const genesis_issuance = all_issuance_events.find((obj) => obj.status === 'valid');
            const lock_issuance = all_issuance_events.find((obj) => (obj.status === 'valid' && obj.locked));

            // // TODO may be rethought... because at the moment it makes an array copy just for this
            // const last_description = [...all_issuance_events].reverse().find((obj) => (obj.status === 'valid' && obj.description !== ''));

            // console.log(`wwww1`);
            // console.log(genesis_issuance);
            // console.log(`wwww2`);
            // console.log(genesis_issuance.divisible);
            // console.log(`wwww3`);

            let total_integer = 0;
            for (const issuance_event of all_issuance_events) {
                if (issuance_event.status === 'valid') {
                    if (issuance_event.issuance_event_type === 'issuance') {
                        total_integer += issuance_event.quantity;
                    }
                    else { // issuance_event.issuance_event_type === 'destroy'
                        total_integer -= issuance_event.quantity;
                    }
                }
            }

            const quantity_with_divisibility = quantityWithDivisibility(genesis_issuance.divisible, total_integer);
            // const quantity_with_divisibility = genesis_issuance.divisible ? (total_integer / (10 ** 8)).toFixed(8) : total_integer;

            const issuance_events_message = this.state.destructions.length ?
                `All issuance (and destroy) events:` :
                `All issuance events:`;

            asset_metadata = (
                <>
                    <h3>Genesis:</h3>
                    {/* <h3>Genesis issuance:</h3> */}
                    <ul>
                        {this.state.asset_row.asset_longname ?
                            (<li>asset_longname: {this.state.asset_row.asset_longname}</li>)
                            : (null)
                        }
                        <li>asset_name: {this.state.asset_row.asset_name}</li>
                        <li>asset_id: {this.state.asset_row.asset_id}</li>
                        {/* <li>block_index: <Link to={`/block/${this.state.asset_row.block_index}`}>{this.state.asset_row.block_index}</Link></li> */}
                        <li>block_index: <Link to={`/block/${this.state.asset_row.block_index}`}>{this.state.asset_row.block_index}</Link></li>
                        <li>block_time_iso: {timeIsoFormat(genesis_issuance.block_time)}</li>
                        {/* <li>satoshi divisibility: {genesis_issuance.divisible ? 'true' : 'false'}</li> */}
                        <li>divisible: {genesis_issuance.divisible ? 'true' : 'false'}</li>
                    </ul>

                    <h3>{issuance_events_message}</h3>
                    {/* <h3>All issuance (and destroy) events:</h3> */}
                    {/* <h3>All issuance / destroy events:</h3> */}

                    <ul>
                        <li>locked supply: {lock_issuance ? 'true' : 'false'}</li>
                        <li>current supply: {quantity_with_divisibility}</li>
                        {/* <li>most recent description: {last_description.description}</li> */}
                        {/* <li>current supply: {quantity_with_divisibility}{lock_issuance ? '' : ' (unlocked)'}</li> */}
                        {/* <li>supply: {quantity_with_divisibility}{lock_issuance ? '' : ' (unlocked)'}</li> */}
                    </ul>

                    {/* <h3>Issuance events</h3> */}

                    <table>
                        <tbody>
                            {ListElements.getTableRowIssuanceEventsAssetHeader()}
                            {all_issuance_events.map((issuance_event_row, index) => {

                                // console.log(`bbb1`);
                                // console.log(JSON.stringify(issuance_event_row));
                                // console.log(`bbb2`);

                                if (issuance_event_row.issuance_event_type === 'issuance') {
                                    return ListElements.getTableRowIssuanceEventsIssuanceAsset(issuance_event_row, index, genesis_issuance.divisible);
                                }
                                else { // issuance_event_row.issuance_event_type === 'destroy'
                                    return ListElements.getTableRowIssuanceEventsDestroyAsset(issuance_event_row, index, genesis_issuance.divisible);
                                }

                                // return ListElements.getTableRowIssuanceEventsAsset(issuance_event_row, index, genesis_issuance.divisible);
                                // // return ListElements.getTableRowIssuanceEventsAsset(issuance_event_row, index);
                                // // const page = 'home'; // TODO?
                                // // return ListElements.getTableRowMessage(message_row, index, page);
                            })}
                        </tbody>
                    </table>
                </>
            );

        }

        const asset_element = (
            <>
                <h2>Asset: {this.state.asset_name}</h2>
                {asset_metadata}
            </>
        );

        return OneElements.getFullPageForRouteElement(asset_element);

    }

}

export default withRouter(Asset);
