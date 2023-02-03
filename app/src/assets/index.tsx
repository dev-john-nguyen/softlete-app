/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { Pressable, StyleProp, View } from 'react-native';
import { moderateScale } from '@app/utils';

import { default as Chevron } from './ChevronSvg';
import { default as Checked } from './CheckedSvg';
import { default as Person } from './PersonSvg';
import { default as Heart } from './HeartSvg';
import { default as Notebook } from './NotebookSvg';
import { default as Graph } from './GraphSvg';
import { default as Upload } from './UploadSvg';
import { default as Logo } from './LogoSvg';
import { default as Signout } from './Signout';
import { default as Save } from './SaveSvg';
import { default as Calendar } from './CalendarSvg';
import { default as Network } from './NetworkSvg';
import { default as NetworkCheck } from './NetworkCheckSvg';
import { default as Candles } from './CandleSticksSvg';
import { default as Graph2 } from './Graph2Svg';
import { default as CrescentMoon } from './CrescentMoon';
import { default as Checkmark } from './CheckedSvg';
import { default as Ruler } from './RulerSvg';
import { default as FilterBars } from './FilterBarsSvg';
import { default as Dumbbell } from './DumbbellSvg';
import { default as Download } from './DownloadSvg';
import { default as Clock } from './ClockSvg';
import { default as Fire } from './FireSvg';
import { default as Compass } from './CompassSvg';
import { default as Ellipsis } from './MoreSvg';
import { default as Run } from './RunSvg';
import { default as Flag } from './Flag';
import { default as FlagFinish } from './FlagFinishSvg';
import { default as Pyramid } from './PyramidSvg';
import { default as Speed } from './SpeedSvg';
import { default as ZoomOut } from './ZoomOutSvg';
import { default as Close } from './CloseSvg';
import { default as Hide } from './HideSvg';
import { default as Mail } from './MailSvg';
import { default as Lock } from './LockSvg';
import { default as SendMail } from './SendMailSvg';
import { default as Info } from './InfoSvg';
import { default as TrashBin } from './TrashSvg';
import { default as Refresh } from './RefreshSvg';
import { default as Calculator } from './CalcSvg';
import { default as Pencil } from './PencilSvg';

const Icons = {
  chevron: (props: any) => <Chevron {...props} />,
  checked: (props: any) => <Checked {...props} />,
  person: (props: any) => <Person {...props} />,
  heart: (props: any) => <Heart {...props} />,
  notebook: (props: any) => <Notebook {...props} />,
  graph: (props: any) => <Graph {...props} />,
  upload: (props: any) => <Upload {...props} />,
  logo: (props: any) => (
    <Logo {...props} secondary={props.variant === 'secondary'} />
  ),
  signout: (props: any) => <Signout {...props} />,
  save: (props: any) => <Save {...props} />,
  calendar: (props: any) => <Calendar {...props} />,
  network: (props: any) => <Network {...props} />,
  network_check: (props: any) => <NetworkCheck {...props} />,
  candles: (props: any) => <Candles {...props} />,
  graph_two: (props: any) => <Graph2 {...props} />,
  crescent_moon: (props: any) => <CrescentMoon {...props} />,
  checkmark: (props: any) => <Checkmark {...props} />,
  ruler: (props: any) => <Ruler {...props} />,
  filter_bars: (props: any) => <FilterBars {...props} />,
  dumb_bell: (props: any) => <Dumbbell {...props} />,
  download: (props: any) => <Download {...props} />,
  clock: (props: any) => <Clock {...props} />,
  fire: (props: any) => <Fire {...props} />,
  compass: (props: any) => <Compass {...props} />,
  ellipsis: (props: any) => <Ellipsis {...props} />,
  run: (props: any) => <Run {...props} />,
  flag: (props: any) => <Flag {...props} />,
  speed: (props: any) => <Speed {...props} />,
  pyramid: (props: any) => <Pyramid {...props} />,
  flag_finish: (props: any) => <FlagFinish {...props} />,
  zoom_out: (props: any) => <ZoomOut {...props} />,
  close: (props: any) => <Close {...props} />,
  hide: (props: any) => <Hide {...props} />,
  mail: (props: any) => <Mail {...props} />,
  lock: (props: any) => <Lock {...props} />,
  send_mail: (props: any) => <SendMail {...props} />,
  info: (props: any) => <Info {...props} />,
  trash_bin: (props: any) => <TrashBin {...props} />,
  refresh: (props: any) => <Refresh {...props} />,
  calculator: (props: any) => <Calculator {...props} />,
  pencil: (props: any) => <Pencil {...props} />,
};

export type IconOptions = keyof typeof Icons;

type Props = {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  icon: IconOptions;
  size: number;
  strokeColor?: string;
  fillColor?: string;
  color?: string;
  direction?: string;
  opacity?: number;
  containerStyles?: StyleProp<any>;
  hitSlop?: number;
  variant?: 'secondary';
};

const Icon: FC<Props> = ({
  onPress,
  icon,
  size,
  opacity,
  containerStyles,
  hitSlop,
  onPressIn,
  onPressOut,
  ...props
}) => {
  if (onPress || onPressIn || onPressOut) {
    return (
      <Pressable
        hitSlop={hitSlop}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          opacity,
          ...(containerStyles || {}),
        }}>
        {Icons[icon]?.({ size: moderateScale(size), ...props })}
      </Pressable>
    );
  }

  return (
    <View
      style={{
        opacity,
        ...(containerStyles || {}),
      }}>
      {Icons[icon]?.({ size: moderateScale(size), ...props })}
    </View>
  );
};

export default Icon;
