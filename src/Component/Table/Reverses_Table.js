import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import React, { Component } from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import { KEYS, getData } from '../../api/User_Preference';
export class Reverses_Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Contract name', 'Product', 'Received By', 'Date'],
            rowData: [],
            reverseId: '',
            contractId: ''
        };
    }
    componentDidMount() {
        this.handleReverse();
    };



    handleReverse = async () => {
        try {
            const erpiD= await getData(KEYS.USER_INFO);
            console.log('efeeeee',erpiD.erpID);
            const params = {erpID: erpiD.erpID };
            const response = await makeRequest(BASE_URL + '/mobile/dashboard',params)
            // console.log("reverse_table",response);
            const { success, message, reverseDetails } = response;
            if (success) {
                const modifiedReverseDetails = reverseDetails.map(({ reverse_id, contact_name, product, received_name, date, contract_id }) => ({
                    reverse_id, contact_name, product, received_name, date, contract_id
                })) // changes by manish
                this.setState({ rowData: modifiedReverseDetails }); // changes by manish 

            } else {
                console.log(message);

            }
        } catch (error) {
            console.log(error);
        }
    }

     // pdf api by manish
     handlePressProductID = (reverseId) => {

        this.setState({ reverseId }, this._handlePressProductpdf); // Pass a reference to _handlePressProductpdf
    }

    _handlePressProductpdf = async () => {
        try {
            const erpiD= await getData(KEYS.USER_INFO);
            console.log('efeeeee',erpiD.erpID);
            const { reverseId } = this.state;
            if (!reverseId) {
                console.log('No contract ID available to fetch PDF');
                return;
            }
            const params = { reverse_id: reverseId,erpID: erpiD.erpID  };
            console.log('papapapapapap', params);
            const response = await makeRequest(BASE_URL + '/mobile/reversepdf', params);
            const { success, message, pdfLink } = response;
            console.log('pdfpdfpdf', response);
            if (success) {
                console.log('PDF Link:', pdfLink);
                Linking.openURL(pdfLink)
            } else {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
            }
        } catch (error) {
            console.log(error);
        }
    };


    // pdf api by manish

    handlePressContract = (contractId) => {
        this.setState({ contractId }, this._handleContractPdf);
    };

    _handleContractPdf = async () => {
        try {
            const erpiD= await getData(KEYS.USER_INFO);
            console.log('efeeeee',erpiD.erpID);
            const { contractId } = this.state;
            if (!contractId) {
                console.log('No contract ID available to fetch PDF');
                return;
            }

            const params = { contract_id: contractId,erpID: erpiD.erpID  };
            const response = await makeRequest(BASE_URL + '/mobile/contractpdf', params);
            const { success, message, pdfLink } = response;
            console.log('PDF response:', response);
            if (success) {
                console.log('PDF Link:', pdfLink);
                // Handle PDF link as needed, e.g., opening it
                Linking.openURL(pdfLink);
            } else {
                console.log('Error fetching PDF:', message);
            }
        } catch (error) {
            console.log('Error fetching PDF:', error);
        }
    };




    render() {
        const { tableHead, rowData } = this.state;
        return (
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 3, 3, 2, 2]} />
                    {rowData.map((rowData, index) => (
                        <Row
                            key={index}
                            data={[
                                <TouchableOpacity key={'indent_id'} onPress={() => this.handlePressProductID(rowData.reverse_id)}>
                                    <Text style={styles.Highlight}>{rowData.reverse_id}</Text>
                                </TouchableOpacity>,

                                <TouchableOpacity key={'contract_name'} onPress={() => this.handlePressContract(rowData.contract_id)}>
                                    <Text style={styles.Highlight}>{rowData.contact_name}</Text>
                                </TouchableOpacity>,

                                <Text style={styles.rowText}>{rowData.product}</Text>,
                                <Text style={styles.rowText}>{rowData.received_name}</Text>,
                                <Text style={styles.rowText}>{rowData.date}</Text>,


                            ]}
                            textStyle={styles.rowText}
                            style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                            flexArr={[0, 3, 3, 2, 2]}
                        />
                    ))}
                </Table>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginTop: wp(2)
    },
    head: {
        backgroundColor: '#197486',
        width: wp(95),
        height: wp(12)
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp(3),
        fontWeight: '500'
    },
    rowEven: {
        backgroundColor: '#d4eef4',
        width: wp(95),
        height: wp(12)
    },
    rowOdd: {
        backgroundColor: '#f4fdfe',
        width: wp(95),
        height: wp(12)
    },
    rowText: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.5),
        paddingHorizontal: wp(0.3),
        marginLeft: 4,
        fontWeight: '400'
    },
    Highlight: {
        color: 'red',
        textAlign: 'left',
        fontSize: wp(2.5),
        fontWeight: '500',
        paddingHorizontal: wp(0.3),
        marginLeft: 4,

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
        height: wp(60)
    },
});
export default Reverses_Table