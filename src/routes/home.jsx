import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from "react-router-dom";
import { timeIsoFormat, timeSince, hashSlice } from '../utils';

import { decode_data } from '../decode_tx';
import { Buffer } from 'buffer';
import {
    Button,
    Card,
    TextInput,
    Title,
    Table,
    TableHead,
    TableBody, TableFoot, TableFooterCell, Subtitle, TableRow
} from "@tremor/react";

// move to util if reused
function isAssetName(possible) {
    // if subasset only validate the superasset part
    const maybe_subasset = possible.split('.');
    if (maybe_subasset.length > 1) {
        possible = maybe_subasset[0];
    }
    // https://stackoverflow.com/a/8653681
    if (possible.match(/^[a-zA-Z]+$/)) {
        // only letters
        return true;
    }
    else if (
        (
            possible.startsWith('A') ||
            possible.startsWith('a')
        ) &&
        Number.isInteger(Number(possible.substring(1))) // Number.isInteger(99999999999999999999999); // true (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#using_isinteger)
    ) {
        // is numeric asset
        return true;
    }
    else {
        return false;
    }
}

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            
            ////
            blocks: null,
            ////
            mempool_empty: null,
            // mempool_full: [],
            mempool_full_new: [],
            get_running_info: null,
            //
            btc_transactions_latest: null,
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    handleSearchChange(event) {
        this.setState({ search: event.target.value });
    }

    handleSearchSubmit(event) {
        event.preventDefault();
        let to_navigate = this.state.search.replace(/\s/g, ''); // remove all whitespace (https://stackoverflow.com/a/6623263)
        this.setState({ search: '' });

        let path_type = null;

        // simple for now:
        if (to_navigate.length === 64) {
            path_type = 'tx';
        }
        else if (Number.isInteger(Number(to_navigate))) {
            // simplest to allow both block_height and tx_index
            const num = Number(to_navigate);
            if (num >= 900000) {
                path_type = 'tx';
            }
            else {
                path_type = 'block';
            }
            // path_type = 'block';
        }
        else if (isAssetName(to_navigate)) {
            const to_uppercase = to_navigate.split('.');
            to_uppercase[0] = to_uppercase[0].toUpperCase();
            to_navigate = to_uppercase.join('.');
            path_type = 'asset';
        }
        // TODO more strict validation, but for now treating everything else as an address
        else {
            path_type = 'address';
        }

        if (path_type) {
            this.props.router.navigate(`${path_type}/${to_navigate}`);
        }
        else {
            alert(`no data type match found for: ${to_navigate}`);
        }

    }

    async fetchDataBlocks() {
        // TODO cache instead of repeating the call?
        const block_response = await getCntrprty('/blocks');
        this.setState({
            blocks: block_response.blocks,
        });
    }

    async fetchDataMempool() {
        const mempool_response = await getCntrprty('/mempool');

        const mempool_full_new = mempool_response.mempool;
        // const mempool_full = mempool_response.mempool;

        let mempool_empty = false;
        if (mempool_full_new.length === 0) {
            // if (mempool_full.length === 0) {
            mempool_empty = true;
        }

        this.setState({
            mempool_empty,
            // mempool_full,
            mempool_full_new, // still wip
            // get_running_info: mempool_response.get_running_info, // not used
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
                                            <Card className={"flex flex-col items-start justify-start"}>
                                                <Link className={"text-yellow-600 "}
                                                      to={`/block/${block_row.block_index}`}>{block_row.block_index}</Link>

                                                {/* {timeIsoFormat(block_row.block_time)}
                                                {' '} */}
                                                <Subtitle
                                                    className={"text-sm"}>{timeSince(new Date(block_row.block_time * 1000))}</Subtitle>

                                                <div className={"flex flex-row my-3"}>
                                                    <span className={"font-bold mr-1"}>{block_row.messages_count}</span><Subtitle>{block_row.messages_count === 1 ? 'message' : 'messages'}</Subtitle>
                                                </div>
                                                {/* // https://github.com/CounterpartyXCP/counterparty-lib/blob/master/counterpartylib/lib/blocks.py#L1078 */}
                                                {/* // https://github.com/CounterpartyXCP/counterparty-lib/blob/master/counterpartylib/lib/blocks.py#L1448 */}
                                                <div className={"flex flex-row w-full justify-between"}>
                                                    <span className={"font-bold mr-1"}>L:</span><Subtitle>{hashSlice(block_row.ledger_hash)}</Subtitle>
                                                </div>
                                                <div className={"flex flex-row w-full justify-between"}>
                                                    <span className={"font-bold mr-1"}>TX:</span><Subtitle>{hashSlice(block_row.txlist_hash)}</Subtitle>
                                                </div>
                                                <div className={"flex flex-row w-full justify-between"}>
                                                    <span className={"font-bold mr-1"}>M:</span><Subtitle>{hashSlice(block_row.messages_hash)}</Subtitle>
                                                </div>
                                                    {/* ledger_hash:{hashSlice(block_row.ledger_hash)}<br />
                                                txlist_hash:{hashSlice(block_row.txlist_hash)}<br />
                                                messages_hash:{hashSlice(block_row.messages_hash)}<br /> */}
                                            </Card>
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
            <div className={"mt-12"}>
                <Title className={"font-bold text-xl mb-3"}>Latest blocks</Title>
                <div className={"overflow-scroll p-0.5"}>
                    {block_element_contents}
                </div>
            </div>
        );
        //////////


        let mempool_element_contents = (<p>loading...</p>);
        if (this.state.mempool_empty) {
            mempool_element_contents = (
                <p>Try refreshing the page in a couple of minutes...</p>
                // <p>Try refreshing the page in a couple of minutes... (<a href={`https://github.com/CounterpartyXCP/counterparty-lib/issues/1227`} target="_blank">why?</a>)</p>
            );
        }
        else if (this.state.mempool_full_new.length) {
            mempool_element_contents = (
                <Card className={"mt-12"}>
                    <Title className={"font-bold text-xl"}>Unconfirmed transactions</Title>
                    <Table className="mt-5">
                        <TableHead>
                            {ListElements.getTableRowMempoolHomeHeader()}
                        </TableHead>
                        <TableBody>
                            {this.state.mempool_full_new.map((mempool_row, index) => {

                                // cntrprty transaction
                                let cntrprty_decoded = {};
                                const cntrprty_hex = Buffer.from(mempool_row.data, 'hex').toString('hex');
                                try {
                                    const current_version_past_block = 819000;
                                    cntrprty_decoded = decode_data(cntrprty_hex, current_version_past_block);
                                } catch (e) {
                                    console.error(`cntrprty_decoded error: ${e}`);
                                }

                                mempool_row.cntrprty_decoded = cntrprty_decoded;
                                return ListElements.getTableRowMempoolHome(mempool_row, index);
                            })}
                            {/*</tbody>*/}
                            {/*</table>*/}
                        </TableBody>
                    </Table>
                </Card>
            );
        }
        // else if (this.state.mempool_full.length) {
        //     mempool_element_contents = (
        //         <table>
        //             <tbody>
        //                 {ListElements.getTableRowMempoolHomeHeader()}
        //                 {this.state.mempool_full.map((mempool_row, index) => {
        //                     // {this.state.mempool_grouped.map((mempool_row, index) => {
        //                     return ListElements.getTableRowMempoolHome(mempool_row, index);
        //                     // return ListElements.getTableRowMempool(mempool_row, index);
        //                 })}
        //             </tbody>
        //         </table>
        //     );
        // }
        const mempool_element = (
            <>
                {/* <h2>Unconfirmed (mempool) transactions:</h2> */}
                {/*<h2 className={"font-bold"}>Unconfirmed transactions:</h2>*/}
                {/* <h2>Mempool transactions:</h2> */}
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
                    {/*<h4>Latest (tx_index desc):</h4>*/}
                    {/* <h4>Latest (most recent top):</h4> */}
                    <Card className={"my-12"}>
                        <Title className={"font-bold text-xl"}>Block transactions</Title>
                        <Subtitle>Latest (tx_index desc)</Subtitle>
                        <Table className="mt-5">
                            <TableHead>
                                {ListElements.getTableRowTransactionHeader(is_home_page)}
                            </TableHead>
                            <TableBody>
                                {this.state.btc_transactions_latest.map((transaction_row, index) => {
                                    return ListElements.getTableRowTransaction(transaction_row, index, is_home_page);
                                })}
                            </TableBody>
                            <TableFoot>
                                <TableRow>
                                    <TableFooterCell>
                                        <Link className={"font-bold hover:text-yellow-500"} to={`/transactions#${link_tx_index}`}>All transactions</Link>
                                    </TableFooterCell>
                                </TableRow>
                            </TableFoot>
                        </Table>
                    </Card>

                    {/*<h4><Link to={`/transactions#${link_tx_index}`}>All transactions</Link></h4>*/}
                    {/* <h4><Link to={`/transactions`}>All transactions</Link></h4> */}
                </>
            );
        }
        const transactions_element = (
            <>
                {/*<h2>Block transactions:</h2>*/}
                {/* <h2>Transactions:</h2> */}
                {transactions_element_contents}
            </>
        );

        const placeholder = " block / tx_index / tx_hash / address / asset";
        const search_element = (
            <span>
                <div style={{ padding: "1.1rem 0 0.5rem 0" }}>
                    <form onSubmit={this.handleSearchSubmit}>
                        <div className={"flex flex-row space-x-1"}>
                        <TextInput className={"w-64"} type="text" value={this.state.search} onChange={this.handleSearchChange} placeholder={placeholder} size={placeholder.length - 12} />
                        {' '}
                        <Button type="submit" variant={"secondary"} value={"go"} >Go</Button>
                        </div>
                    </form>
                </div>
            </span>
        );

        const homenew_element = (
            <div className={"w-full max-w-[1300px]"}>
                {search_element}
                {block_element}
                {mempool_element}
                {transactions_element}
                {/* {tables_element} */}
            </div>
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
