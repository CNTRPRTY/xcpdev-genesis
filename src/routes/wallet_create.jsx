import React from 'react';
// import { withRouter } from './shared/classhooks';
import { postLibApiProxy } from '../api';

class WalletCreate extends React.Component {
    // class WalletCreateIssuance extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     selected_method: 'create_issuance',
        //     source: props.address,

        //     asset: '',
        //     quantity: 0,
        //     divisible: false, // protocol default is true
        //     description: '',
        //     transfer_destination: '', // protocol default is null (but empty string seems to be equivalent)

        //     fee: 0,
        //     // in_post: false,
        //     open_dialog_obj: null, // closed when null
        //     // open_dialog_message: null, // closed when null
        // };
        // this.handleSubmit = this.handleSubmit.bind(this);
        ///
        this.handleDialogCloseSubmit = this.handleDialogCloseSubmit.bind(this);
        ///

        // this.handleAssetChange = this.handleAssetChange.bind(this);
        // this.handleQuantityChange = this.handleQuantityChange.bind(this);
        // this.handleDivisibleChange = this.handleDivisibleChange.bind(this);
        // this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        // this.handleTransferDestinationChange = this.handleTransferDestinationChange.bind(this);

        this.handleFeeChange = this.handleFeeChange.bind(this);
    }

//     async handleSubmit(event) {
//         event.preventDefault();

//         const method = this.state.selected_method;
//         const params = {
//             "source": this.state.source,

//             "asset": this.state.asset,
//             "quantity": Number(this.state.quantity),
//             "divisible": this.state.divisible,
//             "description": this.state.description,
//             "transfer_destination": this.state.transfer_destination,

//             "fee": Number(this.state.fee),
//             "encoding": "opreturn",
//             "allow_unconfirmed_inputs": true,
//         };

//         const request = {
//             method,
//             params,
//         }

//         this.setState({ open_dialog_obj: {
//             dialog_state: 'loading',
//             request,
//         } });
//         // this.setState({ open_dialog_message: 'loading...' });
//         // this.setState({ in_post: true });
//         try {
//             const response = await postLibApiProxy(method, params);
//             if (response && response.lib_response && response.lib_response.result) {
// //                 const alert_message = `
// // succesSSSs! hex:
// // \n
// // ${response.lib_response.result}
// // \n
// // ${JSON.stringify({
// //                     response,
// //                     request,
// //                 }, null, 4)}`; // https://stackoverflow.com/a/17471151
//                 this.setState({ open_dialog_obj: {
//                     dialog_state: 'success',
//                     response,
//                     request,
//                 } });
//                 // this.setState({ open_dialog_message: alert_message });
//                 // alert(alert_message);
//             }
//             else {
//                 this.setState({ open_dialog_obj: {
//                     dialog_state: 'response',
//                     response,
//                     request,
//                 } });
//                 // this.setState({ open_dialog_message: JSON.stringify({
//                 //     response,
//                 //     request,
//                 // }, null, 4) });
//                 // alert(JSON.stringify({
//                 //     response,
//                 //     request,
//                 // }, null, 4));
//             }
//         }
//         catch (error) {
//             this.setState({ open_dialog_obj: {
//                 dialog_state: 'error',
//                 error: error.message,
//                 request,
//             } });
//             // this.setState({ open_dialog_message: JSON.stringify({
//             //     error: error.message,
//             //     request,
//             // }, null, 4) });
//             // alert(JSON.stringify({
//             //     error: error.message,
//             //     request,
//             // }, null, 4));
//         }
//         // this.setState({ in_post: false });
//     }

    async handleDialogCloseSubmit(event) {
        event.preventDefault();
        this.setState({ open_dialog_obj: null });
        // this.setState({ open_dialog_message: null });
    }


    // handleAssetChange(event) {
    //     this.setState({ asset: event.target.value });
    // }

    // handleQuantityChange(event) {
    //     this.setState({ quantity: event.target.value });
    // }

    // handleDivisibleChange(event) {
    //     this.setState({ divisible: event.target.value });
    // }

    // handleDescriptionChange(event) {
    //     this.setState({ description: event.target.value });
    // }

    // handleTransferDestinationChange(event) {
    //     this.setState({ transfer_destination: event.target.value });
    // }


    handleFeeChange(event) {
        this.setState({ fee: event.target.value });
    }

    renderDialogObj() {
        let success = null;
        if (this.state.open_dialog_obj.dialog_state === 'success') {
            success = (
                <>
                    <h3>hex:</h3>
                    {/* TODO reuse css */}
                    <textarea rows="2" cols="55"
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
                        value={this.state.open_dialog_obj.response.lib_response.result}
                        readOnly
                    />
                    {/* }} readOnly>{self.state.open_dialog_obj.response.lib_response.result}</textarea> */}
                </>
            )
        }
    
        let response = null;
        if (this.state.open_dialog_obj.dialog_state !== 'error') {
            response = (
                <>
                    <p>response: {JSON.stringify(this.state.open_dialog_obj.response)}</p>
                </>
            )
        }
        else { // === error (or loading)
            response = (
                <>
                    <p>error: {JSON.stringify(this.state.open_dialog_obj.error)}</p>
                </>
            )
        }
    
    
        const request = (
            <>
                <p>request: {JSON.stringify(this.state.open_dialog_obj.request)}</p>
            </>
        );
        // const request_message = JSON.stringify(self.state.open_dialog_obj.request);
        // const message = JSON.stringify(self.state.open_dialog_obj);
        return (
            <>
                <dialog open>
                    {/* <p>Greetings, one and all!</p> */}
                    <h2>{this.state.open_dialog_obj.dialog_state}</h2>
                    {success}
                    {/* nested terniary! (TODO magic string) */}
                    {this.state.open_dialog_obj.dialog_state !== 'loading' ?
                        (
                            <>
                                {response}
                                {request}
                            </>
                        ) :
                        null}
                    {/* <p>request: {request_message}</p> */}
                    {/* <p>{message}</p> */}
                    {/* <p>{this.state.open_dialog_message}</p> */}
                    <form method="dialog" onSubmit={this.handleDialogCloseSubmit}>
                        {/* nested terniary! (TODO magic string) */}
                        {this.state.open_dialog_obj.dialog_state !== 'loading' ?
                            // {this.state.open_dialog_message !== 'loading...' ?
                            (<button>ok</button>) :
                            null}
                        {/* <button>ok</button> */}
                    </form>
                </dialog>
            </>
        );
    }

    // render() {
    //     return (
    //         <>
    //             {/*  */}
    //             {this.state.open_dialog_obj ?
    //                 // {this.state.open_dialog_message ?
    //                 (this.renderDialogObj())
    //                 :
    //                 null}
    //             {/*  */}
    //             <form onSubmit={this.handleSubmit}>
    //                 <p>Params:</p>
    //                 <table>
    //                     <tbody>
    //                         <tr>
    //                             <td>
    //                                 source:
    //                             </td>
    //                             <td>
    //                                 <input value={this.state.source} size={this.state.source.length} disabled />
    //                             </td>
    //                         </tr>

    //                         <tr>
    //                             <td>
    //                                 asset:
    //                             </td>
    //                             <td>
    //                                 <input type="text" size="16" value={this.state.asset} onChange={this.handleAssetChange} />
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td>
    //                                 quantity:
    //                             </td>
    //                             <td>
    //                                 <input type="text" size="8" value={this.state.quantity} onChange={this.handleQuantityChange} />
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td>
    //                                 divisible:
    //                             </td>
    //                             <td>
    //                                 <select value={this.state.divisible} onChange={this.handleDivisibleChange}>
    //                                     <option value={false}>false</option>
    //                                     <option value={true}>true (satoshi)</option>
    //                                 </select>
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td>
    //                                 description:
    //                             </td>
    //                             <td>
    //                                 {/* TODO styling with css file */}
    //                                 <textarea rows="2" cols="55" style={{
    //                                     // https://stackoverflow.com/a/658197
    //                                     'whiteSpace': "nowrap",
    //                                     'overflow': "scroll",
    //                                     'overflowY': "hidden",
    //                                     'overflowX': "scroll",
    //                                     'overflow': "-moz-scrollbars-horizontal",
    //                                     // https://stackoverflow.com/a/5271803
    //                                     'resize': 'horizontal',
    //                                 }} onChange={this.handleDescriptionChange}></textarea>
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td>
    //                                 transfer_destination:
    //                             </td>
    //                             <td>
    //                                 <input type="text" size="16" value={this.state.transfer_destination} onChange={this.handleTransferDestinationChange} />
    //                             </td>
    //                         </tr>

    //                         <tr>
    //                             <td>
    //                                 fee:
    //                             </td>
    //                             <td>
    //                                 <input type="text" size="8" value={this.state.fee} onChange={this.handleFeeChange} />
    //                             </td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //                 <br />
    //                 <input type="submit" value="submit" disabled={this.state.open_dialog_obj !== null} />
    //                 {/* <input type="submit" value="submit" disabled={this.state.open_dialog_message !== null} /> */}
    //                 {/* <input type="submit" value="submit" disabled={this.state.in_post} /> */}
    //             </form>
    //         </>
    //     );
    // }

}

export default WalletCreate;
// export default withRouter(WalletCreateIssuance);
