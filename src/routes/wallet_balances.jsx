import React from 'react';
import { withRouter } from './shared/classhooks';
// import { getCntrprty } from '../api';
import { ListElements } from './shared/elements';
import {Card, Table, TableBody, TableHead, Title} from "@tremor/react";
// import { Outlet, Link } from "react-router-dom";

class WalletBalances extends React.Component {
    // class Wallet extends React.Component {
    constructor(props) {
        super(props);

        // let address_if_specified = undefined;
        // if (props.router.location.hash.length) {
        //     const page_number_string = props.router.location.hash.replace('#', '');
        //     address_if_specified = page_number_string;
        // }

        this.state = {
            // error_loading: false,
            // loading: false,

            address: props.address,
            balances: props.balances,

            // address: address_if_specified,
            // balances: null,
            // // balances: [],
        };

        // this.handleSearchChange = this.handleSearchChange.bind(this);
        // this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    // handleSearchChange(event) {
    //     this.setState({ address: event.target.value });
    // }

    // handleSearchSubmit(event) {
    //     event.preventDefault();
    //     const to_navigate = this.state.address;
    //     // this.setState({ address: '' });
    //     this.props.router.navigate(`/wallet#${to_navigate}`);
    // }

    // async fetchData(address) {

    //     this.setState({ loading: true });

    //     let balances_response;
    //     // let balances_response = {};
    //     try {

    //         // tried fixing in express but is not obvious/simple, so doing this check here instead
    //         if (!address.trim().length) {
    //             throw Error('no request done');
    //         }

    //         balances_response = await getCntrprty(`/address/${address}/balances`);
    //     }
    //     catch (e) {
    //         console.log(`error loading balances`);
    //         // balances_response.balances = [];
    //     }

    //     if (!balances_response) {
    //         this.setState({
    //             error_loading: true,
    //             loading: false,
    //             address,
    //         });
    //     }
    //     else {
    //         // if (balances_response.balances.length) {

    //         // removing all zero balances here
    //         const nonzero_balances = balances_response.balances.filter(balances_row => balances_row.quantity > 0);

    //         this.setState({
    //             loading: false,
    //             address,
    //             balances: nonzero_balances,
    //             // balances: balances_response.balances,
    //         });
    //         // }
    //     }

    //     // // if (balances_response.balances.length) {

    //     // // removing all zero balances here
    //     // const nonzero_balances = balances_response.balances.filter(balances_row => balances_row.quantity > 0);

    //     // this.setState({
    //     //     loading: false,
    //     //     address,
    //     //     balances: nonzero_balances,
    //     //     // balances: balances_response.balances,
    //     // });
    //     // // }

    // }

    // async componentDidMount() {
    //     if (this.state.address) {
    //         // not awaiting it
    //         this.fetchData(this.state.address);
    //     }
    //     // // not awaiting it
    //     // this.fetchData(this.state.address);
    // }

    // async componentDidUpdate(prevProps) {
    //     const updatedHash = this.props.router.location.hash;
    //     const prevHash = prevProps.router.location.hash;
    //     if (updatedHash !== prevHash) {
    //         const address = updatedHash.replace('#', '');
    //         if (address.length) {
    //             await this.fetchData(address);
    //         }
    //         else {
    //             this.setState({
    //                 address: '',
    //                 balances: null,
    //             });
    //         }
    //         // await this.fetchData(address);
    //     }
    // }

    render() {

        // let show_button = null;
        // const button_value = "get";
        // // const button_value = "get balances";
        // if (this.state.address && this.state.address.length) {
        //     // if (this.state.address.length) {
        //     show_button = (<span> <input type="submit" value={button_value} disabled={this.state.loading} /></span>);
        //     // show_button = (<span> <input type="submit" value={button_value} /></span>);
        // }
        // const placeholder = "address";
        // const address_bar = (
        //     <span>
        //         <div style={{ padding: "1.1rem 0 0.5rem 0" }}>
        //             <form onSubmit={this.handleSearchSubmit}>
        //                 <input type="text" value={this.state.address} onChange={this.handleSearchChange} placeholder={placeholder} disabled={this.state.loading} />
        //                 {/* <input type="text" value={this.state.address} onChange={this.handleSearchChange} placeholder={placeholder} /> */}
        //                 {show_button}
        //             </form>
        //         </div>
        //     </span>
        // );

        // let loading_element = null;
        // if (this.state.loading) {
        //     loading_element = (<p>loading...</p>)
        // }

        let wallet_element_contents = null;

        // // let wallet_element_contents = (<p>coming soon...</p>);
        // // let wallet_element_contents = (<p>loading...</p>);
        // let wallet_element_contents = (
        //     <>
        //         <p>Show balances for address:</p>
        //         {address_bar}
        //         {loading_element}
        //         {/* <p>Address: {address_bar}</p> */}
        //     </>
        // );

        // if (this.state.error_loading) {
        //     wallet_element_contents = (
        //         <>
        //             <p>these was an error loading balances for address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p>
        //         </>
        //     );
        // }
        // else if (this.state.balances && !this.state.balances.length) {
        //     wallet_element_contents = (
        //         <>
        //             <p>no balances for address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p>
        //         </>
        //     );
        // }

        if (this.state.balances && !this.state.balances.length) {
            wallet_element_contents = (
                <>
                    <p>No balances for address</p>
                    {/* <p>no balances for address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p> */}
                </>
            );
        }

        // BUT not having results can be moved here!...
        // which should always be the case now
        else if (this.state.balances && this.state.balances.length) {
            // if (this.state.balances && this.state.balances.length) {
            // else if (this.state.balances && this.state.balances.length) {
            // if (this.state.balances && this.state.balances.length) {
            // if (this.state.balances.length) {
            // if (this.state.balances) {
            function balancesSort(a, b) {
                if (b.quantity === a.quantity) {
                    const mainname_a = a.asset_longname ? a.asset_longname : a.asset;
                    const mainname_b = b.asset_longname ? b.asset_longname : b.asset;
                    if (mainname_a < mainname_b) {
                        return -1;
                    }
                    if (mainname_a > mainname_b) {
                        return 1;
                    }
                    return 0;
                }
                else {
                    return b.quantity - a.quantity;
                }
            };

            const address_balances_element = (
                <>
                    <Table>
                        <TableHead>
                            {ListElements.getTableRowBalanceAddressHeader()}
                        </TableHead>
                        <TableBody>
                            {this.state.balances.sort(balancesSort).map((balances_row, index) => {
                                return ListElements.getTableRowBalanceAddress(balances_row, index);
                            })}
                        </TableBody>
                    </Table>
                </>
            );

            wallet_element_contents = (
                <>
                    {/* <p>Address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p> */}


                    {/* <nav
                        style={{
                            // borderBottom: "solid 1px",
                            paddingBottom: "1rem",
                        }}
                    >
                        <Link to="/wallet">Balances</Link> |{" "}
                        // <Link to="/wallet/balances">Balances</Link> |{" "}

                        <Link to="/wallet/generate">New</Link>
                        // <Link to="/wallet/generate">Generate</Link>
                        // <Link to="/wallet/code">Code</Link>

                    </nav> */}
                    {/* <Outlet /> */}


                    <Card>
                        <Title>Assets balance (sorted by most units on top, then alphabetically):</Title>
                        {/* <h3>Balances (sorted by most units on top, then alphabetically):</h3> */}

                        {/* <p>
                            For [m]edia visit bitSTART:{' '}
                            <a href={`https://bitst.art/_collector/${this.state.address}`} target="_blank">/_collector/{this.state.address}</a>
                            // <a href={`https://bitst.art/_/${this.state.address}`} target="_blank">/_/{this.state.address}</a>
                        </p> */}

                        {address_balances_element}
                    </Card>
                </>
            );

        }

        // const wallet_element = (
        //     <>
        //         {/* <Outlet /> */}
        //         {/* <h2>Wallet tools:</h2> */}
        //         {wallet_element_contents}
        //     </>
        // );

        return (
            <>
                {wallet_element_contents}
                {/* {wallet_element} */}
            </>
        );
        // return OneElements.getFullPageForRouteElement(wallet_element);
    
    }

}

export default withRouter(WalletBalances);
// export default withRouter(Wallet);
