import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.41659 3.5C3.30411 4.43938 2.50714 5.6979 2.13356 7.10519C1.75999 8.51249 1.82785 10.0006 2.32796 11.368C2.82808 12.7355 3.73629 13.9162 4.92965 14.7505C6.12301 15.5847 7.54389 16.0321 8.99992 16.0321C10.456 16.0321 11.8768 15.5847 13.0702 14.7505C14.2635 13.9162 15.1718 12.7355 15.6719 11.368C16.172 10.0006 16.2399 8.51249 15.8663 7.10519C15.4927 5.6979 14.6957 4.43938 13.5833 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 1.66666V8.99999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

interface Props {
    strokeColor: string;
}

class LogoutSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.strokeColor} />
        )
    }
}

export default LogoutSvg