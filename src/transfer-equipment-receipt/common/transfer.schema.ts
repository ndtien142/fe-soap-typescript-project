import * as Yup from 'yup';

export const TransferCreateSchema = Yup.object().shape({
  transferDate: Yup.string().required('Ngày chuyển là bắt buộc'),
  transferFrom: Yup.string().required('Phòng chuyển là bắt buộc'),
  transferTo: Yup.string().required('Phòng nhận là bắt buộc'),
  userCode: Yup.string().required('Người chịu trách nhiệm là bắt buộc'),
  notes: Yup.string(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        serialNumber: Yup.string().required('Serial thiết bị là bắt buộc'),
        notes: Yup.string(),
      })
    )
    .min(1, 'Chọn ít nhất một thiết bị')
    .required('Danh sách thiết bị là bắt buộc'),
});
