import { ReactNode } from 'react';
import { Animated } from 'react-native';
import React from 'react';

// @ts-ignore
export type ArrayType = Array<any>;
export type ScrollType = number | void;
export type ReactNodeType = ReactNode;
export type StyleType = { [key: string]: string | number | StyleType };
export type ClassNameType = { [key: string]: boolean };
// @ts-ignore
export type TabsContentType = Array<{ header: string; content: ReactNodeType }>;
export type MotionValueType = {
  // @ts-ignore
  [key: string]: Animated.Value;
};
export type StartParameterType = () => void;
export type Listener = (animatedValue: { value: number }) => void;
export type MotionProps = {
  onAnimationEnd?: null | (() => void);
  animatedValues: any;
  imperative?: boolean;
  doNotUseNativeDriver?: boolean;
  listeners?: { [key: string]: Listener };
  children: (
    animatedValues: MotionValueType,
    animation: any,
  ) => ReactNodeType;
};

declare class Motion extends React.Component<MotionProps> {}

declare module 'react-motion' {}

export default Motion;
