# Site — Geovana Vidor, Nutricionista

Site estático (HTML + CSS + JS puro, sem dependências). Abra `index.html` no navegador para ver.

## Conceito
**"O que permanece."** A bio dela promete resultados que *permanecem* depois da alta, e o consultório tem luz âmbar, ripado de madeira e um arranjo de eucalipto seco num vaso dourado. O site é esse consultório:
- **Abertura (~3,4 s):** portas ripadas escuras; o monograma GV dourado aparece com um reflexo de luz, a linha âmbar acende de 0 a 100% entre "Welcome" e "Bem-vinda", e as portas se abrem para o hero. Clique ou Esc pula.
- **Elemento interativo:** eucalipto seco em vaso de latão (canvas). Os galhos balançam com o mouse, as folhas giram quando tocadas, um clique solta folhas que caem e renascem.
- **Método como ripado:** as 8 etapas do acompanhamento são ripas verticais (como o balcão do consultório); a ripa ativa se abre em âmbar.
- Paleta tirada do Instagram dela: greige do ensaio, marfim, âmbar e oliva dos destaques, ouro do logo e vermelho do Inside.
- Fontes: Castoro / Castoro Titling (títulos) + Urbanist (texto).

## Estrutura
```
index.html          página única
css/site.css        todo o estilo (tokens de cor no topo, em :root)
js/config.js        WhatsApp, mensagem, Instagram e canal  ← edite aqui
js/eucalipto.js     o arranjo interativo
js/main.js          abertura, menu, ripado, avaliações, revelações
assets/images/      fotos e logos
_originais/         material bruto (PDF do Instagram, Canva) — não publicar
qa/                 scripts e screenshots de teste — não publicar
```

## Como alterar
- **WhatsApp / Instagram / Canal Inside:** `js/config.js`. Todos os botões usam esses valores.
- **Fotos:** substitua o arquivo em `assets/images/` mantendo o mesmo nome (tamanhos no PENDENCIAS.md).
- **Avaliações:** em `index.html`, seção `#experiencia`; cada nome é um botão com o texto em `data-t`.
- **Cores:** variáveis no início de `css/site.css`.
- **Sempre que mudar CSS/JS**, troque o `?v=20261107b` nos links do `index.html` (senão o navegador mostra a versão antiga).

## Publicar
Qualquer hospedagem estática (Hostinger, GitHub Pages). Envie `index.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `css/`, `js/` e `assets/`. Não envie `_originais/` nem `qa/`.
Antes, ajuste o domínio em `index.html` (canonical/og), `robots.txt` e `sitemap.xml`.
