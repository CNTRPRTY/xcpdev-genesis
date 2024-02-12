import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty, COUNTERPARTY_VERSION } from "../api";
// import { getCntrprty } from "../api";
import { Link } from "react-router-dom";
import { OneElements, ListElements } from './shared/elements';

class Messagespage extends React.Component {
    // class Transactionspage extends React.Component {
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
            page_not_found: null,

            from_index: index_if_specified,
            to_index: null,
            rows: [],
        };
    }

    async fetchData(from_index) {
        const response = await getCntrprty(`/messages/${from_index}`);
        // const response = await getCntrprty(`/transactions/${from_index}`);

        if (!response) {
            this.setState({ page_not_found: true });
        }
        else {
            this.setState({
                from_index: response.from_index,
                to_index: response.to_index,
                rows: response.messages,
                // rows: response.transactions,
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

        const change_pages_element = (
            <p><Link to={`/messages#${this.state.to_index + 1}`}>next 100 {'>'}</Link></p>
        );

        content_element = (
            <div>

                <p>All CNTRPRTY Bitcoin transaction and state messages in ascending order.</p>

                <p><Link to={`/transactions`}>All transactions</Link></p>

                {jump_year_element}

                <h3>
                    Messages from message index {this.state.from_index} to {this.state.to_index}:
                    {/* Transactions from tx_index {this.state.from_index} to {this.state.to_index}: */}
                </h3>

                {change_pages_element}

                <table>
                    <tbody>
                        {ListElements.getTableRowMessagesHeader()}
                        {this.state.rows.map((message_row, index) => {
                            return ListElements.getTableRowMessages(message_row, index);
                        })}
                        {/* {ListElements.getTableRowTransactionHeader()}
                            {this.state.rows.map((transaction_row, index) => {
                                return ListElements.getTableRowTransaction(transaction_row, index);
                            })} */}
                    </tbody>
                </table>

                {change_pages_element}

            </div>
        );

        const page_element = (
            <>
                <h2>Messages:</h2>
                {/* <h2>Transactions:</h2> */}
                {content_element}
            </>
        );

        return OneElements.getFullPageForRouteElement(page_element);

    }
}

export default withRouter(Messagespage);
// export default withRouter(Transactionspage);
