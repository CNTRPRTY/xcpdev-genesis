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

                olga_length,
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

            // is olga
            let olga_element = null;
            const olga_broadcast_tx = "627ae48d6b4cffb2ea734be1016dedef4cee3f8ffefaea5602dd58c696de6b74";
            if (this.state.transaction.tx_hash === olga_broadcast_tx) {
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
                    <>
                        <p>Honoring <Link to={`/asset/OLGA`}>OLGA</Link></p>
                        <img src={data_url_chain_fixed} />
                        <p>Image *<a href={`https://github.com/CNTRPRTY/xcpdev/commit/c7e1abd5bfc2a595bc70f86e14f7abdd91d787a6#r98710211`} target="_blank">written</a>* in Bitcoin since 2015</p>
                        
                        <br />
                        On-chain-only image *can* be seen below, use slider (works on desktop)
                        <br />
                        {/* {data_url_cut.length} chars */}
                        
                        <br />
                        <input
                            type="range"
                            min="0" max={data_url_chain.length}
                            value={data_url_chain.length - this.state.olga_chars_cut}
                            onChange={this.handleRange}
                            step="1"
                        />

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
                    </>
                );
            }

            transaction_element_contents = (
                <>
                {olga_element}

                {/* // at least for now, not using tables for single element result
                // just using a simple ul for now */}

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

                    <li>CNTRPRTY tx_index: {this.state.transaction.tx_index}{this.state.transaction.supported ? '' : ' (supported:0)'}</li>
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
