import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import { KEYS, getData } from '../../api/User_Preference';
export default class Po_Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Id', 'Date', 'Vendor', 'Qty', 'Amount', 'Delivery'],
      rowData: [],
      purchaseorderIId: '',
      purchaseorderId: '',
      poPrimary: '',
      isRevised: '',
    };
  }
  componentDidMount() {
    this.handlePurchaseOrder();
  }

  handlePurchaseOrder = async () => {
    try {
      const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
      const params = { erpID: erpiD.erpID };
      const response = await makeRequest(BASE_URL + '/mobile/dashboard',params);
      // console.log('po_table',response);
      const { success, message, poDetails } = response;
      if (success) {
        const modifiedPurchaseDetails = poDetails.map(
          ({
            purchaseorder_id,
            po_primary,
            is_revised,
            poid,
            date,
            supplier,
            qty,
            amount,
            delivery,
          }) => ({
            purchaseorder_id,
            po_primary,
            is_revised,
            poid,
            date,
            supplier,
            qty,
            amount,
            delivery,
          }),
        ); // change by manish
        this.setState({ rowData: modifiedPurchaseDetails }); // changes  by mansih
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handlePressProductID = (purchaseorderIId, purchaseorderId, poPrimary, isRevised) => {
    this.setState(
      { purchaseorderIId, purchaseorderId, poPrimary, isRevised },
      this.handlePurchaseId,
    );
    console.log('aqaqaqw12123123', purchaseorderIId, purchaseorderId, poPrimary, isRevised);
  };

  handlePurchaseId = async () => {
    try {
      const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
      const { purchaseorderId, poPrimary, isRevised } = this.state;
      const params = {
        purchaseorder_id: purchaseorderId,
        po_primary: poPrimary,
        is_revised: isRevised,
        erpID: erpiD.erpID
      };
      console.log('papapapapapap', params);
      const response = await makeRequest(
        BASE_URL + '/mobile/purchaseorderpdf',
        params,
      );
      const { success, message, pdfLink } = response;
      console.log('pdfpdfpdf', response);
      if (success) {
        this.setState({ cellData: pdfLink });
        Linking.openURL(pdfLink);
      } else {
        console.log('====================================');
        console.log(message);
        console.log('====================================');
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { tableHead, rowData } = this.state;
    return (
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
            flexArr={[1.5, 2.3, 3, 1.5, 2, 2.3]}
          />
          {rowData.map((rowData, index) => (
            <Row
              key={index}
              data={[
                <TouchableOpacity
                  key="poid"
                  onPress={() =>
                    this.handlePressProductID(
                      rowData.poid,
                      rowData.purchaseorder_id,
                      rowData.po_primary,
                      rowData.is_revised,
                    )
                  }>
                  <Text style={styles.Highlight}>{rowData.poid}</Text>
                </TouchableOpacity>,
                <Text style={styles.rowText}>{rowData.date}</Text>,
                <Text style={styles.rowText}>{rowData.supplier}</Text>,
                <Text Text style={styles.rowText}>
                  {rowData.qty}
                </Text>,
                <Text style={styles.rowText}>{rowData.amount}</Text>,
                <Text style={styles.rowText}>{rowData.delivery}</Text>,
              ]}
              textStyle={styles.rowText}
              style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
              flexArr={[1.5, 2.3, 3, 1.5, 2, 2.3]}
            />
          ))}
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: wp(2),
  },
  head: {
    backgroundColor: '#039BE5',
    width: wp(95),
    height: wp(12),
  },
  headText: {
    color: 'white',
    textAlign: 'center',
    fontSize: wp(3),
    fontWeight: '500',
  },
  rowEven: {
    backgroundColor: '#81D4FA',
    width: wp(95),
    height: wp(13),
  },
  rowOdd: {
    backgroundColor: '#B3E5FC',
    width: wp(95),
    height: wp(13),
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
