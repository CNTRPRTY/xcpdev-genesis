import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateOrder extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            advanced_parameters_show: false, // ONLY PRESENTATION! whatever chosen stays
            ...WalletCreate.ADVANCED_PARAMETERS_DEFAULTS,
            
            selected_method: 'create_order',
            source: props.address,

            give_asset: '', // string
            give_quantity: 0, // int
            get_asset: '', // string
            get_quantity: 0, // int
            expiration: 0, // int
            fee_required: 0, // int

            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleGiveAssetChange = this.handleGiveAssetChange.bind(this);
        this.handleGiveQuantityChange = this.handleGiveQuantityChange.bind(this);
        this.handleGetAssetChange = this.handleGetAssetChange.bind(this);
        this.handleGetQuantityChange = this.handleGetQuantityChange.bind(this);
        this.handleExpirationChange = this.handleExpirationChange.bind(this);
        this.handleFeeRequiredChange = this.handleFeeRequiredChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const method = this.state.selected_method;
        let params = {
            "source": this.state.source,

            "give_asset": this.state.give_asset,
            "give_quantity": Number(this.state.give_quantity),
            "get_asset": this.state.get_asset,
            "get_quantity": Number(this.state.get_quantity),
            "expiration": Number(this.state.expiration),
            "fee_required": Number(this.state.fee_required),
        };

        params = this.addAdvancedParams(params);

        if (params) await this.handleSubmitSetState(method, params);
        // await this.handleSubmitSetState(method, params);
    }


    handleGiveAssetChange(event) {
        this.setState({ give_asset: event.target.value });
    }

    handleGiveQuantityChange(event) {
        this.setState({ give_quantity: event.target.value });
    }

    handleGetAssetChange(event) {
        this.setState({ get_asset: event.target.value });
    }

    handleGetQuantityChange(event) {
        this.setState({ get_quantity: event.target.value });
    }

    handleExpirationChange(event) {
        this.setState({ expiration: event.target.value });
    }

    handleFeeRequiredChange(event) {
        this.setState({ fee_required: event.target.value });
    }


    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit}>

                    {this.renderAdvancedParameters()}

                    <p class="text-gray-600 dark:text-gray-400">
                        Params:
                    </p>
                    <div class="py-1 my-1 ml-4">
                        <table>
                            <tbody>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">source:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            value={this.state.source}
                                            size={this.state.source.length}
                                            disabled
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">give asset:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="16"
                                            value={this.state.give_asset}
                                            onChange={this.handleGiveAssetChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">give quantity:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.give_quantity}
                                            onChange={this.handleGiveQuantityChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">get asset:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="16"
                                            value={this.state.get_asset}
                                            onChange={this.handleGetAssetChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">get quantity:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.get_quantity}
                                            onChange={this.handleGetQuantityChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">expiration:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.expiration}
                                            onChange={this.handleExpirationChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">fee required:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.fee_required}
                                            onChange={this.handleFeeRequiredChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {this.state.open_dialog_obj ?
                        (this.renderDialogObj())
                        :
                        null
                    }

                    <div class="py-1 my-1 mt-3">
                        <input
                            class="px-1 border-solid border-2 border-gray-400 dark:text-slate-100"
                            type="submit"
                            value="submit"
                            disabled={this.state.open_dialog_obj !== null}
                        />
                    </div>
                </form>
            </>
        );
    }

}

export default withRouter(WalletCreateOrder);
