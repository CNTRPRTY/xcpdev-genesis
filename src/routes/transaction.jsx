import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty, getBlockMessages, selectTransactionMessagesFromAll } from '../api';
import { OneElements, ListElements } from './shared/elements';
// import { ListElements, OnlyElements } from './shared/elements';
import { Link } from "react-router-dom";
import { decode_data } from '../decode_tx';
import { Buffer } from 'buffer';
import { timeIsoFormat, quantityWithDivisibility } from '../utils';

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tx_hash: props.router.params.txHash,
            transaction_not_found: null,
            transaction: null,
            // messages_maybe: [],
            messages: [],
            mempool: [],

            // main_messages: [],
            // main_message: null,
            // mempool_transaction_messages: null, // can be 1 or multiple
            // // mempool_transaction: null, // can be multiple

            updateable_current_state_obj: null,

            olga_length: 0,
            olga_chars_cut: 0,
        };
        this.handleRange = this.handleRange.bind(this);
    }

    handleRange(event) {
        // back to chars cut
        // event.target.value ={data_url_chain.length - this.state.olga_chars_cut}
        this.setState((prevState, props) => ({
            olga_chars_cut: this.state.olga_length - event.target.value
        }));
    }

    async fetchData(tx_hash) {

        let transaction_response = {};

        // handle txindex redirect
        if (Number.isInteger(Number(tx_hash))) {
            try {
                const txindex_response = await getCntrprty(`/txindex/${tx_hash}`);
                this.props.router.navigate(`/tx/${txindex_response.transaction_row.tx_hash}`, { replace: true });
            }
            catch (e) {
                this.setState({
                    transaction: null,
                    mempool: [],
                });
            }
        }
        else {

            try {
                transaction_response = await getCntrprty(`/tx/${tx_hash}`);
            }
            catch (e) {
                transaction_response = {
                    transaction: null,
                    mempool: [],
                };
            }

            if (
                !transaction_response.transaction &&
                !transaction_response.mempool.length
            ) {
                this.setState({ transaction_not_found: true });
            }
            else if (transaction_response.transaction) {

                // cntrprty transaction
                let cntrprty_decoded = null;
                const cntrprty_hex = Buffer.from(transaction_response.transaction.data, 'hex').toString('hex');
                try {
                    cntrprty_decoded = decode_data(cntrprty_hex, transaction_response.transaction.block_index);
                }
                catch (e) {
                    console.error(`cntrprty_decoded error: ${e}`);
                }

                // get block messages data
                let messages_all = [];
                try {
                    messages_all = (await getBlockMessages(transaction_response.transaction.block_index)).messages;
                }
                catch (e) {
                    console.error(`messages_all error: ${e}`);
                }

                // TODO quick hack
                transaction_response.messages = selectTransactionMessagesFromAll(tx_hash, messages_all);

                ////////////////////
                // repeated code, but keeps it simple
                // is olga?
                let olga_length = 0;
                const olga_broadcast_tx = "627ae48d6b4cffb2ea734be1016dedef4cee3f8ffefaea5602dd58c696de6b74";
                if (tx_hash === olga_broadcast_tx) {
                    const only_message_in_block = transaction_response.messages[0];
                    const bindings = JSON.parse(only_message_in_block.bindings);
                    const broadcast_text_raw = bindings.text;
                    const data_url_chain = `${'data:image'}${broadcast_text_raw.split('data:image')[1]}`;

                    olga_length = data_url_chain.length;
                }
                ////////////////////


                // updateable tx types
                const updateable = [
                    12, // dispenser
                    10, // order
                ];

                let updateable_current_state_obj = null;
                if (
                    cntrprty_decoded &&
                    updateable.includes(cntrprty_decoded.id)
                    ) {

                    // store current dispenser info
                    if (cntrprty_decoded.id === 12) {
                        const updated_dispenser_tx_response = await getCntrprty(`/transactions/dispensers/${tx_hash}`);

                        // for now, just store response directly
                        updateable_current_state_obj = updated_dispenser_tx_response;
                    }

                    // store current order info
                    if (cntrprty_decoded.id === 10) {
                        // for now, just store response directly
                        updateable_current_state_obj = await getCntrprty(`/transactions/orders/${tx_hash}`);
                    }

                }


                this.setState({
                    tx_hash,
                    transaction: transaction_response.transaction,

                    cntrprty_hex,
                    cntrprty_decoded,

                    messages: transaction_response.messages,

                    updateable_current_state_obj,

                    olga_length,
                });
            }
            else { // transaction_response.mempool.length
                this.setState({
                    tx_hash,
                    mempool: transaction_response.mempool
                });
            }

        }

    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData(this.state.tx_hash);
        // await this.fetchData(this.state.tx_hash);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.txHash;
        if (updatedProp !== prevProps.router.params.txHash) {
            // not awaiting it
            this.fetchData(updatedProp);
        }
    }

    render() {

        let dispenser_element = null;
        let order_element = null;

        let transaction_element_contents = (<p>loading...</p>);
        if (this.state.transaction_not_found) {
            transaction_element_contents = (
                // ideally, this should return basic transaction info for non counterparty transactions
                <p>no CNTRPRTY transaction found for tx_hash <a href={`https://mempool.space/tx/${this.state.tx_hash}`} target="_blank">{this.state.tx_hash}</a></p>
                // <p>transaction not found</p>
            );
        }
        else if (this.state.mempool.length) {
            transaction_element_contents = (
                <>
                    <h3>In mempool...</h3>

                    {/* // when it is in the mempool, it can be multiple rows just like the homepage */}

                    <table>
                        <tbody>
                            {ListElements.getTableRowMempoolTxHeader()}
                            {this.state.mempool.map((mempool_row, index) => {
                                return ListElements.getTableRowMempoolTx(mempool_row, index);
                                // const page = 'tx';
                                // return ListElements.getTableRowMempool(mempool_row, index, page);
                                // return ListElements.getTableRowMempool(mempool_row, index);
                            })}
                        </tbody>
                    </table>

                </>
            );
        }

        else if (this.state.transaction) {

            // is olga
            let olga_element = null;
            if (this.state.olga_length) {
                const only_message_in_block = this.state.messages[0];
                const bindings = JSON.parse(only_message_in_block.bindings);
                const broadcast_text_raw = bindings.text;
                const data_url_chain = `${'data:image'}${broadcast_text_raw.split('data:image')[1]}`;

                let data_url_cut; // making copies of both

                if (this.state.olga_chars_cut) {
                    data_url_cut = data_url_chain.slice(0, -this.state.olga_chars_cut);
                }
                else {
                    data_url_cut = data_url_chain.slice();
                }

                // https://github.com/CNTRPRTY/xcpdev/commit/c7e1abd5bfc2a595bc70f86e14f7abdd91d787a6#r98715058
                const source_fix = "XzkBVJ+7LLFsvw/8VIX1OE5OPsAAAAASUVORK5CYII=";
                const data_url_chain_fixed = `${data_url_chain}${source_fix}`;

                const notreverse = [...data_url_cut]; // making both arrays for consistency
                const reverse = [...data_url_cut].reverse(); // https://stackoverflow.com/a/57569141

                olga_element = (
                    // <>
                    <li>
                        <p>Honoring <Link to={`/asset/OLGA`}>OLGA</Link></p>
                        <img src={data_url_chain_fixed} />
                        <p>Image *written* in Bitcoin since 2015</p>

                        {/* <br /> */}
                        <input
                            type="range"
                            min="0" max={data_url_chain.length}
                            value={data_url_chain.length - this.state.olga_chars_cut}
                            onChange={this.handleRange}
                            step="1"
                        />

                        <br />
                        *<a href={`https://github.com/CNTRPRTY/xcpdev/commit/c7e1abd5bfc2a595bc70f86e14f7abdd91d787a6#r98710211`} target="_blank">on chain only</a>* image *can* be seen below, use slider (works on desktop)

                        <br />
                        <br />
                        {/* <img src={`${data_url_cut}=`} /> */}
                        <img src={`${data_url_cut}=`} style={{ width: "200px" }} />
                        <br />
                        reverse:{' '}
                        [{reverse.join('')}]
                        <br />
                        esrever:{' '}
                        {/* not reverse: */}
                        [{notreverse.join('')}]
                    </li>
                    // </>
                );
            }


            // is updateable: dispenser
            if (
                this.state.cntrprty_decoded.id === 12 &&
                this.state.updateable_current_state_obj
            ) {

                const tip_blocks_row = this.state.updateable_current_state_obj.tip_blocks_row;
                let tell_multiple = false;
                if (this.state.updateable_current_state_obj.issuances_row.length > 1) {
                    tell_multiple = true;
                }
                const asset_issuance = this.state.updateable_current_state_obj.issuances_row[0];
                let tell_reset = false;
                if (asset_issuance.resets) {
                    tell_reset = true;
                }
                const dispensers_row = this.state.updateable_current_state_obj.dispensers_row;

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

                const dispenses_rows = this.state.updateable_current_state_obj.dispenses_rows;

                dispenser_element = (
                    <>
                        <h3>Dispenser:</h3>
                        <p>State as of block {tip_blocks_row.block_index} ({timeIsoFormat(tip_blocks_row.block_time)})</p>
                        <ul>
                            <li>status: {dispenser_status}</li>
                        </ul>
                        <ul>
                            <li>address: <Link to={`/address/${dispensers_row.source}`}>{dispensers_row.source}</Link></li>
                            <li>asset:{tell_multiple ? ':' : ''} <Link to={`/asset/${dispensers_row.asset}`}>{dispensers_row.asset}</Link>{asset_issuance.asset_longname ? ` (${asset_issuance.asset_longname})` : ''}</li>
                        </ul>

                        {!tell_reset ?
                            (
                                <>
                                    <ul>
                                        <li>{dispensers_row.satoshirate} sats for {quantityWithDivisibility(asset_issuance.divisible, dispensers_row.give_quantity)}</li>
                                        <li>{quantityWithDivisibility(asset_issuance.divisible, dispensers_row.give_remaining)} of {quantityWithDivisibility(asset_issuance.divisible, dispensers_row.escrow_quantity)} remaining</li>
                                    </ul>
                                    <ul>
                                        <li>{dispensers_row.satoshirate/dispensers_row.give_quantity} sats / unit</li>
                                    </ul>
                                </>
                            )
                            :
                            (
                                <ul>
                                    <li>v9.60 RESET ASSET</li>
                                </ul>
                            )
                        }

                        {dispenses_rows.length ?
                            (
                                <>
                                    <p>Dispenses:</p>
                                    <table>
                                        <tbody>
                                            {ListElements.getTableRowDispensesHeader()}
                                            {dispenses_rows.map((dispenses_row, index) => {
                                                return ListElements.getTableRowDispenses(dispenses_row, index, asset_issuance);
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            )
                            : null
                        }

                    </>
                );

            }


            // is updateable: order
            if (
                this.state.cntrprty_decoded.id === 10 &&
                this.state.updateable_current_state_obj
            ) {

                const tip_blocks_row = this.state.updateable_current_state_obj.tip_blocks_row;
                
                // // only doing this kind of check for dispensers
                // let tell_multiple = false;
                
                const give_issuance = this.state.updateable_current_state_obj.give_issuances_row[0];
                let give_tell_reset = false;
                if (give_issuance.resets) {
                    give_tell_reset = true;
                }

                const get_issuance = this.state.updateable_current_state_obj.get_issuances_row[0];
                let get_tell_reset = false;
                if (get_issuance.resets) {
                    get_tell_reset = true;
                }

                const orders_row = this.state.updateable_current_state_obj.orders_row;

                const expire_block_message = (orders_row.expire_index > tip_blocks_row.block_index) ?
                    `expire block: ${orders_row.expire_index} (in ${orders_row.expire_index - tip_blocks_row.block_index} blocks)`
                    :
                    `expired in block: ${orders_row.expire_index}`;

                const order_matches_rows = this.state.updateable_current_state_obj.order_matches_rows;
                    
                order_element = (
                    <>
                        <h3>Order:</h3>
                        <p>State as of block {tip_blocks_row.block_index} ({timeIsoFormat(tip_blocks_row.block_time)})</p>
                        <ul>
                            <li>status: {orders_row.status}</li>
                        </ul>

                        <ul>
                            <li>give (asset in escrow):
                                <ul>
                                    <li>asset: <Link to={`/asset/${give_issuance.asset}`}>{give_issuance.asset}</Link>{give_issuance.asset_longname ? ` (${give_issuance.asset_longname})` : ''}</li>
                                    {!give_tell_reset ?
                                        (
                                            <li>{quantityWithDivisibility(give_issuance.divisible, orders_row.give_remaining)} of {quantityWithDivisibility(give_issuance.divisible, orders_row.give_quantity)} remaining</li>
                                        )
                                        :
                                        (
                                            <ul>
                                                <li>v9.60 RESET ASSET</li>
                                            </ul>
                                        )
                                    }
                                </ul>
                            </li>
                        </ul>
                        <ul>
                            <li>get (asset requested in exchange):
                                <ul>
                                    <li>asset: <Link to={`/asset/${get_issuance.asset}`}>{get_issuance.asset}</Link>{get_issuance.asset_longname ? ` (${get_issuance.asset_longname})` : ''}</li>
                                    {!get_tell_reset ?
                                        (
                                            <li>{quantityWithDivisibility(get_issuance.divisible, orders_row.get_remaining)} (of {quantityWithDivisibility(get_issuance.divisible, orders_row.get_quantity)} total requested)</li>
                                            // <li>{quantityWithDivisibility(get_issuance.divisible, orders_row.get_remaining)} of {quantityWithDivisibility(get_issuance.divisible, orders_row.get_quantity)} remaining</li>
                                        )
                                        :
                                        (
                                            <ul>
                                                <li>v9.60 RESET ASSET</li>
                                            </ul>
                                        )
                                    }
                                </ul>
                            </li>
                        </ul>

                        <ul>
                            <li>{expire_block_message}</li>
                            {orders_row.fee_required ?
                                (
                                    <li>fee_required_remaining: {orders_row.fee_required_remaining} (of {orders_row.fee_required})</li>
                                )
                                : null
                            }
                        </ul>

                        {order_matches_rows.length ?
                            (
                                <>
                                    <p>Order matches:</p>
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
                                </>
                            )
                            : null
                        }

                    </>
                );

            }


            transaction_element_contents = (
                <>
                    {/* {olga_element} */}

                    {/* // at least for now, not using tables for single element result
                // just using a simple ul for now */}

                    <ul>

                        {/* non protocol / manual connection to the tx (but SHOULD still be on-chain based) */}
                        {olga_element}

                        <li>

                            <h3>CNTRPRTY transaction:</h3>

                            <ul>

                                <li>tx_index: {this.state.transaction.tx_index}{this.state.transaction.supported ? '' : ' (supported:0)'}</li>

                                <li>tx_hash: {this.state.transaction.tx_hash} <a href={`https://mempool.space/tx/${this.state.transaction.tx_hash}`} target="_blank">{String.fromCharCode(10697)}</a></li>
                                {/* https://www.quora.com/Is-the-symbol-for-external-link-available-in-Unicode-If-so-how-do-I-get-in-on-my-Mac */}
                                {/* <li>tx_hash: <a href={`https://mempool.space/tx/${this.state.transaction.tx_hash}`} target="_blank">{this.state.transaction.tx_hash}</a></li> */}
                                {/* <li>tx_hash: {this.state.transaction.tx_hash}</li> */}
                                {/* <li>tx_index: {this.state.transaction.tx_index}</li> */}
                                <li>block_index: <Link to={`/block/${this.state.transaction.block_index}`}>{this.state.transaction.block_index}</Link></li>
                                {/* <li>block_index: {this.state.transaction.block_index}</li> */}
                                {/* <li>block_time: {this.state.transaction.block_time}</li> */}
                                <li>block_time_iso: {timeIsoFormat(this.state.transaction.block_time)}</li>
                                {/* <li>tx_index: {this.state.transaction.tx_index}</li> */}
                                <li>source: <Link to={`/address/${this.state.transaction.source}`}>{this.state.transaction.source}</Link></li>
                                {/* <li>source: {this.state.transaction.source}</li> */}
                                {this.state.transaction.destination ? (
                                    <li>destination: <Link to={`/address/${this.state.transaction.destination}`}>{this.state.transaction.destination}</Link></li>
                                    // <li>destination: {this.state.transaction.destination}</li>
                                ) : null}
                            </ul>

                        </li>

                        <li>
                            {/* TODO? remove the whole section for Bitcoin only transactions (like dispense)...??? */}
                            <p>Data:</p>
                            {(this.state.cntrprty_decoded && this.state.cntrprty_decoded.msg_decoded) ?
                            // {this.state.cntrprty_decoded.msg_decoded ?
                                (
                                    <ul>
                                        <li>hex: {this.state.cntrprty_hex}</li>
                                        <li>type: {this.state.cntrprty_decoded.msg_type} (id: {this.state.cntrprty_decoded.id})</li>
                                        
                                        <li>decoded:
                                            <ul>
                                                {Object.keys(this.state.cntrprty_decoded.msg_decoded).map((msg_decoded_key, list_index) => {
                                                    const msg_decoded_value = this.state.cntrprty_decoded.msg_decoded[msg_decoded_key];
                                                    return (
                                                        <li key={list_index}>{msg_decoded_key}: {msg_decoded_value}</li>
                                                    );
                                                })}
                                            </ul>
                                        </li>
                                        {/* <li>decoded: {JSON.stringify(this.state.cntrprty_decoded.msg_decoded)}</li> */}

                                    </ul>
                                ) :
                                (<p>(unable to decode this transaction)</p>)
                            }
                        </li>

                        {/* <li>
                        <h3>CNTRPRTY data:</h3>
                        // CNTRPRTY:
                        // {'{'}
                        <table>
                            <tbody>
                                <tr style={{ padding: "0.25rem" }}>
                                    <td style={{ padding: "0 1rem 0 0" }}>tx_index: {this.state.transaction.tx_index}</td>
                                    <td style={{ padding: "0 1rem 0 0" }}>supported: {this.state.transaction.supported}</td>
                                    <td style={{ padding: "0 1rem 0 0" }}>data_type: {this.state.transaction.data.type}</td>
                                    // <td style={{ padding: "0 1rem 0 0" }}>CNTRPRTY: {'{'}data: {JSON.stringify(this.state.transaction.data.data)}{'}'}</td>
                                    <td style={{ padding: "0 1rem 0 0" }}>data: {JSON.stringify(this.state.transaction.data.data)}</td>
                                </tr>
                            </tbody>
                        </table>
                        // {'}'}
                    </li> */}

                        {/* <li>CNTRPRTY tx_index: {this.state.transaction.tx_index}{this.state.transaction.supported ? '' : ' (supported:0)'}</li> */}
                        {/* <li>CNTRPRTY tx_index: {this.state.transaction.tx_index}</li> */}

                        <li>
                            {/* <ul> */}
                            {/* <li>source: {this.state.transaction.source}</li> */}
                            {/* {this.state.transaction.destination ? (
                                <li>destination: {this.state.transaction.destination}</li>
                            ) : null} */}
                            {/* <li>tx_index: {this.state.transaction.tx_index}</li> */}

                            {/* </ul> */}


                            {/* {this.state.main_messages.length ? (
                            <>
                                <h3>Main messages:</h3>
                                // <h3>Main message:</h3>

                                <table>
                                    <tbody>
                                        {ListElements.getTableRowMessageTxHeader()}
                                        {this.state.main_messages.map((message_row, index) => {
                                            return ListElements.getTableRowMessageTx(message_row, index);
                                            // const page = 'tx';
                                            // return ListElements.getTableRowMessage(message_row, index, page);
                                        })}
                                        // {ListElements.getTableRowMessage(this.state.main_message, 0, 'tx')}
                                    </tbody>
                                </table>
                            </>
                        ) : null} */}


                            {/* TODO ALL?! */}
                            {/* <h3>"All" (WIP) messages:</h3> */}
                            {/* <h3>All messages:</h3> */}
                            <p>Messages:</p>
                            {/* <h3>Messages:</h3> */}

                            {/* <ul>
                            <li> */}
                            <table>
                                <tbody>
                                    {ListElements.getTableRowMessageTxHeader()}
                                    {this.state.messages.map((message_row, index) => {
                                        return ListElements.getTableRowMessageTx(message_row, index);
                                        // const page = 'tx';
                                        // return ListElements.getTableRowMessage(message_row, index, page);
                                    })}
                                </tbody>
                            </table>
                            {/* </li> */}
                            {/* <li>supported: {this.state.transaction.supported}</li>
                            <li>data_type: {this.state.transaction.data.type}</li>
                            <li>data: {JSON.stringify(this.state.transaction.data.data)}</li> */}
                            {/* </ul> */}
                        </li>


                        {/* <li>
                        <h3>Other (possibly related) block messages:</h3>
                        <table>
                            <tbody>
                                {this.state.messages_maybe.map((message_row, index) => {

                                    // // basic filters here to remove what is more likely NOT part of this

                                    // if (this.state.messages.includes(message_row)) {
                                    //     return null;
                                    // }

                                    // const bindings = JSON.parse(message_row.bindings);
                                    // if (bindings.tx_hash && bindings.tx_hash !== this.state.tx_hash) {
                                    //     return null;
                                    // }
                                    // else if (bindings.event && bindings.event !== this.state.tx_hash) {
                                    //     return null;
                                    // }

                                    const page = 'tx';
                                    return ListElements.getTableRowMessage(message_row, index, page);
                                })}
                            </tbody>
                        </table>
                    </li> */}

                    </ul>

                    {/* // <table>
                //     <tbody>
                //         {this.state.mempool_full.map((mempool_row, index) => {
                //             // {this.state.mempool_grouped.map((mempool_row, index) => {
                //             return ListElements.getTableRowMempool(mempool_row, index);
                //         })}
                //     </tbody>
                // </table> */}

                </>
            );
        }

        const transaction_element = (
            <>
                {dispenser_element}
                {order_element}
                <h2>Bitcoin transaction: {this.state.tx_hash}</h2>
                {/* <h2>Transaction: {this.state.tx_hash}</h2> */}
                {transaction_element_contents}
            </>
        );

        return OneElements.getFullPageForRouteElement(transaction_element);
        // return (
        //     <main style={{ padding: "1rem" }}>
        //         {transaction_element}
        //         <p>
        //             [xcp.dev v1.0]
        //             <br />
        //             [counterparty-lib v9.59] in [Bitcoin Core v0.21]
        //         </p>
        //     </main>
        // );
    }

}

export default withRouter(Transaction);
