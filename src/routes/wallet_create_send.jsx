import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateSend extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            advanced_parameters_show: false, // ONLY PRESENTATION! whatever chosen stays
            ...WalletCreate.ADVANCED_PARAMETERS_DEFAULTS,
            
            selected_method: 'create_send',
            source: props.address,

            destination: '',
            asset: '',
            quantity: 0,
            memo: '',
            memo_is_hex: 'false',
            use_enhanced_send: 'true',

            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleAssetChange = this.handleAssetChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleMemoChange = this.handleMemoChange.bind(this);
        this.handleMemoIsHexChange = this.handleMemoIsHexChange.bind(this);
        this.handleUseEnhancedSendChange = this.handleUseEnhancedSendChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const method = this.state.selected_method;
        let params = {
            "source": this.state.source,

            "destination": this.state.destination,
            "asset": this.state.asset,
            "quantity": Number(this.state.quantity),
            "memo": this.state.memo,
            "memo_is_hex": this.state.memo_is_hex === 'true',
            "use_enhanced_send": this.state.use_enhanced_send === 'true',
        };

        params = this.addAdvancedParams(params);

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

    handleMemoChange(event) {
        this.setState({ memo: event.target.value });
    }

    handleMemoIsHexChange(event) {
        this.setState({ memo_is_hex: event.target.value });
    }

    handleUseEnhancedSendChange(event) {
        this.setState({ use_enhanced_send: event.target.value });
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
                                        <span class="dark:text-slate-100">destination:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="32"
                                            value={this.state.destination}
                                            onChange={this.handleDestinationChange}
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
                                        <span class="dark:text-slate-100">memo:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="16"
                                            value={this.state.memo}
                                            onChange={this.handleMemoChange}
                                        />
                                        {' '}
                                        <span class="dark:text-slate-100">is hex:</span>
                                        {' '}
                                        <select
                                            class="border-solid border-2 border-gray-300"
                                            value={this.state.memo_is_hex}
                                            onChange={this.handleMemoIsHexChange}
                                        >
                                            <option value="false">false</option>
                                            <option value="true">true</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pr-1 py-1">
                                        <span class="dark:text-slate-100">use enhanced send:</span>
                                    </td>
                                    <td class="py-1">
                                        <select
                                            class="border-solid border-2 border-gray-300"
                                            value={this.state.use_enhanced_send}
                                            onChange={this.handleUseEnhancedSendChange}
                                        >
                                            <option value="false">false</option>
                                            <option value="true">true</option>
                                        </select>
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

export default withRouter(WalletCreateSend);
