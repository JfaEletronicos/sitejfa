import { createBehaviorContext, watchReducedMotion } from './context';
import { initHeader } from './header';
import { initGlobalSearch } from './globalSearch';
import { initQuickAccess } from './quickAccess';
import { initPartsPromo } from './partsPromo';
import { initBuySection } from './buySection';
import { initTechMarquee } from './techMarquee';
import { initHero } from './hero';
import { initProductsCarousel } from './productsCarousel';
import { initFronts } from './fronts';
import { initRepresentatives } from './representatives';
import { initManuals } from './manuals';
import { initDarkExperience } from './darkExperience';
import { initEnergyField } from './energyField';
import { initFooter } from './footer';
import { initCampaignCarousel } from './campaignCarousel';
import { initRouter } from './router';

/**
 * Liga todos os comportamentos interativos do site (animações, carrosséis, roteador,
 * buscas, mapa etc.) sobre o DOM já renderizado pelo React.
 *
 * A ordem importa: alguns módulos expõem funções no contexto usadas por outros
 * (ex.: `syncHeaderSpacer`, `setProductsCategory`, `refreshManualsField`).
 *
 * @returns {() => void} Função que desfaz tudo (listeners, observers, timers, rAF).
 */
export function initPageBehaviors() {
  const ctx = createBehaviorContext();

  initProductsCarousel(ctx);
  initTechMarquee(ctx);
  initHeader(ctx);
  initGlobalSearch(ctx);
  initQuickAccess(ctx);
  initPartsPromo(ctx);
  initBuySection(ctx);
  initHero(ctx);
  initFronts(ctx);
  watchReducedMotion(ctx);
  initRepresentatives(ctx);
  initManuals(ctx);
  initDarkExperience(ctx);
  initEnergyField(ctx);
  initFooter(ctx);
  initCampaignCarousel(ctx);
  initRouter(ctx);

  return () => {
    ctx.cleanups.forEach((fn) => {
      try {
        fn();
      } catch {
        /* ignora falhas individuais de limpeza */
      }
    });
  };
}
