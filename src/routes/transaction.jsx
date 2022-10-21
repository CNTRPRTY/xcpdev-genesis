import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import ListElements from './shared/list_elements';

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tx_hash: props.router.params.txHash,
            transaction_not_found: null,
            transaction: null,
            mempool_transaction_messages: null, // can be 1 or multiple
            // mempool_transaction: null, // can be multiple
        };
    }

    async fetchData(tx_hash) {
        const transaction_response = await getCntrprty(`/transactions/${tx_hash}`);

        // console.log(`rrr1`);
        // console.log(JSON.stringify(transaction_response));
        // console.log(`rrr2`);

        if (transaction_response.transactions.length > 1) {
            alert(`unexpected!`);
        }
        else {

            // it can be a block transaction or a mempool transaction

            if (!transaction_response.transactions.length) {

                // now try to find this tx in the mempool
                const mempool_response = await getCntrprty(`/mempool/${tx_hash}`);

                // console.log(`rrr3`);
                // console.log(JSON.stringify(mempool_response));
                // console.log(`rrr4`);

                if (mempool_response.mempool.length) {
                    this.setState({
                        tx_hash,
                        mempool_transaction_messages: mempool_response.mempool,
                    });
                }
                else {
                    this.setState({ transaction_not_found: true });
                }

                // this.setState({ transaction_not_found: true });
            }

            else {
                this.setState({
                    tx_hash,
                    transaction: transaction_response.transactions[0],
                });
            }

        }

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
                    <li>tx_hash: {this.state.transaction.tx_hash}</li>
                    {/* <li>tx_index: {this.state.transaction.tx_index}</li> */}
                    <li>block_index: {this.state.transaction.block_index}</li>
                    {/* <li>block_time: {this.state.transaction.block_time}</li> */}
                    <li>block_time_iso: {(new Date(this.state.transaction.block_time * 1000).toISOString()).replace('.000Z', 'Z')}</li>
                    {/* <li>tx_index: {this.state.transaction.tx_index}</li> */}
                    <li>
                        <ul>
                            <li>source: {this.state.transaction.source}</li>
                            <li>tx_index: {this.state.transaction.tx_index}</li>
                            <li>
                                <ul>
                                    <li>supported: {this.state.transaction.supported}</li>
                                    <li>data_type: {this.state.transaction.data.type}</li>
                                    <li>data: {JSON.stringify(this.state.transaction.data.data)}</li>
                                </ul>
                            </li>
                            {/* <li>supported: {this.state.transaction.supported}</li>
                            <li>data_type: {this.state.transaction.data.type}</li>
                            <li>data: {JSON.stringify(this.state.transaction.data.data)}</li> */}
                        </ul>
                    </li>
                    {/* <li>tx_index: {this.state.transaction.tx_index}</li>
                    <li>source: {this.state.transaction.source}</li>
                    <li>supported: {this.state.transaction.supported}</li>
                    <li>data_type: {this.state.transaction.data.type}</li>
                    <li>data: {JSON.stringify(this.state.transaction.data.data)}</li> */}
                    {/* <li>{JSON.stringify(this.state.transaction)}</li> */}
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
        else if (this.state.mempool_transaction_messages) {
            transaction_element_contents = (
                <>
                    <h3>In mempool...</h3>

                    {/* // when it is in the mempool, it can be multiple rows just like the homepage */}

                    <table>
                        <tbody>
                            {this.state.mempool_transaction_messages.map((mempool_row, index) => {
                                const page = 'tx';
                                return ListElements.getTableRowMempool(mempool_row, index, page);
                                // return ListElements.getTableRowMempool(mempool_row, index);
                            })}
                        </tbody>
                    </table>

                </>
            );
        }
        const transaction_element = (
            <>
                <h2>Transaction: {this.state.tx_hash}</h2>
                {transaction_element_contents}
            </>
        );

        return (
            <main style={{ padding: "1rem" }}>
                {transaction_element}
                <p>
                    [xcp.dev v1.0]
                    <br />
                    [counterparty-lib v9.59] in [Bitcoin Core v0.21]
                </p>
            </main>
        );
    }

}

export default withRouter(Transaction);
