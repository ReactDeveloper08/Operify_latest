import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { KEYS, clearData, getData } from '../../api/User_Preference';
// Import your logo image
import logo from '../../Assets/applogo.png';


export class Header_comp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showProcessingLoader:false,
            logoSource: null,
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

    handleLogout = async () => {
        // Show alert to confirm logout
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        // Clear user data (assuming clearData is an async function)
                        await clearData();
                        // Navigate back to the login screen using replace to replace the current screen
                        this.props.navigation.replace('login');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

   


    render() {
 
        const {logoSource}= this.state;
        return (

            <View
                style={{
                    backgroundColor: '#E1F5FE',
                    height: wp(14),
                    borderRadius: wp(1),
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'

                }}>

                <Image source={logoSource}
                    style={{
                        width: wp(20), // Adjust the width as needed
                        height: wp(16), // Adjust the height as needed // Set the width and height to the same value for square size
                        marginLeft: wp(2.5),
                        resizeMode: 'contain',

                    }} />

                <Text
                    style={{
                        color: '#333',
                        fontSize: wp(5),
                        fontWeight: '500',
                        letterSpacing: wp(0.4)
                    }}>DashBoard</Text>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                

                    <TouchableOpacity onPress={this.handleLogout}>
                        <Image source={require('../../Assets/Image/logout.png')}
                            style={{
                                width: wp(7),
                                height: wp(7),
                                marginRight: wp(2.5)
                            }} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default Header_comp

