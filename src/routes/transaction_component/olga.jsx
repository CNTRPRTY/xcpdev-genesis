import React from 'react';
import { Link } from "react-router-dom";

function getOlgaDataUrl(olga_text) {
    const data_url_chain = `${'data:image'}${olga_text.split('data:image')[1]}`;
    return data_url_chain;
}

class Olga extends React.Component {

    constructor(props) {
        super(props);

        const olga_text = props.olga_text;
        const data_url_chain = getOlgaDataUrl(olga_text);
        const olga_length = data_url_chain.length;

        this.state = {
            olga_text,
            olga_length,
            olga_chars_cut: 0,
        };
        this.handleRange = this.handleRange.bind(this);
    }

    handleRange(event) {
        // back to chars cut
        // event.target.value ={data_url_chain.length - this.state.olga_chars_cut}
        this.setState((prevState, props) => ({
            olga_chars_cut: this.state.olga_length - event.target.value
        }));
    }

    render() {
        
        const data_url_chain = getOlgaDataUrl(this.state.olga_text);

        let data_url_cut; // making copies of both

        if (this.state.olga_chars_cut) {
            data_url_cut = data_url_chain.slice(0, -this.state.olga_chars_cut);
        }
        else {
            data_url_cut = data_url_chain.slice();
        }

        // https://github.com/CNTRPRTY/xcpdev/commit/c7e1abd5bfc2a595bc70f86e14f7abdd91d787a6#r98715058
        const source_fix = "XzkBVJ+7LLFsvw/8VIX1OE5OPsAAAAASUVORK5CYII=";
        const data_url_chain_fixed = `${data_url_chain}${source_fix}`;

        const notreverse = [...data_url_cut]; // making both arrays for consistency
        const reverse = [...data_url_cut].reverse(); // https://stackoverflow.com/a/57569141

        const olga_element = (
            <>
                <h3>Honoring <Link to={`/asset/OLGA`}>OLGA</Link></h3>
                <img src={data_url_chain_fixed} />
                <p>Image *written* in Bitcoin since 2015</p>

                <input
                    type="range"
                    min="0" max={data_url_chain.length}
                    value={data_url_chain.length - this.state.olga_chars_cut}
                    onChange={this.handleRange}
                    step="1"
                />

                <br />
                *<a href={`https://github.com/CNTRPRTY/xcpdev/commit/c7e1abd5bfc2a595bc70f86e14f7abdd91d787a6#r98710211`} target="_blank">on chain only</a>* image *can* be seen below, use slider (works on desktop)

                <br />
                <br />
                <img src={`${data_url_cut}=`} style={{ width: "200px" }} />
                <br />
                reverse:{' '}
                [{reverse.join('')}]
                <br />
                esrever:{' '}
                [{notreverse.join('')}]
            </>
        );

        return olga_element;
    }

}

Olga.broadcast_tx_hash = "627ae48d6b4cffb2ea734be1016dedef4cee3f8ffefaea5602dd58c696de6b74";

export default Olga;
