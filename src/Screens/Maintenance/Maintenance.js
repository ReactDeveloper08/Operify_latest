import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    RefreshControl,
    ScrollView,
    FlatList,
    Linking,
    SafeAreaView,
} from 'react-native';
import React, { Component } from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import { KEYS, getData } from '../../api/User_Preference';
// Import your logo image
import logo from '../../Assets/applogo.png';
export class Maintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Date', 'Machine', 'Breakdown', 'Time (Hrs)', 'Assgin To', 'Status'],
            rowData: [], // Initialize as an empty array
            currentPage: 0,
            rowsPerPage: 50,
            searchPO: '',
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false,
            purchaseorderId: '',
            poPrimary: '',
            isRevised: '',
            logoSource: null,
        };
    }

   async componentDidMount() {
        this.handleMaintenance();
        this.props.navigation.addListener('focus', this._handleListRefreshing); // Add listener for screen focus
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
        this.props.navigation.removeListener('focus', this._handleListRefreshing); // Remove listener on component unmount
    }

    handleMaintenance = async () => {
        try {
            this.setState({ isRefreshing: true });
            const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
      const params = {erpID: erpiD.erpID };
            const response = await makeRequest(BASE_URL + '/mobile/maintenance',params);
            const { success, message, maintenanceDetails } = response;
            // console.log("po",response);
            if (success) {
                const modifiedPurchaseDetails = maintenanceDetails.map(
                    ({
                        date,
                        machine,
                        breakdown,
                        time,
                        assign_to,
                        status
                    }) => ({
                        date,
                        machine,
                        breakdown,
                        time,
                        assign_to,
                        status
                    }),
                ); // change by manish
                this.setState({ rowData: modifiedPurchaseDetails, isRefreshing: false });
            } else {
                console.log(message);
                this.setState({ isRefreshing: false });
            }
        } catch (error) {
            console.log(error);
            this.setState({ isRefreshing: false });
        }
    };

    nextPage = () => {
        const { currentPage } = this.state;
        this.setState({ currentPage: currentPage + 1 });
    };

    prevPage = () => {
        const { currentPage } = this.state;
        if (currentPage > 0) {
            this.setState({ currentPage: currentPage - 1 });
        }
    };

    _handleListRefreshing = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleMaintenance();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false, currentPage: 0 });
                }, 2000);
            });
        } catch (error) { }
    };

    handleGoBackHome = () => {
        this.props.navigation.navigate('home');
    };

    render() {
        const {logoSource}= this.state;
        const { tableHead, rowData, currentPage, rowsPerPage } = this.state;
        const startIndex = currentPage * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, rowData.length); // Calculate end index while considering the last page
        const slicedData = rowData.slice(startIndex, endIndex);

        if (this.state.isLoading) {
            return <CustomLoader />;
        }
        const { showProcessingLoader } = this.state;

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
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    style={{
                        backgroundColor: '#FFCDD2',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image
                            source={require('../../Assets/goback/maintain.png')}
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
                        Maintenance
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

                <View style={styles.search}>
                    <TextInput
                        placeholder="Search Maintenance"
                        placeholderTextColor="#E53935"
                        maxLength={25}
                        keyboardType="number-pad"
                        style={styles.search_text}
                    />

                    <TouchableOpacity>
                        <Image
                            source={require('../../Assets/Image/maintain.png')}
                            style={{ width: wp(5), height: wp(5), marginRight: wp(3) }}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            colors={['#E57373']}
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._handleListRefreshing}
                            style={{ bottom: wp(8) }}
                        />
                    }
                    style={styles.container}>
                    {rowData.length ? (
                        <Table
                            style={{ marginTop: wp(2) }}
                            borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row
                                data={tableHead}
                                style={styles.head}
                                textStyle={styles.text}
                                flexArr={[2.3, 3.5, 3.5, 1.2, 2, 2.3]}
                            />
                            {slicedData.map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={[
                                        <Text style={[styles.rowText, { lineHeight: 15 }]}>
                                            {rowData.date}
                                        </Text>,
                                        <Text style={[styles.rowText, { lineHeight: 15 }]}>
                                            {rowData.machine}
                                        </Text>,

                                        <Text style={[styles.rowText1, { lineHeight: 15 }]}>
                                            {rowData.breakdown}
                                        </Text>,
                                        <Text style={[styles.rowText, { lineHeight: 15 }]}>
                                            {rowData.time}
                                        </Text>,
                                        <Text style={[styles.rowText2, { lineHeight: 15 }]}>
                                            {rowData.assign_to}
                                        </Text>,
                                        <Text style={[styles.rowText3, { lineHeight: 15 }]}>
                                            {rowData.status}
                                        </Text>,
                                    ]}
                                    textStyle={styles.rowText}
                                    style={[
                                        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                                        { height: rowHeight },
                                    ]}
                                    flexArr={[2.3, 3.5, 3.5, 1.2, 2, 2.3]}
                                />
                            ))}
                        </Table>
                    ) : (
                        <Text
                            style={{
                                color: '#E53935',
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
                        <Text style={styles.paginationText}>Page {currentPage + 1}</Text>
                        <Text style={styles.paginationText}>
                            Showing {startIndex + 1} - {endIndex} of {rowData.length} records
                        </Text>
                        <TouchableOpacity
                            onPress={this.nextPage}
                            disabled={endIndex >= rowData.length}>
                            <Text style={styles.paginationText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {showProcessingLoader && <ProcessingLoader />}
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    head: {
        backgroundColor: '#E57373',
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
        backgroundColor: '#FFCDD2',
        width: wp(97),
        height: wp(10),
    },
    rowOdd: {
        backgroundColor: '#FFEBEE',
        width: wp(97),
        height: wp(10),
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
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.5),
        paddingHorizontal: wp(0.3),
        marginLeft: 4,
        fontWeight: '400',
        textTransform:'capitalize'
    },
    rowText2: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.5),
        paddingHorizontal: wp(0.3),
        marginLeft: 4,
        fontWeight: '400',
        textTransform:'capitalize'
    },
    rowText3: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.5),
        paddingHorizontal: wp(0.3),
        marginLeft: 4,
        fontWeight: '400',
        textTransform:'capitalize'
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: wp(3),
        paddingHorizontal: wp(3),
        marginBottom: wp(2.5)
    },
    paginationText: {
        fontSize: wp(3.5),
        color: '#E53935',
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
        borderColor: '#E53935',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#FFEBEE',
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    search_text: {
        color: '#E53935',
        fontSize: wp(3.5),
        marginLeft: wp(2),
        fontWeight: '500',
        width: wp(40),
    },
});