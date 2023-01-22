export enum BannerTypes {
  warning = 'warning',
  default = 'default',
  error = 'error',
  success = 'success',
}

export type BannerProps = {
  msg: string;
  type: string;
  duration?: number;
  id: string;
};

export interface BannersProps {
  banners: BannerProps[];
}

export interface BannerActionsProps {
  setBanner: (type: BannerTypes, msg: string, duration?: number) => void;
}
