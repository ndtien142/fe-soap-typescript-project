import { Page, View, Text, Document } from '@react-pdf/renderer';
import styles from './BorrowReceiptStyle';
import Label from 'src/common/components/Label';
import { fDate } from 'src/common/utils/formatTime';

// ----------------------------------------------------------------------

type Props = {
  borrowReceipt: any;
};

export default function BorrowReceiptPDF({ borrowReceipt }: Props) {
  if (!borrowReceipt) return null;

  const { id, status, note, room, requestedBy, borrowEquipments, requestItems, returnDate } =
    borrowReceipt;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Text style={styles.h3}>PHIẾU MƯỢN THIẾT BỊ</Text>
          <Text>{`#${id}`}</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Phòng mượn</Text>
            <Text style={styles.body1}>{room?.roomName}</Text>
            <Text style={styles.body1}>{room?.department?.departmentName}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Người mượn</Text>
            <Text style={styles.body1}>{requestedBy?.username}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]}>Ngày trả dự kiến</Text>
            <Text style={styles.body1}>{returnDate ? fDate(returnDate) : '-'}</Text>
          </View>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]}>Trạng thái</Text>
            <Text style={styles.body1}>{status}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>Chi tiết nhóm thiết bị mượn</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Mã nhóm thiết bị</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Tên nhóm</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Số lượng</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Loại thiết bị</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Hãng sản xuất</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableBody}>
            {requestItems?.map((item: any, idx: number) => (
              <View style={styles.tableRow} key={item.groupEquipmentCode}>
                <View style={styles.tableCell_1}>
                  <Text>{idx + 1}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text>{item.groupEquipmentCode}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.type?.name}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.manufacturer?.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8, { marginTop: 16 }]}>
          Danh sách thiết bị mượn
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Serial Number</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Mã nhóm thiết bị</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Trạng thái</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableBody}>
            {borrowEquipments?.map((eq: any, idx: number) => (
              <View style={styles.tableRow} key={eq.serialNumber}>
                <View style={styles.tableCell_1}>
                  <Text>{idx + 1}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text>{eq.serialNumber}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text>{eq.groupEquipmentCode}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{eq.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>Ghi chú</Text>
            <Text>{note || 'Không có ghi chú.'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
