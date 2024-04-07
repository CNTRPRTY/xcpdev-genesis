import React from 'react';
import { Link } from "react-router-dom";
import Olga from './olga';

class TransactionStatic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tx_hash: props.tx_hash,
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
                    <h3 class="font-bold text-xl mb-1">
                        BTC pay:
                    </h3>
                    {/* <h3>BTC pay:</h3> */}
                    <div class="py-1 my-1 ml-4 whitespace-nowrap overflow-auto">
                        {/* <div class="py-1 my-1 ml-4"> */}
                        {/* <div class="py-1 my-1"> */}
                        <ul>
                            {/* <ul class="list-disc list-inside"> */}

                            <li>
                                <span class="text-gray-600 dark:text-gray-400">tx0:</span>
                                {' '}
                                <span class="dark:text-slate-100"><Link to={`/tx/${order_0}`}>{order_0}</Link></span>
                            </li>
                            <li>
                                <span class="text-gray-600 dark:text-gray-400">tx1:</span>
                                {' '}
                                <span class="dark:text-slate-100"><Link to={`/tx/${order_1}`}>{order_1}</Link></span>
                            </li>

                            {/* <li>tx0: <Link to={`/tx/${order_0}`}>{order_0}</Link></li>
                            <li>tx1: <Link to={`/tx/${order_1}`}>{order_1}</Link></li> */}
                        </ul>
                    </div>
                </>
            );
        }

        // is broadcast
        if (this.state.decoded_obj.id === 30) {
            // if (this.state.cntrprty_decoded.id === 30) {
            const text = this.state.decoded_obj.msg_decoded.text;
            // const text = this.state.cntrprty_decoded.msg_decoded.text;

            // is olga?
            let olga_element = null;
            if (this.state.tx_hash === Olga.broadcast_tx_hash) {
                olga_element = (
                    <div class="pb-1 mb-1">
                        {/* <div class="py-1 my-1"> */}
                        <Olga olga_text={text} />
                    </div>
                );
                // olga_element = <Olga olga_text={text} />;
            }

            broadcast_element = (
                <>
                    {/* non protocol / manual connection to the tx (but SHOULD still be on-chain based) */}
                    {olga_element}

                    <h3 class="font-bold text-xl mb-1">
                        Broadcast:
                    </h3>
                    {/* <h3>Broadcast:</h3> */}
                    <div class="py-1 my-1 ml-4 whitespace-nowrap overflow-auto">
                        {/* <div class="py-1 my-1 ml-4"> */}
                        {/* <div class="py-1 my-1"> */}
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
                            value={text}
                            readOnly
                        />
                    </div>
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
