import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mempool_empty: null,
            mempool_full: [],
            get_running_info: null,
        };
    }

    async fetchData() {
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

    async componentDidMount() {
        // not awaiting it
        this.fetchData();
    }

    render() {

        let mempool_element_contents = (<p>loading...</p>);
        if (this.state.mempool_empty) {
            mempool_element_contents = (
                <p>Refresh the page in a couple of seconds...</p>
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
                <h2>Mempool:</h2>
                {mempool_element_contents}
            </>
        );

        return OneElements.getFullPageForRouteElement(mempool_element);
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
