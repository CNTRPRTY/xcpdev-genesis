import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateIssuance extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            advanced_parameters_show: false, // ONLY PRESENTATION! whatever chosen stays
            ...WalletCreate.ADVANCED_PARAMETERS_DEFAULTS,
            
            selected_method: 'create_issuance',
            source: props.address,

            asset: '',
            quantity: 0,
            divisible: 'false', // protocol default is true
            // divisible: false, // protocol default is true
            description: '',
            transfer_destination: '', // protocol default is null (but empty string seems to be equivalent)

            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleAssetChange = this.handleAssetChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleDivisibleChange = this.handleDivisibleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTransferDestinationChange = this.handleTransferDestinationChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const method = this.state.selected_method;
        let params = {
            "source": this.state.source,

            "asset": this.state.asset,
            "quantity": Number(this.state.quantity),
            "divisible": this.state.divisible === 'true',
            // "divisible": this.state.divisible,
            "description": this.state.description,
            "transfer_destination": this.state.transfer_destination,
        };

        params = this.addAdvancedParams(params);

        if (params) await this.handleSubmitSetState(method, params);
        // await this.handleSubmitSetState(method, params);
    }

    handleAssetChange(event) {
        this.setState({ asset: event.target.value });
    }

    handleQuantityChange(event) {
        this.setState({ quantity: event.target.value });
    }

    handleDivisibleChange(event) {
        this.setState({ divisible: event.target.value });
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value });
    }

    handleTransferDestinationChange(event) {
        this.setState({ transfer_destination: event.target.value });
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
                                        <span class="dark:text-slate-100">quantity:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.quantity}
                                            onChange={this.handleQuantityChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">divisible:</span>
                                    </td>
                                    <td class="py-1">
                                        <select
                                            class="border-solid border-2 border-gray-300"
                                            value={this.state.divisible}
                                            onChange={this.handleDivisibleChange}
                                        >
                                            <option value="false">false</option>
                                            <option value="true">true (satoshi)</option>
                                            {/* <option value={false}>false</option>
                                            <option value={true}>true (satoshi)</option> */}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">description:</span>
                                    </td>
                                    <td class="py-1">
                                        <textarea
                                            class="border-solid border-2 border-gray-300"
                                            rows="2"
                                            cols="30"
                                            // cols="55"
                                            style={{
                                                // https://stackoverflow.com/a/658197
                                                'whiteSpace': "nowrap",
                                                'overflow': "scroll",
                                                'overflowY': "hidden",
                                                'overflowX': "scroll",
                                                'overflow': "-moz-scrollbars-horizontal",
                                                // https://stackoverflow.com/a/5271803
                                                'resize': 'horizontal',
                                            }} onChange={this.handleDescriptionChange}></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">transfer destination:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="32"
                                            value={this.state.transfer_destination}
                                            onChange={this.handleTransferDestinationChange}
                                        />
                                    </td>
                                </tr>

                                {/* <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">fee:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="8"
                                            value={this.state.fee}
                                            onChange={this.handleFeeChange}
                                        />
                                    </td>
                                </tr> */}

                            </tbody>
                        </table>
                    </div>

                    {this.state.open_dialog_obj ?
                        (this.renderDialogObj())
                        :
                        null
                    }

                    <div class="py-1 my-1 mt-3">
                        {/* <div class="py-1 my-1"> */}
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

export default withRouter(WalletCreateIssuance);
