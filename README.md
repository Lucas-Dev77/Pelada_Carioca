# Pelada Carioca — recriação local

Recriação do site *Pelada Carioca* em HTML, CSS e JavaScript puros, sem
frameworks, sem build e sem dependências para instalar.

## Estrutura

```
site/
├─ index.html            # o corpo do site: todas as seções da página
├─ css/
│  └─ style.css          # toda a estilização: cores, fontes, layout, responsivo
├─ js/
│  └─ script.js          # o comportamento: carrossel, menu, lightbox, animações
├─ assets/
│  └─ img/               # imagens locais (vazia até você rodar baixar-imagens.ps1)
├─ iniciar-servidor.bat  # sobe o servidor local com 2 cliques
├─ baixar-imagens.ps1    # baixa as imagens e deixa o site 100% offline
└─ README.md
```

### O que cada arquivo faz

| Arquivo | Papel |
|---|---|
| `index.html` | Estrutura e conteúdo. Define o que existe na página e em que ordem: cabeçalho, hero, carrossel, blog, peladas, galeria e rodapé. |
| `css/style.css` | Aparência. Paleta (laranja `#ea5a00`), tipografia (Montserrat + Alata), espaçamentos, grid de cada seção e os breakpoints do responsivo. Está dividido em 10 blocos comentados. |
| `js/script.js` | Interatividade. Cabeçalho que fica branco ao rolar, menu hambúrguer no mobile, carrossel com setas/bolinhas/autoplay/teclado, destaque do link da seção atual, animação de entrada dos blocos e lightbox da galeria. |

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
