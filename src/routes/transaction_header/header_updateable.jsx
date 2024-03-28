/* global BigInt */

import React from 'react';
import { getCntrprty } from '../../api';
import { ListElements } from '../shared/elements';
import { Link } from "react-router-dom";
import { timeIsoFormat, quantityWithDivisibility, formatDivision } from '../../utils';

class TransactionUpdateable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tx_hash: props.tx_hash,
            decoded_obj: props.decoded_obj,

            // TODO? maybe better to have each type individually? not for now, it works well
            transaction_state_loading: true,
            transaction_state_loading_error: null,
            transaction_state: null,
        };
    }

    async fetchData(tx_hash) {
        try {
            let url;
            if (this.state.decoded_obj.id === 12) { // dispenser
                url = `/transactions/dispensers/${tx_hash}`;
            }
            else if (this.state.decoded_obj.id === 10) { // order
                url = `/transactions/orders/${tx_hash}`;
            }
            else {
                throw Error(`tx type id:${this.state.decoded_obj.id} not configured`);
            }

            const transaction_state_response = await getCntrprty(url);
            this.setState({
                transaction_state_loading: false,
                transaction_state: transaction_state_response,
            });
        }
        catch (err) {
            this.setState({
                transaction_state_loading_error: err,
            });
        }
    }

    async componentDidMount() {
        await this.fetchData(this.state.tx_hash);
    }

    render() {

        // handle the header separately
        let transaction_state_element_header = null;
        if (this.state.decoded_obj.id === 12) { // dispenser
            transaction_state_element_header = 'Dispenser';
        }
        else if (this.state.decoded_obj.id === 10) { // order
            transaction_state_element_header = 'Order';
        }
        else {
            transaction_state_element_header = 'id error';
        }

        let transaction_state_element = (<p>loading...</p>);
        if (this.state.transaction_state_loading_error) {
            transaction_state_element = (<p>{`${this.state.transaction_state_loading_error}`}</p>);
        }
        else if (!this.state.transaction_state_loading) {

            if (this.state.decoded_obj.id === 12) { // dispenser

                const tip_blocks_row = this.state.transaction_state.tip_blocks_row;
                let tell_multiple = false;
                if (this.state.transaction_state.issuances_row.length > 1) {
                    tell_multiple = true;
                }
                const asset_issuance = this.state.transaction_state.issuances_row[0];
                let tell_reset = false;
                if (asset_issuance.resets) {
                    tell_reset = true;
                }
                const dispensers_row = this.state.transaction_state.dispensers_row;

                // status (integer): The state of the dispenser. 0 for open, 1 for open using open_address, 10 for closed.
                let dispenser_status;
                if (dispensers_row.status === 0) {
                    dispenser_status = 'open';
                }
                else if (dispensers_row.status === 1) {
                    dispenser_status = 'open_address';
                }
                else if (dispensers_row.status === 10) {
                    dispenser_status = 'closed';
                }

                const dispenses_rows = this.state.transaction_state.dispenses_rows;

                transaction_state_element = (
                    <>
                        {/* <h3>Dispenser:</h3> */}
                        <div class="pb-1 mb-1">
                            {/* <div class="py-1 my-1"> */}
                            <p>State as of block {tip_blocks_row.block_index} ({timeIsoFormat(tip_blocks_row.block_time)})</p>
                        </div>

                        <div class="py-1 my-1">
                            <ul class="list-disc list-inside">
                                <li>status: {dispenser_status}</li>
                            </ul>
                        </div>

                        <div class="py-1 my-1">
                            <ul class="list-disc list-inside">
                                <li>asset:{tell_multiple ? ':' : ''} <Link to={`/asset/${dispensers_row.asset}`}>{dispensers_row.asset}</Link>{asset_issuance.asset_longname ? ` (${asset_issuance.asset_longname})` : ''}</li>
                                <li>address: <Link to={`/address/${dispensers_row.source}`}>{dispensers_row.source}</Link></li>
                            </ul>
                        </div>

                        {!tell_reset ?
                            (
                                <>
                                    <div class="py-1 my-1">
                                        <ul class="list-disc list-inside">
                                            <li>
                                                {`${BigInt(dispensers_row.satoshirate_text)}`}
                                                {' sats for '}
                                                {quantityWithDivisibility(asset_issuance.divisible, BigInt(dispensers_row.give_quantity_text))}
                                                {' ('}
                                                {formatDivision(dispensers_row.satoshirate, dispensers_row.give_quantity)}
                                                {' sats / unit)'}
                                            </li>
                                            <li>
                                                {quantityWithDivisibility(asset_issuance.divisible, BigInt(dispensers_row.give_remaining_text))}
                                                {' of '}
                                                {quantityWithDivisibility(asset_issuance.divisible, BigInt(dispensers_row.escrow_quantity_text))}
                                                {' remaining'}
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )
                            :
                            (
                                <ul class="list-disc list-inside">
                                    <li>v9.60 RESET ASSET</li>
                                </ul>
                            )
                        }

                        {dispenses_rows.length ?
                            (
                                <>
                                    <div class="pt-1 mt-1">
                                        {/* <div class="py-1 my-1"> */}
                                        <p class="font-bold">
                                            Dispenses:
                                        </p>
                                        <div class="pt-1 mt-1">
                                            {/* <div class="py-1 my-1"> */}
                                            <table>
                                                <tbody>
                                                    {ListElements.getTableRowDispensesHeader()}
                                                    {dispenses_rows.map((dispenses_row, index) => {
                                                        return ListElements.getTableRowDispenses(dispenses_row, index, asset_issuance);
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )
                            : null
                        }

                    </>
                );
            }

            else if (this.state.decoded_obj.id === 10) { // order

                const tip_blocks_row = this.state.transaction_state.tip_blocks_row;

                // // only doing this kind of check for dispensers
                // let tell_multiple = false;

                const give_issuance = this.state.transaction_state.give_issuances_row[0];
                let give_tell_reset = false;
                if (give_issuance.resets) {
                    give_tell_reset = true;
                }

                const get_issuance = this.state.transaction_state.get_issuances_row[0];
                let get_tell_reset = false;
                if (get_issuance.resets) {
                    get_tell_reset = true;
                }

                const orders_row = this.state.transaction_state.orders_row;

                const expire_block_message = (orders_row.expire_index > tip_blocks_row.block_index) ?
                    `expire block: ${orders_row.expire_index} (in ${orders_row.expire_index - tip_blocks_row.block_index} blocks)`
                    :
                    `expired in block: ${orders_row.expire_index}`;

                const order_matches_rows = this.state.transaction_state.order_matches_rows;
                const order_matches_btcpays_rows = this.state.transaction_state.btcpays_rows;

                const btc_is_promise = give_issuance.asset === 'BTC' ? 'promise' : 'escrowed';
                
                transaction_state_element = (
                    <>
                        {/* <h3>Order:</h3> */}
                        <div class="pb-1 mb-1">
                            {/* <div class="py-1 my-1"> */}
                            <p>State as of block {tip_blocks_row.block_index} ({timeIsoFormat(tip_blocks_row.block_time)})</p>
                        </div>

                        <div class="py-1 my-1">
                            <ul class="list-disc list-inside">
                                <li>status: {orders_row.status}</li>
                                <li>{expire_block_message}</li>
                                {orders_row.fee_required ?
                                    (
                                        <li>fee_required_remaining: {orders_row.fee_required_remaining} (of {orders_row.fee_required})</li>
                                    )
                                    : null
                                }
                            </ul>
                        </div>

                        <div class="py-1 my-1">
                            <ul class="list-disc list-inside">
                                <li>give ({btc_is_promise}):
                                {/* <li>give asset ({btc_is_promise}): */}
                                {/* <li>give (asset escrowed): */}
                                    <div class="pb-1 mb-1 ml-4">
                                        {/* <div class="py-1 my-1 ml-4"> */}
                                        <ul class="list-disc list-inside">
                                            <li>asset: <Link to={`/asset/${give_issuance.asset}`}>{give_issuance.asset}</Link>{give_issuance.asset_longname ? ` (${give_issuance.asset_longname})` : ''}</li>
                                            {!give_tell_reset ?
                                                (
                                                    <li>{quantityWithDivisibility(give_issuance.divisible, BigInt(orders_row.give_remaining_text))} of {quantityWithDivisibility(give_issuance.divisible, BigInt(orders_row.give_quantity_text))} remaining</li>
                                                )
                                                :
                                                (
                                                    // <ul>
                                                    <li>v9.60 RESET ASSET</li>
                                                    // </ul>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="py-1 my-1">
                            <ul class="list-disc list-inside">
                                <li>get (requested in exchange):
                                {/* <li>get asset (requested in exchange): */}
                                {/* <li>get (asset requested in exchange): */}
                                    <div class="pb-1 mb-1 ml-4">
                                        {/* <div class="py-1 my-1 ml-4"> */}
                                        <ul class="list-disc list-inside">
                                            <li>asset: <Link to={`/asset/${get_issuance.asset}`}>{get_issuance.asset}</Link>{get_issuance.asset_longname ? ` (${get_issuance.asset_longname})` : ''}</li>
                                            {!get_tell_reset ?
                                                (
                                                    <li>{quantityWithDivisibility(get_issuance.divisible, BigInt(orders_row.get_remaining_text))} (of {quantityWithDivisibility(get_issuance.divisible, BigInt(orders_row.get_quantity_text))} total requested)</li>
                                                )
                                                :
                                                (
                                                    // <ul>
                                                    <li>v9.60 RESET ASSET</li>
                                                    // </ul>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {order_matches_rows.length ?
                            (
                                <>
                                    <div class="pt-1 mt-1">
                                        {/* <div class="py-1 my-1"> */}
                                        <p class="font-bold">
                                            Order matches:
                                        </p>
                                        <div class="pt-1 mt-1">
                                            {/* <div class="py-1 my-1"> */}
                                            <table>
                                                <tbody>
                                                    {ListElements.getTableRowOrderMatchesHeader()}
                                                    {order_matches_rows.map((order_matches_row, index) => {
                                                        const order_metadata = {
                                                            tx_hash: orders_row.tx_hash,
                                                            give_issuance: give_issuance,
                                                            get_issuance: get_issuance,
                                                        }
                                                        return ListElements.getTableRowOrderMatches(order_matches_row, index, order_metadata);
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* !nested terniary! */}
                                        {order_matches_btcpays_rows.length ?
                                            (
                                                // <>
                                                // {/* TODO why (pt-1) mt-3 /4 didn't work? */}
                                                <div class="pt-1 mt-2">
                                                    {/* <div class="pt-1 mt-1"> */}
                                                    {/* <div class="py-1 my-1"> */}
                                                    <p class="font-bold">
                                                        BTC pays:
                                                    </p>
                                                    <div class="pt-1 mt-1">
                                                        {/* <div class="py-1 my-1"> */}
                                                        <table>
                                                            <tbody>
                                                                {ListElements.getTableRowOrderMatchesBtcpaysHeader()}
                                                                {order_matches_btcpays_rows.map((btcpays_row, index) => {
                                                                    return ListElements.getTableRowOrderMatchesBtcpays(btcpays_row, index);
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                // </>
                                            )
                                            : null
                                        }
                                    </div>
                                </>
                            )
                            : null
                        }

                    </>
                );
            }

        }

        const transaction_element = (
            <>
                <h3 class="font-bold text-xl mb-1">
                    {transaction_state_element_header}:
                </h3>
                {/* indent only for updatable */}
                <div class="py-1 my-1 ml-4">
                    {/* <div class="py-1 my-1"> */}
                    {transaction_state_element}
                </div>
            </>
        );

        return transaction_element;
    }

}

TransactionUpdateable.tx_type_ids = [
    12, // dispenser
    10, // order
];

export default TransactionUpdateable;
