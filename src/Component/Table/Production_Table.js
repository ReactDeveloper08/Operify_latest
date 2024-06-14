import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import React, {Component} from 'react';
import {Table, Row} from 'react-native-table-component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BASE_URL, makeRequest} from '../../api/Api_info';
import { KEYS, getData } from '../../api/User_Preference';

export default class Production_Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: [
        'Id',
        'Date',
        'Contract Name',
        'Product',
        'Plan Qty',
        'Prep Qty',
      ],
      rowData: [],
      contractId: '',
      productionId: '',
    };
  }
  componentDidMount() {
    this.handleProductionOrder();
  }

  handleProductionOrder = async () => {
    try {
      const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
      const params = { erpID: erpiD.erpID };
      const response = await makeRequest(BASE_URL + '/mobile/dashboard',params);
      // console.log("production_table",response);
      const {success, message, productionDetails} = response;
      if (success) {
        const modifiedProductionDetails = productionDetails.map(
          ({
            po_id,
            date,
            contact_name,
            product,
            plannedqty,
            preparedqty,
            contract_id,
          }) => ({
            po_id,
            date,
            contact_name,
            product,
            plannedqty,
            preparedqty,
            contract_id,
          }),
        ); // changes by manish
        this.setState({rowData: modifiedProductionDetails}); // chnages by manish
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // pdf api by manish
  handlePressProductID = productionId => {
    this.setState({productionId}, this._handlePressProductpdf); // Pass a reference to _handlePressProductpdf
  };

  _handlePressProductpdf = async () => {
    try {
      const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
      const {productionId} = this.state;
      if (!productionId) {
        console.log('No contract ID available to fetch PDF');
        return;
      }
      const params = {production_id: productionId,erpID: erpiD.erpID};
      console.log('papapapapapap', params);
      const response = await makeRequest(
        BASE_URL + '/mobile/productionorderpdf',
        params,
      );
      const {success, message, pdfLink} = response;
      console.log('pdfpdfpdf', response);
      if (success) {
        console.log('PDF Link:', pdfLink);
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

  // pdf api by manish

  handlePressContract = contractId => {
    this.setState({contractId}, this._handleContractPdf);
  };

  _handleContractPdf = async () => {
    try {
      const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
      const {contractId} = this.state;
      if (!contractId) {
        console.log('No contract ID available to fetch PDF');
        return;
      }

      const params = {contract_id: contractId,erpID: erpiD.erpID};
      const response = await makeRequest(
        BASE_URL + '/mobile/contractpdf',
        params,
      );
      const {success, message, pdfLink} = response;
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
    const {tableHead, rowData} = this.state;
    return (
      <View style={styles.container}>
        <Table borderStyle={{borderWidth: wp(0.2), borderColor: 'white'}}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
            flexArr={[0, 2, 3, 3, 1, 1]}
          />
          {rowData.map((rowData, index) => (
            <Row
              key={index}
              data={[
                <TouchableOpacity
                  key={'po_id'}
                  onPress={() => this.handlePressProductID(rowData.po_id)}>
                  <Text style={styles.Highlight}>{rowData.po_id}</Text>
                </TouchableOpacity>,

                <Text style={styles.rowText}>{rowData.date}</Text>,

                <TouchableOpacity
                  key={'contract_name'}
                  onPress={() => this.handlePressContract(rowData.contract_id)}>
                  <Text style={styles.Highlight}>{rowData.contact_name}</Text>
                </TouchableOpacity>,
                <Text style={styles.rowText}>{rowData.product}</Text>,
                <Text style={styles.rowText}>{rowData.plannedqty}</Text>,
                <Text style={styles.rowText}>{rowData.preparedqty}</Text>,
              ]}
              textStyle={styles.rowText}
              style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
              flexArr={[0, 2, 3, 3, 1, 1]}
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
    backgroundColor: '#40856f',
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
    backgroundColor: '#d2e5df',
    width: wp(95),
    height: wp(13),
  },
  rowOdd: {
    backgroundColor: '#f3faf7',
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
