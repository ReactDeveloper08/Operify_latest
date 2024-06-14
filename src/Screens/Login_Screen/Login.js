import React, { Component } from 'react';
import { Text, TextInput, Image, View, TouchableOpacity, Keyboard, Alert, SafeAreaView, TouchableWithoutFeedback, ImageBackground, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import { KEYS, storeData,getData } from '../../api/User_Preference';
import { getUniqueId } from 'react-native-device-info';
// Import your logo image
import logo from '../../Assets/applogo.png';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      showProcessingLoader: false,
      showPassword: false,
      isLoading: false,
      logoSource: null
    };
  }
  async componentDidMount() {
    try {
      const info = await getData(KEYS.USER_INFO);
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

  handleLogin = async () => {
    try {
      const { mobile, password } = this.state;
      Keyboard.dismiss();
  
      // Validation
      if (!mobile && !password) {
        Alert.alert('Please enter your mobile number and password.');
        return;
      }
      if (!mobile) {
        Alert.alert('Please enter your mobile number.');
        return;
      }
      if (!/^\d{10}$/.test(mobile)) {
        Alert.alert('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!password) {
        Alert.alert('Please enter your password.');
        return;
      }
  
      this.setState({ showProcessingLoader: true });
  
      let uniqueId = getUniqueId();
      const params = { mobile, password, device_id: uniqueId };
      console.log('mobile_params', params);
  
      const response = await makeRequest(BASE_URL + '/mobile/login', params);
      console.log('login response', response);
  
  const { success,output} = response;
  
      if (success) {
        const {mobile, message, erpID, company_name, userId, deviceId: device_id, logo,authToken}=output
        console.log('fewfewf',output)
        // Store data including device ID
        const userInfo = { mobile, message, erpID, company_name, userId, deviceId: device_id, logo, authToken };
        console.log('Storing userInfo:', userInfo);
  
        // Attempt to store userInfo and catch any errors
        try {
          await storeData(KEYS.USER_INFO, userInfo);
          console.log('Successfully stored userInfo');
        } catch (storeError) {
          console.error('Error storing userInfo:', storeError);
        }
  
        // Navigate to the appropriate screen
        this.setState({ showProcessingLoader: false });
       
        this.props.navigation.navigate('mytab', { mobile, userId: userId });
        this.setState({ mobile: '', password: '', showProcessingLoader: false });
      } else {
        Alert.alert(message);
        this.setState({ showProcessingLoader: false });
      }
  
    } catch (error) {
      Alert.alert('Invalid Login Details.');
      this.setState({ showProcessingLoader: false });
    }
  };
  

  handleMobileLogin = (text) => {
    this.setState({ mobile: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  toggleShowPassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  };

  // handleForget = () => {
  //   try {
  //     this.props.navigation.navigate('forget')
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  render() {
    const {logoSource}= this.state;
    const { showProcessingLoader } = this.state;
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <SafeAreaView style={{ flex: 1, padding: wp(2) }}>

          <View style={{ flex: 1, top: wp(-5) }}>
            <View style={Styles.logo}>
              <Image source={logoSource}
                style={{ width: wp(40), height: wp(40) }} resizeMode='contain' />
            </View>

            <View style={Styles.welcomeText}>
              <Text style={{
                fontWeight: '700',
                color: '#000000',
                letterSpacing: wp(0.4),
                fontSize: wp(5.5),
                textAlign: 'center'
              }}>Hello Again!</Text>

              <Text style={{
                fontWeight: '500',
                color: '#383838',
                letterSpacing: wp(0.3),
                fontSize: wp(3.5),
                textAlign: 'center',
                marginTop: wp(2)
              }}>
                It's great to have you back! please log in to access your account.
              </Text>

            </View>

          </View>

          <View style={{ flex: 2, alignSelf: 'center' }}>
            {/*  login and password textinput  */}
            <View style={{ marginTop: wp(8) }}>

              <Text style={{
                fontWeight: '500',
                color: '#000000',
                letterSpacing: wp(0.4),
                fontSize: wp(4),
              }}>Mobile</Text>

              <View style={{
                overflow: 'hidden',
                borderRadius: wp(3),
                backgroundColor: '#E0E0E0',
                width: hp(45),
                height: wp(11.2),
                alignSelf: 'center',
                marginTop: wp(1.5)
              }}>
                <TextInput
                  placeholder='Enter mobile number'
                  placeholderTextColor='#757575'
                  keyboardType='number-pad'
                  maxLength={10}
                  value={this.state.mobile}
                  onChangeText={this.handleMobileLogin}

                  style={{
                    paddingLeft: wp(3.5),
                    fontSize: wp(3.5),
                    fontWeight: '400',
                    color: '#757575',
                  }} />
              </View>
            </View>


            <View style={{ marginTop: wp(8) }}>

              <Text style={{
                fontWeight: '500',
                color: '#000000',
                letterSpacing: wp(0.4),
                fontSize: wp(4),
              }}>Password</Text>

              <View style={{
                overflow: 'hidden',
                borderRadius: wp(3),
                backgroundColor: '#E0E0E0',
                width: hp(45),
                height: wp(11.2),
                alignSelf: 'center',
                marginTop: wp(1.5),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <TextInput
                  placeholder='Password'
                  placeholderTextColor='#757575'
                  maxLength={20}
                  keyboardType='name-phone-pad'
                  secureTextEntry={!this.state.showPassword} // Use secureTextEntry conditionally
                  value={this.state.password}
                  onChangeText={this.handlePassword}
                  style={{
                    paddingLeft: wp(3.5),
                    fontSize: wp(3.5),
                    fontWeight: '400',
                    color: '#757575',
                    width: hp(30),

                  }}
                />

                <TouchableOpacity onPress={this.toggleShowPassword}>
                  <Image
                    source={this.state.showPassword ? require('../../Assets/Image/view.png') : require('../../Assets/Image/hide.png')}
                    style={{ width: wp(5.5), height: wp(5.5), marginRight: wp(5) }}
                  />
                </TouchableOpacity>
              </View>

            </View>

          

            {/* login button */}
            <TouchableOpacity style={{
              justifyContent: 'center',
              backgroundColor: '#0293DF',
              height: wp(10.5),
              width: hp(45),
              alignSelf: 'center',
              borderRadius: wp(5),
              marginTop: wp(10),
            }}
              onPress={this.handleLogin}>
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontSize: wp(4.2),
                fontWeight: '500'
              }}>Log In</Text>
            </TouchableOpacity>
          </View>
          {showProcessingLoader && <ProcessingLoader />}

        </SafeAreaView>

      </TouchableWithoutFeedback >



    );
  }
}

const Styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
  welcomeText: {
    alignSelf: 'center',
    top: wp(-2)
  }
})
