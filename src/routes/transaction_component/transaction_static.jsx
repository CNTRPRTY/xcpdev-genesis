import React from 'react';
import { Link } from "react-router-dom";

class TransactionStatic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            decoded_obj: props.decoded_obj, // TODO does not apply to dispenses (which could be mixed with any other transaction?)
        };
    }

    render() {

        // TODO: dispense

        let btcpay_element = null;
        let broadcast_element = null;

        // is btcpay (trying handling based only on cntrprty_decoded)
        if (this.state.decoded_obj.id === 11) {
            // if (this.state.decoded_id === 11) {
            const order_0 = this.state.decoded_obj.msg_decoded.order_0;
            const order_1 = this.state.decoded_obj.msg_decoded.order_1;
            // const order_0 = this.state.cntrprty_decoded.msg_decoded.order_0;
            // const order_1 = this.state.cntrprty_decoded.msg_decoded.order_1;
            btcpay_element = (
                <>
                    <h3>BTC pay:</h3>
                    <ul>
                        <li>tx0: <Link to={`/tx/${order_0}`}>{order_0}</Link></li>
                        <li>tx1: <Link to={`/tx/${order_1}`}>{order_1}</Link></li>
                    </ul>
                </>
            );
        }

        // is broadcast
        if (this.state.decoded_obj.id === 30) {
            // if (this.state.cntrprty_decoded.id === 30) {
            const text = this.state.decoded_obj.msg_decoded.text;
            // const text = this.state.cntrprty_decoded.msg_decoded.text;
            broadcast_element = (
                <>
                    <h3>Broadcast:</h3>
                    <textarea rows="2" cols="55" style={{
                        // https://stackoverflow.com/a/658197
                        'whiteSpace': "nowrap",
                        'overflow': "scroll",
                        'overflowY': "hidden",
                        'overflowX': "scroll",
                        'overflow': "-moz-scrollbars-horizontal",
                        // https://stackoverflow.com/a/5271803
                        'resize': 'horizontal',
                    }} value={text} readOnly />
                </>
            );
        }

        const transaction_element = (
            <>
                {/* these should be mutually exclusive, at least for now */}
                {btcpay_element}
                {broadcast_element}
            </>
        );

        return transaction_element;
    }

}

TransactionStatic.tx_type_ids = [
    11, // btcpay
    30, // broadcast
];

export default TransactionStatic;
