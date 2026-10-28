import { catalogoEstacoes } from './estacoes.js?v=20261027a';

const amostras = Object.freeze([
  { id: 'sao-paulo', condicao: 'Parcialmente nublado',
    temperatura: 23, umidade: 64, pressao: 1013, ar: 16, luminosidade: 380 },
  { id: 'campinas', condicao: 'Parcialmente nublado',
    temperatura: 25, umidade: 59, pressao: 1011, ar: 14, luminosidade: 510 },
  { id: 'sorocaba', condicao: 'Ensolarado',
    temperatura: 26, umidade: 54, pressao: 1012, ar: 12, luminosidade: 420 },
  { id: 'santos', condicao: 'Chuva leve',
    temperatura: 24, umidade: 78, pressao: 1008, ar: 10, luminosidade: 180 },
  { id: 'curitiba', condicao: 'Nublado',
    temperatura: 17, umidade: 72, pressao: 1016, ar: 8, luminosidade: 230 },
].map(Object.freeze));
export const localidades = Object.freeze(catalogoEstacoes.map(estacao => Object.freeze({
  ...amostras.find(item => item.id === estacao.id), ...estacao,
})));

export const unidades = Object.freeze({
  temperatura: '°C', umidade: '%', pressao: 'hPa', ar: 'µg/m³', luminosidade: 'lx',
});

export function formatarIndicadores(localidade) {
  return Object.fromEntries(Object.entries(unidades).map(([campo, unidade]) =>
    [campo, `${localidade[campo].toLocaleString('pt-BR')} ${unidade}`]));
}

export function moverSelecao(lista, atual, deslocamento) {
  if (!lista.length) return null;
  const indice = Math.max(0, lista.findIndex(local => local.id === atual));
  return lista[((indice + deslocamento) % lista.length + lista.length) % lista.length].id;
}

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filtrarLocalidades(consulta) {
  const termo = normalizar(consulta);
  return localidades.filter(local => normalizar(`${local.nome} ${local.uf}`).includes(termo));
}
