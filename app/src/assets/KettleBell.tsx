import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = (strokeColor: string) => `<svg viewBox="0 0 397 512" xmlns="http://www.w3.org/2000/svg">
<path d="M109.209 126.06L109.208 126.06C99.5195 130.16 90.1836 134.886 81.2266 140.218C80.1447 133.741 79.5938 127.157 79.5938 120.488C79.5938 54.8792 132.973 1.5 198.582 1.5C264.191 1.5 317.57 54.8792 317.57 120.488C317.57 127.157 317.019 133.741 315.937 140.218C306.98 134.886 297.645 130.16 287.956 126.06L287.955 126.06C280.583 122.942 273.092 120.241 265.502 117.927C264.15 82.175 234.663 53.5 198.582 53.5C162.501 53.5 133.019 82.1747 131.666 117.927C124.071 120.238 116.581 122.942 109.209 126.06Z" stroke=${strokeColor} stroke-width="10"/>
<path d="M198.582 141.008C307.152 141.008 395.164 229.02 395.164 337.59C395.164 412.272 353.512 477.228 292.171 510.5H104.993C43.6486 477.228 2 412.272 2 337.59C2 229.02 90.012 141.008 198.582 141.008Z" stroke=${strokeColor} stroke-width="10"/>
</svg>`


interface Props {
    strokeColor: string;
    fillColor: string;
}

class KettleBell extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg(this.props.strokeColor)} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default KettleBell;