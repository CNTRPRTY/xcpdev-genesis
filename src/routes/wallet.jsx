import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements } from './shared/elements';
// import { OneElements, ListElements } from './shared/elements';
import { Link } from "react-router-dom";
// import { Outlet, Link } from "react-router-dom";

import WalletBalances from './wallet_balances';
import WalletCreateSelect from './wallet_create_select';
// import WalletCreate from './wallet_create';

class Wallet extends React.Component {
    constructor(props) {
        super(props);

        let address_if_specified = '';
        // let address_if_specified = null; // Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.
        if (props.router.params.address) {
            address_if_specified = props.router.params.address;
        }

        // let address_if_specified = undefined;
        // if (props.router.location.hash.length) {
        //     const page_number_string = props.router.location.hash.replace('#', '');
        //     address_if_specified = page_number_string;
        // }

        let is_create = false;
        if (
            address_if_specified.length &&
            props.router.location.search
        ) {
            const params = new URLSearchParams(props.router.location.search);
            // for now...
            if (params.get("method")) {
                is_create = true;
            }
        }

        this.state = {
            error_loading: false,
            loading: false,
            address: address_if_specified,
            balances: null,
            // balances: [],
            is_create,
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    handleSearchChange(event) {
        this.setState({ address: event.target.value });
    }

    handleSearchSubmit(event) {
        event.preventDefault();
        const to_navigate = this.state.address;
        // this.setState({ address: '' });
        this.props.router.navigate(`/wallet/${to_navigate}`);
        // this.props.router.navigate(`/wallet#${to_navigate}`);
    }

    async fetchData(address) {

        this.setState({ loading: true });

        let balances_response;
        // let balances_response = {};
        try {

            // tried fixing in express but is not obvious/simple, so doing this check here instead
            if (!address.trim().length) {
                throw Error('no request done');
            }

            balances_response = await getCntrprty(`/address/${address}/balances`);
        }
        catch (e) {
            console.log(`error loading balances`);
            // balances_response.balances = [];
        }

        if (!balances_response) {
            this.setState({
                error_loading: true,
                loading: false,
                address,
            });
        }
        else {
            // if (balances_response.balances.length) {

            // removing all zero balances here
            const nonzero_balances = balances_response.balances.filter(balances_row => balances_row.quantity > 0);

            this.setState({
                loading: false,
                address,
                balances: nonzero_balances,
                // balances: balances_response.balances,
            });
            // }
        }

        // // if (balances_response.balances.length) {

        // // removing all zero balances here
        // const nonzero_balances = balances_response.balances.filter(balances_row => balances_row.quantity > 0);

        // this.setState({
        //     loading: false,
        //     address,
        //     balances: nonzero_balances,
        //     // balances: balances_response.balances,
        // });
        // // }

    }

    async componentDidMount() {
        if (this.state.address.trim().length) {
            // if (this.state.address) {
            // not awaiting it
            this.fetchData(this.state.address);
        }
        // // not awaiting it
        // this.fetchData(this.state.address);
    }

    async componentDidUpdate(prevProps) {

        // first checking if is a path change
        const updatedPathname = this.props.router.location.pathname;
        const prevPathname = prevProps.router.location.pathname;
        if (updatedPathname !== prevPathname) {
            const addressPRE = updatedPathname.replace('/wallet', '');
            if (addressPRE.trim().length > 1) {
                const address = addressPRE.replaceAll('/', '');
                await this.fetchData(address);
            }
            else {
                // TODO? use init state function
                this.setState({
                    error_loading: false,
                    loading: false,
                    address: '',
                    balances: null,
                    is_create: false,
                });
            }
        }
        else { // then checking if is a search params change
            const updatedSearch = this.props.router.location.search;
            const prevSearch = prevProps.router.location.search;
            if (updatedSearch !== prevSearch) {

                // for now...
                this.setState({
                    is_create: (updatedSearch.length > 0),
                });

            }
        }

        // const updatedHash = this.props.router.location.hash;
        // const prevHash = prevProps.router.location.hash;
        // if (updatedHash !== prevHash) {
        //     const address = updatedHash.replace('#', '');
        //     if (address.length) {
        //         await this.fetchData(address);
        //     }
        //     else {
        //         this.setState({
        //             address: '',
        //             balances: null,
        //         });
        //     }
        //     // await this.fetchData(address);
        // }

    }

    render() {

        let show_button = null;
        const button_value = "go";
        // const button_value = "get";
        // const button_value = "get balances";
        if (this.state.address && this.state.address.length) {
            // if (this.state.address.length) {
            show_button = (<span> <input type="submit" value={button_value} disabled={this.state.loading} /></span>);
            // show_button = (<span> <input type="submit" value={button_value} /></span>);
        }
        const placeholder = "address";
        const address_bar = (
            <span>
                <div style={{ padding: "1.1rem 0 0.5rem 0" }}>
                    <form onSubmit={this.handleSearchSubmit}>
                        <input type="text" value={this.state.address} onChange={this.handleSearchChange} placeholder={placeholder} disabled={this.state.loading} />
                        {/* <input type="text" value={this.state.address} onChange={this.handleSearchChange} placeholder={placeholder} /> */}
                        {show_button}
                    </form>
                </div>
            </span>
        );

        let loading_element = null;
        if (this.state.loading) {
            loading_element = (<p>loading...</p>)
        }

        let wallet_element_contents = (
            <>
                <p>Enter your address (or start with a <a href={`https://bitst.art/`} target="_blank">wallet</a>):</p>
                {address_bar}
                {loading_element}
            </>
        );

        if (this.state.error_loading) {
            wallet_element_contents = (
                <>
                    <p>these was an error loading balances for address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p>
                </>
            );
        }
        // else if (this.state.balances && !this.state.balances.length) {
        //     wallet_element_contents = (
        //         <>
        //             <p>no balances for address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p>
        //         </>
        //     );
        // }
        else if (this.state.balances) {
            // else if (this.state.balances && this.state.balances.length) {
            // if (this.state.balances && this.state.balances.length) {
            // if (this.state.balances.length) {
            // if (this.state.balances) {

            // function balancesSort(a, b) {
            //     if (b.quantity === a.quantity) {
            //         const mainname_a = a.asset_longname ? a.asset_longname : a.asset;
            //         const mainname_b = b.asset_longname ? b.asset_longname : b.asset;
            //         if (mainname_a < mainname_b) {
            //             return -1;
            //         }
            //         if (mainname_a > mainname_b) {
            //             return 1;
            //         }
            //         return 0;
            //     }
            //     else {
            //         return b.quantity - a.quantity;
            //     }
            // };

            // const address_balances_element = (
            //     <>
            //         <table>
            //             <tbody>
            //                 {ListElements.getTableRowBalanceAddressHeader()}
            //                 {this.state.balances.sort(balancesSort).map((balances_row, index) => {
            //                     return ListElements.getTableRowBalanceAddress(balances_row, index);
            //                 })}
            //             </tbody>
            //         </table>
            //     </>
            // );

            const wallet_balances_element = (
                <>
                    <nav
                        style={{
                            // borderBottom: "solid 1px",
                            paddingBottom: "1rem",
                        }}
                    >
                        <strong>Balances</strong> |{" "}
                        <Link to={`/wallet/${this.state.address}?method=create`}>Create</Link>
                    </nav>
                    {/* <Outlet /> */}

                    <WalletBalances address={this.state.address} balances={this.state.balances} />
                </>
            );

            const wallet_create_element = (
                <>
                    <nav
                        style={{
                            paddingBottom: "1rem",
                        }}
                    >
                        <Link to={`/wallet/${this.state.address}`}>Balances</Link> |{" "}
                        <strong>Create</strong>
                    </nav>

                    <WalletCreateSelect address={this.state.address} />
                    {/* <WalletCreate address={this.state.address} /> */}
                </>
            );

            wallet_element_contents = (
                <>
                    <p>Address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p>

                    {this.state.is_create ?
                        (<>{wallet_create_element}</>)
                        :
                        (<>{wallet_balances_element}</>)
                    }
                </>
            );
            // wallet_element_contents = (
            //     <>
            //         <p>Address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p>

            //         <h3>Assets balance (sorted by most units on top, then alphabetically):</h3>
            //         {/* <h3>Balances (sorted by most units on top, then alphabetically):</h3> */}

            //         {/* <p>
            //             For [m]edia visit bitSTART:{' '}
            //             <a href={`https://bitst.art/_collector/${this.state.address}`} target="_blank">/_collector/{this.state.address}</a>
            //             // <a href={`https://bitst.art/_/${this.state.address}`} target="_blank">/_/{this.state.address}</a>
            //         </p> */}

            //         {address_balances_element}
            //     </>
            // );

        }

        const wallet_element = (
            <>
                <h2>Wallet tools:</h2>
                {wallet_element_contents}
            </>
        );

        return OneElements.getFullPageForRouteElement(wallet_element);
    }

}

export default withRouter(Wallet);
