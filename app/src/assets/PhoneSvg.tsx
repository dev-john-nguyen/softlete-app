import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg  viewBox="0 0 13 22" xmlns="http://www.w3.org/2000/svg">
<path d="M10.5 0H2.5C1.12 0 0 1.12 0 2.5V19.5C0 20.88 1.12 22 2.5 22H10.5C11.88 22 13 20.88 13 19.5V2.5C13 1.12 11.88 0 10.5 0ZM6.5 21C5.67 21 5 20.33 5 19.5C5 18.67 5.67 18 6.5 18C7.33 18 8 18.67 8 19.5C8 20.33 7.33 21 6.5 21ZM11 17H2V3H11V17Z" />
</svg>`

interface Props {
    fillColor: string
}

class PhoneSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default PhoneSvg