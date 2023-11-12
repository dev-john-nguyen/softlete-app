import { Colors, rgba } from '@app/utils';
import { StyleSheet } from 'react-native';
import { normalize } from '../../utils/tools';
import StyleConstants from '../tools/StyleConstants';

const modalStyles = StyleSheet.create({
  container: {
    backgroundColor: `rgba(0, 0, 0 ,.7)`,
    flex: 1,
  },
  backContainer: {
    width: normalize.width(25),
    height: normalize.width(25),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: StyleConstants.smallMargin,
    marginTop: StyleConstants.smallMargin,
  },
  back: {
    fontSize: StyleConstants.extraSmallFont,
    color: Colors.black,
  },
  loading: {
    position: 'absolute',
    top: '10%',
    right: '5%',
  },
  close: {
    width: normalize.width(25),
    height: normalize.width(25),
    marginLeft: StyleConstants.baseMargin,
  },
  content: {
    margin: StyleConstants.baseMargin,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  closeContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 0,
    backgroundColor: rgba(Colors.primaryRgb, 0.5),
  },
  modal: {
    borderColor: Colors.white,
    borderWidth: 1,
    backgroundColor: Colors.lightPrimary,
    padding: StyleConstants.baseMargin,
    borderRadius: 5,
  },
  title: {
    fontSize: StyleConstants.smallMediumFont,
    color: Colors.primary,
    textAlign: 'center',
  },
  svg: {
    height: normalize.width(25),
    width: normalize.width(25),
  },
  item: {
    backgroundColor: rgba(Colors.whiteRbg, 0.1),
    borderColor: Colors.white,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: normalize.width(2.5),
    flexWrap: 'wrap',
    borderRadius: 100,
  },
  label: {
    fontSize: StyleConstants.smallerFont,
    color: Colors.black,
  },
});

export default modalStyles;
