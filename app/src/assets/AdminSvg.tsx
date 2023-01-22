import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.9999 16.62C17.6184 16.62 18.1199 16.1186 18.1199 15.5C18.1199 14.8814 17.6184 14.38 16.9999 14.38C16.3813 14.38 15.8799 14.8814 15.8799 15.5C15.8799 16.1186 16.3813 16.62 16.9999 16.62Z" />
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.9998 17.5C16.2698 17.5 14.8098 17.86 14.7598 18.58C15.2598 19.29 16.0798 19.75 16.9998 19.75C17.9198 19.75 18.7398 19.29 19.2398 18.58C19.1898 17.86 17.7298 17.5 16.9998 17.5Z" />
<path fill-rule="evenodd" clip-rule="evenodd" d="M18 11.09V6.27L10.5 3L3 6.27V11.18C3 15.72 6.2 19.97 10.5 21C11.05 20.87 11.58 20.68 12.1 20.45C13.18 21.99 14.97 23 17 23C20.31 23 23 20.31 23 17C23 14.03 20.84 11.57 18 11.09ZM11 17C11 17.56 11.08 18.11 11.23 18.62C10.99 18.73 10.75 18.84 10.5 18.92C7.33 17.92 5 14.68 5 11.18V7.58L10.5 5.18L16 7.58V11.09C13.16 11.57 11 14.03 11 17ZM17 21C14.79 21 13 19.21 13 17C13 14.79 14.79 13 17 13C19.21 13 21 14.79 21 17C21 19.21 19.21 21 17 21Z" />
</svg>`

interface Props {
    fillColor: string;
}

class AdminSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default AdminSvg