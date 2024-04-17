import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateDispenser extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            advanced_parameters_show: false, // ONLY PRESENTATION! whatever chosen stays
            ...WalletCreate.ADVANCED_PARAMETERS_DEFAULTS,
            
            selected_method: 'create_dispenser',
            source: props.address,

            asset: '', // string
            give_quantity: 0, // int
            escrow_quantity: 0, // int
            mainchainrate: 0, // int
            open_address: '', // string
            status: 0, // int

            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleAssetChange = this.handleAssetChange.bind(this);
        this.handleGiveQuantityChange = this.handleGiveQuantityChange.bind(this);
        this.handleEscrowQuantityChange = this.handleEscrowQuantityChange.bind(this);
        this.handleMainchainrateChange = this.handleMainchainrateChange.bind(this);
        this.handleOpenAddressChange = this.handleOpenAddressChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const method = this.state.selected_method;
        let params = {
            "source": this.state.source,

            "asset": this.state.asset,
            "give_quantity": Number(this.state.give_quantity),
            "escrow_quantity": Number(this.state.escrow_quantity),
            "mainchainrate": Number(this.state.mainchainrate),
            "open_address": this.state.open_address,
            "status": Number(this.state.status),
        };

        params = this.addAdvancedParams(params);

        await this.handleSubmitSetState(method, params);
    }


    handleAssetChange(event) {
        this.setState({ asset: event.target.value });
    }

    handleGiveQuantityChange(event) {
        this.setState({ give_quantity: event.target.value });
    }

    handleEscrowQuantityChange(event) {
        this.setState({ escrow_quantity: event.target.value });
    }

    handleMainchainrateChange(event) {
        this.setState({ mainchainrate: event.target.value });
    }

    handleOpenAddressChange(event) {
        this.setState({ open_address: event.target.value });
    }

    handleStatusChange(event) {
        this.setState({ status: event.target.value });
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
                                        <span class="dark:text-slate-100">asset:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="16"
                                            value={this.state.asset}
                                            onChange={this.handleAssetChange}
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
                                        <span class="dark:text-slate-100">escrow quantity:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.escrow_quantity}
                                            onChange={this.handleEscrowQuantityChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">mainchainrate:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.mainchainrate}
                                            onChange={this.handleMainchainrateChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">open address:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="32"
                                            value={this.state.open_address}
                                            onChange={this.handleOpenAddressChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">status:</span>
                                    </td>
                                    <td class="py-1">
                                        <select
                                            class="border-solid border-2 border-gray-300"
                                            value={this.state.status}
                                            onChange={this.handleStatusChange}
                                        >
                                            <option value="0">open (0)</option>
                                            <option value="1">open_address (1)</option>
                                            <option value="10">closed (10)</option>
                                        </select>
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

export default withRouter(WalletCreateDispenser);
