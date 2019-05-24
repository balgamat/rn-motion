import React from 'react';
import { Animated } from 'react-native';
import { ReactNodeType } from './motionTypes';
import { values } from 'ramda';

export type MotionValueType = { [key: string]: Animated.Value };
export type StartParameterType = () => void;

export type Listener = (animatedValue: { value: number }) => void;

type PropsType = {
  onAnimationEnd?: null | (() => void);
  animatedValues: any;
  imperative?: boolean;
  doNotUseNativeDriver?: boolean;
  listeners: { [key: string]: Listener };
  children: (
    animatedValues: MotionValueType,
    animation: Animation,
  ) => ReactNodeType;
};

class Motion extends React.Component<PropsType> {
  static defaultProps = {
    doNotUseNativeDriver: false,
    imperative: false,
    onAnimationEnd: null,
    listeners: {},
  };

  animatedValues: any = {};
  animation: any;

  constructor(props: PropsType) {
    super(props);

    const {
      animatedValues,
      onAnimationEnd,
      imperative,
      listeners,
      doNotUseNativeDriver,
    } = props;
    const keys = Object.keys(animatedValues);
    const animations: any[] = [];
    this.animatedValues = keys.reduce((acc: any, key: string) => {
      const {
        method = Animated.spring,
        defaultValue,
        toValue,
        ...options
      } = animatedValues[key];
      acc[key] = new Animated.Value(defaultValue);
      if (listeners[key]) {
        acc[key].addListener(listeners[key]);
      }
      if (defaultValue !== toValue) {
        animations.push(
          method(acc[key], {
            toValue,
            useNativeDriver: !Boolean(doNotUseNativeDriver || false),
            ...options,
          }),
        );
      }
      return acc;
    }, {});

    this.animation = Animated.parallel(animations);

    if (animations.length && !imperative) {
      this.animation.start(onAnimationEnd);
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const {
      animatedValues,
      onAnimationEnd,
      imperative,
      doNotUseNativeDriver,
    } = nextProps;
    const keys = Object.keys(animatedValues);
    const animations = keys.map((key: string) => {
      const {
        defaultValue,
        toValue,
        method = Animated.spring,
        ...options
      } = animatedValues[key];
      return method(this.animatedValues[key], {
        toValue,
        useNativeDriver: !doNotUseNativeDriver,
        ...options,
      });
    });

    this.animation = Animated.parallel(animations);
    if (!imperative) {
      this.animation.start(onAnimationEnd);
    }
  }

  componentWillUnmount() {
    values(this.animatedValues).forEach(animatedValue =>
      animatedValue.removeAllListeners(),
    );
  }

  render() {
    const { children } = this.props;

    return React.Children.only(children(this.animatedValues, this.animation));
  }
}

export default Motion;
