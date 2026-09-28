import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppFloat from './components/layout/WhatsAppFloat';
import Hero from './components/home/Hero';
import QuickAccess from './components/home/QuickAccess';
import Fronts from './components/home/Fronts';
import Products from './components/home/Products';
import CampaignCarousel from './components/home/CampaignCarousel';
import BuySection from './components/home/BuySection';
import PartsPromo from './components/home/PartsPromo';
import TechMarquee from './components/home/TechMarquee';
import DarkExperience from './components/home/DarkExperience';
import BatteriesPage from './components/pages/BatteriesPage';
import BatteryDetailPage from './components/pages/BatteryDetailPage';
import { SectorCatalogPage, SectorProductPage } from './components/pages/SectorPages';
import { SupportPage, RepresentativesPage, ManualsPage } from './components/pages/SectionPages';
import MoovPage from './components/pages/MoovPage';
import PartsPage from './components/pages/PartsPage';
import { initPageBehaviors } from './behaviors';
import { SHOW_MOOV, SHOW_PARTS } from './data/visibility';

export default function App() {
  // Os comportamentos interativos (incluindo o roteador por hash, que alterna
  // entre a Home e as páginas internas) são ligados uma única vez sobre o DOM
  // renderizado e desfeitos por completo ao desmontar.
  useEffect(() => initPageBehaviors(), []);

  return (
    <div className="jfa-page" id="jfaPage">
      <canvas className="page-energy-canvas" id="pageEnergyCanvas" aria-hidden="true" />
      <Header />
      <div id="homeView">
        <Hero />
        <QuickAccess />
        <Fronts />
        <Products />
        <BuySection />
        <CampaignCarousel />
        {/* OCULTO: Moov/Parts (data/visibility.js) */}
        {SHOW_PARTS && <PartsPromo />}
        <TechMarquee />
        <DarkExperience />
      </div>
      <BatteriesPage />
      <BatteryDetailPage />
      <SectorCatalogPage />
      <SectorProductPage />
      {/* OCULTO: Moov/Parts (data/visibility.js) */}
      {SHOW_MOOV && <MoovPage />}
      {SHOW_PARTS && <PartsPage />}
      <SupportPage />
      <RepresentativesPage />
      <ManualsPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
