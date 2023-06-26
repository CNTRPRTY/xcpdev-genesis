import React from 'react';
import { withRouter } from './shared/classhooks';
import { postLibApiProxy } from '../api';

class WalletCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: props.address,
        };
    }

    render() {
        let wallet_element_contents = null;
        // TODO
        wallet_element_contents = (
            <>
                <h3>Create unsigned transactions here...</h3>
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
