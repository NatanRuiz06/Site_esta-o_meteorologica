import { FUSO_LEITURAS, LIMITE_DESATUALIZACAO_MS } from './configuracao-api.js';
export const campos = ['temperatura', 'umidade', 'pressao', 'ar', 'luminosidade'];
export const numero = valor => Number.isFinite(valor) ? valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : 'Indisponível';
export function normalizarLeitura(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Formato de leitura inválido.');
  const valores = Object.fromEntries(campos.map(campo => {
    const valor = item[campo === 'ar' ? 'qualidade_ar' : campo];
    return [campo, typeof valor === 'number' && Number.isFinite(valor) ? valor : null];
  }));
  let horario = typeof item.data_hora === 'string' ? item.data_hora : '';
  if (horario && !/(Z|[+-]\d{2}:\d{2})$/.test(horario)) horario = FUSO_LEITURAS ? horario + FUSO_LEITURAS : '';
  return { ...valores, horario: Number.isFinite(Date.parse(horario)) ? horario : null };
}
export function normalizarHistorico(dados) {
  if (dados === null) return [];
  if (!Array.isArray(dados)) throw new Error('Formato de histórico inválido: esperado uma lista.');
  return dados.map(normalizarLeitura).sort((a, b) => Date.parse(a.horario) - Date.parse(b.horario));
}
export function situacaoLeitura(item) {
  if (!item) return 'Sem leituras disponíveis';
  if (!item.horario) return 'Horário da leitura indisponível';
  const idade = Date.now() - Date.parse(item.horario);
  if (idade < -60000) return 'Horário da leitura no futuro — verificar relógio da estação';
  return idade > LIMITE_DESATUALIZACAO_MS ? 'Dados desatualizados — conectividade não informada' :
    'Leitura recente — conectividade não informada pela API';
}
export function formatarHorario(horario) {
  return horario ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short',
    timeZone: 'America/Sao_Paulo' }).format(new Date(horario)) : 'Indisponível';
}
export function classificar(campo, valor) {
  if (!Number.isFinite(valor)) return 'Indisponível';
  if (campo === 'umidade') return valor < 12 ? 'Emergência: umidade abaixo de 12%' :
    valor < 30 ? 'Atenção: umidade abaixo de 30%' : 'Sem alerta de baixa umidade';
  return campo === 'ar' ? 'Unidade e calibração não informadas pela API' : 'Sem faixas de classificação documentadas';
}
