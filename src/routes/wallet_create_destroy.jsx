import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateDestroy extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            advanced_parameters_show: false, // ONLY PRESENTATION! whatever chosen stays
            ...WalletCreate.ADVANCED_PARAMETERS_DEFAULTS,
            
            selected_method: 'create_destroy',
            source: props.address,

            asset: '', // string
            quantity: 0, // int
            tag: '', // string

            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleAssetChange = this.handleAssetChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const method = this.state.selected_method;
        let params = {
            "source": this.state.source,

            "asset": this.state.asset,
            "quantity": Number(this.state.quantity),
            "tag": this.state.tag,
        };

        params = this.addAdvancedParams(params);

        if (params) await this.handleSubmitSetState(method, params);
    }


    handleAssetChange(event) {
        this.setState({ asset: event.target.value });
    }

    handleQuantityChange(event) {
        this.setState({ quantity: event.target.value });
    }

    handleTagChange(event) {
        this.setState({ tag: event.target.value });
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
                                        <span class="dark:text-slate-100">tag:</span>
                                    </td>
                                    <td class="py-1">
                                        <input
                                            class="border-solid border-2 border-gray-300"
                                            type="text"
                                            size="16"
                                            value={this.state.tag}
                                            onChange={this.handleTagChange}
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

export default withRouter(WalletCreateDestroy);
