import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements, ListElements } from './shared/elements';
// import { ListElements, OnlyElements } from './shared/elements';
import { Link } from "react-router-dom";

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.router.params.address,
            address_not_found: null,
            // block_row: null,
            tables: null,
            // messages: null,
        };
    }

    async fetchData(address) {

        console.log(`rrr01`);
        console.log(address);
        console.log(`rrr02`);

        let address_response = {};
        try {
            address_response = await getCntrprty(`/address/${address}`);
        }
        catch (e) {
            address_response.tables = null;
        }
        // const block_response = await getCntrprty(`/block/${block}`);

        console.log(`rrr1`);
        console.log(JSON.stringify(address_response));
        console.log(`rrr2`);

        if (!address_response.tables) {
            this.setState({
                address,
                address_not_found: true,
                // block_row: null,
                tables: null,
            });
        }
        // else if (!address_response.tables.length) {
        //     this.setState({
        //         address,
        //         address_not_found: null,
        //         // block_row: block_response.block_row,
        //         tables: [],
        //     });
        // }
        else { // block_response.messages.length
            this.setState({
                address,
                address_not_found: null,
                // block_row: block_response.block_row,
                tables: address_response.tables,
            });
        }

    }

    async componentDidMount() {
        // not awaiting it
        this.fetchData(this.state.address);
    }

    async componentDidUpdate(prevProps) {

        // console.log(`rrrrrrrrr1`);
        // console.log(JSON.stringify(this.props));
        // console.log(this.props.router.params.block);
        // console.log(`rrrrrrrrr2`);
        // console.log(JSON.stringify(prevProps));
        // console.log(prevProps.router.params.block);
        // console.log(`rrrrrrrrr3`);

        // const paramsName = 'address';

        // props.router.params.block
        const updatedProp = this.props.router.params.address;
        // const updatedProp = this.props.router.params.block;
        // const updatedProp = this.props.block;
        if (updatedProp !== prevProps.router.params.address) {
            // if (updatedProp !== prevProps.router.params.block) {
            // if (updatedProp !== prevProps.block) {
            await this.fetchData(updatedProp);
        }
    }

    render() {

        // let address_element_contents = (<p>loading...</p>);
        // if (this.state.address_not_found) {
        //     address_element_contents = (
        //         <p>address not found</p>
        //     );
        // }
        // else if (this.state.tables && !this.state.tables.length) {
        //     address_element_contents = (
        //         <>
        //             <h3>Messages:</h3>
        //             <p>no messages in block</p>
        //         </>
        //     );
        // }
        // else if (this.state.tables && this.state.tables.length) {
        //     address_element_contents = (
        //         <>
        //             <h3>Messages:</h3>

        //             <table>
        //                 <tbody>
        //                     {ListElements.getTableRowMessageBlockHeader()}
        //                     {this.state.messages.map((message_row, index) => {
        //                         return ListElements.getTableRowMessageBlock(message_row, index);
        //                         // const page = 'home'; // TODO?
        //                         // return ListElements.getTableRowMessage(message_row, index, page);
        //                     })}
        //                 </tbody>
        //             </table>

        //         </>
        //     );
        // }

        let address_metadata = null;
        // let block_metadata = (<p>loading...</p>);
        if (this.state.tables) {



            address_metadata = (
                <>
                    <h3>Balances:</h3>

                    <table>
                        <tbody>
                            {ListElements.getTableRowBalanceAddressHeader()}
                            {this.state.tables.balances.map((balance_row, index) => {
                                return ListElements.getTableRowBalanceAddress(balance_row, index);
                                // const page = 'home'; // TODO?
                                // return ListElements.getTableRowMessage(message_row, index, page);
                            })}
                        </tbody>
                    </table>

                </>
            );



            // address_metadata = (
            //     <>
            //         <ul>
            //             <li>block_indexxx: {this.state.tables.balances.length}</li>
            //             {/* <li>block_time: {this.state.block_row.block_time}</li> */}
            //             {/* <li>block_time_iso: {(new Date(this.state.block_row.block_time * 1000).toISOString()).replace('.000Z', 'Z')}</li> */}
            //         </ul>
            //         {/* <ul>
            //             <li>block_hash: {this.state.block_row.block_hash}</li>
            //             <li>previous_block_hash: {this.state.block_row.previous_block_hash}</li>
            //         </ul>
            //         <ul>
            //             <li>ledger_hash: {this.state.block_row.ledger_hash}</li>
            //             <li>txlist_hash: {this.state.block_row.txlist_hash}</li>
            //             <li>messages_hash: {this.state.block_row.messages_hash}</li>
            //         </ul> */}
            //     </>
            // );
        }

        const block_element = (
            <>
                <h2>Address: {this.state.address}</h2>
                {/* <h2>Block: {this.state.block}</h2> */}
                {/* {change_pages_element} */}
                {address_metadata}
                {/* {address_element_contents} */}
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

export default withRouter(Address);
