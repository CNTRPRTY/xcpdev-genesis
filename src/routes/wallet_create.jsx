import React from 'react';
import { postLibApiProxyFetch, API_HOST_IS_PROD } from '../api';

class WalletCreate extends React.Component {

    constructor(props) {
        super(props);

        this.handleSelectAdvancedParameterEncoding = this.handleSelectAdvancedParameterEncoding.bind(this);
        this.handleSelectAdvancedParameterPubkey = this.handleSelectAdvancedParameterPubkey.bind(this);
        this.handleSelectAdvancedParameterAllowUnconfirmedInputs = this.handleSelectAdvancedParameterAllowUnconfirmedInputs.bind(this);
        this.handleSelectAdvancedParameterFee = this.handleSelectAdvancedParameterFee.bind(this);
        this.handleSelectAdvancedParameterFeePerKb = this.handleSelectAdvancedParameterFeePerKb.bind(this);
        this.handleSelectAdvancedParameterFeeProvided = this.handleSelectAdvancedParameterFeeProvided.bind(this);
        this.handleSelectAdvancedParameterCustomInputs = this.handleSelectAdvancedParameterCustomInputs.bind(this);
        this.handleSelectAdvancedParameterUnspentTxHash = this.handleSelectAdvancedParameterUnspentTxHash.bind(this);
        this.handleSelectAdvancedParameterRegularDustSize = this.handleSelectAdvancedParameterRegularDustSize.bind(this);
        this.handleSelectAdvancedParameterMultisigDustSize = this.handleSelectAdvancedParameterMultisigDustSize.bind(this);
        this.handleSelectAdvancedParameterDustReturnPubkey = this.handleSelectAdvancedParameterDustReturnPubkey.bind(this);
        this.handleSelectAdvancedParameterDisableUtxoLocks = this.handleSelectAdvancedParameterDisableUtxoLocks.bind(this);
        this.handleSelectAdvancedParameterOpReturnValue = this.handleSelectAdvancedParameterOpReturnValue.bind(this);
        this.handleSelectAdvancedParameterExtendedTxInfo = this.handleSelectAdvancedParameterExtendedTxInfo.bind(this);
        this.handleSelectAdvancedParameterP2shPretxTxid = this.handleSelectAdvancedParameterP2shPretxTxid.bind(this);
        
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

    handleSelectAdvancedParameterFeePerKb(event) {
        this.setState({ ap_fee_per_kb: event.target.value });
    }

    handleSelectAdvancedParameterFeeProvided(event) {
        this.setState({ ap_fee_provided: event.target.value });
    }

    handleSelectAdvancedParameterCustomInputs(event) {
        this.setState({ ap_custom_inputs: event.target.value });
    }

    handleSelectAdvancedParameterUnspentTxHash(event) {
        this.setState({ ap_unspent_tx_hash: event.target.value });
    }

    handleSelectAdvancedParameterRegularDustSize(event) {
        this.setState({ ap_regular_dust_size: event.target.value });
    }

    handleSelectAdvancedParameterMultisigDustSize(event) {
        this.setState({ ap_multisig_dust_size: event.target.value });
    }

    handleSelectAdvancedParameterDustReturnPubkey(event) {
        this.setState({ ap_dust_return_pubkey: event.target.value });
    }

    handleSelectAdvancedParameterDisableUtxoLocks(event) {
        this.setState({ ap_disable_utxo_locks: event.target.value });
    }

    handleSelectAdvancedParameterOpReturnValue(event) {
        this.setState({ ap_op_return_value: event.target.value });
    }

    handleSelectAdvancedParameterExtendedTxInfo(event) {
        this.setState({ ap_extended_tx_info: event.target.value });
    }

    handleSelectAdvancedParameterP2shPretxTxid(event) {
        this.setState({ ap_p2sh_pretx_txid: event.target.value });
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
            // string/list:
            try {
                // list
                new_params.pubkey = JSON.parse(this.state.ap_pubkey);
            }
            catch (err) {
                // string
                new_params.pubkey = this.state.ap_pubkey;
            }
        }

        // allow_unconfirmed_inputs dealt above

        if (this.state.ap_fee !== ADVANCED_PARAMETERS_DEFAULTS.ap_fee) {
            new_params.fee = Number(this.state.ap_fee);
        }

        if (this.state.ap_fee_per_kb !== ADVANCED_PARAMETERS_DEFAULTS.ap_fee_per_kb) {
            new_params.fee_per_kb = Number(this.state.ap_fee_per_kb);
        }

        if (this.state.ap_fee_provided !== ADVANCED_PARAMETERS_DEFAULTS.ap_fee_provided) {
            new_params.fee_provided = Number(this.state.ap_fee_provided);
        }

        if (this.state.ap_custom_inputs !== ADVANCED_PARAMETERS_DEFAULTS.ap_custom_inputs) {
            try {
                new_params.custom_inputs = JSON.parse(this.state.ap_custom_inputs);
            }
            catch (err) {
                alert(`custom_inputs:${this.state.ap_custom_inputs} is not a JSON object`);
                return;
            }
        }

        if (this.state.ap_unspent_tx_hash !== ADVANCED_PARAMETERS_DEFAULTS.ap_unspent_tx_hash) {
            new_params.unspent_tx_hash = this.state.ap_unspent_tx_hash;
        }

        if (this.state.ap_regular_dust_size !== ADVANCED_PARAMETERS_DEFAULTS.ap_regular_dust_size) {
            new_params.regular_dust_size = Number(this.state.ap_regular_dust_size);
        }

        if (this.state.ap_multisig_dust_size !== ADVANCED_PARAMETERS_DEFAULTS.ap_multisig_dust_size) {
            new_params.multisig_dust_size = Number(this.state.ap_multisig_dust_size);
        }

        if (this.state.ap_dust_return_pubkey !== ADVANCED_PARAMETERS_DEFAULTS.ap_dust_return_pubkey) {
            new_params.dust_return_pubkey = this.state.ap_dust_return_pubkey;
        }

        if (this.state.ap_disable_utxo_locks !== ADVANCED_PARAMETERS_DEFAULTS.ap_disable_utxo_locks) {
            new_params.disable_utxo_locks = (this.state.ap_disable_utxo_locks === 'true');
        }

        if (this.state.ap_op_return_value !== ADVANCED_PARAMETERS_DEFAULTS.ap_op_return_value) {
            new_params.op_return_value = Number(this.state.ap_op_return_value);
        }

        if (this.state.ap_extended_tx_info !== ADVANCED_PARAMETERS_DEFAULTS.ap_extended_tx_info) {
            new_params.extended_tx_info = (this.state.ap_extended_tx_info === 'true');
        }

        if (this.state.ap_p2sh_pretx_txid !== ADVANCED_PARAMETERS_DEFAULTS.ap_p2sh_pretx_txid) {
            new_params.p2sh_pretx_txid = this.state.ap_p2sh_pretx_txid;
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
            if (API_HOST_IS_PROD){
                response_data = await fetch_res.json();
            }
            else {
                response_data = {
                    data: await fetch_res.json()
                };
            }

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

                <div class="py-1 my-1">
                <label>
                    <input
                        type="checkbox"
                        onClick={() => {
                            this.setState((prevState, props) => ({
                                advanced_parameters_show: !prevState.advanced_parameters_show
                            }));
                        }}
                        checked={this.state.advanced_parameters_show}
                    />
                    {' '}
                    <span class="text-gray-600 dark:text-gray-400">show advanced</span>
                </label>
                </div>

                {this.state.advanced_parameters_show ?
                    (

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
                                        size="32"
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

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">fee per kb:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="8"
                                        value={this.state.ap_fee_per_kb}
                                        onChange={this.handleSelectAdvancedParameterFeePerKb}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">fee provided:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="8"
                                        value={this.state.ap_fee_provided}
                                        onChange={this.handleSelectAdvancedParameterFeeProvided}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">custom inputs:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="32"
                                        value={this.state.ap_custom_inputs}
                                        onChange={this.handleSelectAdvancedParameterCustomInputs}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">unspent tx hash:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="32"
                                        value={this.state.ap_unspent_tx_hash}
                                        onChange={this.handleSelectAdvancedParameterUnspentTxHash}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">regular dust size:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="8"
                                        value={this.state.ap_regular_dust_size}
                                        onChange={this.handleSelectAdvancedParameterRegularDustSize}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">multisig dust size:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="8"
                                        value={this.state.ap_multisig_dust_size}
                                        onChange={this.handleSelectAdvancedParameterMultisigDustSize}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">dust return pubkey:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="32"
                                        value={this.state.ap_dust_return_pubkey}
                                        onChange={this.handleSelectAdvancedParameterDustReturnPubkey}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">disable utxo locks:</span>
                                </td>
                                <td class="py-1">
                                    <select
                                        class="border-solid border-2 border-gray-300"
                                        value={this.state.ap_disable_utxo_locks}
                                        onChange={this.handleSelectAdvancedParameterDisableUtxoLocks}
                                    >
                                        <option value="false">false</option>
                                        <option value="true">true</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">op return value:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="8"
                                        value={this.state.ap_op_return_value}
                                        onChange={this.handleSelectAdvancedParameterOpReturnValue}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">extended tx info:</span>
                                </td>
                                <td class="py-1">
                                    <select
                                        class="border-solid border-2 border-gray-300"
                                        value={this.state.ap_extended_tx_info}
                                        onChange={this.handleSelectAdvancedParameterExtendedTxInfo}
                                    >
                                        <option value="false">false</option>
                                        <option value="true">true</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td class="pr-1 py-1">
                                    <span class="dark:text-slate-100">p2sh pretx txid:</span>
                                </td>
                                <td class="py-1">
                                    <input
                                        class="border-solid border-2 border-gray-300"
                                        type="text"
                                        size="32"
                                        value={this.state.ap_p2sh_pretx_txid}
                                        onChange={this.handleSelectAdvancedParameterP2shPretxTxid}
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                </>

                    )
                    : null
                }

            </>
        );
    }

    renderDialogObj() {
        let success = null;
        if (this.state.open_dialog_obj.dialog_state === 'success') {

            // hex position varies based on extended_tx_info
            let hex = this.state.open_dialog_obj.response.data.lib_response.result;
            if (typeof hex === 'object') hex = hex.tx_hex;

            success = (
                <>
                    <p class="dark:text-slate-100">
                        (This is alpha software, verify the request was done correctly below.)
                        <br />
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
                            value={hex}
                            // value={this.state.open_dialog_obj.response.data.lib_response.result}
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
    ap_encoding: 'auto', // string
    ap_pubkey: '', // string/list

    // friendlier client default
    ap_allow_unconfirmed_inputs: 'true', // bool
    // ap_allow_unconfirmed_inputs: 'false', // bool
    
    ap_fee: '', // int
    ap_fee_per_kb: '', // int
    ap_fee_provided: '', // int

    ap_custom_inputs: '', // list
    ap_unspent_tx_hash: '', // string

    ap_regular_dust_size: 546, // 5430, // integer
    // Note: 1000 is the new default, but may be considered too low for future redeem
    ap_multisig_dust_size: 1000, // 7800, // integer

    ap_dust_return_pubkey: '', // string
    ap_disable_utxo_locks: 'false', // bool

    ap_op_return_value: 0, // integer

    ap_extended_tx_info: 'false', // bool
    ap_p2sh_pretx_txid: '', // string
}
WalletCreate.ADVANCED_PARAMETERS_DEFAULTS = ADVANCED_PARAMETERS_DEFAULTS;

export default WalletCreate;
