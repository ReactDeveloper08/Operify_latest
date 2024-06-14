import React, {Component} from 'react';
import {View, StyleSheet, Animated, Text, Image} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KEYS, getData } from '../../api/User_Preference';
// Import your logo image
import logo from '../../Assets/applogo.png';
class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoOpacity: new Animated.Value(0), // Initial opacity of logo
      logoScale: new Animated.Value(0.85), // Initial scale of logo
      logoSource: null, // State to hold the logo URL
    };
  }

  componentDidMount() {
    this.splash();
    // Animation configuration
    const animationConfig = {
      toValue: 1, // Final value of opacity
      duration: 2000, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use native driver for performance
    };

    // Sequence of animations
    Animated.timing(this.state.logoOpacity, {
      ...animationConfig,
      delay: 500, // Adding delay to match the spring animation in the previous implementation
    }).start();

    Animated.spring(this.state.logoScale, {
      toValue: 1,
      friction: 1,
      useNativeDriver: true,
    }).start();
  }

  splash = async () => {
    try {
      const info = await getData(KEYS.USER_INFO);
      console.log('Fetched user info:', info);
  
      if (info && info.logo) {
        console.log('Using fetched logo:', info.logo);
        this.setState({ logoSource: { uri: info.logo } });
      } else {
        console.log('Using default logo');
        this.setState({ logoSource: logo });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      console.log('Using default logo due to error');
      this.setState({ logoSource: logo });
    }
  }
  


  render() {
    const { logoOpacity, logoScale, logoSource } = this.state;

    return (
      <View style={styles.container}>
        {logoSource && (
          <Animated.Image
            source={logoSource}
            style={[
              styles.logo,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
            resizeMode="cover"
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: wp(60),
    height: wp(60),
    marginLeft: wp(2.5),
    resizeMode: 'contain',
  },
});

export default SplashScreen;
