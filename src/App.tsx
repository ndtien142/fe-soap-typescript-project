// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './common/components/settings';
import { ChartStyle } from './common/components/chart';
import ScrollToTop from './common/components/ScrollToTop';
import { ProgressBarStyle } from './common/components/ProgressBar';
import NotistackProvider from './common/components/NotistackProvider';
import MotionLazyContainer from './common/components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <NotistackProvider>
            <ProgressBarStyle />
            <ChartStyle />
            <ScrollToTop />
            <Router />
          </NotistackProvider>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
