import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg  viewBox="0 0 39 48" xmlns="http://www.w3.org/2000/svg">
<path d="M13.991 40.976C13.991 44.638 11.022 47.607 7.36 47.607C3.698 47.607 0.729004 44.638 0.729004 40.976V6.631C0.729004 2.969 3.698 0 7.36 0C11.022 0 13.991 2.969 13.991 6.631V40.976Z" />
<path d="M38.8772 40.976C38.8772 44.638 35.9082 47.607 32.2462 47.607C28.5842 47.607 25.6152 44.638 25.6152 40.976V6.631C25.6162 2.969 28.5852 0 32.2462 0C35.9082 0 38.8772 2.969 38.8772 6.631V40.976Z" />
</svg>
`

interface Props {
    fillColor: string;
}

class PauseSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default PauseSvg