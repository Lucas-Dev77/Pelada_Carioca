# Pelada Carioca — recriação local

Recriação do site *Pelada Carioca* em HTML, CSS e JavaScript puros, sem
frameworks, sem build e sem dependências para instalar.

## Estrutura

```
site/
├─ index.html                     # página inicial
├─ vamos-jogar.html               # preparo, prevenção e recuperação
├─ css/style.css                  # aparência de todas as páginas (12 blocos comentados)
├─ js/script.js                   # comportamento de todas as páginas (7 blocos)
├─ dados/noticias.json            # notícias — escrito pelo robô, lido pelo site
├─ scripts/coletar-noticias.mjs   # o robô: busca, filtra e grava o JSON
├─ .github/workflows/noticias.yml # agenda que roda o robô todo dia
├─ 404.html                      # página de erro do GitHub Pages
├─ favicon.svg · favicon.png     # ícone da aba
├─ apple-touch-icon.png          # ícone do atalho no celular
├─ robots.txt · sitemap.xml      # instruções para buscadores
├─ assets/og-capa.png            # prévia exibida ao compartilhar o link
├─ assets/img/                   # imagens locais (vazia até rodar baixar-imagens.ps1)
├─ iniciar-servidor.bat           # sobe o localhost com 2 cliques
├─ baixar-imagens.ps1             # deixa o site 100% offline
└─ README.md
```

### O que cada parte faz

| Arquivo | Papel |
|---|---|
| `index.html` | Estrutura da home: hero, carrossel, notícias, peladas, galeria e rodapé. |
| `vamos-jogar.html` | Guia de pré e pós-jogo: aquecimento, fortalecimento, recuperação e sinais de alerta. |
| `css/style.css` | Toda a aparência. Bloco 1 tem as variáveis — trocar `--laranja` muda o site inteiro. |
| `js/script.js` | Carrossel, menu mobile, lightbox, animações e o carregamento das notícias. |
| `dados/noticias.json` | A lista de notícias que a home exibe. Não edite na mão: o robô sobrescreve. |
| `scripts/coletar-noticias.mjs` | Consulta o Google Notícias em vários temas de basquete, filtra e marca o que é do Rio. |
| `.github/workflows/noticias.yml` | Roda o coletor todo dia às 9h de Brasília e faz commit se algo mudou. |

## O robô de notícias

Roda sozinho no GitHub Actions, sem servidor e sem custo.

**Para funcionar, o repositório precisa de uma permissão:**
Settings › Actions › General › Workflow permissions › **Read and write permissions** › Save.
Sem isso o robô coleta as notícias mas não consegue publicar.

**Para rodar na hora**, sem esperar o horário: aba Actions › *Atualizar notícias* › *Run workflow*.

**Para testar no seu computador:**

```powershell
node scripts/coletar-noticias.mjs
```

**Para ajustar o que ele busca:** abra `scripts/coletar-noticias.mjs` e mexa na lista
`CONSULTAS` no topo do arquivo. Cada linha é uma busca, e o `peso` define a prioridade
na ordenação. `MAX_DIAS` descarta notícia velha; `MAX_ITENS` limita quantos cards aparecem.

Quando nenhuma notícia do Rio ou de rua aparece na rodada, o destaque da home mostra
conteúdo próprio do site — uma ficha de pelada ou uma dica do guia de preparo — em vez
de encher espaço com matéria de fora.

## Acabamento e compartilhamento

| Arquivo | Para que serve |
|---|---|
| `favicon.svg` | Ícone da aba. SVG escala em qualquer tamanho; o `favicon.png` é a reserva para navegadores antigos. |
| `apple-touch-icon.png` | Ícone usado quando alguém salva o site na tela inicial do celular. |
| `assets/og-capa.png` | A miniatura que aparece quando o link é colado no WhatsApp, Instagram ou LinkedIn. 1200×630, o tamanho que essas plataformas esperam. |
| `robots.txt` | Libera a indexação e aponta o caminho do sitemap. |
| `sitemap.xml` | Lista as páginas do site para os buscadores. **Ao criar uma página nova, adicione a URL dela aqui.** |
| `404.html` | O que o visitante vê ao digitar um endereço que não existe. O GitHub Pages usa este arquivo automaticamente. |

As meta tags de compartilhamento ficam no `<head>` de cada página e usam endereços
absolutos (`https://lucas-dev77.github.io/Pelada_Carioca/...`) — é exigência das
plataformas, que buscam a imagem pelo endereço completo. Se o site mudar de domínio,
esses endereços precisam ser atualizados em `index.html`, `vamos-jogar.html`,
`robots.txt` e `sitemap.xml`.

## Como rodar em localhost

**Opção 1 — dois cliques:** abra `iniciar-servidor.bat`.
Ele sobe o servidor e abre <http://localhost:8000> no navegador.

**Opção 2 — terminal:** dentro da pasta `site`, rode

```powershell
python -m http.server 8000
```

e acesse <http://localhost:8000>. Para parar, `Ctrl + C`.

> Abrir o `index.html` com dois cliques (`file://`) até funciona, mas o
> servidor local é o jeito certo — é assim que o site se comporta hospedado.

## Imagens

As imagens são carregadas do Unsplash pela internet. Para deixar o site
funcionando offline, rode uma vez no PowerShell, dentro da pasta `site`:

```powershell
powershell -ExecutionPolicy Bypass -File .\baixar-imagens.ps1
```

O script baixa tudo para `assets/img/` e troca os endereços em `index.html`
e `css/style.css` para os caminhos locais.

## Próximos passos possíveis

- Páginas separadas de **Loja** e **Eventos** (existiam no site original).
- Posts do blog em páginas próprias.
- Formulário de contato de verdade.
