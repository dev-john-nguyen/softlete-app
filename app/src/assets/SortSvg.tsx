import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg  viewBox="0 0 24 12"  xmlns="http://www.w3.org/2000/svg">
<path d="M19.53 6.01L19.99 6.47L15.46 11H15V10.54L19.53 6.01ZM21.33 3C21.205 3 21.075 3.05 20.98 3.145L20.065 4.06L21.94 5.935L22.855 5.02C23.05 4.825 23.05 4.51 22.855 4.315L21.685 3.145C21.585 3.045 21.46 3 21.33 3ZM19.53 4.595L14 10.125V12H15.875L21.405 6.47L19.53 4.595Z" />
<path d="M16.5 5.01L0 5V7H16.5V5.01ZM0 10H12V12H0V10ZM18 0H0V2.01L18 2V0Z" />
</svg>`

interface Props {
    fillColor: string;
}

class SortSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default SortSvg