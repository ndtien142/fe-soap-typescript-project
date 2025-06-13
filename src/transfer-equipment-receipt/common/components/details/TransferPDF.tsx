import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fCurrency } from '../../../../common/utils/formatNumber';
import { fDate } from '../../../../common/utils/formatTime';
// @types
import { ITransferReceipts } from 'src/common/@types/transfer-receipt/transfer-receipt.interface';
//
import styles from './TransferStyle';

// ----------------------------------------------------------------------

type Props = {
  transfer: ITransferReceipts;
};

const TransferPDF = ({ transfer }: Props) => {
  const {
    items = [],
    status,
    transferDate,
    transferTo,
    transferFrom,
    createdBy,
    id,
    notes,
  } = transfer;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/logo/logo_full.jpg" style={{ height: 32 }} />
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{status}</Text>
            <Text>{`ID-${id}`}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Transfer from</Text>
            <Text style={styles.body1}>{transferFrom?.name}</Text>
            <Text style={styles.body1}>ID: {transferFrom?.id}</Text>
          </View>

          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Transfer to</Text>
            <Text style={styles.body1}>{transferTo?.name}</Text>
            <Text style={styles.body1}>ID: {transferTo?.id}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Transfer date</Text>
            <Text style={styles.body1}>{transferDate}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Người tạo</Text>
            <Text style={styles.body1}>{createdBy?.username}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>Danh sách thiết bị</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Tên thiết bị</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Serial</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Loại thiết bị</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Mô tả</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {items.map((item, index) => (
              <View style={styles.tableRow} key={item.serialNumber}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.type?.name}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text>{item.serialNumber}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.type?.name}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>GHI CHÚ</Text>
            <Text>{notes ? notes.replace(/<[^>]+>/g, '') : ''}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TransferPDF;
