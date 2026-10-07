// Linha do tempo do filme (segundos). A duração é visual — a música entra depois
// e não dita o ritmo. Total: 30 s.
//   0 – 19 s  : 3D (takes 01–13)
//  19 – 27 s  : filmagem real (takes 14–16), inserida na montagem final
//  27 – 30 s  : encerramento "JFA — Energia que vira som."
export const END_3D = 19;
export const REAL_START = 19;
export const END_CARD_START = 27;
export const TOTAL = 30;

// cam: from/to = posição; tgtFrom/tgtTo = ponto de mira; fov = [início, fim]
export const TAKES = [
  { id: '01', name: 'Bateria / revelação', start: 0, end: 1.8,
    cam: { from: [0.05, 0.22, 2.3], to: [0.9, 0.7, 3.6], tgtFrom: [0, 0.75, 0], tgtTo: [0, 0.5, 0], fov: [28, 32] } },
  { id: '02', name: 'Bateria / ângulo', start: 1.8, end: 3.0,
    cam: { from: [2.7, 1.9, -1.9], to: [2.1, 1.6, -2.6], tgtFrom: [0, 0.5, 0], fov: [32] } },
  { id: '03', name: 'Bateria / close', start: 3.0, end: 4.2,
    cam: { from: [-0.95, 1.35, 1.15], to: [-0.5, 1.22, 1.3], tgtFrom: [-0.55, 0.95, 0.2], tgtTo: [-0.35, 0.85, 0.3], fov: [26] } },
  { id: '04', name: 'Bateria / transformação', start: 4.2, end: 6.6,
    cam: { from: [2.6, 1.7, 3.3], to: [-1.9, 1.4, 3.6], tgtFrom: [0, 0.7, 0], tgtTo: [0, 0.4, 0], fov: [35] } },
  { id: '05', name: 'Fonte', start: 6.6, end: 7.8,
    cam: { from: [1.9, 0.45, 2.6], to: [1.2, 0.55, 2.95], tgtFrom: [0, 0.35, 0], fov: [30] } },
  { id: '06', name: 'Fonte / close + voltímetro', start: 7.8, end: 9.6,
    cam: { from: [-0.6, 0.45, 1.75], to: [0.35, 0.38, 1.55], tgtFrom: [-0.75, 0.27, 0.66], tgtTo: [0.55, 0.27, 0.66], fov: [28] } },
  { id: '07', name: 'Fonte / transformação', start: 9.6, end: 11.6,
    cam: { from: [0.2, 1.1, 4.0], to: [2.8, 2.0, 5.2], tgtFrom: [0, 0.45, 0], tgtTo: [0, 0.85, 0], fov: [35] } },
  { id: '08', name: 'Início da montagem do som', start: 11.6, end: 12.4,
    cam: { from: [-3.6, 0.6, 3.0], to: [-3.2, 0.8, 3.4], tgtFrom: [0, 0.8, 0], fov: [33] } },
  { id: '09', name: 'Graves', start: 12.4, end: 13.8,
    cam: { from: [1.7, 0.9, 2.6], to: [0.4, 0.95, 3.7], tgtFrom: [0.76, 0.85, 0.6], tgtTo: [0, 0.9, 0.5], fov: [32] } },
  { id: '10', name: 'Cornetas', start: 13.8, end: 15.0,
    cam: { from: [1.8, 2.9, 2.7], to: [1.0, 2.6, 3.1], tgtFrom: [0, 1.65, 0.3], fov: [32] } },
  { id: '11', name: 'LEDs', start: 15.0, end: 16.0,
    cam: { from: [-2.3, 0.3, 2.8], to: [-1.7, 0.35, 3.15], tgtFrom: [0, 0.95, 0.4], fov: [32] } },
  { id: '12', name: 'Sistema completo', start: 16.0, end: 17.2,
    cam: { from: [0.6, 1.3, 3.8], to: [0, 1.0, 5.6], tgtFrom: [0, 0.95, 0], fov: [34] } },
  // O último quadro deste take é o "quadro de casamento" com a filmagem real.
  { id: '13', name: 'Grave', start: 17.2, end: 19.0,
    cam: { from: [0, 0.9, 5.1], to: [0, 0.88, 4.8], tgtFrom: [0, 0.9, 0], fov: [36] } },
];
