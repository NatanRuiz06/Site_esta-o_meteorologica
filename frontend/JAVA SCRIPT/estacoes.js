// Configure apenas identificadores confirmados pela API. Null significa não configurado.
export const catalogoEstacoes = Object.freeze([
  { id: 'sao-paulo', nome: 'São Paulo', uf: 'SP', imagem: 'sao-paulo.webp', posicao: 'center 65%', apiId: null },
  { id: 'campinas', nome: 'Campinas', uf: 'SP', imagem: 'campinas.webp', posicao: 'center', apiId: null },
  { id: 'sorocaba', nome: 'Sorocaba', uf: 'SP', imagem: 'sorocaba.webp', posicao: 'center', apiId: null },
  { id: 'santos', nome: 'Santos', uf: 'SP', imagem: 'santos.webp', posicao: 'center 75%', apiId: null },
  { id: 'curitiba', nome: 'Curitiba', uf: 'PR', imagem: 'curitiba.webp', posicao: 'center 60%', apiId: null },
].map(item => Object.freeze({ ...item, cidade: item.nome,
  imagem: `../ASSETS/images/locations/${item.imagem}`,
  rota: `dashboard.html?local=${encodeURIComponent(item.id)}`,
  disponibilidade: item.apiId === null ? 'unconfigured' : 'configured',
})));
export const estacoes = Object.freeze(Object.fromEntries(catalogoEstacoes.map(item => [item.id, item.apiId])));
