import Slider from 'react-slick';
import { useState, useEffect, useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Link,
  Stack,
  Input,
  Button,
  Avatar,
  Dialog,
  Tooltip,
  TextField,
  CardProps,
  Typography,
  CardHeader,
  InputProps,
  DialogTitle,
  DialogProps,
  DialogActions,
  Slider as MuiSlider,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import { CarouselArrows } from '../../../../components/carousel';

// ----------------------------------------------------------------------

const MIN_AMOUNT = 0;

const MAX_AMOUNT = 1000;

const STEP = 50;

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }[];
}

export default function BankingQuickTransfer({ title, subheader, list, sx, ...other }: Props) {
  const theme = useTheme();

  const carouselRef = useRef<Slider | null>(null);

  const [autoWidth, setAutoWidth] = useState(24);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [selectContact, setSelectContact] = useState(0);

  const [amount, setAmount] = useState<AmountProps>(0);

  const getContactInfo = list.find((_, index) => index === selectContact);

  const sliderSettings = {
    dots: false,
    arrows: false,
    slidesToShow: 7,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    centerPadding: '0px',
    rtl: Boolean(theme.direction === 'rtl'),
    beforeChange: (current: number, next: number) => setSelectContact(next),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        settings: {
          slidesToShow: 5,
        },
      },
    ],
  };

  useEffect(() => {
    if (amount) {
      handleAutoWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleAutoWidth = () => {
    const getNumberLength = amount.toString().length;
    setAutoWidth(getNumberLength * 22);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setAmount(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (amount < 0) {
      setAmount(0);
    } else if (amount > MAX_AMOUNT) {
      setAmount(MAX_AMOUNT);
    }
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: 0,
          bgcolor: 'background.neutral',
          ...sx,
        }}
        {...other}
      >
        <CardHeader title={title} subheader={subheader} />

        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Recent
            </Typography>
            <Link sx={{ typography: 'button' }}>View All</Link>
          </Stack>

          <Box sx={{ position: 'relative' }}>
            <CarouselArrows
              filled
              onPrevious={handlePrevious}
              onNext={handleNext}
              customIcon={'eva:arrow-ios-forward-fill'}
              sx={{
                '& .arrow': {
                  mt: '-14px',
                  '&.left': { left: -16 },
                  '&.right': { right: -16 },
                  '& button': { width: 28, height: 28, borderRadius: '50%', p: 0.75 },
                },
              }}
            >
              <Slider ref={carouselRef} {...sliderSettings}>
                {list.map((contact, index) => (
                  <Box key={contact.id} sx={{ py: 5 }}>
                    <Box sx={{ width: 40, height: 40 }}>
                      <Tooltip key={contact.id} title={contact.name} arrow placement="top">
                        <Avatar
                          src={contact.avatar}
                          sx={{
                            opacity: 0.48,
                            cursor: 'pointer',
                            transition: (theme) => theme.transitions.create('all'),
                            ...(selectContact === index && {
                              opacity: 1,
                              transform: 'scale(1.25)',
                              boxShadow: '-4px 12px 24px 0 rgb(0,0,0,0.24)',
                            }),
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Slider>
            </CarouselArrows>
          </Box>

          <Stack spacing={3}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              insert amount
            </Typography>

            <InputAmount
              onBlur={handleBlur}
              onChange={handleInputChange}
              autoWidth={autoWidth}
              amount={amount}
            />

            <MuiSlider
              value={typeof amount === 'number' ? amount : 0}
              valueLabelDisplay="auto"
              step={STEP}
              marks
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              onChange={handleSliderChange}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Your Balance
              </Typography>
              <Typography variant="subtitle1">{fCurrency(34212)}</Typography>
            </Stack>

            <Button
              variant="contained"
              size="large"
              disabled={amount === 0}
              onClick={handleOpenConfirm}
            >
              Transfer Now
            </Button>
          </Stack>
        </Box>
      </Card>

      <ConfirmTransferDialog
        open={openConfirm}
        autoWidth={autoWidth}
        amount={amount}
        contactInfo={getContactInfo}
        onClose={handleCloseConfirm}
        onBlur={handleBlur}
        onChange={handleInputChange}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type AmountProps = number | string | Array<number | string>;

interface InputAmountProps extends InputProps {
  autoWidth: number;
  amount: AmountProps;
}

function InputAmount({ autoWidth, amount, onBlur, onChange, sx, ...other }: InputAmountProps) {
  return (
    <Stack direction="row" justifyContent="center" spacing={1} sx={sx}>
      <Typography variant="h5">$</Typography>
      <Input
        disableUnderline
        size="small"
        value={amount}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={{ step: STEP, min: MIN_AMOUNT, max: MAX_AMOUNT, type: 'number' }}
        sx={{
          typography: 'h3',
          '& input': {
            p: 0,
            textAlign: 'center',
            width: autoWidth,
          },
        }}
        {...other}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

type TConfirmTransferDialogProps = InputAmountProps & DialogProps;

interface ConfirmTransferDialogProps extends TConfirmTransferDialogProps {
  contactInfo?: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  onClose: VoidFunction;
}

function ConfirmTransferDialog({
  open,
  amount,
  autoWidth,
  contactInfo,
  onClose,
  onBlur,
  onChange,
}: ConfirmTransferDialogProps) {
  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Transfer to</DialogTitle>

      <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={contactInfo?.avatar} sx={{ width: 48, height: 48 }} />

          <div>
            <Typography variant="subtitle2">{contactInfo?.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {contactInfo?.email}
            </Typography>
          </div>
        </Stack>

        <InputAmount
          onBlur={onBlur}
          onChange={onChange}
          autoWidth={autoWidth}
          amount={amount}
          disableUnderline={false}
          sx={{ justifyContent: 'flex-end' }}
        />

        <TextField fullWidth multiline rows={2} placeholder="Write a message..." />
      </Stack>

      <DialogActions>
        <Button variant="contained" disabled={amount === 0} onClick={onClose}>
          Confirm & Transfer
        </Button>

        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
