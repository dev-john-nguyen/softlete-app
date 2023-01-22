import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
<path d="M3.00006 2H13.0001L7.99006 8.3L3.00006 2ZM0.250056 1.61C2.27006 4.2 6.00006 9 6.00006 9V15C6.00006 15.55 6.45006 16 7.00006 16H9.00006C9.55006 16 10.0001 15.55 10.0001 15V9C10.0001 9 13.7201 4.2 15.7401 1.61C16.2501 0.95 15.7801 0 14.9501 0H1.04006C0.210056 0 -0.259944 0.95 0.250056 1.61Z" />
</svg>`

interface Props {
    fillColor: string
}

class FilterSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default FilterSvg