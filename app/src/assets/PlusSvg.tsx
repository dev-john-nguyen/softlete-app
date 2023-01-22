import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
<path d="M7 1L7 13" stroke-width="2" stroke-linecap="round"/>
<path d="M13 7L1 7" stroke-width="2" stroke-linecap="round"/>
</svg>`

interface Props {
    strokeColor: string;
}

class PlusSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.strokeColor} />
        )
    }
}

export default PlusSvg