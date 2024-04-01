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
            // special render for not found error
            let to_print;
            if (this.state.block_row_loading_error.message.startsWith('[404:')) {
                to_print = `block not found...`;
            }
            else {
                to_print = `${this.state.block_row_loading_error}`;
            }
            block_metadata_element = (<p>{to_print}</p>);
            // block_metadata_element = (<p>{`${this.state.block_row_loading_error}`}</p>);
        }
        else if (!this.state.block_row_loading) {
            block_metadata_element = (
                <>
                    <div class="py-1 my-1">
                        <ul>
                            {/* does not show with overflow-auto */}
                            {/* <ul class="list-disc list-outside"> */}
                            <li>
                                <span class="text-gray-600">block index:</span>
                                {' '}
                                {this.state.block}
                            </li>
                            <li>
                                <span class="text-gray-600">block time:</span>
                                {' '}
                                {(new Date(this.state.block_row.block_time * 1000).toISOString()).replace('.000Z', 'Z')}
                            </li>
                        </ul>
                    </div>
                    <div class="py-1 my-1">
                        <ul>
                        {/* <ul class="list-disc list-outside"> */}
                            <li>
                                <span class="text-gray-600">block hash:</span>
                                {' '}
                                {this.state.block_row.block_hash}
                            </li>
                            <li>
                                <span class="text-gray-600">previous block hash:</span>
                                {' '}
                                {this.state.block_row.previous_block_hash}
                            </li>
                        </ul>
                    </div>
                    <div class="py-1 my-1">
                        <ul>
                        {/* <ul class="list-disc list-outside"> */}
                            <li>
                                <span class="text-gray-600">ledger hash (L):</span>
                                {' '}
                                {this.state.block_row.ledger_hash}
                            </li>
                            <li>
                                <span class="text-gray-600">txlist hash (TX):</span>
                                {' '}
                                {this.state.block_row.txlist_hash}
                            </li>
                            <li>
                                <span class="text-gray-600">messages hash (M):</span>
                                {' '}
                                {this.state.block_row.messages_hash}
                            </li>
                        </ul>
                    </div>
                </>
            );
        }


        let block_messages_element_header = (
            <h3 class="font-bold">
                Messages:
            </h3>
        );

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
                block_messages_element_header = (
                    <h3 class="font-bold">
                        Messages ({this.state.messages.length}):
                    </h3>
                );
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
                        <td>
                            <div class="mx-1">{' | '}</div>
                        </td>
                        {next_page_column}
                    </tr>
                </tbody>
            </table>
        );


        const page_element = (
            <div class="py-2 my-2">
                <h2 class="font-bold text-xl mb-1">
                    Block: {this.state.block}
                </h2>

                <div class="py-1 my-1">
                    {change_pages_element}
                </div>
                <div class="pt-1 mt-1 ml-4 whitespace-nowrap overflow-auto">
                {/* <div class="pt-1 mt-1 ml-4 whitespace-nowrap overflow-auto border-4"> */}
                {/* <div class="pt-1 mt-1"> */}
                    {/* <div class="py-1 my-1"> */}
                    {block_metadata_element}
                </div>

                <div class="pt-1 mt-1">
                    {/* <div class="py-1 my-1"> */}
                    <div class="py-1 my-1">
                        {block_messages_element_header}
                    </div>
                    <div class="pt-1 mt-1 ml-4 overflow-auto">
                    {/* <div class="pt-1 mt-1 overflow-auto border-4"> */}
                    {/* <div class="pt-1 mt-1"> */}
                        {/* <div class="py-1 my-1"> */}
                        {block_messages_element}
                    </div>
                </div>
            </div>
        );

        return OneElements.getFullPageForRouteElement(page_element);
    }

}

export default withRouter(Block);
