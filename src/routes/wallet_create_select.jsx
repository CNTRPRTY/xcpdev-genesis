import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreateBroadcast from './wallet_create_broadcast';

class WalletCreateSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_method: 'create_broadcast',
            address: props.address,
        };
        this.handleSelectMethod = this.handleSelectMethod.bind(this);
    }

    handleSelectMethod(event) {
        this.setState({ selected_method: event.target.value });
    }

    renderMethodOptions() {
        return (
            <>
                <option value="create_broadcast">create_broadcast</option>
            </>
        );
    }

    renderMethodForm() {
        if (this.state.selected_method === 'create_broadcast') {
            return (<WalletCreateBroadcast address={this.state.address} />);
        }
        else {
            return null;
        }
    }

    render() {
        let wallet_element_contents = null;
        wallet_element_contents = (
            <>
                <h3>Create unsigned transactions (<a href={`https://bitst.art/`} target="_blank">to later sign and broadcast</a>):</h3>
                <p>Method:</p>
                <select value={this.state.selected_action} onChange={this.handleSelectMethod}>
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
