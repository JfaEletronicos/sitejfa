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
// Vertical 9:16: vk afasta a câmera do alvo e vf abre a lente (padrão 1,75 e 1,45).
// Lentes: tele (FOV 12–15) nos planos de produto, grande-angular (50–58) na montagem.
// Match cuts: polo (03 → 04) e círculo do grave (08 → 09) na mesma posição da tela.
// O produto é a energia: bateria (0–6,8 s) e fonte (6,8–12 s) têm o tempo; o som é o
// "tchan" do final (montagem em cascata de pops + grave).
export const TAKES = [
  // Abertura baixa: a bateria cai curto e pesado; "ENERGIA" despenca atrás dela.
  { id: '01', name: 'Bateria cai e pousa', start: 0, end: 2.8,
    cam: { from: [0.25, 0.3, 3.5], to: [0.7, 0.9, 3.9], tgtFrom: [0, 0.5, 0], fov: [30, 31], curve: 'in' } },
  // Teleobjetiva de longe: perspectiva achatada, produto heroico.
  { id: '02', name: 'Bateria / ângulo', start: 2.8, end: 3.6,
    cam: { from: [9.4, 5.2, -6.8], to: [8.4, 4.9, -8.0], tgtFrom: [0, 0.5, 0], fov: [13], curve: 'float', vk: 1.3 } },
  // Close no polo, terminando com ele no centro do quadro (match cut com o 04).
  { id: '03', name: 'Bateria / close', start: 3.6, end: 4.6,
    cam: { from: [1.05, 1.3, 1.1], to: [0.7, 1.5, 0.85], tgtFrom: [0.6, 1.0, 0.3], tgtTo: [0.55, 1.07, 0], fov: [24], dof: 0.0022, curve: 'stop', vk: 1.3 } },
  // Órbita contínua: começa de cima sobre o mesmo polo e abre enquanto a bateria vira fonte.
  { id: '04', name: 'Bateria / transformação', start: 4.6, end: 6.8,
    cam: { orbit: { center: [0, 0, 0], angle: [0.25, -1.6], radius: [1.2, 3.7], height: [2.3, 1.4] },
      tgtFrom: [0.55, 1.07, 0], tgtTo: [0, 0.45, 0], fov: [30, 35], curve: 'glide' } },
  // Teleobjetiva baixa: a fonte como objeto de lançamento.
  { id: '05', name: 'Fonte', start: 6.8, end: 8.6,
    cam: { from: [6.6, 0.75, 9.0], to: [5.2, 0.8, 9.9], tgtFrom: [0, 0.32, 0], fov: [12], curve: 'float', vk: 1.3, ty: 0.06 } },
  // Voltímetro sobe; o foco passa do display para a marca.
  { id: '06', name: 'Fonte / close + voltímetro', start: 8.6, end: 10.6,
    cam: { from: [-0.5, 0.42, 1.55], to: [-0.2, 0.38, 1.42], tgtFrom: [-0.72, 0.27, 0.66], tgtTo: [-0.3, 0.27, 0.66], fov: [26],
      dof: 0.0028, focusFrom: [-0.75, 0.27, 0.66], focusTo: [-0.08, 0.27, 0.66], focusAt: [0.55, 0.85], curve: 'stop', vk: 1.5 } },
  // Sem corte: a câmera persegue a energia que sai do borne e desenha o projeto da caixa
  // em volta da fonte; abre para o plano geral e a fonte vira a caixa (b0 = fim − 1 s).
  { id: '07', name: 'Fonte / transformação', start: 10.6, end: 13.0,
    cam: { from: [2.6, 1.3, 4.4], via: [3.1, 1.7, 5.3], to: [2.3, 2.1, 5.8], tgtFrom: [0, 0.6, 0], tgtTo: [0, 1.05, 0], fov: [38, 36],
      follow: { offset: [0.75, 0.45, 1.35], release: [10.9, 12.0] }, curve: 'glide' } },
  // Insert: o anel de energia do grave esquerdo; o grave salta de dentro dele (match cut com o 09).
  { id: '08', name: 'Início da montagem do som', start: 13.0, end: 13.4,
    cam: { from: [-0.95, 1.05, 2.4], to: [-0.88, 0.98, 2.25], tgtFrom: [-0.76, 0.86, 0.66], fov: [34], dof: 0.0012, curve: 'stop', vk: 1.5 } },
  { id: '09', name: 'Graves', start: 13.4, end: 13.9,
    cam: { from: [-0.8, 0.95, 1.95], to: [-0.1, 0.95, 2.1], tgtFrom: [-0.76, 0.86, 0.66], tgtTo: [0.3, 0.86, 0.6], fov: [55, 53],
      dof: 0.0018, focusFrom: [-0.76, 0.86, 0.66], focusTo: [0.76, 0.86, 0.66], focusAt: [0.2, 0.8], curve: 'glide', vk: 1.8, vf: 1.15 } },
  { id: '10', name: 'Cornetas', start: 13.9, end: 14.4,
    cam: { from: [1.3, 2.3, 2.4], to: [0.9, 2.2, 2.65], tgtFrom: [0, 1.85, 0.6], fov: [48], curve: 'float', vk: 1.8, vf: 1.2 } },
  { id: '11', name: 'LEDs', start: 14.4, end: 15.0,
    cam: { from: [-1.7, 0.2, 1.9], to: [-1.4, 0.25, 2.1], tgtFrom: [0, 1.0, 0.4], fov: [56], curve: 'float', vk: 1.7, vf: 1.15 } },
  // Sistema pronto: a câmera dá um 360 — passa por trás, onde estão os equipamentos JFA
  // (fonte e baterias), e volta para a frente exatamente onde o 13 começa (sem corte).
  { id: '12', name: 'Sistema completo / 360 com equipamentos JFA', start: 15.0, end: 17.4,
    cam: { orbit: { center: [0, 0, 0], angle: [-0.1332 + Math.PI * 2, -0.1332], radius: [5.65, 3.6, 5.65], height: [1.45, 1.75, 1.45] },
      tgtFrom: [-0.2, 1.0, 0], fov: [36], curve: 'glide' } },
  // Frontal e um pouco de cima, como o drone começa. Carga → pancadas → a última
  // empurra a câmera para a frente e para cima, dentro da onda de choque.
  { id: '13', name: 'Grave', start: 17.4, end: 19.0,
    cam: { from: [-0.75, 1.45, 5.6], to: [0, 1.7, 5.2], tgtFrom: [-0.2, 1.0, 0], tgtTo: [0, 1.02, 0], fov: [36], curve: 'float' } },
];
