# Arcor — Este Natal Ainda Não Existe

Maquete 3D de uma proposta **acadêmica e não oficial** para o Shopping Eldorado. O espaço de 20 × 20 m é uma referência conceitual, não uma planta validada. A versão 2 evolui a cena procedural existente em Three.js 0.160.1; não exige React, backend ou build.

## Experimentar

Abra https://arcor-maquete-3d.vercel.app/ ou inicie na raiz:

```sh
python3 -m http.server 8000
```

Acesse http://localhost:8000. Three.js e seus addons são carregados da mesma versão fixa via jsDelivr. Fontes web são opcionais e têm fallback local. Internet e WebGL são necessários para a maquete; a jornada textual/interativa permanece disponível quando o 3D falha.

## Jornada implementada

1. **Entrada:** receber a Fita de Autoria ilumina o portal e aproxima uma família.
2. **Tortuguita:** escolher estrela, coração, árvore ou presente exibe o símbolo 3D no jardim.
3. **Block:** encaixar base, ponte e luz nessa ordem faz surgir uma construção de três partes. Tentativas incorretas dão orientação, sem cronômetro ou ranking.
4. **Respiro:** banco no trajeto antes de Butter Toffees (pausa espacial, não uma oitava tarefa).
5. **Butter Toffees:** ajustar dois controles entre 45 e 55, com diferença máxima de cinco pontos, permite firmar o encontro. Os orbes e o aro respondem aos controles. Não há vantagem por velocidade.
6. **Clímax:** revelar o símbolo escolhido, a base em três partes de Block e os dois aros do encontro. A cortina se dissolve e a luz cresce.
7. **Bon o Bon:** um presente animado passa para outra família. Trata-se de hipótese de partilha, sujeita à validação das três submarcas e das regras de distribuição.
8. **Saída:** “O Natal que criamos continua com você.”

A navegação permite visitar qualquer setor. Participar exige as contribuições anteriores, com atalhos claros para completá-las. As escolhas ficam em `sessionStorage` nesta aba; se o armazenamento estiver indisponível, há aviso e estado em memória. Trocar o símbolo preserva construção e cooperação, mas exige revelar e compartilhar novamente. “Nova família” pede confirmação e reinicia a jornada.

## Apresentação e acessibilidade

- Apresentação automática de cerca de 81 segundos: inicia na entrada, demonstra cada interação e conclui na saída.
- Pausar, continuar, anterior, próxima, reiniciar e voltar à exploração. A demonstração tem estado isolado e não sobrescreve as escolhas da família.
- Ao ocultar a aba, a apresentação pausa. Som sintetizado é opcional e começa desligado; efeitos não dependem de arquivos externos.
- Câmera orbital, zoom com mouse/toque ou botões, marcadores e navegação de etapas por teclado.
- Tela cheia quando suportada, layout adaptável e respeito a `prefers-reduced-motion`.
- Mensagens de falha para carregamento e perda de contexto WebGL; o painel continua utilizável.

## Estrutura

- `index.html`: layout, controles e diálogos acessíveis.
- `styles.css`: tema preservado em azul profundo, dourado e vermelho; desktop e mobile.
- `main.js`: interface, apresentação, áudio e inicialização resiliente.
- `js/narrative.js`: conteúdo, câmeras, símbolos e peças.
- `js/state.js`: progressão, validação, persistência e demonstração isolada.
- `js/scene.js`: cena original preservada e refinada; fita, famílias, materiais e transformações.
- `tests/state.test.js`: percurso completo, pré-requisitos, equilíbrio, armazenamento corrompido e isolamento da apresentação.

```sh
npm test
```

Resultados e limites das verificações estão em `VALIDATION.md`.

Sem dependências npm de produção. O `vercel.json` mantém a publicação estática explícita. A integração existente do GitHub com o Vercel publica `main`.

## Limites e próximo refinamento visual

A cenografia permanece **procedural e estilizada**, agora com fita contínua, arcos, chocolate, caramelo, sinais de escala humana, reflexos e iluminação progressiva. Geometrias estáticas são agrupadas por material e luzes da fita usam instâncias; resolução é limitada em telas pequenas, onde sombras são desativadas. Não há promessa de FPS em dispositivos físicos não testados.

Não foram fornecidas imagens conceituais ou modelos GLB/GLTF nesta implementação. A fidelidade às referências e a substituição por modelos detalhados continuam sendo uma etapa de produção de arte; a cena não deve ser apresentada como fotorrealista. Arquitetura do shopping, fluxos e acessibilidade espacial exigem validação técnica.

Fita de Autoria não define RFID, NFC, QR Code ou sensores. Clímax, equipamentos, materiais, operação e distribuição de produtos não são decisões executivas. Bon o Bon aparece apenas como hipótese de presente; as três protagonistas são Tortuguita, Block e Butter Toffees.
