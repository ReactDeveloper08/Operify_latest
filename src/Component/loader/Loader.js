import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LoaderKit from 'react-native-loader-kit'
 


const CustomLoader = () => ( 
    <View style={styles.container}>
    <LoaderKit style={{ width: 50, height: 50 }}
        name={'BallClipRotate'}
        size={50}
        color={'#0068b1'} />
    </View>
   
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomLoader;