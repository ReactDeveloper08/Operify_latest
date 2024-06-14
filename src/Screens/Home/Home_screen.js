import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  AppState,
  SafeAreaView,
} from 'react-native';
import React, { Component } from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Header_comp from '../../Component/Header/Header_comp';
import Po_Table from '../../Component/Table/Po_Table';
import GRN_Table from '../../Component/Table/GRN_Table';
import { Indents_Table } from '../../Component/Table/Indents_Table';
import { Reverses_Table } from '../../Component/Table/Reverses_Table';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import Production_Table from '../../Component/Table/Production_Table';
import { KEYS, clearData, getData } from '../../api/User_Preference';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import UpdateBanner from '../../Component/UpdateBanner/UpdateBanner';
import { getUniqueId } from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractData: {
        contractcount: 0,
        todaycontractcount: 0,
        weekcontractcount: 0,
        monthcontractcount: 0,
      },

      purchaseData: {
        purchasenordercount: 0,
        todaypurchasenordercount: 0,
        weekpurchasenordercount: 0,
        monthpurchasenordercount: 0,
      },
      grnData: {
        totalgrncount: 0,
        todaylgrncount: 0,
        weeklgrncount: 0,
        monthgrncount: 0,
      },
      supplierData: {
        suppliercount: 0,
        todaylsuppliercount: 0,
        weeklsuppliercount: 0,
        monthsuppliercount: 0,
      },

      maintenanceData: {
        maintenancecount: 0,
        todaymaintenancecount: 0,
        weekmaintenancecount: 0,
        monthmaintenancecount: 0,
      },
      isRefreshing: false,
      showProcessingLoader: false,
      isLoading: false,
      appState: AppState.currentState,
      isUpdateVisible: false,
    };
  }

  componentDidMount = async () => {
    await this.checkAppVersion();
    this.handleSliderBox();
    // this.onRegister();
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this._handleListRefresh); // Remove listener on component unmount
  }

  handleAppStateChange = async nextAppState => {
    try {
      const { appState } = this.state;
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        await this.checkAppVersion();
      }

      this.setState({ appState: nextAppState });
    } catch (error) {
      console.log(error.message);
    }
  };

  checkAppVersion = async () => {
    try {
      let buildNumber = '';
      let IosbuildNumber = '';
      const erpiD= await getData(KEYS.USER_INFO);
      console.log('efeeeee',erpiD.erpID);
      let erpID =erpiD.erpID ;
      if (Platform.OS === 'ios') {
        IosbuildNumber = Number(DeviceInfo.getBuildNumber());
      } else {
        buildNumber = Number(DeviceInfo.getBuildNumber());
      }
      console.log('====================================');
      console.log('dada', IosbuildNumber);
      console.log('====================================');

      let params = {
        ios_build_no: IosbuildNumber,
        android_build_no: buildNumber,
        erpID: erpID
      };

      const response = await makeRequest(
        BASE_URL + '/mobile/versioncheck',
        params,
      );
      const { success, app_url, message, app_url_ios } = response;
      console.log('====================================');
      console.log('dada111', response);
      console.log('====================================');

      if (success === false) {
        this.setState({ isUpdateVisible: true });
        const storeUrl = Platform.OS === 'ios' ? app_url_ios : app_url;
        this.setState({ isStoreUrl: storeUrl });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleCloseUpdateBanner = () => {
    this.setState({ isUpdateVisible: false });
  };

  handleSliderBox = async () => { 
    try {
      const userData = await getData(KEYS.USER_INFO);
      let uniqueId = getUniqueId();
  
      const params = {
        user_id: userData.userId,
        erpID: userData.erpID,
      
      };
      console.log('====================================');
      console.log('Params:', params);
      console.log('====================================');
      const response = await makeRequest(
        BASE_URL + '/mobile/dashboard',
        params,
      );
      const {
        success,
        message,
        contractHeader,
        poHeader,
        grnHeader,
        supplierHeader,
        maintenanceHeader,
        device_id: responseDeviceId,
       
      } = response;
  
      console.log('====================================');
      console.log('Response:', response);
      console.log('====================================');
  
      // if (uniqueId !== responseDeviceId) {
      //   console.log('Device ID mismatch. Logging out user.');
      //   // Implement logout logic here
      //   await clearData(); // Clear stored user data
      //   this.props.navigation.navigate('login');
      //   return; // Exit the function to prevent further execution
      // }
  
      if (success) {
        if (
          contractHeader.length > 0 ||
          poHeader.length > 0 ||
          grnHeader.length > 0 ||
          supplierHeader.length > 0 ||
          maintenanceHeader.length > 0
        ) {
          this.setState({
            contractData: contractHeader[0],
            purchaseData: poHeader[0],
            grnData: grnHeader[0],
            supplierData: supplierHeader[0],
            maintenanceData: maintenanceHeader[0],
            
          });
        }
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
  };


  handlePO = () => {
    try {
      this.props.navigation.navigate('PO_AAA');
    } catch (error) {
      console.log(error);
    }
  };

  handleProduction = () => {
    try {
      this.props.navigation.navigate('Production');
    } catch (error) {
      console.log(error);
    }
  };
  handleGRN = () => {
    try {
      this.props.navigation.navigate('GRN_AA');
    } catch (error) {
      console.log(error);
    }
  };
  handleContract = () => {
    try {
      this.props.navigation.navigate('Contract');
    } catch (error) {
      console.log(error);
    }
  };

  handleIndent = () => {
    try {
      this.props.navigation.navigate('Indent_A');
    } catch (error) {
      console.log(error);
    }
  };

  handleReverse = () => {
    try {
      this.props.navigation.navigate('Reverse_AA');
    } catch (error) {
      console.log(error);
    }
  };

  handleSupplier = () => {
    try {
      this.props.navigation.navigate('supplier');
    } catch (error) {
      console.log(error);
    }
  };

  handleMaintenance = () => {
    try {
      this.props.navigation.navigate('Maintenance')
    } catch (error) {
      console.log(error);
    }
  }

  _handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({ isRefreshing: true }, () => {
        // setTimeout with a delay of 1000 milliseconds (1 second)
        setTimeout(() => {
          // updating list after the delay
          this.handleSliderBox();
          // resetting isRefreshing after the update
          this.setState({ isRefreshing: false });
        }, 1000);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const { contractData, purchaseData, grnData, supplierData, maintenanceData } =
      this.state;
    console.log('mansih', contractData);
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const { showProcessingLoader } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header_comp navigation={this.props.navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            padding: wp(2),
            flex: 1,
            backgroundColor: '#fefefc',
            marginBottom: wp(2),
          }}
          refreshControl={
            <RefreshControl
              colors={['#0068b1']}
              refreshing={this.state.isRefreshing}
              onRefresh={this._handleListRefresh}
            />
          }>
          {/* Header slider */}

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={this.handleContract}>
              <View style={Styles.slider_box1}>
                <View style={Styles.box1}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    Contract ({contractData.contractcount})
                  </Text>
                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    Today - {contractData.todaycontractcount}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Week - {contractData.weekcontractcount}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Month - {contractData.monthcontractcount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {/* box 2 */}
            <TouchableOpacity onPress={this.handlePO}>
              <View style={Styles.slider_box2}>
                <View style={Styles.box2}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2),
                    }}>
                    Purchase Order ({purchaseData.purchasenordercount})
                  </Text>
                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    Today - {purchaseData.todaypurchasenordercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Week - {purchaseData.weekpurchasenordercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Month - {purchaseData.monthpurchasenordercount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* box 3 */}
            <TouchableOpacity onPress={this.handleGRN}>
              <View style={Styles.slider_box3}>
                <View style={Styles.box3}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2),
                    }}>
                    GRN ({grnData.totalgrncount})
                  </Text>
                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    Today - {grnData.todaylgrncount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Week - {grnData.weeklgrncount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Month - {grnData.monthgrncount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* box 4 */}
            <TouchableOpacity onPress={this.handleSupplier}>
              <View style={Styles.slider_box4}>
                <View style={Styles.box4}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2),
                    }}>
                    Vendors ({supplierData.suppliercount})
                  </Text>
                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    Today - {supplierData.todaylsuppliercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Week - {supplierData.weeklsuppliercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Month - {supplierData.monthsuppliercount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* box 5 */}
            <TouchableOpacity onPress={this.handleMaintenance}>
            <View style={Styles.slider_box5}>
              <View style={Styles.box5}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: wp(3),
                    fontWeight: '500',
                    marginLeft: wp(2),
                  }}>
                  Maintenance ({maintenanceData.maintenancecount})
                </Text>
              </View>
              <View style={Styles.second_box}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: wp(2.8),
                    fontWeight: '500',
                    marginLeft: wp(2),
                    letterSpacing: wp(0.1),
                  }}>
                  Today - {maintenanceData.todaymaintenancecount}
                </Text>

                <Text
                  style={{
                    color: 'white',
                    fontSize: wp(2.8),
                    fontWeight: '500',
                    marginLeft: wp(2),
                    letterSpacing: wp(0.1),
                  }}>
                  This Week - {maintenanceData.weekmaintenancecount}
                </Text>

                <Text
                  style={{
                    color: 'white',
                    fontSize: wp(2.8),
                    fontWeight: '500',
                    marginLeft: wp(2),
                    letterSpacing: wp(0.1),
                  }}>
                  This Month - {maintenanceData.monthmaintenancecount}
                </Text>
              </View>
            </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Table */}

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Purchase Order */}
            <View
              style={{
                marginTop: wp(5),
                borderColor: '#039BE5',
                borderWidth: wp(0.1),
                borderRadius: wp(0.5),
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(1),
                  marginTop: wp(2),
                }}>
                <Text
                  style={{
                    fontSize: wp(5),
                    fontWeight: '500',
                    color: '#039BE5',
                    letterSpacing: wp(0.3),
                  }}>
                  Purchase Order
                </Text>
                <TouchableOpacity onPress={this.handlePO}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: wp(1),
                      right: wp(2),
                    }}>
                    <Text
                      style={{
                        fontSize: wp(3),
                        fontWeight: '500',
                        color: '#039BE5',
                        marginRight: wp(1),
                        letterSpacing: wp(0.3),
                      }}>
                      View More
                    </Text>
                    <Image
                      source={require('../../Assets/Image/production-arrow.png')}
                      style={{ width: wp(2.5), height: wp(2.5) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Po_Table />
            </View>

            {/* Production Orders */}

            <View
              style={{
                marginTop: wp(5),
                borderColor: '#40856f',
                borderWidth: wp(0.1),
                borderRadius: wp(0.5),
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(1),
                  marginTop: wp(2),
                }}>
                <Text
                  style={{
                    fontSize: wp(5),
                    fontWeight: '500',
                    color: '#40856f',
                    letterSpacing: wp(0.3),
                  }}>
                  Production Order
                </Text>
                <TouchableOpacity onPress={this.handleProduction}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: wp(1),
                      right: wp(2),
                    }}>
                    <Text
                      style={{
                        fontSize: wp(3),
                        fontWeight: '500',
                        color: '#40856f',
                        marginRight: wp(1),
                        letterSpacing: wp(0.3),
                      }}>
                      View More
                    </Text>
                    <Image
                      source={require('../../Assets/Image/right-arrow.png')}
                      style={{ width: wp(2.5), height: wp(2.5) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Production_Table />
            </View>

            {/* GRN */}

            <View
              style={{
                marginTop: wp(5),
                borderColor: '#8D6E63',
                borderWidth: wp(0.1),
                borderRadius: wp(0.5),
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(1),
                  marginTop: wp(2),
                }}>
                <Text
                  style={{
                    fontSize: wp(5),
                    fontWeight: '500',
                    color: '#8D6E63',
                    letterSpacing: wp(0.3),
                  }}>
                  GRN
                </Text>
                <TouchableOpacity onPress={this.handleGRN}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: wp(1),
                      right: wp(2),
                    }}>
                    <Text
                      style={{
                        fontSize: wp(3),
                        fontWeight: '500',
                        color: '#8D6E63',
                        marginRight: wp(1),
                        letterSpacing: wp(0.3),
                      }}>
                      View More
                    </Text>
                    <Image
                      source={require('../../Assets/Image/grn-arrow.png')}
                      style={{ width: wp(2.5), height: wp(2.5) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <GRN_Table />
            </View>

            {/* indents */}

            <View
              style={{
                marginTop: wp(5),
                borderColor: '#757575',
                borderWidth: wp(0.1),
                borderRadius: wp(0.5),
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(1),
                  marginTop: wp(2),
                }}>
                <Text
                  style={{
                    fontSize: wp(5),
                    fontWeight: '500',
                    color: '#757575',
                    letterSpacing: wp(0.3),
                  }}>
                  Indent{' '}
                </Text>
                <TouchableOpacity onPress={this.handleIndent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: wp(1),
                      right: wp(2),
                    }}>
                    <Text
                      style={{
                        fontSize: wp(3),
                        fontWeight: '500',
                        color: '#757575',
                        marginRight: wp(1),
                        letterSpacing: wp(0.3),
                      }}>
                      View More
                    </Text>
                    <Image
                      source={require('../../Assets/Image/indent-arrow.png')}
                      style={{ width: wp(2.5), height: wp(2.5) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Indents_Table />
            </View>

            {/* Reverse */}

            <View
              style={{
                marginTop: wp(5),
                borderColor: '#197486',
                borderWidth: wp(0.1),
                borderRadius: wp(0.5),
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(1),
                  marginTop: wp(2),
                }}>
                <Text
                  style={{
                    fontSize: wp(5),
                    fontWeight: '500',
                    color: '#197486',
                    letterSpacing: wp(0.3),
                  }}>
                  Reverse
                </Text>
                <TouchableOpacity onPress={this.handleReverse}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: wp(1),
                      right: wp(2),
                    }}>
                    <Text
                      style={{
                        fontSize: wp(3),
                        fontWeight: '500',
                        color: '#197486',
                        marginRight: wp(1),
                        letterSpacing: wp(0.3),
                      }}>
                      View More
                    </Text>
                    <Image
                      source={require('../../Assets/Image/reverse-arrow.png')}
                      style={{ width: wp(2.5), height: wp(2.5) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Reverses_Table />
            </View>
          </ScrollView>
        </ScrollView>

        <UpdateBanner
          isVisible={this.state.isUpdateVisible}
          onClose={this.handleCloseUpdateBanner}
          storeUrl={this.state.isStoreUrl}
        />
        {showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const Styles = StyleSheet.create({
  // Header slider bar //

  slider_box1: {
    backgroundColor: '#9E9E9E',
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  box1: {
    backgroundColor: '#9E9E9E',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  second_box: {
    backgroundColor: '355c6e',
    width: wp(70),
    flex: 1,
    justifyContent: 'center',
  },

  // 2 //.
  slider_box2: {
    backgroundColor: '#039BE5',
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  box2: {
    backgroundColor: '#039BE5',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  // 3//
  slider_box3: {
    backgroundColor: '#8D6E63',
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  box3: {
    backgroundColor: '#8D6E63',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  // 4 //
  slider_box4: {
    backgroundColor: '#00838F',
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  box4: {
    backgroundColor: '#00838F',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  // 5 //
  slider_box5: {
    backgroundColor: '#EF9A9A',
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  box5: {
    backgroundColor: '#EF9A9A',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },
});
