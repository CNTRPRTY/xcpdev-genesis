import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty, COUNTERPARTY_VERSION } from "../api";
// import { getCntrprty } from "../api";
import { Link } from "react-router-dom";
import { OneElements, ListElements } from './shared/elements';

class Transactionspage extends React.Component {
    constructor(props) {
        super(props);

        let tx_index_if_specified = undefined;
        if (props.router.location.hash.length) {
            const page_number_string = props.router.location.hash.replace('#', '');
            if (Number.isInteger(Number(page_number_string))) {
                tx_index_if_specified = Number(page_number_string);
            }
        }

        if (!tx_index_if_specified) {
            tx_index_if_specified = 0;
        }

        this.state = {
            page_not_found: null,

            from_index: tx_index_if_specified,
            to_index: null,
            rows: [],
        };
    }

    async fetchData(from_index) {
        const transactions_response = await getCntrprty(`/transactions/${from_index}`);
        if (!transactions_response) {
            this.setState({ page_not_found: true });
        }
        else {
            this.setState({
                from_index: transactions_response.from_index,
                to_index: transactions_response.to_index,
                rows: transactions_response.transactions,
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

        let content_element = (<p>loading...</p>);
        if (this.state.page_not_found) {
            return (
                <main style={{ padding: "1rem" }}>
                    <h2>No results found</h2>
                </main>
            );
        }
        else if (this.state.rows.length) {

            // TODO? easier to do manual at least for now...
            let years;
            if (COUNTERPARTY_VERSION.startsWith('9.59')) {
                years = {
                    y2014: 0,
                    y2015: 134093,
                    y2016: 399428,
                    y2017: 751271,
                    y2018: 1152661,
                    y2019: 1405841,
                    y2020: 1482018,
                    y2021: 1540493,
                    y2022: 1833799,
                    y2023: 2199002,
                };
            }
            else { // 9.60
                years = {
                    y2014: 0,
                    y2015: 134093,
                    y2016: 399428,
                    y2017: 751271,
                    y2018: 1152661,
                    y2019: 1405841,
                    y2020: 1482018,
                    y2021: 1540493,
                    y2022: 1835266,
                    y2023: 2209456,
                };
            }
            // keeping this around as I'm not sure why is not matching with either (it should have with 9.60 I think...)
            // const years = {
            //     y2014: 0,
            //     y2015: 134093,
            //     y2016: 399428,
            //     y2017: 751271,
            //     y2018: 1152661,
            //     y2019: 1405841,
            //     y2020: 1482022,
            //     y2021: 1540497,
            //     y2022: 1835273,
            //     y2023: 2209463,
            // }
            const jump_year_element = (
                <>
                    <h3>
                        Jump to year:
                    </h3>
                    <p>
                        <Link to={`/transactions#${years['y2014']}`}>2014</Link>{' | '}
                        <Link to={`/transactions#${years['y2015']}`}>2015</Link>{' | '}
                        <Link to={`/transactions#${years['y2016']}`}>2016</Link>{' | '}
                        <Link to={`/transactions#${years['y2017']}`}>2017</Link>{' | '}
                        <Link to={`/transactions#${years['y2018']}`}>2018</Link>{' | '}
                        <Link to={`/transactions#${years['y2019']}`}>2019</Link>{' | '}
                        <Link to={`/transactions#${years['y2020']}`}>2020</Link>{' | '}
                        <Link to={`/transactions#${years['y2021']}`}>2021</Link>{' | '}
                        <Link to={`/transactions#${years['y2022']}`}>2022</Link>{' | '}
                        <Link to={`/transactions#${years['y2023']}`}>2023</Link>
                    </p>
                    {/* <p>
                        2014: <Link to={`/transactions#${years['y2014']}`}>{years['y2014']}</Link>{' | '}
                        2015: <Link to={`/transactions#${years['y2015']}`}>{years['y2015']}</Link>{' | '}
                        2016: <Link to={`/transactions#${years['y2016']}`}>{years['y2016']}</Link>{' | '}
                        2017: <Link to={`/transactions#${years['y2017']}`}>{years['y2017']}</Link>{' | '}
                        2018: <Link to={`/transactions#${years['y2018']}`}>{years['y2018']}</Link>{' | '}
                        2019: <Link to={`/transactions#${years['y2019']}`}>{years['y2019']}</Link>{' | '}
                        2020: <Link to={`/transactions#${years['y2020']}`}>{years['y2020']}</Link>{' | '}
                        2021: <Link to={`/transactions#${years['y2021']}`}>{years['y2021']}</Link>{' | '}
                        2022: <Link to={`/transactions#${years['y2022']}`}>{years['y2022']}</Link>
                    </p> */}
                </>
            );

            const change_pages_element = (
                <p><Link to={`/transactions#${this.state.to_index + 1}`}>next 100 {'>'}</Link></p>
            );

            content_element = (
                <div>

                    <p>All CNTRPRTY Bitcoin transactions in ascending order.</p>

                    {jump_year_element}

                    <h3>
                        Transactions from tx_index {this.state.from_index} to {this.state.to_index}:
                    </h3>

                    {change_pages_element}

                    <table>
                        <tbody>
                            {ListElements.getTableRowTransactionHeader()}
                            {this.state.rows.map((transaction_row, index) => {
                                return ListElements.getTableRowTransaction(transaction_row, index);
                            })}
                        </tbody>
                    </table>

                    {change_pages_element}

                </div>
            );
        }

        const page_element = (
            <>
                <h2>Transactions:</h2>
                {content_element}
            </>
        );

        return OneElements.getFullPageForRouteElement(page_element);

    }
}

export default withRouter(Transactionspage);
