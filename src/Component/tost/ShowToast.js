import Toast from 'react-native-root-toast';

export  const showToast = (message) =>
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    containerStyle: { backgroundColor: '#0068b1',borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    textStyle: { color: 'white', fontWeight: '400' }

  });

  export default showToast;