import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreateBroadcast from './wallet_create_broadcast';
import WalletCreateIssuance from './wallet_create_issuance';
import WalletCreateSend from './wallet_create_send';
import WalletCreateDispenser from './wallet_create_dispenser';
import WalletCreateOrder from './wallet_create_order';
import WalletCreateSweep from './wallet_create_sweep';

class WalletCreateSelect extends React.Component {

    constructor(props) {
        super(props);

        // JUST doing this search params handling for now to keep it simple

        // should always have search params, right?
        const params = new URLSearchParams(props.router.location.search);
        const paramsGetMethod = params.get("method");

        let selected_method = 'create_broadcast'; // default (at least for now)
        if (paramsGetMethod) {
            if (
                paramsGetMethod === 'create_broadcast' ||
                paramsGetMethod === 'create_issuance' ||
                paramsGetMethod === 'create_send' ||
                paramsGetMethod === 'create_dispenser' ||
                paramsGetMethod === 'create_order' ||
                paramsGetMethod === 'create_sweep'
            ) {
                selected_method = paramsGetMethod;
            }
        }
        // else { } // TODO? else clean it up?

        this.state = {
            selected_method,
            address: props.address,
        };
        this.handleSelectMethod = this.handleSelectMethod.bind(this);
    }

    handleSelectMethod(event) {
        // TODO also change the search param url (could be done in different ways?)... but not yet to keep it simple!
        this.setState({ selected_method: event.target.value });
    }

    renderMethodOptions() {
        return (
            <>
                <option value="create_broadcast">create_broadcast</option>
                <option value="create_issuance">create_issuance</option>
                <option value="create_send">create_send</option>
                <option value="create_dispenser">create_dispenser</option>
                <option value="create_order">create_order</option>
                <option value="create_sweep">create_sweep</option>
            </>
        );
    }

    renderMethodForm() {
        if (this.state.selected_method === 'create_broadcast') {
            return (<WalletCreateBroadcast address={this.state.address} />);
        }
        else if (this.state.selected_method === 'create_issuance') {
            return (<WalletCreateIssuance address={this.state.address} />);
        }
        else if (this.state.selected_method === 'create_send') {
            return (<WalletCreateSend address={this.state.address} />);
        }
        else if (this.state.selected_method === 'create_dispenser') {
            return (<WalletCreateDispenser address={this.state.address} />);
        }
        else if (this.state.selected_method === 'create_order') {
            return (<WalletCreateOrder address={this.state.address} />);
        }
        else if (this.state.selected_method === 'create_sweep') {
            return (<WalletCreateSweep address={this.state.address} />);
        }
        else {
            return null;
        }
    }

    render() {

        const wallet_method_element = (
            <>
                <p class="text-gray-600 dark:text-gray-400">
                    {/* <p class="dark:text-slate-100"> */}
                    Method:
                </p>
                <div class="py-1 my-1">

                    <div class="ml-4">
                        <select
                            class="border-solid border-2 border-gray-300"
                            // class="px-1 border-solid border-2 border-gray-400 dark:text-slate-100"
                            value={this.state.selected_method}
                            onChange={this.handleSelectMethod}
                        >
                            {this.renderMethodOptions()}
                        </select>
                    </div>

                    <div class="py-1 my-1">
                        {this.renderMethodForm()}
                    </div>

                </div>
            </>
        );

        const wallet_element_contents = (
            <>
                <div class="whitespace-nowrap overflow-auto">
                    <h3>
                        Create unsigned transactions, to then sign and broadcast with a <a href={`https://github.com/CNTRPRTY/simplest/`} target="_blank">wallet</a>:
                    </h3>
                    <div class="py-1 my-1">
                        {wallet_method_element}
                    </div>
                </div>
            </>
        );

        return (
            <>
                {wallet_element_contents}
            </>
        );

    }

}

export default withRouter(WalletCreateSelect);
