import React from 'react';
import { withRouter } from './shared/classhooks';

import WalletCreate from './wallet_create';
import {Button, Textarea, TextInput} from "@tremor/react";

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
                {/* {this.state.open_dialog_obj ?
                    // {this.state.open_dialog_message ?
                    (this.renderDialogObj())
                    :
                    null} */}
                <form onSubmit={this.handleSubmit}>
                    <p>Params:</p>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    source:
                                </td>
                                <td>
                                    <input value={this.state.source} size={this.state.source.length} disabled />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    text:
                                </td>
                                <td>
                                    {/* TODO styling with css file */}
                                    <Textarea rows="2" cols="55" style={{
                                        // https://stackoverflow.com/a/658197
                                        'whiteSpace': "nowrap",
                                        'overflow': "scroll",
                                        'overflowY': "hidden",
                                        'overflowX': "scroll",
                                        'overflow': "-moz-scrollbars-horizontal",
                                        // https://stackoverflow.com/a/5271803
                                        'resize': 'horizontal',
                                    }} onChange={this.handleTextChange}></Textarea>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    fee:
                                </td>
                                <td>
                                    <TextInput type="text" size="8" value={this.state.fee} onChange={this.handleFeeChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />

                    {this.state.open_dialog_obj ?
                    // {this.state.open_dialog_message ?
                    (this.renderDialogObj())
                    :
                    null}

                    <Button type="submit" value="submit" disabled={this.state.open_dialog_obj !== null} >Submit</Button>
                    {/* <input type="submit" value="submit" disabled={this.state.in_post} /> */}
                </form>
            </>

        );
    }

}

export default withRouter(WalletCreateBroadcast);
