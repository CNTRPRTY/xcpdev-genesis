import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreateBroadcast from './wallet_create_broadcast';
import WalletCreateIssuance from './wallet_create_issuance';
import WalletCreateSend from './wallet_create_send';

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
                paramsGetMethod === 'create_send'
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
                <option value="create_broadcast">create_broadcast (opreturn)</option>
                <option value="create_issuance">create_issuance (opreturn)</option>
                <option value="create_send">create_send (opreturn)</option>
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
        else {
            return null;
        }
    }

    render() {
        let wallet_element_contents = null;
        wallet_element_contents = (
            <>
                <h3>Create unsigned transactions, to then sign and broadcast with a <a href={`https://bitst.art/`} target="_blank">wallet</a>:</h3>
                <p>Method:</p>
                <select value={this.state.selected_method} onChange={this.handleSelectMethod}>
                    {/* <select value="create_broadcast"> */}
                    {this.renderMethodOptions()}
                </select>
                {this.renderMethodForm()}
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
