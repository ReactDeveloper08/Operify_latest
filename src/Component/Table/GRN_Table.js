/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {BASE_URL, makeRequest} from '../../api/Api_info';
import { KEYS, getData } from '../../api/User_Preference';
export class GRN_Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Id', 'Po Id', 'Date', 'Bill Date', 'Supplier', 'Amount '],
      rowData: [],
      goodsID: '',
      cellData: '',
    };
  }

  componentDidMount() {
    this.handleGrnOrder();
  }

  handleGrnOrder = async () => {
    try {
      const erpiD = await getData(KEYS.USER_INFO);
      console.log('efeeeee', erpiD.erpID);
      const params = { erpID: erpiD.erpID };
      const response = await makeRequest(BASE_URL + '/mobile/dashboard',params);
      const {success, grnDetails} = response;
      if (success) {
        const modifiedGrnData = grnDetails.map(
          ({grnno, poid, date, billDate, supplier, amount}) => ({
            grnno,
            poid,
            date,
            billDate,
            supplier,
            amount,
          }),
        );
        this.setState({rowData: modifiedGrnData});
      } else {
        console.log('Failed to fetch data');
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  handlePress = cellData => {
    this.setState({goodsID: cellData}, () => {
      this._handleGRNPdf();
    });
  };
  _handleGRNPdf = async () => {
    try {
      const erpiD= await getData(KEYS.USER_INFO);
      console.log('efeeeee',erpiD.erpID);
      const {goodsID} = this.state;
      const params = {goodsID: goodsID.grnno,erpID: erpiD.erpID};
      console.log('papapapapapap', params);
      const response = await makeRequest(BASE_URL + '/mobile/grnpopup', params);
      const {success, message, pdfLink} = response;
      console.log('pdfpdfpdf', response);
      if (success) {
        this.setState({cellData: pdfLink});
        Linking.openURL(pdfLink);
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
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
            textStyle={styles.text}
            flexArr={[0, 0, 2, 2, 3, 2]}
          />
          {rowData.map((rowData, index) => (
            <Row
              key={index}
              data={[
                <TouchableOpacity
                  //   key={cellIndex}
                  onPress={() => this.handlePress(rowData.grnno)}>
                  <Text style={styles.Highlight}>{rowData.grnno}</Text>
                </TouchableOpacity>,
                <Text style={styles.rowText}>{rowData.poid}</Text>,
                <Text style={styles.rowText}>{rowData.date}</Text>,
                <Text style={styles.rowText}>{rowData.billDate}</Text>,
                <Text style={styles.rowText}>{rowData.supplier}</Text>,
                <Text
                  style={{
                    color: '#212529',
                    textAlign: 'right',
                    fontSize: wp(2.5),
                    paddingHorizontal: wp(0.3),
                    marginRight: 5, // Adjust the margin as per your preference
                    fontWeight: '400',
                  }}>
                  {rowData.amount}
                </Text>,
              ]}
              textStyle={styles.rowText}
              style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
              flexArr={[0, 0, 2, 2, 3, 2]}
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
    backgroundColor: '#8D6E63',
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
    backgroundColor: '#D7CCC8',
    width: wp(95),
    height: wp(12),
  },
  rowOdd: {
    backgroundColor: '#EFEBE9',
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
  Highlight: {
    color: 'red',
    textAlign: 'left',
    fontSize: wp(2.5),
    paddingHorizontal: wp(0.3),
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default GRN_Table;
