import React from 'react';
import { postLibApiProxyFetch } from '../api';

class WalletCreate extends React.Component {

    constructor(props) {
        super(props);
        this.handleDialogCloseSubmit = this.handleDialogCloseSubmit.bind(this);
        this.handleFeeChange = this.handleFeeChange.bind(this);
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


    handleFeeChange(event) {
        this.setState({ fee: event.target.value });
    }

    renderDialogObj() {
        let success = null;
        if (this.state.open_dialog_obj.dialog_state === 'success') {
            success = (
                <>
                    <p>Copy the following hex, sign it, and then broadcast it.</p>
                    <h3>hex:</h3>
                    {/* TODO reuse css */}
                    <textarea
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
                    />
                </>
            )
        }

        let response = null;
        if (this.state.open_dialog_obj.dialog_state !== 'error') {
            response = (
                <>
                    <p>
                        response:
                        <br />
                        <textarea
                            rows="10"
                            cols="30"
                            // cols="55"
                            value={JSON.stringify(this.state.open_dialog_obj.response, null, " ")}
                            readOnly
                        />
                    </p>
                </>
            )
        }
        else { // === error (or loading)
            response = (
                <>
                    <p>
                        {this.state.open_dialog_obj.error_message}
                    </p>
                </>
            )
        }


        const request = (
            <>
                <p>
                    request:
                    <br />
                    <textarea
                        rows="10"
                        cols="30"
                        // cols="55"
                        value={JSON.stringify(this.state.open_dialog_obj.request, null, " ")}
                        readOnly
                    />
                </p>
            </>
        );

        return (
            <>
                {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method */}

                <table style={{
                    border: "1px solid black",
                    padding: "1rem 1rem",
                }}>
                    <tr>
                        <td>

                            <>
                                <h2>{this.state.open_dialog_obj.dialog_state}</h2>
                                {this.state.open_dialog_obj.dialog_state === 'loading' ?
                                    (
                                        <p>please wait, it can take up to 10 seconds</p>
                                    ) : null
                                }
                            </>

                            {success}
                            {/* nested terniary! (TODO magic string) */}
                            {this.state.open_dialog_obj.dialog_state !== 'loading' ?
                                (
                                    <>
                                        {response}
                                        {request}
                                    </>
                                ) :
                                null
                            }

                            {this.state.open_dialog_obj.dialog_state !== 'loading' ?
                                (<button onClick={this.handleDialogCloseSubmit}>ok</button>)
                                :
                                null
                            }

                        </td>
                    </tr>
                </table>
                <br />

            </>
        );
    }

}

export default WalletCreate;
