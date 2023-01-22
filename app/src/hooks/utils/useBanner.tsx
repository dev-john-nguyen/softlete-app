import { useDispatch } from 'react-redux';
import { setBanner } from 'src/services/banner/actions';
import { BannerTypes } from 'src/services/banner/types';

const useBanner = () => {
  const dispatch = useDispatch();
  return (
    message: string,
    type: BannerTypes = BannerTypes.default,
    duration?: number,
  ) => {
    dispatch(setBanner(type, message, duration ? 1000 / duration : undefined));
  };
};

export default useBanner;
