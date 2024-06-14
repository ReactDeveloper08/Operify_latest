import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import {BASE_URL, makeRequest} from '../../api/Api_info';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { KEYS, getData } from '../../api/User_Preference';
// Import your logo image
import logo from '../../Assets/applogo.png';
export class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: [
        'Date',
        'Opening',
        'Received',
        'Issued',
        'Reverse',
        'Return',
        'Close',
      ],
      rowData: [],
      currentPage: 0,
      rowsPerPage: 50,
      showProcessingLoader: false,
      searchName: '',
      contractName: [],
      isRefreshing: false,
      isDateTimePickerVisible: false,
      showFlatList: false, // Add this state variable
      selectedDateFrom: '',
      selectedDateTo: '',
      pickerType: '',
      vendorid: '',
      nameInput: '',
      isLoading: false,
      errorMessage: '',
      searchDataAvailable: true,
      logoSource: null,
    };
  }

 async componentDidMount() {
    this.handleStock();
    this.props.navigation.addListener('focus', this._handleListRefresh); // Add listener for screen focus
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

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this._handleListRefresh); // Remove listener on component unmount
  }

  handleStock = async () => {
    try {
      this.setState({isRefreshing: true});
      const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
  
      const params = { erpID: erpiD.erpID };
      const response = await makeRequest(BASE_URL + '/mobile/stock',params);
      const {success, message, stockDetails, item_name} = response;
      console.log('stock stock stock ', response);
      if (success) {
        const modfiedStock = stockDetails.map(
          ({
            date,
            opening_stock,
            received_stock,
            issued_stock,
            reverse_stock,
            return_stock,
            closing_stock,
          }) => ({
            date,
            opening_stock,
            received_stock,
            issued_stock,
            reverse_stock,
            return_stock,
            closing_stock,
          }),
        );
        this.setState({
          rowData: modfiedStock,
          nameInput: item_name,
          isRefreshing: false,
        });
      } else {
        console.log(message);
        this.setState({isRefreshing: false});
      }
    } catch (error) {
      console.log(error);
      this.setState({isRefreshing: false});
    }
  };

  nextPage = () => {
    const {currentPage} = this.state;
    this.setState({currentPage: currentPage + 1});
  };

  prevPage = () => {
    const {currentPage} = this.state;
    if (currentPage > 0) {
      this.setState({currentPage: currentPage - 1});
    }
  };

  _handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isRefreshing: true}, () => {
        // setTimeout with a delay of 1000 milliseconds (1 second)
        setTimeout(() => {
          // updating list after the delay
          this.handleStock();
          // resetting isRefreshing after the update
          this.setState({
            isRefreshing: false,
            selectedDateFrom: '',
            selectedDateTo: '',
            searchName: '',
            currentPage: 0,
          });
        }, 2000);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleGoBackHome = () => {
    this.props.navigation.navigate('home');
  };

  // date time picker

  _showDateTimePicker = type =>
    this.setState({isDateTimePickerVisible: true, pickerType: type});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 to month because it's zero-based
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    if (this.state.pickerType === 'from') {
      this.setState({selectedDateFrom: formattedDate});
    } else if (this.state.pickerType === 'to') {
      this.setState({selectedDateTo: formattedDate});
    }
    this._hideDateTimePicker();
  };

  handleShowSearch = async () => {
    try {
      const erpiD= await getData(KEYS.USER_INFO);
      console.log('efeeeee',erpiD.erpID);
      const {selectedDateFrom, selectedDateTo, itemid} = this.state;
      const params = {
        item_id: itemid,
        datefrom: selectedDateFrom,
        dateto: selectedDateTo,
        erpID: erpiD.erpID
      };
      console.log('111112121212', params);
      const response = await makeRequest(
        BASE_URL + '/mobile/searchstock',
        params,
      );
      const {success, message, stockDetails} = response;
      if (success) {
        const modfiedStock = stockDetails.map(
          ({
            date,
            opening_stock,
            received_stock,
            issued_stock,
            reverse_stock,
            return_stock,
            closing_stock,
          }) => ({
            date,
            opening_stock,
            received_stock,
            issued_stock,
            reverse_stock,
            return_stock,
            closing_stock,
          }),
        );
        this.setState({
          rowData: modfiedStock,
          searchDataAvailable: stockDetails.length > 0,
        });
      } else {
        console.log(message);
        this.setState({searchDataAvailable: false});
      }
    } catch (error) {
      console.log(error);
      this.setState({searchDataAvailable: false});
    }
  };

  handleSearch = async () => {
    try {
      const erpiD= await getData(KEYS.USER_INFO);
      console.log('efeeeee',erpiD.erpID);
      const {searchName} = this.state;
      if (searchName.length < 1) {
        this.setState({contractName: []}); // Clear the search results
        return;
      }
      const params = {
        item_name: searchName,
        erpID: erpiD.erpID
      };
      const response = await makeRequest(
        BASE_URL + '/mobile/searchitemname',
        params,
      );
      const {success, message, itemName} = response;
      if (success) {
        this.setState({contractName: itemName, showFlatList: true});
      } else {
        this.setState({
          contractName: [],
          errorMessage: message,
          showFlatList: true,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({contractName: [], showFlatList: false});
    }
  };

  handleProductPress = item => {
    const {item_name, item_id} = item;
    console.log('6377033994', item_id);
    // Update searchName state with the selected item's name
    this.setState({searchName: item_name, itemid: item_id});
    // Stop refreshing and clear search term and results
    this.setState({contractName: [], showFlatList: false});
  };

  componentDidFocus = () => {
    this.setState({searchName: '', contractName: []}); // Clear the search term and results when screen is focused
  };

  renderProductItem = ({item}) => {
    if (!item) {
      return (
        <View style={{alignItems: 'center', paddingVertical: wp(2)}}>
          <Text>No Data </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => this.handleProductPress(item)}>
        <View style={{borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
          <Text
            style={{
              color: 'black',
              fontWeight: '500',
              fontSize: wp(3),
              marginBottom: wp(2),
            }}>
            {item.item_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {logoSource}= this.state;
    const {
      tableHead,
      rowData,
      currentPage,
      rowsPerPage,
      isLoading,
      showProcessingLoader,
    } = this.state;
    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, rowData.length); // Calculate end index while considering the last page
    const slicedData = rowData.slice(startIndex, endIndex);

    if (isLoading) {
      return <CustomLoader />;
    }
    // Calculate the maximum number of lines for each cell in a row
    let maxLines = 2;
    rowData.forEach(cellData => {
      const lines = Math.ceil(cellData.length / 20); // Assuming each line has 20 characters
      if (lines > maxLines) {
        maxLines = lines;
      }
    });

    // Calculate row height based on the maximum number of lines and font size
    const rowHeight = maxLines * 25; // Assuming font size of 25

    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#EDE7F6',
            height: wp(14),
            borderRadius: wp(1),
            overflow: 'hidden',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={this.handleGoBackHome}>
            <Image
              source={require('../../Assets/goback/stock.png')}
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
            Stock
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
          <View
            style={{marginBottom: wp(16)}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={['#9575CD']}
                refreshing={this.state.isRefreshing}
                onRefresh={this._handleListRefresh}
              />
            }>
            {/* Search bar and results */}
            <View style={styles.search}>
              <TextInput
                placeholder={this.state.nameInput}
                placeholderTextColor="#9575CD"
                maxLength={25}
                keyboardType="name-phone-pad"
                value={this.state.searchName}
                onChangeText={searchName => {
                  this.setState({searchName});
                  this.handleSearch(searchName);
                }}
                style={styles.search_text}
              />
            </View>
            {this.state.showFlatList && this.state.searchName.length > 0 ? (
              <View style={styles.searchResultsContainer}>
                {this.state.contractName.length > 0 ? (
                  <FlatList
                    data={this.state.contractName}
                    renderItem={this.renderProductItem}
                    // keyExtractor={(item) => item.id.toString()}
                    style={styles.searchResultsList}
                  />
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No Data Found</Text>
                  </View>
                )}
              </View>
            ) : null}

            {/* Date Time picker View */}
            <View style={styles.DateTimepicker_Box}>
              <DateTimePicker
                mode="date"
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
              />

              <View style={styles.Date_From}>
                <TouchableOpacity
                  onPress={() => this._showDateTimePicker('from')}>
                  <Text style={styles.Date_text}>
                    {this.state.selectedDateFrom
                      ? this.state.selectedDateFrom
                      : 'Select Date from'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.Date_to}>
                <TouchableOpacity
                  onPress={() => this._showDateTimePicker('to')}>
                  <Text style={styles.Date_text}>
                    {this.state.selectedDateTo
                      ? this.state.selectedDateTo
                      : 'Select Date to'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={this.handleShowSearch}
                style={{
                  width: wp(20),
                  height: wp(9),
                  borderRadius: wp(2),
                  backgroundColor: '#9575CD',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: wp(3.7),
                    fontWeight: '500',
                    color: 'white',
                  }}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._handleListRefreshing}
                  colors={['#8D6E63']}
                />
              }>
              {slicedData.length ? (
                <Table
                  style={{marginTop: wp(3)}}
                  borderStyle={{borderWidth: wp(0.2), borderColor: 'white'}}>
                  <Row
                    data={tableHead}
                    style={styles.head}
                    textStyle={styles.text}
                    flexArr={[2.7, 2.2, 2.2, 2.2, 2, 2, 2]}
                  />
                  {slicedData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={[
                        <Text style={styles.rowText}>{rowData.date}</Text>,
                        <Text style={styles.rowText}>
                          {rowData.opening_stock}
                        </Text>,

                        <Text style={styles.rowText}>
                          {rowData.received_stock}
                        </Text>,

                        <Text style={styles.rowText}>
                          {rowData.issued_stock}
                        </Text>,
                        <Text style={styles.rowText}>
                          {rowData.received_stock}
                        </Text>,
                        <Text style={styles.rowText}>
                          {rowData.received_stock}
                        </Text>,
                        <Text style={styles.rowText}>
                          {rowData.closing_stock}
                        </Text>,
                      ]}
                      textStyle={styles.rowText}
                      style={[
                        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                        {height: rowHeight},
                      ]}
                      flexArr={[2.7, 2.2, 2.2, 2.2, 2, 2, 2]}
                    />
                  ))}
                </Table>
              ) : (
                <Text
                  style={{
                    color: '#9575CD',
                    fontWeight: '500',
                    fontSize: wp(3.2),
                    textAlign: 'center',
                    marginTop: wp(10),
                  }}>
                  No Data Found
                </Text>
              )}

              <View style={styles.pagination}>
                <TouchableOpacity
                  onPress={this.prevPage}
                  disabled={currentPage === 0}>
                  <Text style={styles.paginationText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.paginationText}>
                  Page {currentPage + 1}
                </Text>
                <Text style={styles.paginationText}>
                  Showing {startIndex + 1} - {endIndex} of {rowData.length}{' '}
                  records
                </Text>
                <TouchableOpacity
                  onPress={this.nextPage}
                  disabled={endIndex >= rowData.length}>
                  <Text style={styles.paginationText}>Next</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>

        {showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  head: {
    backgroundColor: '#9575CD',
    width: wp(97),
    height: wp(12),
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: wp(3),
    fontWeight: '500',
  },
  rowEven: {
    backgroundColor: '#D1C4E9',
    width: wp(97),
  },
  rowOdd: {
    backgroundColor: '#EDE7F6',
    width: wp(97),
  },
  rowText: {
    color: '#212529',
    textAlign: 'left',
    fontSize: wp(2.5),
    paddingHorizontal: wp(0.3),
    marginLeft: 4,
    fontWeight: '400',
  },
  Highlight: {
    color: 'red',
    textAlign: 'left',
    fontSize: wp(2.5),
    fontWeight: '500',
    paddingHorizontal: wp(0.3),
    marginLeft: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: wp(4),
    paddingHorizontal: wp(3),
  },
  paginationText: {
    fontSize: wp(3.5),
    color: '#9575CD',
    fontWeight: '500',
  },
  Contract_name: {
    color: '#212529',
    fontSize: wp(4),
    fontWeight: '500',
  },
  search: {
    width: wp(97),
    height: wp(12),
    borderColor: '#9575CD',
    borderWidth: wp(0.3),
    borderRadius: wp(2),
    marginTop: wp(3),
    backgroundColor: '#EDE7F6',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  search_text: {
    color: '#9575CD',
    fontSize: wp(3.5),
    marginLeft: wp(2),
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  popoverContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: wp(2),
    borderRadius: 10,
    width: wp(90),
    height: wp(160),
  },

  searchResultsContainer: {
    position: 'absolute',
    top: hp(8), // Adjust the top position as needed
    left: wp(2), // Adjust the left position as needed
    right: wp(2), // Adjust the right position as needed
    backgroundColor: '#fff',
    borderRadius: wp(2),
    elevation: 3,
    zIndex: 999, // Ensure the search results view is displayed above other content
  },
  searchResultsList: {
    maxHeight: hp(30), // Adjust the max height as needed
    borderRadius: wp(2),
    padding: wp(2),
  },

  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: wp(2),
  },
  noResultsText: {
    fontSize: wp(3),
    fontWeight: 'bold',
  },

  // Date time picker style //
  DateTimepicker_Box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: wp(3),
    alignContent: 'center',
  },
  Date_From: {
    width: wp(35),
    height: wp(9),
    borderColor: '#9575CD',
    borderWidth: wp(0.3),
    borderRadius: wp(2),
    backgroundColor: '#EDE7F6',
    justifyContent: 'center',
  },
  Date_text: {
    color: '#9575CD',
    fontSize: wp(3),
    fontWeight: '500',
    marginLeft: wp(2),
  },

  Date_to: {
    width: wp(35),
    height: wp(9),
    borderColor: '#9575CD',
    borderWidth: wp(0.3),
    borderRadius: wp(2),
    backgroundColor: '#EDE7F6',
    justifyContent: 'center',
  },
});

export default Stock;
