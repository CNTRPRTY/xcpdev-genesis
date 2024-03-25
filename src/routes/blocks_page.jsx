import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from "../api";
import { Link } from "react-router-dom";
import { OneElements } from './shared/elements';
import { timeIsoFormat } from '../utils';

class Blockspage extends React.Component {

    constructor(props) {
        super(props);

        let index_if_specified = undefined;
        if (props.router.location.hash.length) {
            const index_string = props.router.location.hash.replace('#', '');
            if (Number.isInteger(Number(index_string))) {
                index_if_specified = Number(index_string);
            }
        }

        if (!index_if_specified) {
            index_if_specified = 278319; // 0;
        }

        this.state = {

            from_index: index_if_specified,
            to_index: null,

            rows_loading: true,
            rows_loading_error: null,
            rows: null,
        };
    }

    async fetchData(from_index) {
        try {
            const response = await getCntrprty(`/blocks/${from_index}`);
            this.setState({
                from_index: response.from_index,
                to_index: response.to_index,

                rows_loading: false,
                rows: response.blocks,
            });
        }
        catch (err) {
            this.setState({
                rows_loading_error: err,
            });
        }
    }

    async componentDidMount() {
        await this.fetchData(this.state.from_index);
    }

    async componentDidUpdate(prevProps) {
        const updatedHash = this.props.router.location.hash;
        const prevHash = prevProps.router.location.hash;
        if (updatedHash !== prevHash) {
            const from_index = updatedHash.replace('#', '');
            await this.fetchData(Number(from_index));
        }

    }

    render() {

        // Here is always the same
        let years = {
            y2014: 278319,
            y2015: 336861,
            y2016: 391182,
            y2017: 446033,
            y2018: 501961,
            y2019: 556459,
            y2020: 610691,
            y2021: 663913,
            y2022: 716599,
            y2023: 769787,
            y2024: 823786,
        };
        const jump_year_element = (
            <>
                <h3>
                    Jump to year:
                </h3>
                <p>
                    <Link to={`/blocks#${years['y2014']}`}>2014</Link>{' | '}
                    <Link to={`/blocks#${years['y2015']}`}>2015</Link>{' | '}
                    <Link to={`/blocks#${years['y2016']}`}>2016</Link>{' | '}
                    <Link to={`/blocks#${years['y2017']}`}>2017</Link>{' | '}
                    <Link to={`/blocks#${years['y2018']}`}>2018</Link>{' | '}
                    <Link to={`/blocks#${years['y2019']}`}>2019</Link>{' | '}
                    <Link to={`/blocks#${years['y2020']}`}>2020</Link>{' | '}
                    <Link to={`/blocks#${years['y2021']}`}>2021</Link>{' | '}
                    <Link to={`/blocks#${years['y2022']}`}>2022</Link>{' | '}
                    <Link to={`/blocks#${years['y2023']}`}>2023</Link>{' | '}
                    <Link to={`/blocks#${years['y2024']}`}>2024</Link>
                </p>
            </>
        );

        let content_element = (<p>loading...</p>);
        if (this.state.rows_loading_error) {
            content_element = (<p>{`${this.state.rows_loading_error}`}</p>);
        }
        else if (!this.state.rows_loading) {

            const change_pages_element = (
                <p><Link to={`/blocks#${this.state.to_index + 1}`}>next 100 {'>'}</Link></p>
            );

            content_element = 
            this.state.rows.length ?
            (
                <>
                <h3>
                    From block index {this.state.from_index} to {this.state.to_index}:
                </h3>

                {change_pages_element}

                <table>
                    <tbody>

                        <tr style={{ padding: "0.25rem" }}>
                            <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                            <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                            <td style={{ padding: "0 1rem 0.25rem 0" }}>block hash</td>
                            <td style={{ padding: "0 1rem 0.25rem 0" }}>transactions hash</td>
                            <td style={{ padding: "0 1rem 0.25rem 0" }}>messages hash</td>
                            <td style={{ padding: "0 1rem 0.25rem 0" }}>ledger hash</td>
                        </tr>

                        {/* {ListElements.getTableRowMessagesHeader()} */}
                        {this.state.rows.map((block_row, index) => {

                            const block_time_iso = timeIsoFormat(block_row.block_time);
                            return (
                                <tr key={index} style={{ padding: "0.25rem" }}>
                                    <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${block_row.block_index}`}>{block_row.block_index}</Link></td>
                                    <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                                    <td style={{ padding: "0 1rem 0 0" }}>{block_row.block_hash}</td>
                                    <td style={{ padding: "0 1rem 0 0" }}>{block_row.txlist_hash}</td>
                                    <td style={{ padding: "0 1rem 0 0" }}>{block_row.messages_hash}</td>
                                    <td style={{ padding: "0 1rem 0 0" }}>{block_row.ledger_hash}</td>
                                </tr>
                            );

                            // return ListElements.getTableRowMessages(message_row, index);
                        })}
                    </tbody>
                </table>

                {change_pages_element}
                </>
            )
            : (<p>no rows found...</p>);
        }

        const page_element = (
            <>
                <h2>Blocks:</h2>
                <p>All Bitcoin blocks since CNTRPRTY <Link to={`/transactions`}>started</Link>, in ascending order.</p>
                {jump_year_element}
                {content_element}
            </>
        );

        return OneElements.getFullPageForRouteElement(page_element);

    }
}

export default withRouter(Blockspage);
