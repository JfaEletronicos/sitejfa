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
// fov = [início, fim]; dof = abertura da profundidade de campo.
// curve: glide | float | in | stop — nenhuma para nas pontas: todo take entra e sai
// em movimento (o peso vem só da variação de velocidade; a mira segue com leve atraso).
// orbit: órbita contínua; follow: persegue o traço de energia;
// focusFrom/focusTo: rack focus entre dois pontos.
// Lentes: tele (FOV 12–15) nos planos de produto, grande-angular (50–58) na montagem.
// Match cuts: polo (03 → 04) e círculo do grave (08 → 09) na mesma posição da tela.
export const TAKES = [
  // Lente quase no piso: primeiro só o reflexo; a câmera sobe devagar e revela.
  { id: '01', name: 'Bateria / revelação', start: 0, end: 2.0,
    cam: { from: [0.0, 0.035, 2.7], to: [0.55, 0.8, 3.4], tgtFrom: [0, 0.08, 0], tgtTo: [0, 0.5, 0], fov: [30, 31], curve: 'in' } },
  // Teleobjetiva de longe: perspectiva achatada, produto heroico.
  { id: '02', name: 'Bateria / ângulo', start: 2.0, end: 3.0,
    cam: { from: [9.4, 5.2, -6.8], to: [8.4, 4.9, -8.0], tgtFrom: [0, 0.5, 0], fov: [13], curve: 'float' } },
  // Close no polo, terminando com ele no centro do quadro (match cut com o 04).
  { id: '03', name: 'Bateria / close', start: 3.0, end: 4.2,
    cam: { from: [1.05, 1.3, 1.1], to: [0.7, 1.5, 0.85], tgtFrom: [0.6, 1.0, 0.3], tgtTo: [0.55, 1.07, 0], fov: [24], dof: 0.0022, curve: 'stop' } },
  // Órbita contínua de ~120°: começa de cima sobre o mesmo polo e abre enquanto a bateria se transforma.
  { id: '04', name: 'Bateria / transformação', start: 4.2, end: 6.6,
    cam: { orbit: { center: [0, 0, 0], angle: [0.25, -1.85], radius: [0.75, 3.9], height: [2.0, 1.45] },
      tgtFrom: [0.55, 1.07, 0], tgtTo: [0, 0.55, 0], fov: [30, 36], curve: 'glide' } },
  // Teleobjetiva baixa: a fonte como objeto de lançamento.
  { id: '05', name: 'Fonte', start: 6.6, end: 7.8,
    cam: { from: [6.6, 0.75, 9.0], to: [5.4, 0.8, 9.8], tgtFrom: [0, 0.32, 0], fov: [12], curve: 'float' } },
  // Voltímetro sobe; o foco passa do display para a marca.
  { id: '06', name: 'Fonte / close + voltímetro', start: 7.8, end: 9.0,
    cam: { from: [-0.5, 0.42, 1.55], to: [-0.25, 0.38, 1.45], tgtFrom: [-0.72, 0.27, 0.66], tgtTo: [-0.35, 0.27, 0.66], fov: [26],
      dof: 0.0028, focusFrom: [-0.75, 0.27, 0.66], focusTo: [-0.08, 0.27, 0.66], focusAt: [0.55, 0.85], curve: 'stop' } },
  // Sem corte: a câmera persegue a energia que sai do borne, corre pelo piso,
  // desenha a caixa, e então sobe num plano geral enquanto a fonte se transforma.
  { id: '07', name: 'Fonte / transformação', start: 9.0, end: 11.8,
    cam: { from: [2.6, 1.2, 4.2], via: [3.0, 1.6, 5.0], to: [2.2, 1.9, 5.4], tgtFrom: [0, 0.6, 0], tgtTo: [0, 0.9, 0], fov: [38, 36],
      follow: { offset: [0.75, 0.45, 1.35], release: [9.5, 10.9] }, curve: 'glide' } },
  // Insert: o anel de energia do grave esquerdo centrado no quadro (match cut com o 09).
  { id: '08', name: 'Início da montagem do som', start: 11.8, end: 12.4,
    cam: { from: [-0.95, 1.05, 2.4], to: [-0.85, 0.95, 2.15], tgtFrom: [-0.76, 0.86, 0.66], fov: [34], dof: 0.0012, curve: 'stop' } },
  // Grande-angular perto: começa no mesmo círculo (agora o grave) e o foco passa de um grave ao outro.
  { id: '09', name: 'Graves', start: 12.4, end: 13.6,
    cam: { from: [-0.8, 0.95, 1.95], to: [0.5, 0.95, 2.2], tgtFrom: [-0.76, 0.86, 0.66], tgtTo: [0.2, 0.86, 0.6], fov: [55, 52],
      dof: 0.0018, focusFrom: [-0.76, 0.86, 0.66], focusTo: [0.76, 0.86, 0.66], focusAt: [0.45, 0.8], curve: 'glide' } },
  { id: '10', name: 'Cornetas', start: 13.6, end: 14.6,
    cam: { from: [1.2, 2.55, 1.45], to: [0.6, 2.35, 1.75], tgtFrom: [0, 1.75, 0.3], fov: [52], curve: 'float' } },
  { id: '11', name: 'LEDs', start: 14.6, end: 15.6,
    cam: { from: [-1.7, 0.2, 1.8], to: [-1.3, 0.25, 2.1], tgtFrom: [0, 0.95, 0.4], fov: [56], curve: 'float' } },
  // Momento longo de contemplação.
  { id: '12', name: 'Sistema completo', start: 15.6, end: 17.2,
    // Termina exatamente onde o 13 começa, já na mesma direção: a passagem 12→13 é contínua.
    cam: { from: [-2.6, 1.6, 4.2], via: [-1.3, 1.36, 5.6], to: [-0.75, 1.38, 5.4], tgtFrom: [-0.2, 0.84, 0], fov: [34, 36], curve: 'glide' } },
  // Frontal e um pouco de cima, como o drone começa. Carga → pancadas → a última
  // empurra a câmera para a frente e para cima, dentro da onda de choque.
  // (leve deriva lateral constante: a câmera nunca para, nem quando o respiro inverte o recuo)
  { id: '13', name: 'Grave', start: 17.2, end: 19.0,
    cam: { from: [-0.75, 1.38, 5.4], to: [0, 1.56, 4.95], tgtFrom: [-0.2, 0.84, 0], tgtTo: [0, 0.86, 0], fov: [36], curve: 'float' } },
];
