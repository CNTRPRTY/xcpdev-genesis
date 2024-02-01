import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
import { Link } from "react-router-dom";

function baseState(block) {
    return {
        block,

        // TODO make it non-cntrprty compatible

        // block_not_found: false,
        block_row_loading: true,
        block_row_loading_error: null,
        block_row: null,

        messages_block: null, // for ux, to not show a different block's messages in transitions
        messages_loading: true,
        messages_loading_error: null,
        messages: [],
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

        let block_metadata_element = (<p>loading...</p>);
        if (this.state.block_row_loading_error) {
            block_metadata_element = (<p>{`${this.state.block_row_loading_error}`}</p>);
        }
        else if (!this.state.block_row_loading) {
            block_metadata_element = (
                <>
                    <ul>
                        <li>block_index: {this.state.block}</li>
                        <li>block_time_iso: {(new Date(this.state.block_row.block_time * 1000).toISOString()).replace('.000Z', 'Z')}</li>
                    </ul>
                    <ul>
                        <li>block_hash: {this.state.block_row.block_hash}</li>
                        <li>previous_block_hash: {this.state.block_row.previous_block_hash}</li>
                    </ul>
                    <ul>
                        <li>ledger_hash (L): {this.state.block_row.ledger_hash}</li>
                        <li>txlist_hash (TX): {this.state.block_row.txlist_hash}</li>
                        <li>messages_hash (M): {this.state.block_row.messages_hash}</li>
                    </ul>
                </>
            );
        }


        let block_messages_element_header = (<h3>Messages:</h3>);

        let block_messages_element = (<p>loading...</p>);
        if (this.state.messages_loading_error) {
            block_messages_element = (<p>{`${this.state.messages_loading_error}`}</p>);
        }
        else if (
            !this.state.messages_loading
            &&
            this.state.block === this.state.messages_block
        ) {
            // else if (!this.state.messages_loading) {

            if (this.state.messages.length) {
                block_messages_element_header = (<h3>Messages ({this.state.messages.length}):</h3>);
            }

            block_messages_element =
                this.state.messages.length ?
                    (
                        <>
                            <table>
                                <tbody>
                                    {ListElements.getTableRowMessageBlockHeader()}
                                    {this.state.messages.map((message_row, index) => {
                                        return ListElements.getTableRowMessageBlock(message_row, index);
                                    })}
                                </tbody>
                            </table>
                        </>
                    )
                    : (<p>no messages in block</p>);
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
                    <tr style={{ padding: "0.25rem" }}>
                        {previous_page_column}
                        {next_page_column}
                    </tr>
                </tbody>
            </table>
        );


        const block_element = (
            <>
                <h2>Block: {this.state.block}</h2>
                {/* <h2>Bitcoin block: {this.state.block}</h2> */}

                {change_pages_element}
                {block_metadata_element}

                {block_messages_element_header}
                {block_messages_element}
            </>
        );

        return OneElements.getFullPageForRouteElement(block_element);
    }

}

export default withRouter(Block);
