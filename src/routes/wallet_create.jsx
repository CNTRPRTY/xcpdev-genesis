import React from 'react';
import { postLibApiProxyFetch } from '../api';

class WalletCreate extends React.Component {

    constructor(props) {
        super(props);

        this.handleSelectAdvancedParameterEncoding = this.handleSelectAdvancedParameterEncoding.bind(this);
        this.handleSelectAdvancedParameterPubkey = this.handleSelectAdvancedParameterPubkey.bind(this);
        this.handleSelectAdvancedParameterAllowUnconfirmedInputs = this.handleSelectAdvancedParameterAllowUnconfirmedInputs.bind(this);
        this.handleSelectAdvancedParameterFee = this.handleSelectAdvancedParameterFee.bind(this);

        this.handleDialogCloseSubmit = this.handleDialogCloseSubmit.bind(this);
        // this.handleFeeChange = this.handleFeeChange.bind(this);
    }


    handleSelectAdvancedParameterEncoding(event) {
        this.setState({ ap_encoding: event.target.value });
    }

    handleSelectAdvancedParameterPubkey(event) {
        this.setState({ ap_pubkey: event.target.value });
    }

    handleSelectAdvancedParameterAllowUnconfirmedInputs(event) {
        this.setState({ ap_allow_unconfirmed_inputs: event.target.value });
    }

    handleSelectAdvancedParameterFee(event) {
        this.setState({ ap_fee: event.target.value });
    }


    // only adds if different from defaults
    addAdvancedParams(params) {
        const new_params = { ...params };

        // first deal with the "client" defaults (always include)
        new_params.allow_unconfirmed_inputs = (this.state.ap_allow_unconfirmed_inputs === 'true');

        if (this.state.ap_encoding !== ADVANCED_PARAMETERS_DEFAULTS.ap_encoding) {
            new_params.encoding = this.state.ap_encoding;
        }

        if (this.state.ap_pubkey !== ADVANCED_PARAMETERS_DEFAULTS.ap_pubkey) {
            // TODO string/list
            new_params.pubkey = this.state.ap_pubkey;
        }

        // allow_unconfirmed_inputs dealt above

        if (this.state.ap_fee !== ADVANCED_PARAMETERS_DEFAULTS.ap_fee) {
            new_params.fee = Number(this.state.ap_fee);
        }

        return new_params;
    }


    async handleSubmitSetState(method, params) {

        const request = {
            method,
            params,
        }

        this.setState({
            open_dialog_obj: {
                dialog_state: 'loading',
                request,
            }
        });

        let dialog_state;
        try {


            let response_data;
            const fetch_res = await postLibApiProxyFetch(method, params);

            // too many requests error is special
            if (!fetch_res.ok) {
                if (fetch_res.status === 429) {
                    dialog_state = 'ip rate limited';
                }
                else {
                    dialog_state = 'error';
                }
            }
            response_data = await fetch_res.json();


            if (dialog_state === 'error') {
                this.setState({
                    open_dialog_obj: {
                        dialog_state,
                        error_message: JSON.stringify(response_data), // TODO?
                        request,
                    }
                });
            }
            else if (dialog_state === 'ip rate limited') {
                this.setState({
                    open_dialog_obj: {
                        dialog_state,
                        response: response_data,
                        request,
                    }
                });
            }
            else if (response_data && response_data.data && response_data.data.lib_response && response_data.data.lib_response.result) {
                this.setState({
                    open_dialog_obj: {
                        dialog_state: 'success',
                        response: response_data,
                        request,
                    }
                });
            }
            else {
                this.setState({
                    open_dialog_obj: {
                        dialog_state: 'check lib_response',
                        response: response_data,
                        request,
                    }
                });
            }

        }
        catch (error) { // final catch all in case
            this.setState({
                open_dialog_obj: {
                    dialog_state: 'error',
                    error_message: error.message,
                    request,
                }
            });
        }
    }

    async handleDialogCloseSubmit(event) {
        event.preventDefault();
        this.setState({ open_dialog_obj: null });
    }


    // handleFeeChange(event) {
    //     this.setState({ fee: event.target.value });
    // }

    renderAdvancedParameters() {
        return (
            <>
                <p class="text-gray-600 dark:text-gray-400">
                    Advanced parameters:
                </p>
                <div class="py-1 my-1 ml-4">
                    <table>
                        <tbody>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">encoding:</span>
                                </td>
                                <td class="py-1">
                                    <select
                                        class="border-solid border-2 border-gray-300"
                                        value={this.state.ap_encoding}
                                        onChange={this.handleSelectAdvancedParameterEncoding}
                                    >
                                        <option value="auto">auto</option>
                                        <option value="opreturn">opreturn</option>
                                        <option value="multisig">multisig</option>
                                        <option value="pubkeyhash">pubkeyhash</option>
                                        <option value="P2SH">p2sh</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">pubkey:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="8"
                                        value={this.state.ap_pubkey}
                                        onChange={this.handleSelectAdvancedParameterPubkey}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">allow unconfirmed inputs:</span>
                                </td>
                                <td class="py-1">
                                    <select
                                        class="border-solid border-2 border-gray-300"
                                        value={this.state.ap_allow_unconfirmed_inputs}
                                        onChange={this.handleSelectAdvancedParameterAllowUnconfirmedInputs}
                                    >
                                        <option value="true">true</option>
                                        <option value="false">false</option>
                                    </select>
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
                                        value={this.state.ap_fee}
                                        onChange={this.handleSelectAdvancedParameterFee}
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    renderDialogObj() {
        let success = null;
        if (this.state.open_dialog_obj.dialog_state === 'success') {
            success = (
                <>
                    <p class="dark:text-slate-100">
                        Copy the following hex, sign it, and then broadcast it.
                    </p>
                    <div class="py-1 my-1">
                        <h3 class="font-bold">
                            hex:
                        </h3>
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
                            }}
                            value={this.state.open_dialog_obj.response.data.lib_response.result}
                            readOnly
                            disabled
                        />
                    </div>
                </>
            )
        }

        let response = null;
        if (this.state.open_dialog_obj.dialog_state !== 'error') {
            response = (
                <>
                    <p>
                        <span class="dark:text-slate-100">response:</span>
                        {/* <span class="text-gray-600 dark:text-gray-400">response:</span> */}
                        <br />
                        <textarea
                            class="border-solid border-2 border-gray-300"
                            rows="10"
                            cols="30"
                            // cols="55"
                            value={JSON.stringify(this.state.open_dialog_obj.response, null, " ")}
                            readOnly
                            disabled
                        />
                    </p>
                </>
            )
        }
        else { // === error (or loading)
            response = (
                <>
                    <p class="text-gray-600 dark:text-gray-400">
                        {this.state.open_dialog_obj.error_message}
                    </p>
                </>
            )
        }


        const request = (
            <>
                <p>
                    <span class="dark:text-slate-100">request:</span>
                    {/* <span class="text-gray-600 dark:text-gray-400">request:</span> */}
                    <br />
                    <textarea
                        class="border-solid border-2 border-gray-300"
                        rows="10"
                        cols="30"
                        // cols="55"
                        value={JSON.stringify(this.state.open_dialog_obj.request, null, " ")}
                        readOnly
                        disabled
                    />
                </p>
            </>
        );

        return (
            <div class="p-4 border-solid border-l-2 border-gray-400 dark:text-slate-100">
                {/* <div class="p-4 border-solid border-l-2 border-gray-400 dark:text-slate-100 whitespace-nowrap overflow-auto"> */}
                {/* <div class="p-4 border-solid border-2 border-gray-400 dark:text-slate-100 whitespace-nowrap overflow-auto"> */}
                {/* <div class="p-4 border-solid border-2 border-gray-400 dark:text-slate-100"> */}
                {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method */}

                <>
                    <h2 class="font-bold text-xl mb-1">
                        {this.state.open_dialog_obj.dialog_state}
                    </h2>
                    {this.state.open_dialog_obj.dialog_state === 'loading' ?
                        (
                            <div class="py-1 my-1 ml-4">
                                {/* <div class="py-1 my-1"> */}
                                <p class="dark:text-slate-100">
                                    please wait, it can take up to 10 seconds
                                </p>
                            </div>
                        ) : null
                    }
                </>

                <div class="py-1 my-1">
                    {success}
                </div>

                {/* nested terniary! (TODO magic string) */}
                {this.state.open_dialog_obj.dialog_state !== 'loading' ?
                    (
                        <>
                            <div class="py-1 my-1 ml-4">
                                {/* <div class="py-1 my-1"> */}
                                {response}
                            </div>
                            <div class="py-1 my-1 ml-4">
                                {request}
                            </div>
                        </>
                    ) : null
                }

                {this.state.open_dialog_obj.dialog_state !== 'loading' ?
                    (
                        // <div class="py-1 my-1 ml-4">
                        <div class="py-1 my-1">
                            <button
                                class="px-1 border-solid border-2 border-gray-400 dark:text-slate-100"
                                onClick={this.handleDialogCloseSubmit}
                            >
                                ok
                            </button>
                        </div>
                    )
                    : null
                }

            </div>
        );
    }

}

const ADVANCED_PARAMETERS_DEFAULTS = {
    ap_encoding: 'auto',
    ap_pubkey: '', // string/list

    ap_allow_unconfirmed_inputs: 'true', // friendlier client default
    // allow_unconfirmed_inputs: 'false',

    ap_fee: '', // TODO have been asking for this one always...
    ap_fee_per_kb: '',
    ap_fee_provided: '',

    ap_custom_inputs: '', // list
    ap_unspent_tx_hash: '',

    // TODO some of these defaults might have changed...
    ap_regular_dust_size: 5430, // integer
    ap_multisig_dust_size: 7800, // integer

    ap_dust_return_pubkey: '',
    ap_disable_utxo_locks: 'false',

    ap_op_return_value: 0, // integer

    ap_extended_tx_info: 'false',
    ap_p2sh_pretx_txid: '', // string
}
WalletCreate.ADVANCED_PARAMETERS_DEFAULTS = ADVANCED_PARAMETERS_DEFAULTS;

export default WalletCreate;
