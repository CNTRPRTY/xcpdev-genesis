/* global BigInt */

import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty, selectTransactionMessagesFromAll } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from "react-router-dom";
import { decode_data } from '../decode_tx';
import { Buffer } from 'buffer';
import { timeIsoFormat, quantityWithDivisibility, formatDivision } from '../utils';
import TransactionStatic from './transaction_component/transaction_static';
import TransactionUpdateable from './transaction_component/transaction_updateable';

function baseState(tx_hash) {
    return {
        tx_hash,
        transaction_not_found: null,
        transaction: null,

        messages: [],
        mempool: [],
    };
}

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = baseState(props.router.params.txHash);
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

            this.setState(baseState(tx_hash));

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
                    messages_all = (await getCntrprty(`/block/${transaction_response.transaction.block_index}/messages`)).messages;
                    // messages_all = (await getBlockMessages(transaction_response.transaction.block_index)).messages;
                }
                catch (e) {
                    console.error(`messages_all error: ${e}`);
                }

                // TODO quick hack
                transaction_response.messages = selectTransactionMessagesFromAll(tx_hash, messages_all);

                this.setState({
                    tx_hash,
                    transaction: transaction_response.transaction,

                    cntrprty_hex,
                    cntrprty_decoded,

                    messages: transaction_response.messages,
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
        await this.fetchData(this.state.tx_hash);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.txHash;
        if (updatedProp !== prevProps.router.params.txHash) {
            await this.fetchData(updatedProp);
        }
    }

    render() {

        let header_transaction_element = null;

        let transaction_element_contents = (<p>loading...</p>);
        if (this.state.transaction_not_found) {
            transaction_element_contents = (
                // ideally, this should return basic transaction info for non counterparty transactions
                <p>no CNTRPRTY block transaction found for tx_hash <a href={`https://mempool.space/tx/${this.state.tx_hash}`} target="_blank">{this.state.tx_hash}</a></p>
                // <p>no CNTRPRTY transaction found for tx_hash <a href={`https://mempool.space/tx/${this.state.tx_hash}`} target="_blank">{this.state.tx_hash}</a></p>
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
                            })}
                        </tbody>
                    </table>

                </>
            );
        }

        else if (this.state.transaction) {

            // is header transaction component?
            const updateable = TransactionUpdateable.tx_type_ids;
            const therest = TransactionStatic.tx_type_ids;

            if (updateable.includes(this.state.cntrprty_decoded.id)) {
                header_transaction_element = <TransactionUpdateable tx_hash={this.state.transaction.tx_hash} decoded_obj={this.state.cntrprty_decoded} />
            }
            
            if (therest.includes(this.state.cntrprty_decoded.id)) {
                header_transaction_element = <TransactionStatic tx_hash={this.state.transaction.tx_hash} decoded_obj={this.state.cntrprty_decoded} />
            }


            transaction_element_contents = (
                <>

                    <ul>

                        <li>

                            <h3>CNTRPRTY transaction:</h3>

                            <ul>

                                <li>tx_index: {this.state.transaction.tx_index}{this.state.transaction.supported ? '' : ' (supported:0)'}</li>

                                <li>tx_hash: {this.state.transaction.tx_hash} <a href={`https://mempool.space/tx/${this.state.transaction.tx_hash}`} target="_blank">{String.fromCharCode(10697)}</a></li>
                                {/* https://www.quora.com/Is-the-symbol-for-external-link-available-in-Unicode-If-so-how-do-I-get-in-on-my-Mac */}
                                <li>block_index: <Link to={`/block/${this.state.transaction.block_index}`}>{this.state.transaction.block_index}</Link></li>
                                <li>block_time_iso: {timeIsoFormat(this.state.transaction.block_time)}</li>
                                <li>source: <Link to={`/address/${this.state.transaction.source}`}>{this.state.transaction.source}</Link></li>
                                {this.state.transaction.destination ? (
                                    <li>destination: <Link to={`/address/${this.state.transaction.destination}`}>{this.state.transaction.destination}</Link></li>
                                ) : null}
                            </ul>

                        </li>

                        <li>
                            {/* TODO? remove the whole section for Bitcoin only transactions (like dispense)...??? */}
                            <p>Data:</p>
                            {(this.state.cntrprty_decoded && this.state.cntrprty_decoded.msg_decoded) ?
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

                                    </ul>
                                ) :
                                (<p>(unable to decode this transaction)</p>)
                            }
                        </li>

                        <li>
                            <p>Messages:</p>
                            <table>
                                <tbody>
                                    {ListElements.getTableRowMessageTxHeader()}
                                    {this.state.messages.map((message_row, index) => {
                                        return ListElements.getTableRowMessageTx(message_row, index);
                                    })}
                                </tbody>
                            </table>
                        </li>

                    </ul>

                </>
            );
        }

        const transaction_element = (
            <>
                {header_transaction_element}
                <h2>Bitcoin transaction: {this.state.tx_hash}</h2>
                {transaction_element_contents}
            </>
        );

        return OneElements.getFullPageForRouteElement(transaction_element);
    }

}

export default withRouter(Transaction);
