import { verificarApi, obterLeituraRecente, obterHistorico } from './api.js?v=20261027a';
import { normalizarLeitura, normalizarHistorico } from './leituras.js?v=20261027a';
import { estadoDaLeitura, estadoDaFalha } from './estados.js?v=20261027a';
function leituraDaEstacao(recebido, id) {
  if (recebido?.estacao_id !== undefined && recebido.estacao_id !== id)
    throw new Error('A resposta não pertence à estação selecionada.');
  return recebido === null ? null : normalizarLeitura(recebido);
}
export function interpretarResultados(resultados, id) {
  let leitura = null, historico = [], estado, falhaHistorico = null;
  try {
    if (resultados[0].status === 'rejected') throw resultados[0].reason;
    leitura = leituraDaEstacao(resultados[0].value, id);
    estado = estadoDaLeitura(leitura);
  } catch (erro) { estado = estadoDaFalha(erro); }
  try {
    if (resultados[1].status === 'rejected') throw resultados[1].reason;
    historico = normalizarHistorico(resultados[1].value);
  } catch (erro) { falhaHistorico = estadoDaFalha(erro).tipo; }
  return { leitura, historico, estado, falhaHistorico };
}
export async function consultarEstacao(estacao, consulta) {
  await verificarApi(consulta.signal);
  const resultados = await Promise.allSettled([
    obterLeituraRecente(estacao.apiId, consulta.signal), obterHistorico(estacao.apiId, consulta),
  ]);
  return interpretarResultados(resultados, estacao.apiId);
}
