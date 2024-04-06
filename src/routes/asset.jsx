/* global BigInt */
// https://github.com/eslint/eslint/issues/11524#issuecomment-473790677

import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from 'react-router-dom';
import { timeIsoFormat, quantityWithDivisibility } from '../utils';

// avoiding duplicate code
function renderMarketSection(dispensers_element, orders_give_element, orders_get_element) {
    return (
        <>
            {/* <div class="py-1 my-1"> */}

            <h3 class="font-bold">
                Market:
            </h3>
            {/* <h3>Market:</h3> */}

            <div class="py-1 my-1">
                {dispensers_element}
            </div>

            <div class="py-1 my-1">

                <h4 class="font-bold">
                    Open exchange orders:
                </h4>
                {/* <h4>Open exchange orders:</h4> */}

                <div class="py-1 my-1">
                    <p class="font-bold dark:text-slate-100">
                        Asset in escrow:
                    </p>
                    {/* <p><strong>Asset in escrow:</strong></p> */}
                    {/* <p>Asset in escrow:</p> */}
                    <div class="py-1 my-1 ml-4 overflow-auto">
                        {orders_give_element}
                    </div>
                    {/* {orders_give_element} */}
                </div>

                <div class="py-1 my-1">
                    <p class="font-bold dark:text-slate-100">
                        Asset requested:
                    </p>
                    {/* <p><strong>Asset requested:</strong></p> */}
                    {/* <p>Asset requested:</p> */}
                    <div class="py-1 my-1 ml-4 overflow-auto">
                        {orders_get_element}
                    </div>
                    {/* {orders_get_element} */}
                </div>

            </div>

            {/* </div> */}
        </>
    );
}

function baseState(asset_name) {
    return {
        asset_name,

        asset_row_loading: true,
        asset_row_loading_error: null,
        asset_row: null,
        // tip_blocks_row: null, // TODO moved to the rest (must confirm to be in sync)

        subassets_loading: true,
        subassets_loading_error: null,
        subassets: [],

        issuances_loading: true,
        issuances_loading_error: null,
        issuances_tip_blocks_row: null,
        issuances: [],

        destructions_loading: true,
        destructions_loading_error: null,
        destructions_tip_blocks_row: null,
        destructions: [],

        balances_loading: true,
        balances_loading_error: null,
        balances_tip_blocks_row: null,
        balances: [], // "holders"

        balances_hide_no_balance: true,

        // escrows //
        dispensers_loading: true,
        dispensers_loading_error: null,
        dispensers_tip_blocks_row: null,
        dispensers: [],

        orders_give_loading: true,
        orders_give_loading_error: null,
        orders_give_tip_blocks_row: null,
        orders_give: [],
        // orders: [],
        // escrows //

        orders_get_loading: true,
        orders_get_loading_error: null,
        orders_get_tip_blocks_row: null,
        orders_get: [], // orders this asset can be exchanged for

    };
}

class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = baseState(props.router.params.assetName);
    }

    async fetchData(asset_name) {

        // let asset_response = {};

        // handle subasset redirect
        if (asset_name.includes('.')) {
            try {
                const subasset_response = await getCntrprty(`/subasset/${asset_name}`);
                this.props.router.navigate(`/asset/${subasset_response.asset_row.asset_name}`, { replace: true });
            }
            catch (err) {
                this.setState({
                    asset_row_loading_error: err,
                });
            }
        }
        else {

            this.setState(baseState(asset_name));

            try {
                const asset_response = await getCntrprty(`/asset/${asset_name}`);
                this.setState({
                    asset_row_loading: false,
                    asset_row: asset_response.asset_row,
                });

                ////////////////////////////////////////
                ////////////////////////////////////////

                // moving issuances first as the divisibility will be needed for the market render
                if (['BTC', 'XCP'].includes(asset_name)) {
                    this.setState({
                        issuances_loading: false, // needed in render
                    });
                }
                else { // if (!['BTC', 'XCP'].includes(asset_name)) {
                    try {
                        const issuances_response = await getCntrprty(`/asset/${asset_name}/issuances`);

                        ///////////////
                        // issuances ux adjustments
                        ///////////////
                        let last_description = issuances_response.issuances[0].description;
                        for (let i = 0; i < issuances_response.issuances.length; i++) {
                            const issuance = issuances_response.issuances[i];

                            issuance.display_source = false; // only display for the first (is a genesis transfer)
                            if (i === 0) {

                                // TODO should be FIRST VALID... discover the issue
                                if (issuance.status !== 'valid') {
                                    throw Error(`first tx invalid asset_name:${asset_name}`);
                                }

                                if (issuance.source !== issuance.issuer) issuance.display_source = true;
                            }

                            issuance.display_lock_with_description = true; // (ONLY USE IF LOCKED) only display if is first or different
                            if (i) {
                                if (issuance.description === last_description) issuance.display_lock_with_description = false;
                            }

                            last_description = issuance.description;
                        }
                        ///////////////
                        ///////////////

                        this.setState({
                            issuances_loading: false,
                            issuances_tip_blocks_row: issuances_response.tip_blocks_row,
                            issuances: issuances_response.issuances,
                        });
                    }
                    catch (err) {
                        this.setState({
                            issuances_loading_error: err,
                        });
                    }
                }

                // market (all assets)

                try {
                    const orders_get_response = await getCntrprty(`/asset/${asset_name}/exchanges`);
                    this.setState({
                        orders_get_loading: false,
                        orders_get_tip_blocks_row: orders_get_response.tip_blocks_row,
                        orders_get: orders_get_response.orders_get_open,
                        // orders_get: orders_get_response.orders_get,
                    });
                }
                catch (err) {
                    this.setState({
                        orders_get_loading_error: err,
                    });
                }

                try {
                    const orders_give_response = await getCntrprty(`/asset/${asset_name}/escrows/orders`);
                    this.setState({
                        orders_give_loading: false,
                        orders_give_tip_blocks_row: orders_give_response.tip_blocks_row,
                        orders_give: orders_give_response.orders_give_open,
                        // orders_give: orders_give_response.orders_give,
                        // orders: [],
                    });
                }
                catch (err) {
                    this.setState({
                        orders_give_loading_error: err,
                    });
                }

                // market (BTC does not have dispensers)

                if (!['BTC'].includes(asset_name)) {
                    try {
                        const dispensers_response = await getCntrprty(`/asset/${asset_name}/escrows/dispensers`);
                        this.setState({
                            dispensers_loading: false,
                            dispensers_tip_blocks_row: dispensers_response.tip_blocks_row,
                            dispensers: dispensers_response.dispensers_open,
                            // dispensers: dispensers_response.dispensers,
                        });
                    }
                    catch (err) {
                        this.setState({
                            dispensers_loading_error: err,
                        });
                    }
                }

                // market done

                // BTC and XCP don't show the rest
                if (!['BTC', 'XCP'].includes(asset_name)) {

                    // balances (finish market escrows verify)

                    try {
                        const balances_response = await getCntrprty(`/asset/${asset_name}/balances`);
                        this.setState({
                            balances_loading: false,
                            balances_tip_blocks_row: balances_response.tip_blocks_row,
                            balances: balances_response.balances,
                        });
                    }
                    catch (err) {
                        this.setState({
                            balances_loading_error: err,
                        });
                    }

                    // issuances / destructions
                    // issuances moved to top, required for the rest

                    try {
                        const destructions_response = await getCntrprty(`/asset/${asset_name}/destructions`);
                        this.setState({
                            destructions_loading: false,
                            destructions_tip_blocks_row: destructions_response.tip_blocks_row,
                            destructions: destructions_response.destructions,
                        });
                    }
                    catch (err) {
                        this.setState({
                            destructions_loading_error: err,
                        });
                    }

                    // subassets

                    try {
                        const subassets_response = await getCntrprty(`/asset/${asset_name}/subassets`);
                        this.setState({
                            subassets_loading: false,
                            subassets: subassets_response.assets,
                        });
                    }
                    catch (err) {
                        this.setState({
                            subassets_loading_error: err,
                        });
                    }

                }

                ////////////////////////////////////////
                ////////////////////////////////////////

            }
            catch (err) {
                this.setState({
                    asset_row_loading_error: err,
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

        // TODO tip mismatch check at top? (only after all loaded, if one fails a refresh will be needed anyway...)

        let asset_page_element = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        // let asset_body_contents = (<p>loading...</p>);
        if (this.state.asset_row_loading_error) {

            // special render for not found error
            let to_print;
            if (this.state.asset_row_loading_error.message.startsWith('[404:')) {
                to_print = `asset not found... or it is misspelled (is case sensitive)... or genesis issuance is still in the mempool...`;
            }
            else {
                to_print = `${this.state.asset_row_loading_error}`;
            }
            asset_page_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    {to_print}
                </p>
            );

        }
        else if (
            !this.state.asset_row_loading &&
            !this.state.issuances_loading
        ) {
            // else if (!this.state.asset_row_loading) {

            const asset_page = true;

            ////////////////////////////////////////
            ////////////////////////////////////////

            // first must set the genesis issuance, as I will need the "asset_metadata" for the market

            let genesis_issuance = null;
            let asset_metadata;
            if (['BTC', 'XCP'].includes(this.state.asset_name)) {
                asset_metadata = {
                    asset: this.state.asset_name,
                    divisible: true,
                };
            }
            else {
                genesis_issuance = this.state.issuances.find((obj) => obj.status === 'valid');
                asset_metadata = genesis_issuance;
            }


            // market (all assets) (except reset, which will not be rendered)

            let orders_get_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    loading...
                </p>
            );
            if (this.state.orders_get_loading_error) {
                orders_get_element = (
                    <p class="text-gray-600 dark:text-gray-400">
                        {`${this.state.orders_get_loading_error}`}
                    </p>
                );
            }
            else if (!this.state.orders_get_loading) {
                orders_get_element =
                    this.state.orders_get.length ?
                        (
                            <>
                                <table>
                                    <tbody>
                                        {/* <p>Asset requested:</p> */}
                                        {ListElements.getTableRowOrdersHeader_get(asset_metadata)}
                                        {this.state.orders_get.map((orders_row, index) => {
                                            return ListElements.getTableRowOrders_get(orders_row, index, asset_metadata.divisible);
                                        })}
                                    </tbody>
                                </table>
                            </>
                        )
                        : (
                            <p class="text-gray-600 dark:text-gray-400">
                                no open requested orders
                            </p>
                        );
            }

            let orders_give_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    loading...
                </p>
            );
            if (this.state.orders_give_loading_error) {
                orders_give_element = (
                    <p class="text-gray-600 dark:text-gray-400">
                        {`${this.state.orders_give_loading_error}`}
                    </p>
                );
            }
            else if (!this.state.orders_give_loading) {
                orders_give_element =
                    this.state.orders_give.length ?
                        (
                            <>
                                <table>
                                    <tbody>
                                        {/* <p>Asset in escrow:</p> */}
                                        {ListElements.getTableRowOrdersHeader(asset_metadata)}
                                        {this.state.orders_give.map((orders_row, index) => {
                                            return ListElements.getTableRowOrders(orders_row, index, asset_metadata.divisible, asset_page);
                                        })}
                                    </tbody>
                                </table>
                            </>
                        )
                        : (
                            <p class="text-gray-600 dark:text-gray-400">
                                no open escrow orders
                            </p>
                        );
            }

            // market (BTC does not have dispensers)

            let dispensers_element = null;

            if (!['BTC'].includes(this.state.asset_name)) {
                let dispensers_element_contents = (
                    <p class="text-gray-600 dark:text-gray-400">
                        loading...
                    </p>
                );
                if (this.state.dispensers_loading_error) {
                    dispensers_element_contents = (
                        <p class="text-gray-600 dark:text-gray-400">
                            {`${this.state.dispensers_loading_error}`}
                        </p>
                    );
                }
                else if (!this.state.dispensers_loading) {
                    dispensers_element_contents =
                        this.state.dispensers.length ?
                            (
                                <>
                                    <table>
                                        <tbody>
                                            {/* <h4>Open dispensers:</h4> */}
                                            {ListElements.getTableRowDispensersHeader(asset_metadata)}
                                            {this.state.dispensers.map((dispensers_row, index) => {
                                                return ListElements.getTableRowDispensers(dispensers_row, index, asset_metadata.divisible, asset_page);
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            )
                            : (
                                <p class="text-gray-600 dark:text-gray-400">
                                    no open dispensers
                                </p>
                            );
                }
                dispensers_element = (
                    <>
                        {/* <div class="py-1 my-1"> */}
                        <h4 class="font-bold">
                            Open dispensers:
                        </h4>
                        <div class="py-1 my-1">
                            <div class="py-1 my-1 ml-4 overflow-auto">
                                {dispensers_element_contents}
                            </div>
                        </div>
                        {/* </div> */}
                        {/* <h4>Open dispensers:</h4>
                        {dispensers_element_contents} */}
                    </>
                );
            }

            // market done

            // the following render asset_page_element

            if (['BTC', 'XCP'].includes(this.state.asset_name)) {

                let protocol_base;
                if (this.state.asset_name === 'BTC') {
                    protocol_base = 'Base protocol';
                }
                else { // if (this.state.asset_name === 'XCP') {
                    protocol_base = 'Protocol';
                }

                asset_page_element = (
                    <>

                        <h3 class="font-bold">
                            {protocol_base} asset: {this.state.asset_name}
                        </h3>

                        <div class="py-1 my-1 ml-4">
                            {/* <div class="py-1 my-1"> */}

                            {/* <h3 class="font-bold">
                                {protocol_base} asset: {this.state.asset_name}
                            </h3> */}
                            {/* <h3>{protocol_base} asset: {this.state.asset_name}</h3> */}

                            <ul>
                                <li>
                                    <span class="text-gray-600 dark:text-gray-400">asset id:</span>
                                    {' '}
                                    <span class="dark:text-slate-100">{this.state.asset_row.asset_id}</span>
                                </li>
                                <li>
                                    <span class="text-gray-600 dark:text-gray-400">divisible:</span>
                                    {' '}
                                    <span class="dark:text-slate-100">true (satoshi)</span>
                                </li>
                                {/* <li>asset id: {this.state.asset_row.asset_id}</li>
                            <li>divisible: true (satoshi)</li> */}
                            </ul>

                        </div>

                        <div class="py-1 my-1">
                            {renderMarketSection(dispensers_element, orders_give_element, orders_get_element)}
                        </div>

                    </>
                );

            }
            else { // !['BTC', 'XCP'].includes(asset_name)
                // BTC and XCP don't show the rest
                // if (!['BTC', 'XCP'].includes(asset_name)) {

                // first do this because balances are not printed for reset assets
                // issuances / destructions

                // doing the list first (summary later, which requires all to be loaded)
                // let genesis_issuance = null; // moved to top is needed for market data
                let lock_issuance = null;
                let total_quantity_with_divisibility = null;
                let reset_issuance = null; // v9.60 mistake
                let superasset = null;

                let verify_total_integer_balances = BigInt(0);
                let verify_total_integer_orders = BigInt(0);
                let verify_total_integer_dispensers = BigInt(0);

                let verify_quantity_with_divisibility = null;

                let issuances_destructions_element = null;
                let issuances_destructions_element_contents = (
                    <p class="text-gray-600 dark:text-gray-400">
                        loading...
                    </p>
                );
                if (
                    this.state.issuances_loading_error ||
                    this.state.destructions_loading_error
                ) {
                    issuances_destructions_element_contents = (
                        <p class="text-gray-600 dark:text-gray-400">
                            {`${this.state.issuances_loading_error ? this.state.issuances_loading_error : ''}${this.state.destructions_loading_error ? this.state.destructions_loading_error : ''}`}
                        </p>
                    );
                }
                else if (
                    !this.state.issuances_loading &&
                    !this.state.destructions_loading
                ) {

                    //////////////////////////////////////////
                    //////////////////////////////////////////
                    //////////////////////////////////////////
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

                    // genesis_issuance = all_issuance_events.find((obj) => obj.status === 'valid');
                    // // const genesis_issuance = all_issuance_events.find((obj) => obj.status === 'valid');

                    lock_issuance = all_issuance_events.find((obj) => (obj.status === 'valid' && obj.locked));
                    // const lock_issuance = all_issuance_events.find((obj) => (obj.status === 'valid' && obj.locked));

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

                    total_quantity_with_divisibility = quantityWithDivisibility(genesis_issuance.divisible, total_integer); // ALWAYS use quantityWithDivisibility when divisibility is relevant (not talking about units)
                    // const quantity_with_divisibility = quantityWithDivisibility(genesis_issuance.divisible, total_integer); // ALWAYS use quantityWithDivisibility when divisibility is relevant (not talking about units)
                    // const quantity_with_divisibility = genesis_issuance.divisible ? (total_integer / (10 ** 8)).toFixed(8) : total_integer;

                    const issuance_events_message = this.state.destructions.length ?
                        `All issuance (and destroy) transactions:` :
                        `All issuance transactions:`;

                    reset_issuance = this.state.issuances.find((obj) => (obj.status === 'valid' && obj.reset === 1));
                    // const reset_issuance = this.state.issuances.find((obj) => (obj.status === 'valid' && obj.reset === 1));

                    // detect superasset if is asset_longname
                    // let superasset = null;
                    if (this.state.asset_row.asset_longname) {
                        const split = this.state.asset_row.asset_longname.split('.');
                        superasset = split[0];
                    }

                    // balances + escrows(orders, dispensers) = total_integer(issuances - destructions)
                    let verify_total_integer = BigInt(0);

                    // let verify_total_integer_balances = BigInt(0);
                    for (const balances_row of this.state.balances) {
                        verify_total_integer_balances += BigInt(balances_row.quantity_text);
                    }

                    // let verify_total_integer_orders = BigInt(0);
                    for (const orders_row of this.state.orders_give) {
                        // for (const orders_row of this.state.orders) {
                        verify_total_integer_orders += BigInt(orders_row.give_remaining_text);
                    }

                    // let verify_total_integer_dispensers = BigInt(0);
                    for (const dispensers_row of this.state.dispensers) {
                        verify_total_integer_dispensers += BigInt(dispensers_row.give_remaining_text);
                    }

                    verify_total_integer = verify_total_integer_balances + verify_total_integer_orders + verify_total_integer_dispensers;

                    verify_quantity_with_divisibility = quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer);
                    // const verify_quantity_with_divisibility = quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer);
                    //////////////////////////////////////////
                    //////////////////////////////////////////
                    //////////////////////////////////////////

                    // all assets at this point must have issuances at least
                    issuances_destructions_element_contents = (
                        <>
                            {/* <h3>{issuance_events_message}</h3> */}
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
                        </>
                    );

                    issuances_destructions_element = (
                        <>
                            <h3 class="font-bold">
                                {issuance_events_message}
                            </h3>
                            <div class="py-1 my-1">
                                <div class="py-1 my-1 ml-4 overflow-auto">
                                    {issuances_destructions_element_contents}
                                </div>
                            </div>
                            {/* <h3>{issuance_events_message}</h3>
                            {issuances_destructions_element_contents} */}
                        </>
                    );

                }

                // balances (finish market escrows verify) (but not rendered for resets)

                let balances_element = null;

                let balances_element_contents = (
                    <p class="text-gray-600 dark:text-gray-400">
                        loading...
                    </p>
                );
                if (this.state.balances_loading_error) {
                    balances_element_contents = (
                        <p class="text-gray-600 dark:text-gray-400">
                            {`${this.state.balances_loading_error}`}
                        </p>
                    );
                }
                else if (!this.state.balances_loading) {
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
                    balances_element_contents =
                        this.state.balances.length ?
                            (
                                <>

                                    <label>
                                        <input
                                            type="checkbox"
                                            onClick={() => {
                                                this.setState((prevState, props) => ({
                                                    balances_hide_no_balance: !prevState.balances_hide_no_balance
                                                }));
                                            }}
                                            checked={this.state.balances_hide_no_balance}
                                        />
                                        {' '}
                                        <span class="text-gray-600 dark:text-gray-400">hide no balance</span>
                                    </label>

                                    <table>
                                        <tbody>
                                            {/* <h3>Balances (asset holders):</h3> */}
                                            {ListElements.getTableRowBalanceAddressHeader(asset_page)}

                                            {/* filter only in display */}
                                            {this.state.balances.filter(row => {
                                                if (this.state.balances_hide_no_balance) return row.quantity > 0;
                                                else return true;
                                            }).sort(balancesSortAddress).map((balances_row, index) => {
                                                // {this.state.balances.sort(balancesSortAddress).map((balances_row, index) => {

                                                return ListElements.getTableRowBalanceAddress(balances_row, index, asset_page);
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            )
                            : (
                                <p class="text-gray-600 dark:text-gray-400">
                                    no asset holders
                                </p>
                            );
                }

                balances_element = (
                    <>
                        <h3 class="font-bold">
                            Balances (asset holders):
                        </h3>
                        <div class="py-1 my-1">
                            <div class="py-1 my-1 ml-4 overflow-auto">
                                {balances_element_contents}
                            </div>
                        </div>
                        {/* <h3>Balances (asset holders):</h3>
                        {balances_element_contents} */}
                    </>
                );

                /////////
                // for optional show transfers:
                let hastransfers_element = null;
                const valid_transfers = this.state.issuances.filter(row => (row.status === 'valid' && row.transfer === 1));
                if (valid_transfers.length) {
                    hastransfers_element = ` (${valid_transfers.length} transfers)`;
                }
                /////////

                // doing what is left now that all required info is loaded

                ////////////
                let asset_state_element_contents = (
                    <p class="text-gray-600 dark:text-gray-400">
                        loading...
                    </p>
                );
                if (
                    this.state.issuances_loading_error ||
                    this.state.destructions_loading_error ||

                    this.state.orders_give_loading_error ||
                    this.state.dispensers_loading_error ||
                    this.state.balances_loading_error
                ) {
                    asset_state_element_contents = (
                        <>
                            {this.state.issuances_loading_error ? (
                                <p class="text-gray-600 dark:text-gray-400">
                                    issuances_loading_error: {`${this.state.issuances_loading_error}`}
                                </p>
                            ) : null}
                            {this.state.destructions_loading_error ? (
                                <p class="text-gray-600 dark:text-gray-400">
                                    destructions_loading_error: {`${this.state.destructions_loading_error}`}
                                </p>
                            ) : null}
                            {this.state.orders_give_loading_error ? (
                                <p class="text-gray-600 dark:text-gray-400">
                                    orders_give_loading_error: {`${this.state.orders_give_loading_error}`}
                                </p>
                            ) : null}
                            {this.state.dispensers_loading_error ? (
                                <p class="text-gray-600 dark:text-gray-400">
                                    dispensers_loading_error: {`${this.state.dispensers_loading_error}`}
                                </p>
                            ) : null}
                            {this.state.balances_loading_error ? (
                                <p class="text-gray-600 dark:text-gray-400">
                                    balances_loading_error: {`${this.state.balances_loading_error}`}
                                </p>
                            ) : null}
                        </>
                    );
                }
                else if (
                    // if (
                    !this.state.issuances_loading &&
                    !this.state.destructions_loading &&

                    !this.state.orders_give_loading &&
                    !this.state.dispensers_loading &&
                    !this.state.balances_loading
                ) {
                    asset_state_element_contents = (
                        <>
                            <div class="py-1 my-1">
                                <ul>
                                    <li>
                                        <span class="text-gray-600 dark:text-gray-400">issuance events:</span>
                                        {' '}
                                        <span class="dark:text-slate-100">{this.state.issuances.length} issuances{hastransfers_element}, {this.state.destructions.length} destructions</span>
                                    </li>
                                    <li>
                                        <span class="text-gray-600 dark:text-gray-400">holders:</span>
                                        {' '}
                                        <span class="dark:text-slate-100">{this.state.balances.filter(row => row.quantity !== 0).length} (lifetime: {this.state.balances.length})</span>
                                    </li>

                                    {/* <li>issuance events: {this.state.issuances.length} issuances{hastransfers_element}, {this.state.destructions.length} destructions</li>
                                    //<li>issuance events: {this.state.issuances.length} issuances, {this.state.destructions.length} destructions</li>
                                    <li>holders: {this.state.balances.filter(row => row.quantity !== 0).length} (lifetime: {this.state.balances.length})</li>
                                    //<li>holders (lifetime): {this.state.balances.filter(row => row.quantity !== 0).length} ({this.state.balances.length})</li> */}
                                </ul>
                            </div>

                            <div class="py-1 my-1">
                                <ul>
                                    <li>
                                        <span class="text-gray-600 dark:text-gray-400">locked supply:</span>
                                        {' '}
                                        <span class="dark:text-slate-100">{lock_issuance ? 'true' : 'false'}</span>
                                    </li>
                                    {/* <li>locked supply: {lock_issuance ? 'true' : 'false'}</li> */}

                                    {reset_issuance ?
                                        (
                                            <li>
                                                <span class="dark:text-slate-100">
                                                    v9.60 RESET ASSET
                                                </span>
                                            </li>
                                            // <>{<li>v9.60 RESET ASSET</li>}</>
                                        )
                                        :
                                        (
                                            <>

                                                <li>
                                                    <span class="text-gray-600 dark:text-gray-400">current supply:</span>
                                                    {' '}
                                                    <span class="dark:text-slate-100"><strong>{total_quantity_with_divisibility}</strong></span>
                                                </li>
                                                <li>
                                                    <span class="text-gray-600 dark:text-gray-400">verify:</span>
                                                    {' '}
                                                    <span class="dark:text-slate-100">
                                                        {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_balances)} in balances +
                                                        {' '}
                                                        {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_orders)} in open orders +
                                                        {' '}
                                                        {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_dispensers)} in open dispensers =
                                                        {' '}
                                                        {verify_quantity_with_divisibility}
                                                    </span>
                                                </li>

                                                {/* <li>current supply: <strong>{total_quantity_with_divisibility}</strong></li>
                                                <li>
                                                    verify (
                                                    {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_balances)} in balances +
                                                    {' '}
                                                    {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_orders)} in open orders +
                                                    {' '}
                                                    {quantityWithDivisibility(genesis_issuance.divisible, verify_total_integer_dispensers)} in open dispensers):
                                                    {' '}
                                                    {verify_quantity_with_divisibility}
                                                </li> */}
                                            </>
                                        )
                                    }
                                </ul>
                            </div>
                        </>
                    );
                }
                ////////////

                // subassets

                let subassets_element_contents = null;
                let subassets_element = null; // only show if applies
                if (this.state.subassets_loading_error) {
                    // error must be surfaced with header to make sense...
                    subassets_element_contents = (
                        <p class="text-gray-600 dark:text-gray-400">
                            {`${this.state.subassets_loading_error}`}
                        </p>
                    );
                }
                else if (
                    !this.state.subassets_loading &&
                    this.state.subassets.length
                ) {
                    subassets_element_contents =
                        (
                            <>
                                <table>
                                    <tbody>
                                        {/* <h3>Subassets:</h3> */}
                                        {ListElements.getTableRowSubassetsHeader()}
                                        {this.state.subassets.map((assets_row, index) => {
                                            return ListElements.getTableRowSubassets(assets_row, index);
                                        })}
                                    </tbody>
                                </table>
                            </>
                        );
                }
                if (subassets_element_contents) {
                    subassets_element =
                        (
                            <>
                                <h3 class="font-bold">
                                    Subassets:
                                </h3>
                                <div class="py-1 my-1">
                                    <div class="py-1 my-1 ml-4 overflow-auto">
                                        {subassets_element_contents}
                                    </div>
                                </div>
                                {/* <h3>Subassets:</h3>
                            {subassets_element_contents} */}
                            </>
                        );
                }

                const asset_genesis_element = (
                    <>
                        {this.state.asset_row.asset_longname ?
                            (
                                <div class="py-1 my-1">
                                    <ul>
                                        <li>
                                            <span class="text-gray-600 dark:text-gray-400">superasset:</span>
                                            {' '}
                                            <span class="dark:text-slate-100"><Link to={`/asset/${superasset}`}>{superasset}</Link></span>
                                        </li>
                                    </ul>
                                </div>
                            )
                            : null
                        }

                        <div class="py-1 my-1">
                            <ul>
                                {this.state.asset_row.asset_longname ?
                                    (
                                        <li>
                                            <span class="text-gray-600 dark:text-gray-400">asset longname:</span>
                                            {' '}
                                            <span class="dark:text-slate-100">{this.state.asset_row.asset_longname}</span>
                                        </li>
                                    )
                                    : null
                                }
                                <li>
                                    <span class="text-gray-600 dark:text-gray-400">asset name:</span>
                                    {' '}
                                    <span class="dark:text-slate-100">{this.state.asset_row.asset_name}</span>
                                </li>
                                <li>
                                    <span class="text-gray-600 dark:text-gray-400">asset id:</span>
                                    {' '}
                                    <span class="dark:text-slate-100">{this.state.asset_row.asset_id}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="py-1 my-1">
                            <ul>
                                <li>
                                    <span class="text-gray-600 dark:text-gray-400">block:</span>
                                    {' '}
                                    <span class="dark:text-slate-100"><Link to={`/block/${this.state.asset_row.block_index}`}>{this.state.asset_row.block_index}</Link></span>
                                </li>
                                <li>
                                    <span class="text-gray-600 dark:text-gray-400">block time:</span>
                                    {' '}
                                    <span class="dark:text-slate-100">{timeIsoFormat(genesis_issuance.block_time)}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="py-1 my-1">
                            <ul>
                                <li>
                                    <span class="text-gray-600 dark:text-gray-400">divisible:</span>
                                    {' '}
                                    <span class="dark:text-slate-100">{genesis_issuance.divisible ? 'true (satoshi)' : 'false'}</span>
                                </li>
                            </ul>
                        </div>
                    </>
                );

                const asset_state_element = (
                    <>
                        <p class="dark:text-slate-100">
                            State as of block {this.state.issuances_tip_blocks_row.block_index} ({timeIsoFormat(this.state.issuances_tip_blocks_row.block_time)})
                        </p>
                        <div class="py-1 my-1 ml-4">
                            {/* <div class="py-1 my-1"> */}
                            {asset_state_element_contents}
                        </div>
                        {/* // TODO!!! tip_blocks_row
                        <li><strong>Issuances state:</strong> as of block {this.state.issuances_tip_blocks_row.block_index} ({timeIsoFormat(this.state.issuances_tip_blocks_row.block_time)})
                            {asset_state_element}
                        </li> */}
                    </>
                );

                asset_page_element = (
                    <>

                        <h3 class="font-bold">
                            Genesis:
                        </h3>

                        <div class="py-1 my-1 ml-4 whitespace-nowrap overflow-auto">
                            {/* <div class="py-1 my-1 whitespace-nowrap overflow-auto"> */}
                            {/* <div class="py-1 my-1"> */}
                            {asset_genesis_element}
                        </div>

                        <div class="py-1 my-1 whitespace-nowrap overflow-auto">
                            {/* <div class="py-1 my-1 overflow-auto"> */}
                            {/* <div class="py-1 my-1"> */}
                            {asset_state_element}
                        </div>

                        <div class="py-1 my-1 whitespace-nowrap overflow-auto">
                            {/* <div class="py-1 my-1"> */}
                            <p class="dark:text-slate-100">
                                For <strong>[m]</strong>edia visit <strong>bitSTART</strong>:{' '}
                                <a href={`https://bitst.art/${this.state.asset_row.asset_name}`} target="_blank">/{this.state.asset_row.asset_name}</a>
                            </p>
                            {/* <ul>
                                <li>
                                    For <strong>[m]</strong>edia visit <strong>bitSTART</strong>:{' '}
                                    <a href={`https://bitst.art/${this.state.asset_row.asset_name}`} target="_blank">/{this.state.asset_row.asset_name}</a>
                                </li>
                            </ul> */}
                        </div>

                        <div class="py-1 my-1">
                            {subassets_element}
                        </div>

                        {!reset_issuance ?
                            (
                                <>
                                    <div class="py-1 my-1">
                                        {renderMarketSection(dispensers_element, orders_give_element, orders_get_element)}
                                    </div>
                                </>
                            )
                            : null
                        }

                        <div class="py-1 my-1">
                            {issuances_destructions_element}
                        </div>

                        {!reset_issuance ?
                            (
                                <>
                                    <div class="py-1 my-1">
                                        {balances_element}
                                    </div>
                                </>
                            )
                            : null
                        }

                    </>
                );

            }

            ////////////////////////////////////////
            ////////////////////////////////////////

        }

        const route_element = (
            <div class="py-2 my-2">
                <h2 class="font-bold text-xl mb-1 overflow-auto">
                    {/* <h2 class="font-bold text-xl mb-1"> */}
                    Asset:
                    {' '}
                    <span class="whitespace-nowrap">
                        {this.state.asset_name}
                    </span>
                    {/* Asset: {this.state.asset_name} */}
                </h2>
                <div class="pt-1 mt-1 ml-4">
                    {/* <div class="pt-1 mt-1"> */}
                    {/* <div class="py-1 my-1"> */}
                    {asset_page_element}
                </div>
            </div>
        );

        return <OneElements route_element={route_element} />;
        // return <OneElements route_element={asset_page_element} />;
        // // return OneElements.getFullPageForRouteElement(asset_page_element);

    }

}

export default withRouter(Asset);
