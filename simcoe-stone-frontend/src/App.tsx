import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ServicePage from './components/ServicePage';
import ServiceAreaPage from './components/ServiceAreaPage';
import Portfolio from './components/Portfolio';
import MixedPortfolio from './components/MixedPortfolio';
import About from './components/About';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import EmergencyRepair from './components/EmergencyRepair';
import FAQ from './components/FAQ';
import Estimate from './components/Estimate';
import AllServices from './components/AllServices';
import Footer from './components/Footer';
import SEO from './components/SEO';
import StructuredData from './components/StructuredData';
import AutoSEOEnhancer from './components/AutoSEOEnhancer';
import NotFoundPage from './components/NotFoundPage';
import Analytics, { PerformanceTracker } from './components/Analytics';
import StoneCareGuide from './components/StoneCareGuide';
import FloatingCallButton from './components/FloatingCallButton';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <SEO pageType="home" />
          <StructuredData />
          <AutoSEOEnhancer pageType="home" />
          <Analytics />
          <PerformanceTracker />
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Services />
                <EmergencyRepair />
                <Portfolio />
                <Testimonials />
                <About />
                <ContactForm />
              </>
            } />
            <Route path="/portfolio" element={<MixedPortfolio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/all-services" element={<AllServices />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/consultation" element={<ContactForm />} />
            <Route path="/emergency" element={<EmergencyRepair />} />
            <Route path="/emergency-repair" element={<EmergencyRepair />} />
            <Route path="/service-areas/:areaSlug" element={<ServiceAreaPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/estimate" element={<Estimate />} />
            <Route path="/free-estimate" element={<Estimate />} />
            <Route path="/stone-care-guide" element={<StoneCareGuide />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <FloatingCallButton />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
