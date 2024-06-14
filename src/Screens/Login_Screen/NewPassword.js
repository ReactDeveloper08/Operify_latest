import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export class NewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            showPassword1: false,
            isValid: true,
        };
    }
    toggleNewPassword = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));
    };

    toggleConfirmPassword = () => {
        this.setState(prevState => ({
            showPassword1: !prevState.showPassword1,
        }));
    };

    handleLogin = () => {
        try {
          this.props.navigation.navigate('mytab')
        } catch (error) {
          console.log(error);
        }
      }
    render() {
        const { isValid  } = this.state;

 
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
                            backgroundColor: '#0293DF',
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
                        }}>Create New Password</Text>

                        <Text style={{
                            fontWeight: '500',
                            color: '#383838',
                            letterSpacing: wp(0.3),
                            fontSize: wp(3.5),
                            textAlign: 'center',
                            marginTop: wp(2)
                        }}>Please enter and confirm your new password</Text>

                    </View>



                    <View style={{ flex: 2 }}>
                        {/*  login and password textinput  */}
                        <View style={{
                            overflow: 'hidden',
                            borderRadius: wp(3),
                            backgroundColor: '#E0E0E0',
                            width: hp(45),
                            height: wp(11.2),
                            alignSelf: 'center',
                            marginTop: wp(15),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderColor: isValid ? 'E0E0E0' : 'red',
                            borderWidth: isValid ? wp(0) : wp(0.3)
                        }}>
                            <TextInput
                                placeholder='New Password'
                                placeholderTextColor='#757575'
                                maxLength={20}
                                keyboardType='name-phone-pad'
                                secureTextEntry={!this.state.showPassword} // Use secureTextEntry conditionally
                                style={{
                                    paddingLeft: wp(3.5),
                                    fontSize: wp(3.9),
                                    fontWeight: '400',
                                    color: '#757575',
                                    width: hp(30),

                                }}
                            />

                            <TouchableOpacity onPress={this.toggleNewPassword}>
                                <Image
                                    source={this.state.showPassword ? require('../../Assets/Image/view.png') : require('../../Assets/Image/hide.png')}
                                    style={{ width: wp(5.5), height: wp(5.5), marginRight: wp(5) }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* {!isValidPassword && (
                            <Text style={{
                                color: 'red',
                                fontSize: wp(3),
                                letterSpacing: wp(0.2),
                                marginTop: wp(1),
                                marginLeft: wp(3.5)
                            }}>Passwords must match and be at least 8 characters long.</Text>
                        )} */}



                        <View style={{
                            overflow: 'hidden',
                            borderRadius: wp(3),
                            backgroundColor: '#E0E0E0',
                            width: hp(45),
                            height: wp(11.2),
                            alignSelf: 'center',
                            marginTop: wp(12),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          
                        }}>
                            <TextInput
                                placeholder='Confirm Password'
                                placeholderTextColor='#757575'
                                maxLength={20}
                                keyboardType='name-phone-pad'
                                secureTextEntry={!this.state.showPassword1}
                                value={this.state.confirmPassword}
                                onChangeText={this.handleConfirmPassword}
                                style={{
                                    paddingLeft: wp(3.5),
                                    fontSize: wp(3.9),
                                    fontWeight: '400',
                                    color: '#757575',
                                    width: hp(30),
                                }}
                            />

                            <TouchableOpacity onPress={this.toggleConfirmPassword}>
                                <Image
                                    source={this.state.showPassword1 ? require('../../Assets/Image/view.png') : require('../../Assets/Image/hide.png')}
                                    style={{ width: wp(5.5), height: wp(5.5), marginRight: wp(5) }}
                                />
                            </TouchableOpacity>
                        </View>

                       

                        {/* login button */}
                        <TouchableOpacity onPress={this.handleLogin} style={{
                            justifyContent: 'center',
                            backgroundColor: '#0293DF',
                            height: wp(10.5),
                            width: hp(45),
                            alignSelf: 'center',
                            borderRadius: wp(5),
                            marginTop: wp(10),
                        }}>
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: wp(4.2),
                                fontWeight: '500'
                            }}>Log In</Text>
                        </TouchableOpacity>

                    </View>









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
    }
})