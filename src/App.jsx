import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickAccess from './components/QuickAccess';
import Fronts from './components/Fronts';
import Products from './components/Products';
import TechMarquee from './components/TechMarquee';
import BuySection from './components/BuySection';
import PartsPromo from './components/PartsPromo';
import DarkExperience from './components/DarkExperience';
import Offer from './components/Offer';
import Footer from './components/Footer';
import { initPageBehaviors } from './behaviors';

export default function App() {
  // Os comportamentos interativos são ligados uma única vez sobre o DOM
  // renderizado e desfeitos por completo ao desmontar.
  useEffect(() => initPageBehaviors(), []);

  return (
    <div className="jfa-page" id="jfaPage">
      <Header />
      <Hero />
      <QuickAccess />
      <Fronts />
      <Products />
      <TechMarquee />
      <BuySection />
      <PartsPromo />
      <DarkExperience />
      <Offer />
      <Footer />
    </div>
  );
}
