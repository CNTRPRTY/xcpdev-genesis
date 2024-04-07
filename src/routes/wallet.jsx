import React from 'react';
import { withRouter } from './shared/classhooks';
import { getCntrprty } from '../api';
import { OneElements } from './shared/elements';
import { Link } from "react-router-dom";

import WalletBalances from './wallet_balances';
import WalletCreateSelect from './wallet_create_select';

class Wallet extends React.Component {
    constructor(props) {
        super(props);

        let address_if_specified = '';
        // let address_if_specified = null; // Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.
        if (props.router.params.address) {
            address_if_specified = props.router.params.address;
        }

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
        this.props.router.navigate(`/wallet/${to_navigate}`);
    }

    async fetchData(address) {

        this.setState({ loading: true });

        let balances_response;
        try {

            // tried fixing in express but is not obvious/simple, so doing this check here instead
            if (!address.trim().length) {
                throw Error('no request done');
            }

            balances_response = await getCntrprty(`/address/${address}/balances`);
        }
        catch (e) {
            console.log(`error loading balances`);
        }

        if (!balances_response) {
            this.setState({
                error_loading: true,
                loading: false,
                address,
            });
        }
        else {

            // removing all zero balances here
            const nonzero_balances = balances_response.balances.filter(balances_row => balances_row.quantity > 0);

            this.setState({
                loading: false,
                address,
                balances: nonzero_balances,
            });
        }

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

    }

    render() {

        // let show_button = null;
        // const button_value = "go";
        // if (this.state.address && this.state.address.length) {
        //     show_button = (<span> <input type="submit" value={button_value} disabled={this.state.loading} /></span>);
        // }
        const placeholder = "address";
        const address_bar = (
            <>
                {/* <div style={{ padding: "1.1rem 0 0.5rem 0" }}> */}

                {/*  */}
                <form onSubmit={this.handleSearchSubmit}>
                    <input
                        class="mr-1 border-solid border-2 border-gray-300"
                        // class="border-r-0 border-solid border-2 border-gray-300"
                        // class="border-solid border-2 border-gray-300"
                        type="text"
                        value={this.state.address}
                        onChange={this.handleSearchChange}
                        placeholder={placeholder}
                        disabled={this.state.loading}
                    // size={placeholder_size}
                    />
                    <input
                        class="px-1 border-solid border-2 border-gray-400 dark:text-slate-100"
                        // class="px-1 border-solid border-2 border-gray-400"
                        type="submit"
                        value={"go"}
                        disabled={this.state.loading}
                    />
                </form>
                {/*  */}

                {/* <form onSubmit={this.handleSearchSubmit}>
                        <input type="text" value={this.state.address} onChange={this.handleSearchChange} placeholder={placeholder} disabled={this.state.loading} />
                        {show_button}
                    </form> */}

                {/* </div> */}
            </>
        );

        let loading_element = null;
        if (this.state.loading) {
            loading_element = (
                <p class="text-gray-600 dark:text-gray-400">
                    loading...
                </p>
            );
        }

        let wallet_element_contents = (
            <>
                <p class="dark:text-slate-100">
                    Enter your address (or start <a href={`https://github.com/CNTRPRTY/simplest/`} target="_blank">here</a> if you don't have one):
                </p>
                <div class="py-1 my-1">
                    {address_bar}
                </div>
                <div class="py-1 my-1">
                    {loading_element}
                </div>
            </>
        );

        if (this.state.error_loading) {
            wallet_element_contents = (
                <p class="text-gray-600 dark:text-gray-400">
                    these was an error loading balances for address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link>
                </p>
            );
        }
        else if (this.state.balances) {

            const wallet_balances_element = (
                <>
                    <nav
                        style={{
                            paddingBottom: "1rem",
                        }}
                    >
                        <span class="font-bold dark:text-slate-100">
                            Balances
                        </span>
                        {/* <strong>Balances</strong> */}
                        {' '}|{' '}
                        <Link to={`/wallet/${this.state.address}?method=create`}>Create</Link>
                    </nav>

                    <div class="ml-4">
                        <WalletBalances address={this.state.address} balances={this.state.balances} />
                    </div>
                </>
            );

            const wallet_create_element = (
                <>
                    <nav
                        style={{
                            paddingBottom: "1rem",
                        }}
                    >
                        <Link to={`/wallet/${this.state.address}`}>Balances</Link>
                        {' '}|{' '}
                        <span class="font-bold dark:text-slate-100">
                            Create
                        </span>
                        {/* <strong>Create</strong> */}
                    </nav>

                    <div class="ml-4">
                        <WalletCreateSelect address={this.state.address} />
                    </div>
                </>
            );

            wallet_element_contents = (
                <>
                    <h3 class="font-bold overflow-auto">
                        {/* <h3 class="font-bold"> */}
                        Address:
                        {' '}
                        <span class="whitespace-nowrap">
                            <Link to={`/address/${this.state.address}`}>{this.state.address}</Link>
                        </span>
                    </h3>
                    {/* <p>Address: <Link to={`/address/${this.state.address}`}>{this.state.address}</Link></p> */}

                    <div class="py-1 my-1">
                        {this.state.is_create ?
                            (<>{wallet_create_element}</>)
                            :
                            (<>{wallet_balances_element}</>)
                        }
                    </div>
                </>
            );

        }

        const route_element = (
            <div class="py-2 my-2">
                <h2 class="font-bold text-xl mb-1">
                    Wallet tools:
                </h2>
                <div class="pt-1 mt-1 ml-4">
                    {wallet_element_contents}
                </div>
            </div>
        );

        return <OneElements route_element={route_element} />;
    }

}

export default withRouter(Wallet);
