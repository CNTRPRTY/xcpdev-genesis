import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
// import { ListElements, OnlyElements } from './shared/elements';

class Block extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            block: props.router.params.block,
            block_not_found: null,
            messages: null,
        };
    }

    async fetchData(block) {
        const block_response = await getCntrprty(`/block/${block}`);

        // console.log(`rrr1`);
        // console.log(JSON.stringify(block_response));
        // console.log(`rrr2`);

        if (!block_response.messages) {
            this.setState({ block_not_found: true });
        }
        else if (!block_response.messages.length) {
            this.setState({
                messages: [],
            });
        }
        else { // block_response.messages.length
            this.setState({
                messages: block_response.messages,
            });
        }

    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData(this.state.block);
    }

    render() {

        let block_element_contents = (<p>loading...</p>);
        if (this.state.block_not_found) {
            block_element_contents = (
                <p>block not found</p>
            );
        }
        else if (this.state.messages !== null) {
            // else {
            // if (this.state.messages.length) {
            block_element_contents = (
                <>
                    <h3>Messages:</h3>

                    <table>
                        <tbody>
                            {this.state.messages.map((message_row, index) => {
                                const page = 'home'; // TODO?
                                return ListElements.getTableRowMessage(message_row, index, page);
                            })}
                        </tbody>
                    </table>

                </>
            );
        }
        const block_element = (
            <>
                <h2>Bitcoin block: {this.state.block}</h2>
                {/* <h2>Block: {this.state.block}</h2> */}
                {block_element_contents}
            </>
        );

        return OneElements.getFullPageForRouteElement(block_element);
        // return (
        //     <main style={{ padding: "1rem" }}>
        //         {block_element}
        //         <p>
        //             [xcp.dev v1.0]
        //             <br />
        //             [counterparty-lib v9.59] in [Bitcoin Core v0.21]
        //         </p>
        //     </main>
        // );
    }

}

export default withRouter(Block);
