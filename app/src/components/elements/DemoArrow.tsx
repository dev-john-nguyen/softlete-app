import React, { useMemo } from 'react';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { FlexBox } from '@app/ui';
import { DemoStatePositions, DemoStates } from '@app/services';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';

type Props = {
  state: DemoStates[];
};

const DemoArrow: React.FC<Props> = ({ state = [] }) => {
  const { demo } = useSelector((state: ReducerProps) => ({
    demo: state.demo,
  }));

  const demoPos = useMemo(() => {
    return demo.state ? DemoStatePositions[demo.state] ?? {} : {};
  }, [demo]);

  if (!demo.state) return <></>;

  if (!state.find(s => s === demo.state)) return <></>;

  const { direction = 'down', arrowVisible = true, ...positions } = demoPos;

  if (!arrowVisible) return null;

  return (
    <FlexBox
      {...positions}
      zIndex={1000}
      position="absolute"
      backgroundColor={Colors.white}
      padding={6}
      borderRadius={100}
      borderWidth={1}
      borderColor={Colors.primary}>
      <Icon
        size={12}
        color={Colors.primary}
        icon="chevron"
        direction={direction}
      />
    </FlexBox>
  );
};

export default DemoArrow;
