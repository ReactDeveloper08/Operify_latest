import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default class Forget extends Component {
  handleSendCode = () => {
    try {
      this.props.navigation.navigate('VerifyCode')
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flex: 1
          }}>
            <View style={{
              backgroundColor: '#0293DF',
              width: wp(25),
              height: wp(1),
              borderRadius: wp(0.5)
            }}></View>

            <View style={{
              backgroundColor: '#BDBDBD',
              width: wp(25),
              height: wp(1),
              borderRadius: wp(0.5)
            }}></View>

            <View style={{
              backgroundColor: '#BDBDBD',
              width: wp(25),
              height: wp(1),
              borderRadius: wp(0.5)
            }}></View>
          </View>

          <View style={Styles.welcomeText}>
            <Text style={{
              fontWeight: '700',
              color: '#000000',
              letterSpacing: wp(0.4),
              fontSize: wp(5.5),
              textAlign: 'center'
            }}>Forget Your Password ?</Text>

            <Text style={{
              fontWeight: '500',
              color: '#383838',
              letterSpacing: wp(0.3),
              fontSize: wp(3.5),
              textAlign: 'center',
              marginTop: wp(2)
            }}>
              If you want to ask the user to enter their mobile number for the code to be sent.
            </Text>

          </View>

          {/* forget mobile  box */}

          <View style={{ flex: 2, top: wp(-35), alignSelf: 'center' }}>

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
                style={{
                  paddingLeft: wp(3.5),
                  fontSize: wp(3.5),
                  fontWeight: '400',
                  color: '#757575',
                }} />
            </View>

            <TouchableOpacity onPress={this.handleSendCode} style={{
              justifyContent: 'center',
              backgroundColor: '#0293DF',
              height: wp(10.5),
              width: hp(45),
              alignSelf: 'center',
              borderRadius: wp(5),
              marginTop: wp(20),
            }}>
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontSize: wp(4.2),
                fontWeight: '500'
              }}>Send Code</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </TouchableWithoutFeedback>
    )
  }
}

const Styles = StyleSheet.create({
  welcomeText: {
    alignSelf: 'center',
    flex: 2,
    marginTop: wp(5)

  }
})

