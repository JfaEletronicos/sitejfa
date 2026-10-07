// Linha do tempo do filme (segundos). A duração é visual — a música entra depois
// e não dita o ritmo. Total: 30 s.
//   0 – 19 s  : 3D (takes 01–13)
//  19 – 27 s  : filmagem real (takes 14–16), inserida na montagem final
//  27 – 30 s  : encerramento "JFA — Energia que vira som."
export const END_3D = 19;
export const REAL_START = 19;
export const END_CARD_START = 27;
export const TOTAL = 30;

// cam: from/to = posição (via = ponto de passagem opcional); tgtFrom/tgtTo = mira;
// fov = [início, fim]; dof = abertura da profundidade de campo (closes).
// Ritmo: takes longos de contemplação intercalados com inserts curtos de encaixe.
export const TAKES = [
  { id: '01', name: 'Bateria / revelação', start: 0, end: 2.0,
    cam: { from: [0.05, 0.22, 2.3], to: [0.9, 0.7, 3.6], tgtFrom: [0, 0.75, 0], tgtTo: [0, 0.5, 0], fov: [28, 32] } },
  { id: '02', name: 'Bateria / ângulo', start: 2.0, end: 3.0,
    cam: { from: [2.7, 1.9, -1.9], to: [2.1, 1.6, -2.6], tgtFrom: [0, 0.5, 0], fov: [32] } },
  // Close no polo: é dele que nasce o fio de energia.
  { id: '03', name: 'Bateria / close', start: 3.0, end: 4.2,
    cam: { from: [0.95, 1.3, 1.05], to: [0.75, 1.22, 0.95], tgtFrom: [0.55, 1.07, 0], tgtTo: [0.6, 1.0, 0.3], fov: [24], dof: 0.0022 } },
  { id: '04', name: 'Bateria / transformação', start: 4.2, end: 5.25,
    cam: { from: [2.6, 1.7, 3.3], to: [1.4, 1.6, 3.6], tgtFrom: [0, 0.8, 0], tgtTo: [0, 1.0, 0], fov: [35] } },
  // Insert curto: células girando e virando aletas.
  { id: '04i', name: 'Insert / células', start: 5.25, end: 5.75,
    cam: { from: [1.7, 2.0, 2.3], to: [1.4, 1.85, 2.5], tgtFrom: [0, 1.15, 0], fov: [30], dof: 0.0012 } },
  { id: '04b', name: 'Bateria / transformação (fim)', start: 5.75, end: 6.6,
    cam: { from: [-1.2, 1.3, 3.7], to: [-1.9, 1.1, 3.6], tgtFrom: [0, 0.5, 0], tgtTo: [0, 0.4, 0], fov: [35] } },
  { id: '05', name: 'Fonte', start: 6.6, end: 7.8,
    cam: { from: [1.9, 0.45, 2.6], to: [1.2, 0.55, 2.95], tgtFrom: [0, 0.35, 0], fov: [30] } },
  { id: '06', name: 'Fonte / close + voltímetro', start: 7.8, end: 9.6,
    cam: { from: [-0.6, 0.45, 1.75], to: [0.9, 0.36, 1.6], tgtFrom: [-0.75, 0.27, 0.66], tgtTo: [1.0, 0.25, 0.7], fov: [28], dof: 0.0016 } },
  // Plano-sequência: a câmera atravessa a fonte enquanto ela se abre.
  { id: '07', name: 'Fonte / transformação', start: 9.6, end: 11.8,
    cam: { from: [1.7, 0.35, 2.2], via: [0.7, 0.9, 1.9], to: [2.4, 1.9, 5.2], tgtFrom: [0, 0.3, 0], tgtTo: [0, 0.85, 0], fov: [34, 36] } },
  // Insert curto: encaixe do canto da caixa.
  { id: '08', name: 'Início da montagem do som', start: 11.8, end: 12.4,
    cam: { from: [-2.2, 1.95, 1.6], to: [-2.05, 1.85, 1.75], tgtFrom: [-1.5, 1.6, 0.6], fov: [26], dof: 0.0015 } },
  { id: '09', name: 'Graves', start: 12.4, end: 13.8,
    cam: { from: [1.7, 0.9, 2.6], to: [0.4, 0.95, 3.7], tgtFrom: [0.76, 0.85, 0.6], tgtTo: [0, 0.9, 0.5], fov: [32], dof: 0.0006 } },
  { id: '10', name: 'Cornetas', start: 13.8, end: 15.0,
    cam: { from: [1.8, 2.9, 2.7], to: [1.0, 2.6, 3.1], tgtFrom: [0, 1.65, 0.3], fov: [32] } },
  { id: '11', name: 'LEDs', start: 15.0, end: 16.0,
    cam: { from: [-2.3, 0.3, 2.8], to: [-1.7, 0.35, 3.15], tgtFrom: [0, 0.95, 0.4], fov: [32] } },
  // Momento longo de contemplação.
  { id: '12', name: 'Sistema completo', start: 16.0, end: 17.2,
    cam: { from: [-2.6, 1.6, 4.2], via: [0, 1.3, 4.6], to: [0.4, 1.0, 5.4], tgtFrom: [0, 0.95, 0], fov: [34] } },
  // Quietude → pancadas → onda de choque. O último quadro casa com a filmagem real.
  { id: '13', name: 'Grave', start: 17.2, end: 19.0,
    cam: { from: [0, 0.9, 5.1], to: [0, 0.88, 4.9], tgtFrom: [0, 0.9, 0], fov: [36] } },
];
