import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.99984 8.16667C7.84079 8.16667 9.33317 6.67428 9.33317 4.83333C9.33317 2.99238 7.84079 1.5 5.99984 1.5C4.15889 1.5 2.6665 2.99238 2.6665 4.83333C2.6665 6.67428 4.15889 8.16667 5.99984 8.16667Z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 16.5V14.8333C1 13.9493 1.35119 13.1014 1.97631 12.4763C2.60143 11.8512 3.44928 11.5 4.33333 11.5H7.66667C8.55072 11.5 9.39857 11.8512 10.0237 12.4763C10.6488 13.1014 11 13.9493 11 14.8333V16.5" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.8335 8.16667L13.5002 9.83333L16.8335 6.5" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

interface Props {
    strokeColor: string
}

class PersonCheckSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.strokeColor} />
        )
    }
}

export default PersonCheckSvg