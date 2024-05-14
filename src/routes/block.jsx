import React from 'react';
import { Link } from "react-router-dom";
import { Buffer } from 'buffer';

import { withRouter } from './shared/classhooks';
import { getCntrprty, eventsFilter } from '../api';
// import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { decode_data } from '../decode_tx';

function baseState(block) {
    return {
        block,

        // TODO make it non-cntrprty compatible

        // block_not_found: false,
        block_row_loading: true,
        block_row_loading_error: null,
        block_row: null,

        transactions_block: null, // for ux, to not show a different block's transactions in transitions
        transactions_loading: true,
        transactions_loading_error: null,
        transactions: [],

        messages_block: null, // for ux, to not show a different block's messages in transitions
        messages_loading: true,
        messages_loading_error: null,
        messages: [],

        messages_show_bindings: false,
        // to debug
        show_all_events: false,
    };
}

class Block extends React.Component {
    constructor(props) {
        super(props);
        this.state = baseState(props.router.params.block);
    }

    async fetchData(_block) {

        // handle blockhash redirect
        if (!Number.isInteger(Number(_block))) {
            // assume is blockhash
            try {
                const blockindex_response = await getCntrprty(`/blockhash/${_block}`);
                this.props.router.navigate(`/block/${blockindex_response.block_row.block_index}`, { replace: true });
            }
            catch (err) {
                this.setState({
                    block_row_loading_error: err,
                });
            }
        }
        else {

            const block = Number(_block);

            this.setState(baseState(block));

            let block_row = null;
            try {
                const block_response = await getCntrprty(`/block/${block}`);
                block_row = block_response.block_row;
                this.setState({
                    block_row_loading: false,
                    block_row,
                });
            }
            catch (err) {
                this.setState({
                    block_row_loading_error: err,
                    // block_not_found: true,
                });
            }

            if (!block_row) {
                this.setState({
                    messages_loading: false,
                    messages_loading_error: Error(`no block`),
                });
            }
            else { // block_row

                try {
                    const transactions_response = await getCntrprty(`/block/${block}/transactions`);
                    this.setState({
                        transactions_block: block,
                        transactions_loading: false,
                        transactions: transactions_response.transactions,
                    });
                }
                catch (err) {
                    this.setState({
                        transactions_loading_error: err,
                    });
                }
                
                try {
                    const messages_response = await getCntrprty(`/block/${block}/messages`);
                    this.setState({
                        messages_block: block,
                        messages_loading: false,
                        messages: messages_response.messages,
                    });
                }
                catch (err) {
                    this.setState({
                        messages_loading_error: err,
                    });
                }

            }

        }

    }

    async componentDidMount() {
        await this.fetchData(this.state.block);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.block;
        if (`${updatedProp}`.trim() !== `${prevProps.router.params.block}`.trim()) {
            await this.fetchData(updatedProp);
        }
    }

    render() {

        let block_metadata_element = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        {/* let block_metadata_element = (<p>loading...</p>); */ }
        if (this.state.block_row_loading_error) {
            // special render for not found error
            let to_print;
            if (this.state.block_row_loading_error.message.startsWith('[404:')) {
                to_print = `block not found...`;
            }
            else {
                to_print = `${this.state.block_row_loading_error}`;
            }
            block_metadata_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    {to_print}
                </p>
            );
            // block_metadata_element = (<p>{to_print}</p>);
            // block_metadata_element = (<p>{`${this.state.block_row_loading_error}`}</p>);
        }
        else if (!this.state.block_row_loading) {
            block_metadata_element = (
                <>
                    <div class="py-1 my-1">
                        <ul>
                            <li>
                                <span class="text-gray-600 dark:text-gray-400">block index:</span>
                                {' '}
                                <span class="dark:text-slate-100">{this.state.block}</span>
                            </li>
                            <li>
                                <span class="text-gray-600 dark:text-gray-400">block time:</span>
                                {' '}
                                <span class="dark:text-slate-100">{(new Date(this.state.block_row.block_time * 1000).toISOString()).replace('.000Z', 'Z')}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="py-1 my-1">
                        <ul>
                            <li>
                                <span class="text-gray-600 dark:text-gray-400">block hash:</span>
                                {' '}
                                <span class="dark:text-slate-100">{this.state.block_row.block_hash}</span>
                            </li>
                            <li>
                                <span class="text-gray-600 dark:text-gray-400">previous block hash:</span>
                                {' '}
                                <span class="dark:text-slate-100">{this.state.block_row.previous_block_hash}</span>
                            </li>
                        </ul>
                    </div>
                    {this.state.block_row.ledger_hash.length ?
                        (
                            <div class="py-1 my-1">
                                <ul>
                                    <li>
                                        <span class="text-gray-600 dark:text-gray-400">ledger hash (L):</span>
                                        {' '}
                                        <span class="dark:text-slate-100">{this.state.block_row.ledger_hash}</span>
                                    </li>
                                    <li>
                                        <span class="text-gray-600 dark:text-gray-400">txlist hash (TX):</span>
                                        {' '}
                                        <span class="dark:text-slate-100">{this.state.block_row.txlist_hash}</span>
                                    </li>
                                    <li>
                                        <span class="text-gray-600 dark:text-gray-400">messages hash (M):</span>
                                        {' '}
                                        <span class="dark:text-slate-100">{this.state.block_row.messages_hash}</span>
                                    </li>
                                </ul>
                            </div>
                        )
                        : null
                    }
                </>
            );
        }


        let block_transactions_element_header = (
            <h3 class="font-bold">
                Transactions:
            </h3>
        );

        let block_transactions_element = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        if (this.state.transactions_loading_error) {
            block_transactions_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    {`${this.state.transactions_loading_error}`}
                </p>
            );
        }
        else if (
            !this.state.transactions_loading
            &&
            this.state.block === this.state.transactions_block
        ) {

            if (this.state.transactions.length) {
                block_transactions_element_header = (
                    <h3 class="font-bold">
                        Transactions ({this.state.transactions.length}):
                    </h3>
                );
            }

            block_transactions_element =
                this.state.transactions.length ?
                    (
                        <>
                            <table>
                                <tbody>
                                    {ListElements.getTableRowBlockTransactionsHeader(this.state.messages_show_bindings)}
                                    {this.state.transactions.map((transaction_row, index) => {

                                        // cntrprty transaction
                                        let cntrprty_decoded = {};
                                        const cntrprty_hex = Buffer.from(transaction_row.data, 'hex').toString('hex');
                                        try {
                                            cntrprty_decoded = decode_data(transaction_row.destination, this.state.block, cntrprty_hex);
                                        }
                                        catch (e) {
                                            console.error(`cntrprty_decoded error: ${e}`);
                                        }

                                        transaction_row.cntrprty_decoded = cntrprty_decoded;
                                        return ListElements.getTableRowBlockTransactions(transaction_row, index);
                                    })}
                                </tbody>
                            </table>
                        </>
                    )
                    : (
                        <p class="text-gray-600 dark:text-gray-400">
                            no Counterparty transactions in block
                            {/* no cntrprty transactions in block */}
                            {/* no transactions in block */}
                        </p>
                    );
        }


        let block_messages_element_header = (
            <h3 class="font-bold">
                Messages:
            </h3>
        );

        let block_messages_element = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        // let block_messages_element = (<p>loading...</p>);
        if (this.state.messages_loading_error) {
            block_messages_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    {`${this.state.messages_loading_error}`}
                </p>
            );
            // block_messages_element = (<p>{`${this.state.messages_loading_error}`}</p>);
        }
        else if (
            !this.state.messages_loading
            &&
            this.state.block === this.state.messages_block
        ) {
            // else if (!this.state.messages_loading) {

            if (this.state.messages.length) {
                block_messages_element_header = (
                    <h3 class="font-bold">
                        {/* separate non-message events */}
                        Messages ({this.state.messages.filter((message_row) => {
                            return eventsFilter(message_row);
                        }).length}):
                        {this.state.show_all_events ? ` (${this.state.messages.length} total events)` : ''}
                        {/* Messages ({this.state.messages.length}): */}
                    </h3>
                );
            }

            block_messages_element =
                this.state.messages.length ?
                    (
                        <>

                            <label>
                                <input type="checkbox" onClick={() => {
                                    this.setState((prevState, props) => ({
                                        messages_show_bindings: !prevState.messages_show_bindings
                                    }));
                                }} />
                                {' '}
                                <span class="text-gray-600 dark:text-gray-400">show bindings</span>
                            </label>

                            {localStorage.debug_mode === "true" ?
                                (
                                    <>
                                        {' '}
                                        <label>
                                            <input
                                                type="checkbox"
                                                onClick={() => {
                                                    this.setState((prevState, props) => ({
                                                        show_all_events: !prevState.show_all_events
                                                    }));
                                                }}
                                                checked={this.state.show_all_events}
                                            />
                                            {' '}
                                            <span class="text-gray-600 dark:text-gray-400">debug: show all events</span>
                                        </label>
                                    </>
                                )
                                : null
                            }

                            {/* to debug */}
                            {/* // {' '}
                            // <label>
                            //     <input
                            //         type="checkbox"
                            //         onClick={() => {
                            //             this.setState((prevState, props) => ({
                            //                 show_all_events: !prevState.show_all_events
                            //             }));
                            //         }}
                            //         checked={this.state.show_all_events}
                            //     />
                            //     {' '}
                            //     <span class="text-gray-600 dark:text-gray-400">debug: show all events</span>
                            // </label> */}
                            {/*  */}

                            <table>
                                <tbody>
                                    {ListElements.getTableRowMessageBlockHeader(this.state.messages_show_bindings, this.state.show_all_events)}
                                    {/* {ListElements.getTableRowMessageBlockHeader(this.state.messages_show_bindings)} */}
                                    {/* {ListElements.getTableRowMessageBlockHeader()} */}

                                    {/* filter only in display */}
                                    {this.state.messages.filter((message_row) => {
                                        return eventsFilter(message_row, this.state.show_all_events);
                                    }).map((message_row, index) => {
                                        // {this.state.messages.map((message_row, index) => {
                                        return ListElements.getTableRowMessageBlock(message_row, index, this.state.messages_show_bindings,  this.state.show_all_events);
                                        // return ListElements.getTableRowMessageBlock(message_row, index, this.state.messages_show_bindings, eventsFilter(message_row));
                                        // return ListElements.getTableRowMessageBlock(message_row, index, this.state.messages_show_bindings);
                                        // // return ListElements.getTableRowMessageBlock(message_row, index);
                                    })}
                                </tbody>
                            </table>
                        </>
                    )
                    : (
                        <p class="text-gray-600 dark:text-gray-400">
                            no messages in block
                        </p>
                    );
        }


        const previous_page_column = !this.state.block_row_loading ?
            (
                <td>
                    <Link to={`/block/${this.state.block - 1}`}>{'<'}previous</Link>{' '}
                </td>
            )
            : (<td>{`<previous `}</td>);
        const next_page_column = !this.state.block_row_loading ?
            (
                <td>
                    <Link to={`/block/${this.state.block + 1}`}>next{'>'}</Link>{' '}
                </td>
            )
            : (<td>{`next>`}</td>);
        const change_pages_element = (
            <table>
                <tbody>
                    <tr
                        class="dark:text-slate-100"
                        style={{ padding: "0.25rem" }}
                    >
                        {/* <tr style={{ padding: "0.25rem" }}> */}
                        {previous_page_column}
                        <td>
                            <div class="mx-1">{' | '}</div>
                        </td>
                        {next_page_column}
                    </tr>
                </tbody>
            </table>
        );


        const route_element = (
            <div class="py-2 my-2">
                <h2 class="font-bold text-xl mb-1">
                    Block: {this.state.block}
                </h2>

                <div class="py-1 my-1">
                    {change_pages_element}
                </div>
                <div class="pt-1 mt-1 ml-4 whitespace-nowrap overflow-auto">
                    {block_metadata_element}
                </div>

                {this.state.block_row && this.state.block_row.ledger_hash.length ?
                    (
                        <>
                            <div class="py-1 my-1">
                                <div class="py-1 my-1">
                                    {block_transactions_element_header}
                                </div>
                                <div class="pt-1 mt-1 ml-4 overflow-auto">
                                    {block_transactions_element}
                                </div>
                            </div>

                            <div class="py-1 my-1">
                                <div class="py-1 my-1">
                                    {block_messages_element_header}
                                </div>
                                <div class="pt-1 mt-1 ml-4 overflow-auto">
                                    {block_messages_element}
                                </div>
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            {/* !nested terniary! */}
                            {this.state.block_row ?
                                (
                                    (
                                        <div class="py-1 my-1">
                                            <div class="pt-1 mt-1 ml-4 overflow-auto">
                                                <p class="text-gray-600 dark:text-gray-400">
                                                    the Counterparty protocol was not yet active by this block
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )
                                : null
                            }
                        </>
                    )
                    // (
                    //     <div class="py-1 my-1">
                    //         <div class="pt-1 mt-1 ml-4 overflow-auto">
                    //             <p class="text-gray-600 dark:text-gray-400">
                    //                 the Counterparty protocol was not yet active by this block
                    //             </p>
                    //         </div>
                    //     </div>
                    // )
                }

                <div class="py2 my-2">
                    {change_pages_element}
                </div>

            </div>
        );

        return <OneElements route_element={route_element} />;
        // return OneElements.getFullPageForRouteElement(page_element);
    }

}

export default withRouter(Block);
