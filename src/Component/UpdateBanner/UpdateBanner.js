import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Linking,
    Image,
} from 'react-native';
import {
    heightPercentageToDP,
    widthPercentageToDP,
} from 'react-native-responsive-screen';

const UpdateBanner = ({ isVisible, onClose, storeUrl }) => {
    const handleUpdatePress = () => {
        Linking.openURL(storeUrl);
        console.log('====================================');
        console.log('da', storeUrl);
        console.log('====================================');
        // Close the update banner
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        borderColor: '#0077a2',
                        borderWidth: 1,
                        marginTop: widthPercentageToDP(10),
                    }}>
                    <Image
                        source={require('../../Assets/Image/info.png')}
                        style={{
                            alignSelf: 'center',
                            width: widthPercentageToDP(9),
                            height: widthPercentageToDP(9),
                        }}
                    />
                    <Text style={{ color: '#000' }}>New updates are available!</Text>
                    <TouchableOpacity
                        onPress={handleUpdatePress}
                        style={{
                            backgroundColor: '#0077a2',
                            width: heightPercentageToDP(12),
                            alignSelf: 'center',
                            marginTop: widthPercentageToDP(2),
                            borderRadius: 5,
                            padding: heightPercentageToDP(1),
                        }}>
                        <Text
                            style={{
                                color: '#fff',
                                //     marginTop: 10,
                                textAlign: 'center',
                                fontSize: widthPercentageToDP(3),
                            }}>
                            Update Now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default UpdateBanner;