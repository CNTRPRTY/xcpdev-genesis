import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';

class WalletCreateBroadcast extends WalletCreate {

    constructor(props) {
        super(props);
        this.state = {
            selected_method: 'create_broadcast',
            source: props.address,

            text: '',

            fee: 0,
            open_dialog_obj: null, // closed when null
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleTextChange = this.handleTextChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        // if (this.state.text.length > 54) {
        //     alert(`54 chars max for opreturn`);
        //     return;
        // }

        const method = this.state.selected_method;
        const params = {
            "source": this.state.source,

            "fee_fraction": 0.0,
            "text": this.state.text,
            "timestamp": Math.floor((new Date()).getTime() / 1000),
            "value": 0.0,

            "fee": Number(this.state.fee),
            "encoding": "opreturn",
            "allow_unconfirmed_inputs": true,
            // "extended_tx_info": true
        };

        await this.handleSubmitSetState(method, params);
    }


    handleTextChange(event) {
        this.setState({ text: event.target.value });
    }


    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    <p class="text-gray-600 dark:text-gray-400">
                        Params:
                    </p>
                    <div class="py-1 my-1 ml-4">
                        <table>
                            <tbody>
                                <tr>
                                    <td class="pr-1 py-1">
                                        {/* <td> */}
                                        <span class="dark:text-slate-100">source:</span>
                                        {/* <span class="text-gray-600 dark:text-gray-400">source:</span> */}
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
                                        <span class="dark:text-slate-100">text:</span>
                                    </td>
                                    <td class="py-1">
                                        {/* TODO styling with css file */}
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
                                            }} onChange={this.handleTextChange}></textarea>
                                    </td>
                                </tr>

                                <tr>
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
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {this.state.open_dialog_obj ?
                        (this.renderDialogObj())
                        :
                        null
                    }

                    <div class="py-1 my-1">
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

export default withRouter(WalletCreateBroadcast);
