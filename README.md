# React-Motion

> Declarative animation using React-native's Animated API under the hood.

## Features
1. Motion component

## Usage
> Intended use is to wrap components in order to animate them.

## Implementation example

This component is used to wrap the content which needs to be animated. Component state or parent props can be used to control the flow of animation. Or if `imperative` prop is passed the start of animation could be controlled imperatively via the `animation.start()` function.
Provided props:

* `animatedValues` — used for describing animation(s)
* `animatedContent` — function which renders the component which need to be animated. It is like regular render function but it also receives animated values which should be used in styles in order to do the actual animiation.
* `imperative` - boolean, if set to true it doesn't start animation automatically, but gives you animation reference so it can be controlled when the animation starts. Usualy used when you want to start animation in a saga.
* `onAnimationEnd` - Callback which gets called when animation ends.

API structure for animations definition is shown bellow:

**Example - simple translation animation which is triggered on button press**

```js
import { Motion } from 'utils/motion';
import { Animated } from 'react-native';
...

const AnimatedButton = () => (
    <Motion animatedValues={{ translateX: { defaultValue: 0, toValue: this.state.buttonState ? 200 : 0 } }}>
      {(values: MotionType, _animation: *) => (
          <Animated.View style={{ transform: [{ translateX: values.translateX }] }}>
            <Button
                onPress={() => this.setState({ buttonState: false })}
                onPressIn={() => this.setState({ buttonState: true })}
                style={styles.button}
            >
              <Text>Start the animation!!</Text>
            </Button>
          </Animated.View>
      )}
    </Motion>
);

export default AnimatedButton
```

**Example - combined set of animations for pressIn and pressOut states**
```js
import { Animated, Easing } from 'react-native';
import { Motion, type MotionValueType } from '@addison-global/animation';

type StateType = {|
    buttonAnimationState: boolean,
|};

constructor(props: FooterButtonPropType) {
    super(props);
    this.state = {
        buttonAnimationState: false,
    };
}

<Motion
  animatedValues={{
      scaleAsdf: {
          method: Animated.timing,
          defaultValue: 1,
          toValue: this.state.buttonAnimationState ? 0.6 : 1,
          easing: this.state.buttonAnimationState ?
              Easing.bezier(0.25, 0.1, 0.25, 1) :
              Easing.elastic(3),
          duration: this.state.buttonAnimationState ? 100 : 300,
      },
      rotateBsdf: {
          method: Animated.timing,
          defaultValue: 0,
          toValue: this.state.buttonAnimationState ? 1 : 0,
          easing: this.state.buttonAnimationState ?
              Easing.bezier(0.25, 0.1, 0.25, 1) :
              Easing.elastic(3),
          duration: this.state.buttonAnimationState ? 100 : 300,
      },
  }}
>
  {({ scaleAsdf, rotateBsdf }: MotionValueType) => (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAsdf },
          {
            rotate: rotateBsdf.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '10deg'] }),
          },
        ],
      }}
    >
      <FooterIcon icon={icon} isActive={isActive} isSearch={isSearch} />
      <Button
        onPress={() => this.setState({ buttonAnimationState: !this.state.buttonAnimationState })}
      >
        <Text>Start the animation!</Text>
      </Button>
    </Animated.View>
  )}
</Motion>
```
