import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppLoader from './Components/AppLoader/AppLoader';
import AppRouter from './Components/AppRouter/AppRouter';
import routes from './Routes/Routes';
import Header from './Components/Common/Header/Header';
import Footer from './Components/Common/Footer/Footer';
import Chatbot from './Components/Common/Chatbot/Chatbot';
import BookingModal from './Components/Common/BookingModal/BookingModal';
import { useBookingModal } from './Context/BookingModalContext';
import { initAttributionCapture } from './Utils/attribution';
import { initRecaptchaOnLanding } from './Utils/recaptcha';

// New Changes - ChatBot Change

export default function App() {
  const location = useLocation();
  const [ pageLoading, setPageLoading ] = useState(true);
  const { isOpen, closeModal } = useBookingModal();

  // Initialize attribution capture and reCAPTCHA v3 (once on landing)
  useEffect(() => {
    initAttributionCapture();
    initRecaptchaOnLanding();
  }, []);

  useEffect(() => {
    setPageLoading(true);

    const timeout = setTimeout(() => {
      setPageLoading(false);
    }, 1500); // Adjust loader duration

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Normal site - Chatbot stays mounted outside pageLoading so it doesn't reset when navigating
  return (
    <>
      <AppLoader isVisible={pageLoading} />
      {!pageLoading && (
        <Fragment>
          <Header />
          <AppRouter routes={routes} />
          <Footer />
          <BookingModal isOpen={isOpen} onClose={closeModal} />
        </Fragment>
      )}
      {location.pathname !== '/thank-you' && <Chatbot />}
    </>
  );
}