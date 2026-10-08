# Validação — 8 de outubro de 2026

## Verificado

- `npm test`: seis testes passaram, incluindo a jornada completa com cada um dos quatro símbolos.
- Sintaxe dos módulos JavaScript validada com Node.
- Chromium headless, desktop 1440 × 1000: entrada, escolha de coração, tentativa inválida em Block, montagem correta, dois controles por teclado, cooperação, revelação, partilha e saída.
- Persistência após recarregar a aba; cancelamento do reinício preserva as escolhas.
- Apresentação: pausar, avançar, voltar, reiniciar e sair preservam a família da exploração.
- Apresentação automática completa: chegou ao clímax, revelou o símbolo, alcançou a saída e pausou ao terminar; o estado da família permaneceu intacto. Verificada também com preferência de movimento reduzido.
- Chromium com emulação mobile, toque e viewport 390 × 844: jornada inteira com presente, controles ajustados por toque, revelação e partilha.
- Sem rolagem horizontal involuntária no viewport móvel testado.
- Falha de carregamento da biblioteca 3D simulada: mensagem de erro e painel de jornada continuam operáveis.
- Sem exceções JavaScript nos percursos desktop e móvel testados.
- Capturas visuais inspecionadas: visão geral desktop/mobile e clímax personalizado.

## Correções encontradas na validação

- O enfeite superior das árvores da cena original recebia o material na posição errada dos argumentos. Isso produzia `material.customProgramCacheKey is not a function` durante a renderização. Corrigido.
- Símbolos do clímax foram elevados acima da estrutura e orientados para a câmera para evitar ocultação e visão lateral.
- Título de abertura e área conceitual ficam ocultos ao aproximar uma estação, preservando a área útil do cenário.
- A apresentação mede tempo real, sem limitar cada avanço de tempo ao frame, para não ficar excessivamente lenta quando a renderização perde quadros.

## Limites dos testes

Os testes gráficos usaram a distribuição oficial Three.js **0.160.1** instalada via npm e servida no lugar das URLs da mesma versão em jsDelivr, porque o ambiente de teste não conseguiu baixar a biblioteca pela CDN. O código de produção mantém as URLs fixas originais. O fallback de fontes foi usado nos testes. Isso valida código, renderização e interação, mas não comprova a disponibilidade da CDN em produção.

Emulação de celular não substitui teste em aparelhos físicos. Não foram medidos FPS reais em celulares. A maquete permanece estilizada/procedural, sem modelos artísticos GLB ou imagens de referência fornecidas.

## Publicação

As alterações estão na branch `codex/jornada-interativa`, PR #1. O Vercel bloqueou o deploy porque o autor `enzuu0` não é membro da equipe `gustavo23andrade589-1712s-projects`, conforme comentário do bot no PR. A conexão Vercel disponível também não possui acesso à equipe.

A branch `main` e a publicação atual foram preservadas. A revisão e a publicação devem ser concluídas por uma conta autorizada da equipe, sem alterar autoria de commits, visibilidade do repositório ou permissões para contornar o bloqueio.
