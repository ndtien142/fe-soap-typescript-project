import Slider from 'react-slick';
import { useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Chip,
  Stack,
  Avatar,
  Rating,
  Button,
  CardProps,
  CardHeader,
  Typography,
} from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// components
import Iconify from '../../../../components/Iconify';
import { CarouselArrows } from '../../../../components/carousel';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  rating: number;
  postedAt: Date | string | number;
  tags: string[];
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function BookingCustomerReviews({ title, subheader, list, ...other }: Props) {
  const theme = useTheme();

  const carouselRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    adaptiveHeight: true,
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <CarouselArrows
            customIcon={'ic:round-keyboard-arrow-right'}
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{ '& .arrow': { width: 28, height: 28, p: 0 } }}
          />
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {list.map((item) => (
          <ReviewItem key={item.id} item={item} />
        ))}
      </Slider>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ReviewItemProps = {
  item: ItemProps;
};

function ReviewItem({ item }: ReviewItemProps) {
  const { avatar, name, description, rating, postedAt, tags } = item;

  return (
    <Stack spacing={2} sx={{ minHeight: 402, position: 'relative', p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={name} src={avatar} />
        <div>
          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            Posted {fDateTime(postedAt)}
          </Typography>
        </div>
      </Stack>

      <Rating value={rating} size="small" readOnly precision={0.5} />
      <Typography variant="body2">{description}</Typography>

      <Stack direction="row" flexWrap="wrap">
        {tags.map((tag) => (
          <Chip size="small" key={tag} label={tag} sx={{ mr: 1, mb: 1, color: 'text.secondary' }} />
        ))}
      </Stack>

      <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexGrow: 1 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
        >
          Accept
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="error"
          endIcon={<Iconify icon={'eva:close-circle-fill'} />}
        >
          Reject
        </Button>
      </Stack>
    </Stack>
  );
}
