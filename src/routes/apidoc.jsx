import React from 'react';
import { withRouter } from './shared/classhooks';
import { OneElements } from './shared/elements';
import { API_HOST } from '../api';

class Apidoc extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const url_latest_mempool = `${API_HOST}/mempool`;
        const url_latest_transactions = `${API_HOST}/transactions`;
        const url_latest_blocks = `${API_HOST}/blocks`;

        const url_transaction = `${API_HOST}/tx/685623401c3f5e9d2eaaf0657a50454e56a270ee7630d409e98d3bc257560098`;
        const url_block = `${API_HOST}/block/800000`;
        const url_block_messages = `${API_HOST}/block/800000/messages`;
        const url_address_balances = `${API_HOST}/address/1HbJtt8hm7TGd2DhHvxuw4BRdZsd2iuxYp/balances`;
        const url_address_broadcasts = `${API_HOST}/address/1HbJtt8hm7TGd2DhHvxuw4BRdZsd2iuxYp/broadcasts`;
        const url_asset = `${API_HOST}/asset/TEST`;
        const url_subasset = `${API_HOST}/subasset/OTHERWORLD.EarthEaters`;
        const url_asset_issuances = `${API_HOST}/asset/OLGA/issuances`;
        const url_asset_destructions = `${API_HOST}/asset/TWERK/destructions`;
        const url_asset_balances = `${API_HOST}/asset/DAILYSMOL/balances`;
        const url_asset_market_escrows_dispensers = `${API_HOST}/asset/DAILYSMOL/escrows/dispensers`;
        const url_market_tx_dispenser = `${API_HOST}/transactions/dispensers/f15fcbec8ecad50eef5455e40fc87a9d42c18dd1de5bb7bfd8c0a61d9bcaa254`;

        const latest_element = (
            <>
                <ul class="list-disc list-inside space-y-3">
                    {/* <ul class="list-disc list-inside"> */}
                    <li>
                        <span class="dark:text-slate-100">mempool:</span>
                        <br />
                        <span class="ml-4 whitespace-nowrap">
                            <a href={url_latest_mempool} target="_blank">{url_latest_mempool}</a>
                        </span>
                    </li>
                    <li>
                        <span class="dark:text-slate-100">transactions:</span>
                        <br />
                        <span class="ml-4 whitespace-nowrap">
                            <a href={url_latest_transactions} target="_blank">{url_latest_transactions}</a>
                        </span>
                    </li>
                    <li>
                        <span class="dark:text-slate-100">blocks:</span>
                        <br />
                        <span class="ml-4 whitespace-nowrap">
                            <a href={url_latest_blocks} target="_blank">{url_latest_blocks}</a>
                        </span>
                    </li>
                </ul>
            </>
        );

        const api_resource_element = (

            <>
                <div>
                    <ul class="list-disc list-inside space-y-3">
                        {/* <ul class="list-disc list-outside"> */}
                        {/* <ul class="list-disc list-inside"> */}
                        <li>
                            <span class="dark:text-slate-100">transaction:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_transaction} target="_blank">{url_transaction}</a>
                            </span>
                        </li>

                        <li>
                            <span class="dark:text-slate-100">block:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_block} target="_blank">{url_block}</a>
                            </span>
                        </li>

                        <li>
                            <span class="dark:text-slate-100">block messages:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_block_messages} target="_blank">{url_block_messages}</a>
                            </span>
                        </li>

                        <li>
                            <span class="dark:text-slate-100">address balances:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_address_balances} target="_blank">{url_address_balances}</a>
                            </span>
                        </li>

                        <li>
                            <span class="dark:text-slate-100">address broadcasts:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_address_broadcasts} target="_blank">{url_address_broadcasts}</a>
                            </span>
                        </li>

                        <li>
                            <span class="dark:text-slate-100">asset genesis:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_asset} target="_blank">{url_asset}</a>
                            </span>
                        </li>
                        <li>
                            <span class="dark:text-slate-100">asset genesis (longname):</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_subasset} target="_blank">{url_subasset}</a>
                            </span>
                        </li>

                        <li>
                            <span class="dark:text-slate-100">asset issuances:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_asset_issuances} target="_blank">{url_asset_issuances}</a>
                            </span>
                        </li>
                        <li>
                            <span class="dark:text-slate-100">asset destructions:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_asset_destructions} target="_blank">{url_asset_destructions}</a>
                            </span>
                        </li>
                        <li>
                            <span class="dark:text-slate-100">asset holders:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_asset_balances} target="_blank">{url_asset_balances}</a>
                            </span>
                        </li>
                        <li>
                            <span class="dark:text-slate-100">market: open asset dispensers:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_asset_market_escrows_dispensers} target="_blank">{url_asset_market_escrows_dispensers}</a>
                            </span>
                            {/* market open: asset dispensers: <a href={url_asset_market_escrows_dispensers} target="_blank">{url_asset_market_escrows_dispensers}</a> */}
                        </li>

                        <li>
                            <span class="dark:text-slate-100">market: dispenser info:</span>
                            <br />
                            <span class="ml-4 whitespace-nowrap">
                                <a href={url_market_tx_dispenser} target="_blank">{url_market_tx_dispenser}</a>
                            </span>
                            {/* market transaction: dispenser: <a href={url_market_tx_dispenser} target="_blank">{url_market_tx_dispenser}</a> */}
                        </li>

                    </ul>
                </div>
            </>

        );

        const route_element = (
            <div class="py-2 my-2">

                <h2 class="font-bold text-xl mb-1 overflow-auto">
                    xcp.dev API examples:
                </h2>

                <div class="py-1 my-1">
                    <h3 class="font-bold">
                        Latest data - Free OPEN GET access:
                    </h3>
                    <div class="py-1 my-1 ml-4 overflow-auto">
                        {latest_element}
                    </div>
                </div>

                <div class="py-1 my-1">
                    <h3 class="font-bold">
                        Resource data - Free *limited GET access:
                    </h3>
                    <div class="py-1 my-1 ml-4 overflow-auto">
                        {api_resource_element}
                    </div>
                    <div class="py-1 my-1 mt-2">
                        {/* <div class="py-1 my-1"> */}
                        <p class="dark:text-slate-100">
                            <strong>*limited</strong>: Result is temporarily cached before becoming available in a response. <a href={`https://github.com/CNTRPRTY/xcpdev-genesis/blob/13f9cd3bb8568cff292b1645259c7ee9838f5def/src/api.js#L21`} target="_blank">Just</a> repeat the request while the response is 'Accepted'.
                        </p>
                    </div>
                </div>

                <div class="py-1 my-1">
                    {/* <div class="py-1 my-1">
                        <p class="dark:text-slate-100">
                            <strong>*limited</strong>: Result is temporarily cached before becoming available in a response. <a href={`https://github.com/CNTRPRTY/xcpdev-genesis/blob/13f9cd3bb8568cff292b1645259c7ee9838f5def/src/api.js#L21`} target="_blank">Just</a> repeat the request while the response is 'Accepted'.
                        </p>
                    </div> */}
                    {/* <br /> */}
                    <div class="py-1 my-1">
                        <p class="dark:text-slate-100">
                            Thank you for participating in the xcp.dev API open beta testing, which is (for now) being offered for free without any guarantee. This is a work-in-progress.
                        </p>
                    </div>
                </div>

            </div>
        );

        return <OneElements route_element={route_element} />;

    }
}

export default withRouter(Apidoc);
