/* global BigInt */
// https://github.com/eslint/eslint/issues/11524#issuecomment-473790677

import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from 'react-router-dom';
import { timeIsoFormat, quantityWithDivisibility } from '../utils';

function baseState(asset_name) {
    return {
        asset_name,
        asset_btc_xcp: false,
        asset_not_found: null,
        asset_row: null,

        tip_blocks_row: null,

        issuances: [],
        destructions: [],

        subassets: [],

        balances: [], // "holders"
        // vs. escrows
        orders: [],
        dispensers: [],

        orders_get: [], // orders this asset can be exchanged for
    };
}

class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = baseState(props.router.params.assetName);
    }

    async fetchData(asset_name) {

        let asset_response = {};

        // handle subasset redirect
        if (asset_name.includes('.')) {
            try {
                const subasset_response = await getCntrprty(`/subasset/${asset_name}`);
                this.props.router.navigate(`/asset/${subasset_response.asset_row.asset_name}`, { replace: true });
            }
            catch (e) {
                this.setState({
                    asset_not_found: true,
                });
            }
        }
        else {

            this.setState(baseState(asset_name));

            try {
                asset_response = await getCntrprty(`/asset/${asset_name}`);
            }
            catch (e) {
                asset_response.asset_row = null;
            }

            if (!asset_response.asset_row) {
                this.setState({
                    asset_not_found: true,
                });
            }
            else if (['BTC', 'XCP'].includes(asset_name)) {

                this.setState({
                    asset_btc_xcp: true,
                    asset_row: asset_response.asset_row,
                });
                    
                // vs escrows (orders and dispensers)
                const escrows_response = await getCntrprty(`/asset/${asset_name}/escrows`);
                this.setState({
                    orders: escrows_response.tables.orders,
                    dispensers: escrows_response.tables.dispensers,
                });

                // order exchanges (other side of escrow)
                const exchanges_response = await getCntrprty(`/asset/${asset_name}/exchanges`);
                this.setState({
                    orders_get: exchanges_response.tables.orders_get,
                });

            }
            else {

                // first add duplicate data handling flags
                let last_description = asset_response.tables.issuances[0].description;
                for (let i = 0; i < asset_response.tables.issuances.length; i++) {
                    const issuance = asset_response.tables.issuances[i];

                    issuance.display_source = false; // only display for the first (is a genesis transfer)                    
                    if (i === 0) { // TODO should be FIRST VALID...
                        if (issuance.source !== issuance.issuer) issuance.display_source = true;
                    }

                    issuance.display_lock_with_description = true; // (ONLY USE IF LOCKED) only display if is first or different
                    if (i) {
                        if (issuance.description === last_description) issuance.display_lock_with_description = false;
                    }

                    last_description = issuance.description;
                }

                this.setState({
                    asset_name,
                    asset_btc_xcp: false,
                    asset_not_found: null,
                    asset_row: asset_response.asset_row,
                    tip_blocks_row: asset_response.tip_blocks_row,
                    issuances: asset_response.tables.issuances,
                    destructions: asset_response.tables.destructions,
                });

                // check subassets
                const subassets_response = await getCntrprty(`/asset/${asset_name}/subassets`);

                this.setState({
                    subassets: subassets_response.assets,
                });

                // get holders (could be 0)
                const balances_response = await getCntrprty(`/asset/${asset_name}/balances`);
                this.setState({
                    balances: balances_response.balances,
                });

                // vs escrows (orders and dispensers)
                const escrows_response = await getCntrprty(`/asset/${asset_name}/escrows`);
                this.setState({
                    orders: escrows_response.tables.orders,
                    dispensers: escrows_response.tables.dispensers,
                });

                // order exchanges (other side of escrow)
                const exchanges_response = await getCntrprty(`/asset/${asset_name}/exchanges`);
                this.setState({
                    orders_get: exchanges_response.tables.orders_get,
                });

            }

        }

    }

    async componentDidMount() {
        await this.fetchData(this.state.asset_name);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.assetName;
        if (updatedProp !== prevProps.router.params.assetName) {
            await this.fetchData(updatedProp);
        }
    }

    render() {

        let asset_metadata = (<p>loading...</p>);
        if (this.state.asset_not_found) {
            asset_metadata = (
                <p>asset not found... or it is misspelled (is case sensitive)... or genesis issuance is still in the mempool...</p>
            );
        }
        else if (this.state.asset_btc_xcp) {

            let markets_element = null;

            let protocol_base = '';

            if (this.state.asset_name === 'BTC') {
                protocol_base = 'Base protocol';

                const asset_page = true;

                const asset_metadata = {
                    asset: 'BTC',
                    divisible: true,
                };

                markets_element = (
                    <>
                        <h3>Market:</h3>
    
                        <h4>Open exchange orders:</h4>
    
                        <p>Asset in escrow:</p>
                        {ListElements.getTableRowOrdersHeader(asset_metadata)}
                        {this.state.orders.map((orders_row, index) => {
                            return ListElements.getTableRowOrders(orders_row, index, asset_metadata.divisible, asset_page);
                        })}
    
                        <p>Asset requested:</p>
                        {ListElements.getTableRowOrdersHeader_get(asset_metadata)}
                        {this.state.orders_get.map((orders_row, index) => {
                            return ListElements.getTableRowOrders_get(orders_row, index, asset_metadata.divisible);
                        })}
                    </>
                );

            }
            else if (this.state.asset_name === 'XCP') {
                protocol_base = 'Protocol';

                const asset_page = true;

                const asset_metadata = {
                    asset: 'XCP',
                    divisible: true,
                };

                markets_element = (
                    <>
                        <h3>Market:</h3>
    
                        <h4>Open dispensers:</h4>
                        {ListElements.getTableRowDispensersHeader(asset_metadata)}
                        {this.state.dispensers.map((dispensers_row, index) => {
                            return ListElements.getTableRowDispensers(dispensers_row, index, asset_metadata.divisible, asset_page);
                        })}
    
                        <h4>Open exchange orders:</h4>
    
                        <p>Asset in escrow:</p>
                        {ListElements.getTableRowOrdersHeader(asset_metadata)}
                        {this.state.orders.map((orders_row, index) => {
                            return ListElements.getTableRowOrders(orders_row, index, asset_metadata.divisible, asset_page);
                        })}
    
                        <p>Asset requested:</p>
                        {ListElements.getTableRowOrdersHeader_get(asset_metadata)}
                        {this.state.orders_get.map((orders_row, index) => {
                            return ListElements.getTableRowOrders_get(orders_row, index, asset_metadata.divisible);
                        })}
                    </>
                );

            }

            asset_metadata = (
                <>
                    <h3>{protocol_base} asset: {this.state.asset_name}</h3>
                    <ul>
                        <li>asset id: {this.state.asset_row.asset_id}</li>
                        <li>divisible: true (satoshi)</li>
                    </ul>
                    {markets_element}
                </>
            );
        }
        else if (this.state.asset_row) {

            const all_issuance_events = [
                ...this.state.issuances.map((obj) => {
                    obj.issuance_event_type = 'issuance'; // singular
                    return obj;
                }),
                ...this.state.destructions.map((obj) => {
                    obj.issuance_event_type = 'destroy'; // singular
                    return obj;
                })
            ];
            all_issuance_events.sort((a, b) => a.block_index - b.block_index);

            const genesis_issuance = all_issuance_events.find((obj) => obj.status === 'valid');
            const lock_issuance = all_issuance_events.find((obj) => (obj.status === 'valid' && obj.locked));

            let total_integer = BigInt(0); // ALWAYS use BigInt...
            // let total_integer = 0;
            for (const issuance_event of all_issuance_events) {
                if (issuance_event.status === 'valid') {
                    if (issuance_event.issuance_event_type === 'issuance') {
                        total_integer += BigInt(issuance_event.quantity_text); // ... AND ALWAYS use _text variant (except for divisions that don't work well with BigInt, use util.formatDivision)
                        // total_integer += BigInt(issuance_event.quantity);
                        // total_integer += issuance_event.quantity;
                    }
                    else { // issuance_event.issuance_event_type === 'destroy'
                        total_integer -= BigInt(issuance_event.quantity_text);
                    }
                }
            }

            const quantity_with_divisibility = quantityWithDivisibility(genesis_issuance.divisible, total_integer); // ALWAYS use quantityWithDivisibility when divisibility is relevant (not talking about units)
            // const quantity_with_divisibility = genesis_issuance.divisible ? (total_integer / (10 ** 8)).toFixed(8) : total_integer;

            const issuance_events_message = this.state.destructions.length ?
                `All issuance (and destroy) transactions:` :
                `All issuance transactions:`;


            // CIP3 dumb!
            const reset_issuance = this.state.issuances.find((obj) => (obj.status === 'valid' && obj.reset === 1));


            // detect superasset if is asset_longname
            let superasset = null;
            if (this.state.asset_row.asset_longname) {
                const split = this.state.asset_row.asset_longname.split('.');
                superasset = split[0];
            }


            // show subassets if applies
            let subassets_element = null;
            if (this.state.subassets.length) {
                subassets_element = (
                    <>
                        <h3>Subassets:</h3>
                        {ListElements.getTableRowSubassetsHeader()}
                        {this.state.subassets.map((assets_row, index) => {
                            return ListElements.getTableRowSubassets(assets_row, index);
                        })}
                    </>
                );
            }


            // balances + escrows(orders, dispensers) = total_integer(issuances - destructions)
            let verify_total_integer = BigInt(0);

            let verify_total_integer_balances = BigInt(0);
            for (const balances_row of this.state.balances) {
                verify_total_integer_balances += BigInt(balances_row.quantity_text);
            }

            let verify_total_integer_orders = BigInt(0);
            for (const orders_row of this.state.orders) {
                verify_total_integer_orders += BigInt(orders_row.give_remaining_text);
            }

            let verify_total_integer_dispensers = BigInt(0);
            for (const dispensers_row of this.state.dispensers) {
                verify_total_integer_dispensers += BigInt(dispensers_row.give_remaining_text);
            }

            verify_total_integer = verify_total_integer_balances + verify_total_integer_orders + verify_total_integer_dispensers;

            const verify_quantity_with_divisibility = quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer);


            let issuances_summary_element = (
                <>

                    <ul>
                        <li>issuance events: {this.state.issuances.length} issuances, {this.state.destructions.length} destructions</li>
                    </ul>
                    <br />

                    <ul>
                        <li>locked supply: {lock_issuance ? 'true' : 'false'}</li>
                        
                        {reset_issuance ?
                            (<>{<li>v9.60 RESET ASSET</li>}</>)
                            :
                            (
                                <>
                                    <li>current supply: <strong>{quantity_with_divisibility}</strong></li>
                                    <li>
                                        verify (
                                        {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_balances)} in balances +
                                        {' '}
                                        {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_orders)} in open orders +
                                        {' '}
                                        {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_dispensers)} in open dispensers):
                                        {' '}
                                        {verify_quantity_with_divisibility}
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </>
            );


            let balances_element = null;
            let markets_element = null;

            if (this.state.balances.length && !reset_issuance) { // not dealing with reset assets (at least for now...)
                function balancesSortAddress(a, b) {
                    if (BigInt(b.quantity_text) === BigInt(a.quantity_text)) {
                        if (a.address < b.address) {
                            return -1;
                        }
                        if (a.address > b.address) {
                            return 1;
                        }
                        return 0;
                    }
                    else {
                        // keeping quantity here as it needs to return a Number and is not critical (is only about sorting)
                        // return BigInt(b.quantity_text) - BigInt(a.quantity_text);
                        return b.quantity - a.quantity;
                    }
                }
                const asset_page = true;

                balances_element = (
                    <>
                        <h3>Balances (asset holders):</h3>
                        {ListElements.getTableRowBalanceAddressHeader(asset_page)}
                        {this.state.balances.sort(balancesSortAddress).map((balances_row, index) => {
                            return ListElements.getTableRowBalanceAddress(balances_row, index, asset_page);
                        })}
                    </>
                );

                markets_element = (
                    <>
                        <h3>Market:</h3>

                        <h4>Open dispensers:</h4>

                        {ListElements.getTableRowDispensersHeader(genesis_issuance)}
                        {this.state.dispensers.map((dispensers_row, index) => {
                            return ListElements.getTableRowDispensers(dispensers_row, index, genesis_issuance.divisible, asset_page);
                        })}

                        <h4>Open exchange orders:</h4>

                        <p>Asset in escrow:</p>
                        {ListElements.getTableRowOrdersHeader(genesis_issuance)}
                        {this.state.orders.map((orders_row, index) => {
                            return ListElements.getTableRowOrders(orders_row, index, genesis_issuance.divisible, asset_page);
                        })}

                        <p>Asset requested:</p>
                        {ListElements.getTableRowOrdersHeader_get(genesis_issuance)}
                        {this.state.orders_get.map((orders_row, index) => {
                            return ListElements.getTableRowOrders_get(orders_row, index, genesis_issuance.divisible);
                        })}
                    </>
                );
            }


            asset_metadata = (
                <>

                    <ul>
                        <li><strong>Genesis:</strong>
                        <br />
                        <br />

                    {this.state.asset_row.asset_longname ?
                        (
                            <ul>
                                <li>superasset: <Link to={`/asset/${superasset}`}>{superasset}</Link></li>
                            </ul>
                        )
                        : (null)
                    }

                    <ul>
                        {this.state.asset_row.asset_longname ?
                            (<li>asset longname: {this.state.asset_row.asset_longname}</li>)
                            : (null)
                        }
                        <li>asset name: {this.state.asset_row.asset_name}</li>
                        <li>asset id: {this.state.asset_row.asset_id}</li>
                    </ul>
                    <ul>
                        <li>block: <Link to={`/block/${this.state.asset_row.block_index}`}>{this.state.asset_row.block_index}</Link></li>
                        <li>block time: {timeIsoFormat(genesis_issuance.block_time)}</li>
                    </ul>
                    <ul>
                        <li>divisible: {genesis_issuance.divisible ? 'true (satoshi)' : 'false'}</li>
                    </ul>

                        </li>
                    </ul>
                    
                    <ul>
                        <li><strong>Issuances state:</strong> as of block {this.state.tip_blocks_row.block_index} ({timeIsoFormat(this.state.tip_blocks_row.block_time)})
                            <br />
                            <br />
                            {issuances_summary_element}
                        </li>
                    </ul>

                    <ul>
                        <li>
                            For <strong>[m]</strong>edia visit <strong>bitSTART</strong>:{' '}
                            <a href={`https://bitst.art/${this.state.asset_row.asset_name}`} target="_blank">/{this.state.asset_row.asset_name}</a>
                        </li>
                    </ul>

                    {subassets_element}

                    {markets_element}

                    <h3>{issuance_events_message}</h3>

                    <table>
                        <tbody>
                            {ListElements.getTableRowIssuanceEventsAssetHeader()}
                            {all_issuance_events.map((issuance_event_row, index) => {

                                if (issuance_event_row.issuance_event_type === 'issuance') {
                                    return ListElements.getTableRowIssuanceEventsIssuanceAsset(issuance_event_row, index, genesis_issuance.divisible);
                                }
                                else { // issuance_event_row.issuance_event_type === 'destroy'
                                    return ListElements.getTableRowIssuanceEventsDestroyAsset(issuance_event_row, index, genesis_issuance.divisible);
                                }

                            })}
                        </tbody>
                    </table>

                    {balances_element}

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
