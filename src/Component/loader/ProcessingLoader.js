import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LoaderKit from 'react-native-loader-kit'


const ProcessingLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.modalContainer}>
      {visible && <LoaderKit style={{ width: 50, height: 50,}}
        name={'BallClipRotate'}
        size={50}
        color={'#0068b1'} />}
    </View>
  );
};

export default ProcessingLoader;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor:"white",
    justifyContent: 'center',
    alignItems: 'center',
  },
});
