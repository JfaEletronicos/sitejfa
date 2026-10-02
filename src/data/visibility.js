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
export const SHOW_PARTS = false;

/**
 * OCULTO TEMPORARIAMENTE: baterias na categoria Automotivo. Com `false`, as
 * baterias saem do catálogo #/setores/automotivo, da aba Automotivo dos Manuais,
 * do filtro "Automotivo" do carrossel da Home e dos botões de aplicação
 * (Automotivo / Solar / ...) das páginas das baterias. As páginas e os textos
 * continuam no código, só ficam escondidos.
 *
 * PARA VOLTAR: troque para `true`. Os pontos que leem esta flag estão marcados
 * com o comentário "OCULTO: baterias Automotivo".
 */
export const SHOW_BATERIAS_AUTOMOTIVO = false;

/**
 * OCULTO TEMPORARIAMENTE: amplificadores (AP400X4 e AP800X4). Com `false`, saem
 * do catálogo #/setores/automotivo e as páginas deles voltam para a Home; os
 * manuais continuam na seção Manuais e na busca. A versão de exportação
 * (EN/ES) não muda.
 *
 * PARA VOLTAR: troque para `true` (pontos marcados com "OCULTO: amplificadores").
 */
export const SHOW_AMPLIFICADORES = false;
