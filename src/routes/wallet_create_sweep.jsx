import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateSweep extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            ...WalletCreate.ADVANCED_PARAMETERS_DEFAULTS,
            
            selected_method: 'create_sweep',
            source: props.address,

            destination: '', // string
            flags: 1, // int
            memo: '', // string

            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleFlagsChange = this.handleFlagsChange.bind(this);
        this.handleMemoChange = this.handleMemoChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const method = this.state.selected_method;
        let params = {
            "source": this.state.source,

            "destination": this.state.destination,
            "flags": Number(this.state.flags),
            "memo": this.state.memo,
        };

        params = this.addAdvancedParams(params);

        await this.handleSubmitSetState(method, params);
    }


    handleDestinationChange(event) {
        this.setState({ destination: event.target.value });
    }

    handleFlagsChange(event) {
        this.setState({ flags: event.target.value });
    }

    handleMemoChange(event) {
        this.setState({ memo: event.target.value });
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
                                        <span class="dark:text-slate-100">flags:</span>
                                    </td>
                                    <td class="py-1">
                                        <select
                                            class="border-solid border-2 border-gray-300"
                                            value={this.state.flags}
                                            onChange={this.handleFlagsChange}
                                        >
                                            <option value="1">FLAG_BALANCES (1)</option>
                                            <option value="2">FLAG_OWNERSHIP (2)</option>
                                            <option value="4">FLAG_BINARY_MEMO (4)</option>{/* ??? */}
                                        </select>
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

export default withRouter(WalletCreateSweep);
