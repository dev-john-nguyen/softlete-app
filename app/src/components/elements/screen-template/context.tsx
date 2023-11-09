import React, { createContext, FC, useState, useContext } from 'react';

export type ScreenTemplateContext = {
  setMiddleContent: React.Dispatch<
    React.SetStateAction<JSX.Element | undefined>
  >;
  middleContent?: JSX.Element;
};

export const ScreenTemplateContext =
  createContext<null | ScreenTemplateContext>(null);

export const ScreenTemplateProvider: FC<{ children: JSX.Element[] }> = ({
  children,
}) => {
  const [middleContent, setMiddleContent] = useState<JSX.Element>();

  return (
    <ScreenTemplateContext.Provider value={{ middleContent, setMiddleContent }}>
      {children}
    </ScreenTemplateContext.Provider>
  );
};

export const useScreenTemplateState = () => {
  const state = useContext(ScreenTemplateContext);
  if (!state) throw new Error('cannot access screen template context');
  return state;
};
