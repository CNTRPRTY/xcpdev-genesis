import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateSend extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            selected_method: 'create_send',
            source: props.address,

            destination: '',
            asset: '',
            quantity: 0,

            fee: 0,
            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleAssetChange = this.handleAssetChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const method = this.state.selected_method;
        const params = {
            "source": this.state.source,

            "destination": this.state.destination,
            "asset": this.state.asset,
            "quantity": Number(this.state.quantity),

            "fee": Number(this.state.fee),
            "encoding": "opreturn",
            "allow_unconfirmed_inputs": true,
        };

        await this.handleSubmitSetState(method, params);
    }


    handleDestinationChange(event) {
        this.setState({ destination: event.target.value });
    }

    handleAssetChange(event) {
        this.setState({ asset: event.target.value });
    }

    handleQuantityChange(event) {
        this.setState({ quantity: event.target.value });
    }


    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    <p>Params:</p>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    source:
                                </td>
                                <td>
                                    <input value={this.state.source} size={this.state.source.length} disabled />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    destination:
                                </td>
                                <td>
                                    <input type="text" size="32" value={this.state.destination} onChange={this.handleDestinationChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    asset:
                                </td>
                                <td>
                                    <input type="text" size="16" value={this.state.asset} onChange={this.handleAssetChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    quantity:
                                </td>
                                <td>
                                    <input type="text" size="8" value={this.state.quantity} onChange={this.handleQuantityChange} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    fee:
                                </td>
                                <td>
                                    <input type="text" size="8" value={this.state.fee} onChange={this.handleFeeChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />

                    {this.state.open_dialog_obj ?
                        (this.renderDialogObj())
                        :
                        null}

                    <input type="submit" value="submit" disabled={this.state.open_dialog_obj !== null} />
                </form>
            </>
        );
    }

}

export default withRouter(WalletCreateSend);
