import { FlexBox } from '@app/ui';
import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import PrimaryText from '../../PrimaryText';
import { useScreenTemplateState } from '../context';

type HeaderMiddleContentProps = {
  headerTitleFormatted?: string;
  middleContentFlex?: number;
  middleContent?: JSX.Element;
};

const HeaderMiddleContent: FC<HeaderMiddleContentProps> = ({
  headerTitleFormatted,
  middleContentFlex,
  middleContent,
}) => {
  const { middleContent: middleContentState } = useScreenTemplateState();
  return (
    <FlexBox
      flex={headerTitleFormatted ? 1 : middleContentFlex ?? 1}
      alignItems="center"
      paddingLeft={headerTitleFormatted ? 10 : 0}
      paddingRight={headerTitleFormatted ? 10 : 0}
      justifyContent={headerTitleFormatted ? 'flex-start' : 'center'}>
      {headerTitleFormatted ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <PrimaryText size="large" textTransform="capitalize">
            {headerTitleFormatted}
          </PrimaryText>
        </ScrollView>
      ) : (
        middleContentState || middleContent
      )}
    </FlexBox>
  );
};

export default HeaderMiddleContent;
