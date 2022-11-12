import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements } from './shared/elements';
import { Link } from "react-router-dom";

class BlockHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: null,
        };
    }

    async fetchData() {
        // TODO cache instead of repeating the call?
        const block_response = await getCntrprty('/');
        // const block_response = await getCntrprty(`/block`);

        // console.log(`rrr1`);
        // console.log(JSON.stringify(block_response));
        // console.log(`rrr2`);

        this.setState({
            blocks: block_response.blocks,
        });
    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData();
    }

    render() {

        let block_element_contents = (<p>loading...</p>);

        if (this.state.blocks && this.state.blocks.length) {
            block_element_contents = (
                <>
                    {/* <h3>Messages:</h3> */}

                    <ul>
                        {this.state.blocks.map((block_row, index) => {
                            return (
                                <li key={index}>block: <Link to={`/block/${block_row.block_index}`}>{block_row.block_index}</Link> [{block_row.messages} messages]</li>
                                // <li key={index}>block: {block_row.block_index} [{block_row.messages} messages]</li>
                                // <li key={index}>{JSON.stringify(block_row)}</li>
                            );
                        })}
                    </ul>

                </>
            );
        }
        const block_element = (
            <>
                <h2>Latest blocks:</h2>
                {/* <h2>Bitcoin block: {this.state.block}</h2> */}
                {/* <h2>Block: {this.state.block}</h2> */}
                {block_element_contents}
            </>
        );

        return OneElements.getFullPageForRouteElement(block_element);
    }

}

export default withRouter(BlockHome);
