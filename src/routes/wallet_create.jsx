import React from 'react';
import { withRouter } from './shared/classhooks';
import { postLibApiProxy } from '../api';

class WalletCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: props.address,
            text: '',
            fee: 0,
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleFeeChange = this.handleFeeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTextChange(event) {
        this.setState({ text: event.target.value });
    }

    handleFeeChange(event) {
        this.setState({ fee: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.text.length > 54) {
            alert(`54 chars max for opreturn`);
            return;
        }
        const method = 'create_broadcast';
        const params = {
            "source": this.state.address,
            "fee_fraction": 0.0,
            "text": this.state.text,
            "timestamp": Math.floor((new Date()).getTime() / 1000),
            "value": 0.0,
            "fee": Number(this.state.fee),
            "encoding": "opreturn",
            "allow_unconfirmed_inputs": true,
            "extended_tx_info": true
        };

        const response = await postLibApiProxy(method, params);
        alert(JSON.stringify({
            request: {
                method,
                params,
            },
            response,
        }, null, 4));
    }

    render() {
        let wallet_element_contents = null;
        // TODO
        wallet_element_contents = (
            <>
                <h3>Create unsigned transactions (<a href={`https://bitst.art/`} target="_blank">to later sign and broadcast</a>):</h3>
                <form onSubmit={this.handleSubmit}>
                    <p>Method:</p>
                    <select value="create_broadcast">
                        <option value="create_broadcast">create_broadcast</option>
                    </select>
                    <p>Params:</p>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    source:
                                </td>
                                <td>
                                    <input value={this.state.address} size={this.state.address.length} disabled />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    text:
                                </td>
                                <td>
                                    {/* TODO start correct styling with css */}
                                    <textarea rows="2" cols="55" style={{
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
                                <td>
                                    fee:
                                </td>
                                <td>
                                    <input type="text" size="8" value={this.state.fee} onChange={this.handleFeeChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <input type="submit" value="submit" />
                </form>
            </>
        );
        return (
            <>
                {wallet_element_contents}
            </>
        );
    }

}

export default withRouter(WalletCreate);
