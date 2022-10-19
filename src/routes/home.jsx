import React from 'react';
import { withRouter } from './shared/classhooks';

class Homemedia extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            elements: [],
        };
    }

    async fetchData() {
        this.setState({
            elements: [],
        });
    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData();
    }

    render() {
        return (
            <main style={{ padding: "1rem" }}>
                <h2>Mempool</h2>
                <p>
                    [xcp.dev v1.0]
                    <br />
                    [counterparty-lib v9.59] in [Bitcoin Core v0.21???]
                </p>
            </main>
        );
    }
}

export default withRouter(Homemedia);
