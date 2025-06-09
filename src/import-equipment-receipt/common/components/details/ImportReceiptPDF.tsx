import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fCurrency } from 'src/common/utils/formatNumber';
import styles from './ImportReceiptStyle';
import { IImportReceipt } from 'src/common/@types/import-receipt/import-receipt.interface';
import { fDate } from 'src/common/utils/formatTime';

// ----------------------------------------------------------------------

type Props = {
  importReceipt: IImportReceipt;
};

export default function ImportReceiptPDF({ importReceipt }: Props) {
  const {
    id,
    name,
    items,
    status,
    dateOfOrder,
    dateOfReceived,
    dateOfActualReceived,
    note,
    supplier,
    requestedUser,
    // approvedBy,
  } = importReceipt;

  const subTotalPrice = items?.reduce(
    (sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const totalPrice = subTotalPrice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/logo/logo_full.jpg" style={{ height: 32 }} />
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{status}</Text>
            <Text>{name || `Phiếu nhập #${id}`}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Nhà cung cấp</Text>
            <Text style={styles.body1}>{supplier?.name}</Text>
            <Text style={styles.body1}>{supplier?.address}</Text>
            <Text style={styles.body1}>{supplier?.phone}</Text>
            <Text style={styles.body1}>{supplier?.email}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Người yêu cầu</Text>
            <Text style={styles.body1}>{requestedUser?.username}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]}>Ngày đặt hàng</Text>
            <Text style={styles.body1}>{dateOfOrder && fDate(dateOfOrder)}</Text>
          </View>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]}>Ngày nhận hàng dự kiến</Text>
            <Text style={styles.body1}>{dateOfReceived && fDate(dateOfReceived)}</Text>
          </View>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]}>Ngày nhận hàng thực tế</Text>
            <Text style={styles.body1}>{dateOfActualReceived && fDate(dateOfActualReceived)}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>Chi tiết phiếu nhập</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Mã thiết bị</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Tên thiết bị</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Số lượng</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Đơn giá</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>Thành tiền</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {items.map((item, index) => (
              <View style={styles.tableRow} key={item.code}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text>{item.code}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{fCurrency(item.price)}</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Tạm tính</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(subTotalPrice)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Tổng cộng</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(totalPrice)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>Ghi chú</Text>
            <Text>{note || 'Không có ghi chú.'}</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Liên hệ hỗ trợ</Text>
            <Text>{supplier?.email || 'support@abcapp.com'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
