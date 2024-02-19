import React from 'react'
import { Text, StyleSheet  } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";

export default function Loader(props) {
  return <AnimatedLoader
        visible={props.visible}
        overlayColor="rgba(255,255,255,0.8)"
        source={require('.././assets/json/loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text>Please wait...</Text>
      </AnimatedLoader>
  
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200
  }
});