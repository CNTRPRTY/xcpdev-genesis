import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from "../api";
import { Link } from "react-router-dom";
import { OneElements, ListElements } from './shared/elements';
import { timeIsoFormat } from '../utils';

class Assetspage extends React.Component {
    constructor(props) {
        super(props);

        let asset_if_specified = 'A';
        if (props.router.location.hash.length) {
            asset_if_specified = props.router.location.hash.replace('#', '');
        }

        this.state = {
            from_asset: asset_if_specified,
            to_asset: null,
            rows_loading: true,
            rows_loading_error: null,
            rows: null,
            tip_blocks_row: null,
        };
    }

    async fetchData(_from_asset) {
        let from_asset = _from_asset;
        try {
            if (!_from_asset) {
                from_asset = 'A';
            }
            const response = await getCntrprty(`/assets/${from_asset}`);
            this.setState({
                from_asset: response.from_asset,
                to_asset: response.to_asset,
                rows_loading: false,
                rows: response.assets,
                tip_blocks_row: response.tip_blocks_row,
            });
        }
        catch (err) {
            this.setState({
                rows_loading_error: err,
            });
        }
    }

    async componentDidMount() {
        await this.fetchData(this.state.from_asset);
    }

    async componentDidUpdate(prevProps) {
        const updatedHash = this.props.router.location.hash;
        const prevHash = prevProps.router.location.hash;
        if (updatedHash !== prevHash) {
            const from_asset = updatedHash.replace('#', '');
            await this.fetchData(from_asset);
        }

    }

    render() {

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        const jump_letter_element = (
            <>
                <h3>
                    Jump to letter:
                </h3>
                <p>
                    {alphabet.map((letter, index) => {
                        let include_separator = ' | ';
                        if (index === (alphabet.length - 1)) {
                            include_separator = '';
                        }
                        return (
                            <>
                                <Link to={`/assets#${letter}`}>{letter}</Link>{include_separator}
                            </>
                        );
                    })}
                </p>
            </>
        );

        let content_element = (
            <p class="text-gray-600 dark:text-gray-400">
                loading...
            </p>
        );
        if (this.state.rows_loading_error) {
            content_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    {`${this.state.rows_loading_error}`}
                </p>
            );
        }
        else if (!this.state.rows_loading) {

            const change_pages_element = (
                <p><Link to={`/assets#${this.state.to_asset}`}>next 100 {'>'}</Link></p>
            );

            content_element =
                this.state.rows.length ?
                    (
                        <>
                            <div class="py-1 my-1">
                                <p class="dark:text-slate-100">
                                    Assets from {this.state.from_asset} to {this.state.to_asset}:
                                </p>
                            </div>

                            <div class="py-1 my-1">
                                {change_pages_element}
                            </div>

                            <div class="py-1 my-1">
                                <table>
                                    <tbody>
                                        {ListElements.getTableRowAssetsHeader()}
                                        {this.state.rows.map((row, index) => {
                                            return ListElements.getTableRowAssets(row, index);
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div class="pt-1 mt-1">
                                {/* <div class="py-1 my-1"> */}
                                {change_pages_element}
                            </div>
                        </>
                    )
                    : (
                        <p class="text-gray-600 dark:text-gray-400">
                            no rows found...
                        </p>
                    );
        }

        let tip_notice = '...';
        if (this.state.tip_blocks_row) {
            tip_notice = `, as of block ${this.state.tip_blocks_row.block_index} (${timeIsoFormat(this.state.tip_blocks_row.block_time)}).`;
        }

        const route_element = (
            <div class="py-2 my-2">
                <h2 class="font-bold text-xl mb-1">
                    Assets:
                </h2>
                <div class="py-1 my-1">
                    <p class="dark:text-slate-100">
                        All issued assets in alphabetical order{tip_notice}
                        {/* All issued assets in alphabetical order. */}
                    </p>
                </div>
                <div class="py-1 my-1">
                    {jump_letter_element}
                </div>
                <div class="pt-1 mt-1 ml-4 overflow-auto">
                    {content_element}
                </div>
            </div>
        );

        return <OneElements route_element={route_element} />;

    }
}

export default withRouter(Assetspage);
