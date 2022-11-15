import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements } from './shared/elements';
import { Link } from "react-router-dom";

class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asset_name: props.router.params.assetName,
            asset_not_found: null,
            asset_row: null,
            // tables: null,
        };
    }

    async fetchData(asset_name) {

        let asset_response = {};
        try {
            asset_response = await getCntrprty(`/asset/${asset_name}`);
        }
        catch (e) {
            asset_response.asset_row = null;
        }

        // console.log(`rrr1`);
        // console.log(JSON.stringify(asset_response));
        // console.log(`rrr2`);

        if (!asset_response.asset_row) {
            this.setState({
                asset_name,
                asset_not_found: true,
                asset_row: null,
                // tables: null,
            });
        }
        else {
            this.setState({
                asset_name,
                asset_not_found: null,
                asset_row: asset_response.asset_row,
                // tables: asset_response.tables,
            });
        }

    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData(this.state.asset_name);
    }

    async componentDidUpdate(prevProps) {
        const updatedProp = this.props.router.params.asset_name;
        if (updatedProp !== prevProps.router.params.asset_name) {
            // not awaiting it
            this.fetchData(updatedProp);
        }
    }

    render() {

        // let asset_metadata = null;
        let asset_metadata = (<p>loading...</p>);
        if (this.state.asset_not_found) {
            // if (!this.state.asset_row) {
            asset_metadata = (
                <p>asset not found (or genesis issuance is still in the mempool...)</p>
                // <p>asset not found (or is still in the mempool...)</p>
                // <p>asset not found (maybe is still in the mempool...)</p>
                // <p>asset not found</p>
            );
        }
        else if (this.state.asset_row) {
            // else {
            asset_metadata = (
                <>
                    <ul>
                        {this.state.asset_row.asset_longname ?
                            (<li>asset_longname: {this.state.asset_row.asset_longname}</li>)
                            : (null)
                        }
                        <li>asset_name: {this.state.asset_row.asset_name}</li>
                        <li>asset_id: {this.state.asset_row.asset_id}</li>
                        <li>block_index: <Link to={`/block/${this.state.asset_row.block_index}`}>{this.state.asset_row.block_index}</Link></li>
                        {/* <li>block_index: {this.state.asset_row.block_index}</li> */}
                        {/* <li>{JSON.stringify(this.state.asset_row)}</li> */}
                    </ul>
                </>
            );
        }

        const asset_element = (
            <>
                <h2>Asset: {this.state.asset_name}</h2>
                {asset_metadata}
            </>
        );

        return OneElements.getFullPageForRouteElement(asset_element);

    }

}

export default withRouter(Asset);
