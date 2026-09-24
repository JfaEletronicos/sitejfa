import { PRODUCTS } from '../data/products';

/** Remove acentos, hífens e espaços extras e converte para minúsculas. */
export const normalize = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
/** Versão de `normalize` sem nenhum espaço (casa "k 600" com "k600"). */
export const compact = (s) => normalize(s).replace(/\s+/g, '');

const fieldTier = (fieldRaw, q, qc) => {
  const f = normalize(fieldRaw),
    fc = compact(fieldRaw);
  if (f === q) return 'exact';
  if (f.startsWith(q)) return 'starts';
  if (f.includes(q) || fc.includes(qc)) return 'contains';
  return null;
};
const TIER_SCORE = {
  name: { exact: 100, starts: 90, contains: 70 },
  alias: { exact: 80, starts: 75, contains: 60 },
  category: { exact: 45, starts: 42, contains: 40 },
};
const scoreProduct = (p, q, qc) => {
  let best = 0;
  const nt = fieldTier(p.name, q, qc);
  if (nt) best = Math.max(best, TIER_SCORE.name[nt]);
  p.aliases.forEach((a) => {
    const at = fieldTier(a, q, qc);
    if (at) best = Math.max(best, TIER_SCORE.alias[at]);
  });
  const ct = fieldTier(p.category, q, qc);
  if (ct) best = Math.max(best, TIER_SCORE.category[ct]);
  return best;
};

/**
 * Busca produtos por nome, alias ou categoria e devolve os resultados
 * ordenados por relevância. Itens fora de linha só aparecem em matches fortes.
 */
export const searchCatalog = (query) => {
  const q = normalize(query),
    qc = compact(query);
  if (!q) return [];
  let scored = PRODUCTS.map((p) => ({ p, score: scoreProduct(p, q, qc) })).filter((x) => x.score > 0);
  scored = scored.filter((x) => x.p.status !== 'discontinued' || x.score >= 90);
  scored.sort((a, b) => b.score - a.score);
  return scored.map((x) => x.p);
};
