import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInputView from "@twotalltotems/react-native-otp-input";


export default class VerifiyCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
        };
    }

    handleCodeFilled = (code) => {

        console.log(`Code is ${code}, your code is here!`);
        this.props.navigation.push('newPassword');
    };
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={{ flex: 1, padding: wp(2) }}>
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
                    </View>

                    <View style={Styles.welcomeText}>
                        <Text style={{
                            fontWeight: '700',
                            color: '#000000',
                            letterSpacing: wp(0.4),
                            fontSize: wp(5.5),
                            textAlign: 'center'
                        }}>Verification Code Entry</Text>

                        <Text style={{
                            fontWeight: '500',
                            color: '#383838',
                            letterSpacing: wp(0.3),
                            fontSize: wp(3.5),
                            textAlign: 'center',
                            marginTop: wp(2)
                        }}>
                            Please enter the  Verification code  sent to your mobile number.
                        </Text>

                        <Text style={{
                            fontWeight: '500',
                            color: '#383838',
                            letterSpacing: wp(0.3),
                            fontSize: wp(3.5),
                            textAlign: 'center',
                            marginTop: wp(10)
                        }}>
                            6377033994
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', top: wp(8) }}>
                            <Text style={{
                                fontWeight: '500',
                                color: '#9E9E9E',
                                letterSpacing: wp(0.3),
                                fontSize: wp(3.8),
                                textAlign: 'center',
                            }}>00</Text>


                            <Text style={{
                                fontWeight: '500',
                                color: '#9E9E9E',
                                letterSpacing: wp(0.3),
                                fontSize: wp(3.8),
                                textAlign: 'center',

                            }}>:</Text>

                            <Text style={{
                                fontWeight: '500',
                                color: '#9E9E9E',
                                letterSpacing: wp(0.3),
                                fontSize: wp(3.8),
                                textAlign: 'center',

                            }}>00</Text>
                        </View>

                        <View style={Styles.otpinputview}>

                            <OTPInputView
                                codeInputFieldStyle={Styles.otp_input_feild_style}
                                codeInputHighlightStyle={{ color: 'black', borderColor: '#0293DF' }}
                                placeholderTextColor='#9b9b9b'
                                pinCount={4}
                                autoFocusOnLoad={false}
                                keyboardType="phone-pad"
                                keyboardAppearance='default'
                                onCodeFilled={this.handleCodeFilled}
                            />

                        </View>

                        {/* send again */}
                        <TouchableOpacity>
                            <Text style={{
                                fontWeight: '500',
                                color: '#0293DF',
                                letterSpacing: wp(0.3),
                                fontSize: wp(3.8),
                                textAlign: 'center',
                                top: wp(-5)
                            }}>
                                Send again
                            </Text>
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
    }, 
    otpinputview: {
        width: wp(60),
        height: hp(20),
        alignSelf: 'center',
    },
    otp_input_feild_style: {
        color: '#4a4b4d',
        width: hp(5.5),
        height: hp(8),
        backgroundColor: '#EEEEEE',
        borderColor: '#BDBDBD',
        borderRadius: wp(2),

    },
})
