import React from 'react';
import { Animated } from 'react-native';
import { MotionProps } from '../index';
import { values } from 'ramda';

class Motion extends React.Component<MotionProps> {
  static defaultProps = {
    doNotUseNativeDriver: false,
    imperative: false,
    onAnimationEnd: null,
    listeners: {},
  };

  animatedValues: any = {};
  animation: any;

  constructor(props: MotionProps) {
    super(props);

    const {
      animatedValues,
      onAnimationEnd,
      imperative,
      listeners = {},
      doNotUseNativeDriver,
    } = props;
    // @ts-ignore
    const keys = Object.keys(animatedValues);
    // @ts-ignore
    const animations: Array<any> = [];
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
            // @ts-ignore
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

  componentWillReceiveProps(nextProps: MotionProps) {
    const {
      animatedValues,
      onAnimationEnd,
      imperative,
      doNotUseNativeDriver,
    } = nextProps;
    // @ts-ignore
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
    values(this.animatedValues).forEach((animatedValue: Animated.Value) =>
      animatedValue.removeAllListeners(),
    );
  }

  render() {
    const { children } = this.props;

    return React.Children.only(children(this.animatedValues, this.animation));
  }
}

export default Motion;
