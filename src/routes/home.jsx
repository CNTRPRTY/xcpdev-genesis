import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from "react-router-dom";
import { timeSince, hashSlice } from '../utils';

import { decode_data } from '../decode_tx';
import { Buffer } from 'buffer';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blocks: null,
            mempool: null,
            transactions: null,
        };
    }

    async fetchDataBlocks() {
        const block_response = await getCntrprty('/blocks');
        this.setState({
            blocks: block_response.blocks,
        });
    }

    async fetchDataMempool() {
        const mempool_response = await getCntrprty('/mempool');
        this.setState({
            mempool: mempool_response.mempool,
        });
    }

    async fetchDataTransactions() {
        const transactions_response = await getCntrprty(`/transactions`);
        this.setState({
            transactions: transactions_response.transactions,
            // transactions: transactions_response.transactions_latest, // TODO consistency
        });
    }

    async componentDidMount() {
        // no await
        this.fetchDataBlocks();
        this.fetchDataMempool();
        this.fetchDataTransactions();
    }

    render() {


        let block_element_contents = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        if (this.state.blocks && this.state.blocks.length) {
            block_element_contents = (
                <table>
                    <tbody>
                        <tr
                            class="whitespace-nowrap dark:text-slate-100"
                            style={{ padding: "0.25rem" }}
                        >
                            {/* <tr style={{ padding: "0.25rem" }}> */}
                            {this.state.blocks.map((block_row, index) => {
                                return (
                                    <td key={index} style={{ padding: "0 1rem 0 0" }}>

                                        <div class="p2-4 mr-4">

                                            <Link to={`/block/${block_row.block_index}`}>{block_row.block_index}</Link>
                                            <br />
                                            {timeSince(new Date(block_row.block_time * 1000))}

                                            <div class="py-1 my-1">
                                                <code>{block_row.transactions_count} transaction{block_row.transactions_count === 1 ? '' : 's'}</code><br />
                                                <code>{block_row.messages_count} message{block_row.messages_count === 1 ? '' : 's'}</code>
                                            </div>

                                            <code>L: {hashSlice(block_row.ledger_hash)}</code><br />
                                            <code>TX:{hashSlice(block_row.txlist_hash)}</code><br />
                                            <code>M: {hashSlice(block_row.messages_hash)}</code><br />

                                        </div>

                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            );
        }
        const block_element = (
            <>
                <h2 class="font-bold text-xl mb-1">
                    Latest blocks:
                    {' '}
                    <span class="font-normal">
                        ( <Link to={`/blocks`}>all</Link> )
                    </span>
                </h2>
                <div class="py-1 my-1 ml-4 overflow-auto">
                    {block_element_contents}
                </div>
            </>
        );


        let mempool_element_contents = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        if (this.state.mempool && !this.state.mempool.length) {
            mempool_element_contents = (
                <p class="dark:text-slate-100">
                    Try refreshing the page in a couple of minutes...
                </p>
            );
        }
        else if (this.state.mempool && this.state.mempool.length) {
            mempool_element_contents = (
                <table>
                    <tbody>
                        {ListElements.getTableRowMempoolHomeHeader()}
                        {this.state.mempool.map((mempool_row, index) => {

                            // cntrprty transaction
                            let cntrprty_decoded = {};
                            const cntrprty_hex = Buffer.from(mempool_row.data, 'hex').toString('hex');
                            try {
                                const current_version_past_block = 819000;
                                cntrprty_decoded = decode_data(mempool_row.destination, current_version_past_block, cntrprty_hex);
                            }
                            catch (e) {
                                console.error(`cntrprty_decoded error: ${e}`);
                            }

                            mempool_row.cntrprty_decoded = cntrprty_decoded;
                            return ListElements.getTableRowMempoolHome(mempool_row, index);
                        })}
                    </tbody>
                </table>
            );
        }
        const mempool_element = (
            <>
                <h2 class="font-bold text-xl mb-1">
                    Unconfirmed transactions:
                </h2>
                <div class="py-1 my-1 ml-4 overflow-auto">
                    {mempool_element_contents}
                </div>
            </>
        );

        let transactions_element_contents = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        if (this.state.transactions && this.state.transactions.length) {
            const is_home_page = true;
            transactions_element_contents = (
                <table>
                    <tbody>
                        {ListElements.getTableRowTransactionHeader(is_home_page)}
                        {this.state.transactions.map((transaction_row, index) => {
                            return ListElements.getTableRowTransaction(transaction_row, index, is_home_page);
                        })}
                    </tbody>
                </table>
            );
        }
        const transactions_element = (
            <>
                <h2 class="font-bold text-xl mb-1">
                    Latest confirmed transactions:
                    {' '}
                    <span class="font-normal">
                        ( <Link to={`/transactions`}>all</Link> )
                    </span>
                </h2>
                <div class="pt-1 mt-1 ml-4 overflow-auto">
                    {/* <div class="py-1 my-1 ml-4 overflow-auto"> */}
                    {transactions_element_contents}
                </div>
            </>
        );

        const route_element = (
            <>
                <div class="py-2 my-2">
                    {block_element}
                </div>
                <div class="py-2 my-2">
                    {mempool_element}
                </div>
                <div class="py-2 my-2">
                    {transactions_element}
                </div>
            </>
        );

        return <OneElements route_element={route_element} />;
        // return OneElements.getFullPageForRouteElement(homenew_element);
    }

}

export default withRouter(Home);
