import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty, COUNTERPARTY_VERSION } from "../api";
import { Link } from "react-router-dom";
import { OneElements, ListElements } from './shared/elements';

class Messagespage extends React.Component {
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
            index_if_specified = 0;
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
            const response = await getCntrprty(`/messages/${from_index}`);
            this.setState({
                from_index: response.from_index,
                to_index: response.to_index,

                rows_loading: false,
                rows: response.messages,
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

        // Doing this manually helps in verification...
        let years;
        if (COUNTERPARTY_VERSION.startsWith('9.59')) {
            years = {
                y2014: 0,
                y2015: 505211,
                y2016: 1350000,
                y2017: 2582382,
                y2018: 4186987,
                y2019: 5228022,
                y2020: 5558510,
                y2021: 5855416,
                y2022: 7055629,
                y2023: 8460931,
            };
        }
        else if (COUNTERPARTY_VERSION.startsWith('9.60')) {
            years = {
                y2014: 0,
                y2015: 505211,
                y2016: 1350000,
                y2017: 2582382,
                y2018: 4186987,
                y2019: 5228022,
                y2020: 5558173, // update was in 2022...
                y2021: 5850483,
                y2022: 7070644,
                y2023: 8820356,
                y2024: 10307726,
            };
        }
        else { // 9.61
            years = {
                y2014: 0,
                y2015: 505211,
                y2016: 1350000,
                y2017: 2582382,
                y2018: 4186987,
                y2019: 5228022,
                y2020: 5558173,
                y2021: 5850490, // update was in 2023...
                y2022: 7070697,
                y2023: 8820491,
                y2024: 10315836, // ??? 10315837 2023 block time?
            };
        }
        const jump_year_element = (
            <>
                <h3>
                    Jump to year:
                </h3>
                <p>
                    <Link to={`/messages#${years['y2014']}`}>2014</Link>{' | '}
                    <Link to={`/messages#${years['y2015']}`}>2015</Link>{' | '}
                    <Link to={`/messages#${years['y2016']}`}>2016</Link>{' | '}
                    <Link to={`/messages#${years['y2017']}`}>2017</Link>{' | '}
                    <Link to={`/messages#${years['y2018']}`}>2018</Link>{' | '}
                    <Link to={`/messages#${years['y2019']}`}>2019</Link>{' | '}
                    <Link to={`/messages#${years['y2020']}`}>2020</Link>{' | '}
                    <Link to={`/messages#${years['y2021']}`}>2021</Link>{' | '}
                    <Link to={`/messages#${years['y2022']}`}>2022</Link>{' | '}
                    <Link to={`/messages#${years['y2023']}`}>2023</Link>{' | '}
                    <Link to={`/messages#${years['y2024']}`}>2024</Link>
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
                <p><Link to={`/messages#${this.state.to_index + 1}`}>next 100 {'>'}</Link></p>
            );

            content_element =
                this.state.rows.length ?
                    (
                        <>
                            <div class="py-1 my-1">
                                <p class="dark:text-slate-100">
                                    Messages from message index {this.state.from_index} to {this.state.to_index}:
                                </p>
                            </div>

                            <div class="py-1 my-1">
                                {change_pages_element}
                            </div>

                            <div class="py-1 my-1">
                                <table>
                                    <tbody>
                                        {ListElements.getTableRowMessagesHeader()}
                                        {this.state.rows.map((row, index) => {
                                            return ListElements.getTableRowMessages(row, index);
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

        const route_element = (
            <div class="py-2 my-2">
                <h2 class="font-bold text-xl mb-1">
                    Messages:
                </h2>
                <div class="py-1 my-1">
                    <p class="dark:text-slate-100">
                        All CNTRPRTY Bitcoin transaction and state messages in ascending order.
                    </p>
                    <p><Link to={`/transactions`}>All transactions</Link></p>
                </div>
                <div class="py-1 my-1">
                    {jump_year_element}
                </div>
                <div class="pt-1 mt-1 ml-4 overflow-auto">
                    {/* <div class="pt-1 mt-1"> */}
                    {/* <div class="py-1 my-1"> */}
                    {content_element}
                </div>
            </div>
        );

        return <OneElements route_element={route_element} />;
        // return OneElements.getFullPageForRouteElement(page_element);

    }
}

export default withRouter(Messagespage);
