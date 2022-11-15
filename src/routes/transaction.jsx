import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
// import { ListElements, OnlyElements } from './shared/elements';
import { Link } from "react-router-dom";

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
        };
    }

    async fetchData(tx_hash) {
        // const transaction_response = await getCntrprty(`/tx/${tx_hash}`);
        let transaction_response = {};
        try {
            transaction_response = await getCntrprty(`/tx/${tx_hash}`);
        }
        catch (e) {
            transaction_response = {
                transaction: null,
                mempool: [],
            };
        }

        // console.log(`rrr1`);
        // console.log(JSON.stringify(transaction_response));
        // console.log(`rrr2`);

        if (
            !transaction_response.transaction &&
            !transaction_response.mempool.length
        ) {
            this.setState({ transaction_not_found: true });
        }
        else if (transaction_response.transaction) {
            this.setState({
                // tx_hash,
                transaction: transaction_response.transaction,
                // messages_maybe: transaction_response.messages_maybe,
                messages: transaction_response.messages,
                // main_messages: transaction_response.main_messages,
            });
        }
        else { // transaction_response.mempool.length
            this.setState({
                // tx_hash,
                mempool: transaction_response.mempool
            });
        }

        // this.setState({
        //     tx_hash,
        //     // transaction: transaction_response.transactions[0],
        // });

    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData(this.state.tx_hash);
        // await this.fetchData(this.state.tx_hash);
    }

    render() {

        let transaction_element_contents = (<p>loading...</p>);
        if (this.state.transaction) {
            transaction_element_contents = (

                // at least for now, not using tables for single element result
                // just using a simple ul for now
                <ul>
                    {/* <li>tx_hash: <a href={`https://mempool.space/tx/${this.state.transaction.tx_hash}`} target="_blank">{this.state.transaction.tx_hash}</a></li> */}
                    <li>tx_hash: {this.state.transaction.tx_hash}</li>
                    {/* <li>tx_index: {this.state.transaction.tx_index}</li> */}
                    <li>block_index: <Link to={`/block/${this.state.transaction.block_index}`}>{this.state.transaction.block_index}</Link></li>
                    {/* <li>block_index: {this.state.transaction.block_index}</li> */}
                    {/* <li>block_time: {this.state.transaction.block_time}</li> */}
                    <li>block_time_iso: {(new Date(this.state.transaction.block_time * 1000).toISOString()).replace('.000Z', 'Z')}</li>
                    {/* <li>tx_index: {this.state.transaction.tx_index}</li> */}
                    <li>source: <Link to={`/address/${this.state.transaction.source}`}>{this.state.transaction.source}</Link></li>
                    {/* <li>source: {this.state.transaction.source}</li> */}
                    {this.state.transaction.destination ? (
                        <li>destination: <Link to={`/address/${this.state.transaction.destination}`}>{this.state.transaction.destination}</Link></li>
                        // <li>destination: {this.state.transaction.destination}</li>
                    ) : null}

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

                    <li>CNTRPRTY tx_index: {this.state.transaction.tx_index}</li>

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
                        <h3>Messages:</h3>

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

                // <table>
                //     <tbody>
                //         {this.state.mempool_full.map((mempool_row, index) => {
                //             // {this.state.mempool_grouped.map((mempool_row, index) => {
                //             return ListElements.getTableRowMempool(mempool_row, index);
                //         })}
                //     </tbody>
                // </table>

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
        const transaction_element = (
            <>
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
