import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.204 7.79601L16 6C16.5453 5.45475 16.8179 5.18213 16.9636 4.88803C17.2409 4.32848 17.2409 3.67153 16.9636 3.11197C16.8179 2.81788 16.5453 2.54525 16 2C15.4548 1.45475 15.1821 1.18213 14.888 1.03639C14.3285 0.75911 13.6715 0.75911 13.112 1.03639C12.8179 1.18213 12.5453 1.45475 12 2L10.1814 3.81866C11.1452 5.46926 12.5314 6.84482 14.204 7.79601ZM8.7269 5.27312L1.8564 12.1436C1.43134 12.5687 1.21881 12.7812 1.07907 13.0423C0.939336 13.3034 0.88039 13.5981 0.7625 14.1876L0.147104 17.2646C0.0805817 17.5972 0.0473206 17.7635 0.141929 17.8581C0.236537 17.9527 0.402842 17.9194 0.735452 17.8529L3.81243 17.2375C4.40189 17.1196 4.69661 17.0607 4.95771 16.9209C5.21881 16.7812 5.43134 16.5687 5.8564 16.1436L12.7458 9.25422C11.1241 8.23857 9.75244 6.87628 8.7269 5.27312Z" />
</svg>
`;

interface Props {
  fillColor?: string;
  color?: string;
  size?: string;
}

class PencilSvg extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        fill={this.props.color || this.props.fillColor}
      />
    );
  }
}

export default PencilSvg;
