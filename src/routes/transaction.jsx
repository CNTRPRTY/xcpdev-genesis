import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty, selectTransactionMessagesFromAll } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from "react-router-dom";
import { decode_data } from '../decode_tx';
import { Buffer } from 'buffer';
import { timeIsoFormat } from '../utils';
import TransactionStatic from './transaction_header/header_static';
import TransactionUpdateable from './transaction_header/header_updateable';

function baseState(tx_hash) {
    return {
        tx_hash,

        // TODO make it non-cntrprty compatible

        // transaction_not_found: null,
        transaction_loading: true,
        transaction_loading_error: null,
        transaction: null,

        cntrprty_error: null,
        cntrprty_hex: null,
        cntrprty_decoded: null,

        messages_loading: true,
        messages_loading_error: null,
        messages: [],

        // TODO eventually
        mempool: [],
    };
}

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = baseState(props.router.params.txHash);
    }

    async fetchData(tx_hash) {

        // handle txindex redirect
        if (Number.isInteger(Number(tx_hash))) {
            try {
                const txindex_response = await getCntrprty(`/txindex/${tx_hash}`);
                this.props.router.navigate(`/tx/${txindex_response.transaction_row.tx_hash}`, { replace: true });
            }
            catch (err) {
                this.setState({
                    transaction_loading_error: err,
                });
            }
        }
        else {

            this.setState(baseState(tx_hash));

            let transaction = null;
            try {
                const transaction_response = await getCntrprty(`/tx/${tx_hash}`);
                transaction = transaction_response.transaction;
                this.setState({
                    transaction_loading: false,
                    transaction,
                });
            }
            catch (err) {
                this.setState({
                    transaction_loading_error: err,
                });
            }

            // TODO mempool...

            // cntrprty transaction
            if (transaction.data) {
                try {
                    const cntrprty_hex = Buffer.from(transaction.data, 'hex').toString('hex');
                    const cntrprty_decoded = decode_data(cntrprty_hex, transaction.block_index);
                    this.setState({
                        cntrprty_hex,
                        cntrprty_decoded,
                    });
                }
                catch (err) {
                    this.setState({
                        cntrprty_error: err,
                    });
                }
            }

            try {
                const messages_response = await getCntrprty(`/block/${transaction.block_index}/messages`);
                const messages = selectTransactionMessagesFromAll(tx_hash, messages_response.messages);
                this.setState({
                    messages_loading: false,
                    messages,
                });
            }
            catch (err) {
                this.setState({
                    messages_loading_error: err,
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
        if (this.state.transaction_loading_error) {
            transaction_element_contents = (<p>{`${this.state.transaction_loading_error}`}</p>);
        }
        else if (!this.state.transaction_loading) {

            let cntrprty_element_list = null;
            let cntrprty_element = null;
            if (this.state.cntrprty_error) {
                cntrprty_element_list = (
                    <>
                        <p>
                            unable to decode this transaction:
                            <br />
                            {`${this.state.cntrprty_error}`}
                        </p>
                    </>
                );
            }
            else if (this.state.cntrprty_decoded) {
                cntrprty_element_list = (
                    <>
                        <ul class="list-disc list-inside">

                            <li>hex: {this.state.cntrprty_hex}</li>
                            <li>type: {this.state.cntrprty_decoded.msg_type} (id: {this.state.cntrprty_decoded.id})</li>

                            {Object.keys(this.state.cntrprty_decoded.msg_decoded).length ?
                                (
                                    <li>decoded:
                                        <div class="pt-1 mt-1 ml-4">
                                            {/* <div class="py-1 my-1 ml-4"> */}
                                            <ul class="list-disc list-inside">
                                                {Object.keys(this.state.cntrprty_decoded.msg_decoded).map((msg_decoded_key, list_index) => {
                                                    const msg_decoded_value = this.state.cntrprty_decoded.msg_decoded[msg_decoded_key];
                                                    return (
                                                        <li key={list_index}>{msg_decoded_key}: {msg_decoded_value}</li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </li>
                                )
                                : null
                            }

                        </ul>
                    </>
                );
            }
            if (cntrprty_element_list) {
                cntrprty_element = (
                    <>
                        <ul class="list-disc list-inside">
                            <li>
                                <strong>Data:</strong>
                                {/* <h4>Data:</h4> */}
                                <div class="pt-1 mt-1 ml-4">
                                    {/* <div class="py-1 my-1 ml-4"> */}
                                    {cntrprty_element_list}
                                </div>
                            </li>
                        </ul>
                    </>
                );
            }


            let messages_element_content = (<p>loading...</p>);
            if (this.state.messages_loading_error) {
                messages_element_content = (<p>{`${this.state.messages_loading_error}`}</p>);
            }
            else if (!this.state.messages_loading) {
                messages_element_content = this.state.messages.length ?
                    (
                        <>
                            <table>
                                <tbody>
                                    {ListElements.getTableRowMessageTxHeader()}
                                    {this.state.messages.map((message_row, index) => {
                                        return ListElements.getTableRowMessageTx(message_row, index);
                                    })}
                                </tbody>
                            </table>
                        </>
                    )
                    : (<p>no messages?</p>);
            }
            const messages_element = (
                <>
                    <div class="py-1 my-1">
                        <h4 class="font-bold">
                            Messages:
                        </h4>
                    </div>
                    <div class="pt-1 mt-1">
                        {messages_element_content}
                    </div>
                </>
            );


            if (this.state.cntrprty_decoded) {
                // is header transaction component?
                const updateable = TransactionUpdateable.tx_type_ids;
                const therest = TransactionStatic.tx_type_ids;

                if (updateable.includes(this.state.cntrprty_decoded.id)) {
                    header_transaction_element = (
                        <div class="pb-1 mb-4">
                            {/* <div class="py-1 my-1"> */}
                            <TransactionUpdateable tx_hash={this.state.transaction.tx_hash} decoded_obj={this.state.cntrprty_decoded} />
                        </div>
                    );
                }

                if (therest.includes(this.state.cntrprty_decoded.id)) {
                    header_transaction_element = (
                        <div class="pb-1 mb-4">
                            {/* <div class="py-1 my-1"> */}
                            <TransactionStatic tx_hash={this.state.transaction.tx_hash} decoded_obj={this.state.cntrprty_decoded} />
                        </div>
                    );
                }
            }
            // else it should already be in cntrprty_error


            let transaction_cntrprty_element = null;
            if (this.state.cntrprty_decoded || this.state.messages.length) {
                transaction_cntrprty_element = (
                    <div class="pt-1 mt-1">
                        <div class="pt-1 mt-1">
                            <ul class="list-disc list-inside">
                                <li>
                                    {/* <div class="py-1 my-1"> */}
                                    <strong>CNTRPRTY:</strong>
                                    {/* <h3 class="font-bold">
                                        CNTRPRTY:
                                    </h3> */}
                                    <div class="py-1 my-1 ml-4">
                                        <ul class="list-disc list-inside">
                                            <li>tx_index: {this.state.transaction.tx_index}{this.state.transaction.supported ? '' : ' (supported:0)'}</li>
                                            <li>source: <Link to={`/address/${this.state.transaction.source}`}>{this.state.transaction.source}</Link></li>
                                            {this.state.transaction.destination ? (
                                                <li>destination: <Link to={`/address/${this.state.transaction.destination}`}>{this.state.transaction.destination}</Link></li>
                                            ) : null}
                                        </ul>
                                    </div>
                                    <div class="py-1 my-1 ml-4">
                                        {cntrprty_element}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="pt-1 mt-1">
                            {/* <div class="py-1 my-1"> */}
                            {messages_element}
                        </div>
                    </div>
                );
            }

            transaction_element_contents = (
                <>
                    <ul class="list-disc list-inside">
                        <li>tx hash: {this.state.transaction.tx_hash} <a href={`https://mempool.space/tx/${this.state.transaction.tx_hash}`} target="_blank">{String.fromCharCode(10697)}</a></li>
                        {/* https://www.quora.com/Is-the-symbol-for-external-link-available-in-Unicode-If-so-how-do-I-get-in-on-my-Mac */}
                        <li>block index: <Link to={`/block/${this.state.transaction.block_index}`}>{this.state.transaction.block_index}</Link></li>
                        <li>block time: {timeIsoFormat(this.state.transaction.block_time)}</li>
                    </ul>
                    {transaction_cntrprty_element}
                </>
            );
        }

        const route_element = (
            <div class="py-2 my-2">

                {header_transaction_element}

                <h2 class="font-bold text-xl mb-1">
                    Transaction: {this.state.tx_hash}
                </h2>
                <div class="pt-1 mt-1">
                    {/* <div class="py-1 my-1"> */}
                    {transaction_element_contents}
                </div>

            </div>
        );

        return OneElements.getFullPageForRouteElement(route_element);
    }

}

export default withRouter(Transaction);
