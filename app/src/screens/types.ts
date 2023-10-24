import { UserProps } from '../services/user/types';

export type IndexStackParamsList = {
  SettingsStack: UserProps;
  HomeStack: UserProps | undefined;
  SignIn: undefined;
  Init: undefined;
  NewUserAdvise: undefined;
  NetworkStack: undefined;
  VerifyEmail: undefined;
  HelpStack: undefined;
  About: undefined;
  ProgramStack: undefined;
};

export enum IndexStackList {
  SettingsStack = 'SettingsStack',
  ProgramStack = 'ProgramStack',
  HomeStack = 'HomeStack',
  NewUserAdvise = 'NewUserAdvise',
  Init = 'Init',
  NetworkStack = 'NetworkStack',
  VerifyEmail = 'VerifyEmail',
  HelpStack = 'HelpStack',
  About = 'About',
  SignIn = 'SignIn',
}
