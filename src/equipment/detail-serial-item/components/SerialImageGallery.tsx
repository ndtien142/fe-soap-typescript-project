import { m, AnimatePresence } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import { List, IconButton, ListItem, ListItemText } from '@mui/material';
import Image from 'src/common/components/Image';
import Iconify from 'src/common/components/Iconify';
import { varFade } from 'src/common/components/animate';

type SerialImageGalleryProps = {
  images: { url: string; id?: string | number; name?: string }[];
  showPreview?: boolean;
  onRemove?: (img: { url: string; id?: string | number }) => void;
};

function getFileData(img: { url: string; id?: string | number; name?: string }, index: number) {
  return {
    key: img.id ?? img.url ?? index,
    name: img.name ?? '',
    preview: img.url,
  };
}

export default function SerialImageGallery({
  images,
  showPreview = true,
  onRemove,
}: SerialImageGalleryProps) {
  const hasFile = images && images.length > 0;
  const handleRemove = (img: { url: string; id?: string | number }) => {
    if (onRemove) {
      onRemove(img);
    }
  };
  return (
    <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
      <AnimatePresence>
        {images.map((img, index) => {
          const { key, preview } = getFileData(img, index);

          if (showPreview) {
            return (
              <ListItem
                key={key}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  p: 0,
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.25,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'inline-flex',
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Image alt="preview" src={preview} ratio="1/1" />
                <IconButton
                  size="small"
                  onClick={() => handleRemove(img)}
                  sx={{
                    top: 6,
                    p: '2px',
                    right: 6,
                    position: 'absolute',
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    },
                  }}
                >
                  <Iconify icon={'eva:close-fill'} />
                </IconButton>
              </ListItem>
            );
          }

          return (
            <ListItem
              key={key}
              component={m.div}
              {...varFade().inRight}
              sx={{
                my: 1,
                px: 2,
                py: 0.75,
                borderRadius: 0.75,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Iconify
                icon={'eva:file-fill'}
                sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }}
              />
              <ListItemText primary={img.url} primaryTypographyProps={{ variant: 'subtitle2' }} />
              {onRemove && (
                <IconButton edge="end" size="small" onClick={() => onRemove(img)}>
                  <Iconify icon={'eva:close-fill'} />
                </IconButton>
              )}
            </ListItem>
          );
        })}
      </AnimatePresence>
    </List>
  );
}
