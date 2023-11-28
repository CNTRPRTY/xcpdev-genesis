import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from "react-router-dom";
import { timeIsoFormat, timeSince, hashSlice } from '../utils';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ////
            blocks: null,
            ////
            mempool_empty: null,
            mempool_full: [],
            get_running_info: null,
            //
            btc_transactions_latest: null,
        };
    }

    async fetchDataBlocks() {
        // TODO cache instead of repeating the call?
        const block_response = await getCntrprty('/blocks');
        this.setState({
            blocks: block_response.blocks,
        });
    }

    async fetchDataMempool() {
        // const mempool_response = await getCntrprty('/');
        const mempool_response = await getCntrprty('/mempool');

        const mempool_full = mempool_response.mempool;

        let mempool_empty = false;
        if (mempool_full.length === 0) {
            mempool_empty = true;
        }

        this.setState({
            mempool_empty,
            mempool_full,
            get_running_info: mempool_response.get_running_info,
        });
    }

    async fetchDataLatest() {
        const latest_response = await getCntrprty(`/transactions`);
        this.setState({
            btc_transactions_latest: latest_response.btc_transactions_latest,
        });
    }

    async componentDidMount() {
        // not awaiting it
        this.fetchDataBlocks();
        this.fetchDataMempool();
        this.fetchDataLatest();
    }

    render() {


        //////////
        let block_element_contents = (<p>loading...</p>);

        if (this.state.blocks && this.state.blocks.length) {
            block_element_contents = (
                <>
                    <table>
                        <tbody>
                            <tr style={{ padding: "0.25rem" }}>
                                {this.state.blocks.map((block_row, index) => {
                                    return (
                                        <td key={index} style={{ padding: "0 1rem 0 0" }}>
                                            <strong><Link to={`/block/${block_row.block_index}`}>{block_row.block_index}</Link></strong>
                                            <br />
                                            {/* {timeIsoFormat(block_row.block_time)}
                                            {' '} */}
                                            {timeSince(new Date(block_row.block_time * 1000))}
                                            <br /><br />
                                            {block_row.messages_count} messages
                                            {/* {block_row.messages} messages */}
                                            <br /><br />
                                            {/* // https://github.com/CounterpartyXCP/counterparty-lib/blob/master/counterpartylib/lib/blocks.py#L1078 */}
                                            {/* // https://github.com/CounterpartyXCP/counterparty-lib/blob/master/counterpartylib/lib/blocks.py#L1448 */}
                                            L:{hashSlice(block_row.ledger_hash)}<br />
                                            TX:{hashSlice(block_row.txlist_hash)}<br />
                                            M:{hashSlice(block_row.messages_hash)}<br />
                                            {/* ledger_hash:{hashSlice(block_row.ledger_hash)}<br />
                                            txlist_hash:{hashSlice(block_row.txlist_hash)}<br />
                                            messages_hash:{hashSlice(block_row.messages_hash)}<br /> */}
                                        </td>
                                        // <td key={index} style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(block_row)}</td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        }
        const block_element = (
            <>
                <h2>Latest blocks:</h2>
                {block_element_contents}
            </>
        );
        //////////


        let mempool_element_contents = (<p>loading...</p>);
        if (this.state.mempool_empty) {
            mempool_element_contents = (
                <p>Try refreshing the page in a couple of minutes...</p>
                // <p>Try refreshing the page in a couple of minutes... (<a href={`https://github.com/CounterpartyXCP/counterparty-lib/issues/1227`} target="_blank">why?</a>)</p>
            );
        }
        else if (this.state.mempool_full.length) {
            mempool_element_contents = (
                <table>
                    <tbody>
                        {ListElements.getTableRowMempoolHomeHeader()}
                        {this.state.mempool_full.map((mempool_row, index) => {
                            // {this.state.mempool_grouped.map((mempool_row, index) => {
                            return ListElements.getTableRowMempoolHome(mempool_row, index);
                            // return ListElements.getTableRowMempool(mempool_row, index);
                        })}
                    </tbody>
                </table>
            );
        }
        const mempool_element = (
            <>
                <h2>Mempool transactions:</h2>
                {/* <h2>Mempool:</h2> */}
                {mempool_element_contents}
            </>
        );

        let transactions_element_contents = (<p>loading...</p>);
        if (this.state.btc_transactions_latest && this.state.btc_transactions_latest.length) {
            const is_home_page = true;

            const link_tx_index = this.state.btc_transactions_latest[0].tx_index - 99;
            // const link_tx_index = this.state.btc_transactions_latest[0].tx_index - 999;

            transactions_element_contents = (
                <>
                    {/* <h4>Latest:</h4> */}
                    <h4>Latest (most recent top):</h4>
                    <table>
                        <tbody>
                            {ListElements.getTableRowTransactionHeader(is_home_page)}
                            {this.state.btc_transactions_latest.map((transaction_row, index) => {
                                return ListElements.getTableRowTransaction(transaction_row, index, is_home_page);
                            })}
                        </tbody>
                    </table>

                    <h4><Link to={`/transactions#${link_tx_index}`}>All transactions</Link></h4>
                    {/* <h4><Link to={`/transactions`}>All transactions</Link></h4> */}
                </>
            );
        }
        const transactions_element = (
            <>
                <h2>Block transactions:</h2>
                {/* <h2>Transactions:</h2> */}
                {transactions_element_contents}
            </>
        );

        const homenew_element = (
            <>
                {block_element}
                {mempool_element}
                {transactions_element}
                {/* {tables_element} */}
            </>
        );

        return OneElements.getFullPageForRouteElement(homenew_element);
        // return OneElements.getFullPageForRouteElement(mempool_element);
        // return (
        //     <main style={{ padding: "1rem" }}>
        //         {mempool_element}
        //         <p>
        //             [xcp.dev v1.0]
        //             <br />
        //             [counterparty-lib v9.59] in [Bitcoin Core v0.21???]
        //         </p>
        //     </main>
        // );
    }

}

export default withRouter(Home);
