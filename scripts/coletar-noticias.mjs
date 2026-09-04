/* ==========================================================================
   Coletor de notícias — Pelada Carioca
   Roda no GitHub Actions, sem nenhuma dependência externa.

   O que faz:
   1. consulta o Google Notícias (RSS) para vários temas de basquete
   2. filtra o que não é basquete e o que é velho demais
   3. marca com selo o que é do Rio ou de rua/3x3
   4. escolhe um destaque carioca, se houver
   5. grava dados/noticias.json

   Rodar na mão:  node scripts/coletar-noticias.mjs
   ========================================================================== */

import { writeFile, mkdir } from 'node:fs/promises';

/* ---------- configuração ---------- */

const CONSULTAS = [
  { peso: 3, q: '"basquete de rua" Rio de Janeiro' },
  { peso: 3, q: '"basquete 3x3" Rio de Janeiro OR carioca' },
  { peso: 2, q: '"Campeonato Carioca" basquete' },
  { peso: 2, q: '"Brasileirão 3x3" basquete' },
  { peso: 1, q: 'NBB "Novo Basquete Brasil"' },
  { peso: 1, q: 'seleção brasileira de basquete' },
  { peso: 1, q: 'NBA brasileiro basquete' },
];

const MAX_ITENS   = 9;    // quantos cards a home exibe
const MAX_DIAS    = 45;   // ignora notícia mais velha que isso
const DESTINO     = 'dados/noticias.json';

// só passa quem fala de basquete — evita o Flamengo do futebol entrar na lista
const EH_BASQUETE = /basquete|basket|streetball|\bnbb\b|\bnba\b|3x3|cestinha|enterrada/i;

// marca de origem carioca
const EH_RIO = /rio de janeiro|carioca|fluminense|madureira|aterro|tijuca|maracan|rocinha|jacarezinho|niter[óo]i|baixada|parque ol[íi]mpico/i;

// marca de rua / 3x3
const EH_RUA = /basquete de rua|streetball|3x3|quadra p[úu]blica|pelada|rach[ãa]o/i;

/* ---------- utilidades ---------- */

const limpar = t => t
  .replace(/<!\[CDATA\[|\]\]>/g, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .trim();

const pegar = (bloco, tag) => {
  const m = bloco.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? limpar(m[1]) : '';
};

// "Título da matéria - Veículo"  ->  { titulo, fonte }
const separarVeiculo = (bruto, fonteRss) => {
  if (fonteRss) return { titulo: bruto, fonte: fonteRss };
  const corte = bruto.lastIndexOf(' - ');
  if (corte > 20) return { titulo: bruto.slice(0, corte).trim(), fonte: bruto.slice(corte + 3).trim() };
  return { titulo: bruto, fonte: '' };
};

const chave = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '').slice(0, 60);

/* ---------- coleta ---------- */

async function buscar({ q, peso }) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

  try {
    const resposta = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PeladaCarioca/1.0)' },
      signal: AbortSignal.timeout(20000),
    });
    if (!resposta.ok) {
      console.warn(`  falhou (${resposta.status}): ${q}`);
      return [];
    }

    const xml = await resposta.text();
    const blocos = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

    return blocos.map(bloco => {
      const bruto = pegar(bloco, 'title');
      const { titulo, fonte } = separarVeiculo(bruto, pegar(bloco, 'source'));
      return {
        titulo,
        fonte,
        link: pegar(bloco, 'link'),
        data: pegar(bloco, 'pubDate'),
        peso,
      };
    });
  } catch (erro) {
    console.warn(`  erro em "${q}": ${erro.message}`);
    return [];
  }
}

function classificar(item) {
  const texto = `${item.titulo} ${item.fonte}`;
  const rio = EH_RIO.test(texto);
  const rua = EH_RUA.test(texto);
  return { ...item, selo: rio ? 'rio' : (rua ? 'rua' : null), rio, rua };
}

/* ---------- programa ---------- */

async function principal() {
  console.log('Coletando notícias...\n');

  const lotes = await Promise.all(CONSULTAS.map(async c => {
    const r = await buscar(c);
    console.log(`  ${String(r.length).padStart(3)} resultados — ${c.q}`);
    return r;
  }));

  const limite = Date.now() - MAX_DIAS * 24 * 60 * 60 * 1000;
  const vistos = new Set();
  const itens = [];

  for (const item of lotes.flat()) {
    if (!item.titulo || !item.link) continue;
    if (!EH_BASQUETE.test(item.titulo)) continue;

    const quando = new Date(item.data);
    if (isNaN(quando) || quando.getTime() < limite) continue;

    const k = chave(item.titulo);
    if (vistos.has(k)) continue;
    vistos.add(k);

    itens.push({ ...classificar(item), quando: quando.toISOString() });
  }

  // mais recentes primeiro, com leve preferência para o que é do nosso tema
  itens.sort((a, b) =>
    (b.peso - a.peso) * 0.35 * 86400000 + (new Date(b.quando) - new Date(a.quando))
  );

  const destaque = itens.find(i => i.rio && i.rua) || itens.find(i => i.rio) || itens.find(i => i.rua) || null;

  const saida = {
    atualizadoEm: new Date().toISOString(),
    destaque: destaque && enxugar(destaque),
    itens: itens.filter(i => i !== destaque).slice(0, MAX_ITENS).map(enxugar),
  };

  await mkdir('dados', { recursive: true });
  await writeFile(DESTINO, JSON.stringify(saida, null, 2) + '\n', 'utf8');

  console.log(`\n${saida.itens.length} notícias gravadas em ${DESTINO}`);
  console.log(destaque ? `Destaque carioca: ${destaque.titulo}` : 'Sem destaque carioca hoje — a home usa conteúdo próprio.');
}

const enxugar = ({ titulo, fonte, link, quando, selo }) => ({ titulo, fonte, link, quando, selo });

principal().catch(erro => { console.error(erro); process.exit(1); });
