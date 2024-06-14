import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {Component} from 'react';
import {Table, Row, Rows} from 'react-native-table-component';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {BASE_URL, makeRequest} from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import { KEYS, getData } from '../../api/User_Preference';
// Import your logo image
import logo from '../../Assets/applogo.png';
export class Search_Reverse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Id', 'Contract name', 'Product', 'Received By', 'Date'],
      rowData: [],
      isPopoverVisible: false,
      popoverContent: '',
      logoSource: null,
    };
  }

  renderRowData = (rowData, rowIndex) => {
    if (typeof rowData === 'object' && rowData !== null) {
      return (
        <Row
          key={rowIndex}
          data={Object.values(rowData)}
          textStyle={styles.rowText}
          style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd]}
          flexArr={[0, 2, 3, 3, 2, 2]}
        />
      );
    } else if (Array.isArray(rowData)) {
      let maxLines = 2;
      rowData.forEach(cellData => {
        const lines = Math.ceil(cellData.length / 20);
        if (lines > maxLines) {
          maxLines = lines;
        }
      });
    }

    const rowHeight = maxLines * 19; // Assuming font size of 25

    return (
      <Row
        key={rowIndex}
        data={rowData.map((cellData, columnIndex) => {
          if (columnIndex === 0) {
            return (
              <TouchableOpacity
                key={columnIndex}
                onPress={() => this.handleCellPress(cellData)}>
                <Text style={[styles.rowText1, {lineHeight: 14}]}>
                  {cellData}
                </Text>
              </TouchableOpacity>
            );
          } else if (columnIndex === 1) {
            return (
              <TouchableOpacity
                key={columnIndex}
                onPress={() => this.handleCellPress1(cellData)}>
                <Text style={[styles.rowText1, {lineHeight: 14}]}>
                  {cellData}
                </Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <Text
                key={columnIndex}
                style={[styles.rowText, {lineHeight: 14}]}>
                {cellData}
              </Text>
            );
          }
        })}
        textStyle={styles.rowText}
        style={[
          rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd,
          {height: rowHeight},
        ]}
        flexArr={[0, 2, 3, 3, 2, 2]}
      />
    );
  };

 async componentDidMount() {
    this.handleReverseSearch();
    this._handleListRefresh();
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

  _handleListRefresh = () => {
    try {
      // pull-to-refresh
      this.setState({isRefreshing: true}, () => {
        // setTimeout with a delay of 1000 milliseconds (1 second)
        setTimeout(() => {
          // updating list after the delay
          this.handleReverseSearch();
          // resetting isRefreshing after the update
          this.setState({isRefreshing: false});
        }, 100);
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleReverseSearch = async () => {
    try {
      const erpiD= await getData(KEYS.USER_INFO);
      console.log('efeeeee',erpiD.erpID);
      const {contract_id} = this.props.route.params;
      const params = {contract_id,erpID: erpiD.erpID};
      // console.log("handleContractSearch", contract_id);
      this.setState({showProcessingLoader: true, isRefreshing: true});
      const response = await makeRequest(
        BASE_URL + '/mobile/searchreverse',
        params,
      );
      // console.log("handleContractSearch", response);
      const {success, message, searchReverse} = response;
      if (success) {
        const modifiedReverseDetails = searchReverse.map(
          ({reverse_id, contact_name, product, received_name, date}) => ({
            reverse_id,
            contact_name,
            product,
            received_name,
            date,
          }),
        ); // changes by manish
        this.setState({
          rowData: modifiedReverseDetails,
          showProcessingLoader: false,
          isRefreshing: false,
        }); // changes by manish
      } else {
        console.log(message);
        this.setState({showProcessingLoader: false, isRefreshing: false});
      }
    } catch (error) {
      console.log(error);
      this.setState({showProcessingLoader: false, isRefreshing: false});
    }
  };

  handleGoBackHome = () => {
    this.props.navigation.navigate('Reverse');
  };
  render() {
    const {logoSource}= this.state;
    const {tableHead, rowData} = this.state;
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {showProcessingLoader} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#f4fdfe',
            height: wp(14),
            borderRadius: wp(1),
            overflow: 'hidden',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={this.handleGoBackHome}>
            <Image
           source={require('../../Assets/goback/reverse.png')}
              style={{
                width: wp(8),
                height: wp(8),
                marginLeft: wp(2),
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: '#333',
              fontSize: wp(5),
              fontWeight: '500',
              letterSpacing: wp(0.4),
              textTransform: 'uppercase',
            }}>
            Reverse
          </Text>

          <Image
              source={logoSource}
            style={{
              width: wp(20), // Adjust the width as needed
              height: wp(16), // Adjust the height as needed
              resizeMode: 'contain',
              marginRight: wp(2),
            }}
          />
        </View>
        <View style={styles.container}>
          <Table borderStyle={{borderWidth: wp(0.2), borderColor: 'white'}}>
            <Row
              data={tableHead}
              style={styles.head}
              textStyle={styles.text}
              flexArr={[0, 2, 3, 3, 2, 2]}
            />
            {rowData.length > 0 ? (
              rowData.map((rowData, index) =>
                this.renderRowData(rowData, index),
              )
            ) : (
              <Text
                style={{
                  color: '#197486',
                  fontWeight: '500',
                  fontSize: wp(3.2),
                  textAlign: 'center',
                  marginTop: wp(10),
                }}>
                No Data Found
              </Text>
            )}
          </Table>
        </View>
        {showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: wp(2),
  },
  head: {
    backgroundColor: '#197486',
    width: wp(95),
    height: wp(12),
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: wp(3),
    fontWeight: '500',
  },
  rowEven: {
    backgroundColor: '#d4eef4',
    width: wp(95),
    height: wp(12),
  },
  rowOdd: {
    backgroundColor: '#f4fdfe',
    width: wp(95),
    height: wp(12),
  },
  rowText: {
    color: '#212529',
    textAlign: 'left',
    fontSize: wp(2.5),
    paddingHorizontal: wp(0.3),
    marginLeft: 4,
    fontWeight: '400',
  },
  rowText1: {
    color: 'red',
    textAlign: 'center',
    fontSize: wp(2.5),
    // Optional: add underline to indicate touchability
  },
  popoverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popoverContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: wp(60),
    height: wp(60),
  },
});

export default Search_Reverse;
