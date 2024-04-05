import React from 'react';
import { withRouter } from './shared/classhooks';
import { ListElements } from './shared/elements';

class WalletBalances extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.address,
            balances: props.balances,
        };
    }

    render() {

        let wallet_element_contents = null;

        if (this.state.balances && !this.state.balances.length) {
            wallet_element_contents = (
                <p class="text-gray-600 dark:text-gray-400">
                    no balances for address
                </p>
            );
        }

        // BUT not having results can be moved here!...
        // which should always be the case now
        else if (this.state.balances && this.state.balances.length) {
            function balancesSort(a, b) {
                if (b.quantity === a.quantity) {
                    const mainname_a = a.asset_longname ? a.asset_longname : a.asset;
                    const mainname_b = b.asset_longname ? b.asset_longname : b.asset;
                    if (mainname_a < mainname_b) {
                        return -1;
                    }
                    if (mainname_a > mainname_b) {
                        return 1;
                    }
                    return 0;
                }
                else {
                    return b.quantity - a.quantity;
                }
            };

            const address_balances_element = (
                <>
                    <table>
                        <tbody>
                            {ListElements.getTableRowBalanceAddressHeader()}
                            {this.state.balances.sort(balancesSort).map((balances_row, index) => {
                                return ListElements.getTableRowBalanceAddress(balances_row, index);
                            })}
                        </tbody>
                    </table>
                </>
            );

            wallet_element_contents = (
                <>
                    <div class="whitespace-nowrap overflow-auto">
                        <h3>
                            Assets balance (sorted by most units on top, then alphabetically):
                        </h3>
                        <div class="py-1 my-1">
                            {address_balances_element}
                        </div>
                    </div>
                </>
            );

        }

        return (
            <>
                {wallet_element_contents}
            </>
        );

    }

}

export default withRouter(WalletBalances);
// export default withRouter(Wallet);
