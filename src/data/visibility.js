/**
 * OCULTO ATÉ SEGUNDA ORDEM: Moov e JFA Parts estão escondidos de todo o site
 * (menu Categorias, Frentes, seção JFA Parts da Home, abas de Manuais, busca,
 * rodapé e as páginas #/setores/moov e #/setores/parts, que voltam para a Home).
 *
 * PARA VOLTAR: troque as duas flags para `true`. Todo ponto do código que
 * esconde Moov/Parts lê estas flags e está marcado com o comentário
 * "OCULTO: Moov/Parts"; com `true`, o site volta idêntico ao que era antes.
 */
export const SHOW_MOOV = false;
// Branch `parts`: versão de testes do lançamento da JFA Parts (o Parts aparece aqui).
export const SHOW_PARTS = true;
