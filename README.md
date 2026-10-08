# Arcor — Este Natal Ainda Não Existe | Maquete 3D

Protótipo interativo de um projeto acadêmico e especulativo de brand experience natalina Arcor, pensado para o **Shopping Eldorado, em São Paulo**.

> **A família não visita um Natal pronto. Ela ajuda a fazê-lo existir.**

## Objetivo

Apresentar uma maquete conceitual de **20 × 20 m (400 m²)**, com navegação 3D, estações clicáveis, storytelling e progressão de uma jornada única. O envelope é uma **hipótese de projeto** — não representa uma planta técnica aprovada pelo shopping.

## Jornada

1. **Entrada:** acolhimento e identidade familiar (Fita de Autoria: princípio, não tecnologia definida).
2. **Tortuguita — imaginar:** a escolha inicial ganha forma.
3. **Block — fazer acontecer:** desafio, tentativa, movimento e conquista.
4. **Butter Toffees — encontrar o outro:** cooperação e ritmo compartilhado.
5. **Clímax Arcor — reconhecimento:** a família reconhece sinais da sua contribuição; o coletivo enriquece, mas nunca condiciona o resultado.
6. **Bon o Bon — passar adiante:** conquista transformada em presente e gesto.
7. **Saída:** o Natal continua fora da instalação.

## Tecnologia

Site estático em HTML, CSS e JavaScript, com visualização procedural em **Three.js**; não há build obrigatório. Sem backend, sensores, identificação real nem integração física.

## Como usar

Abra o site publicado ou execute um servidor local na raiz:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`. É necessária uma conexão com a internet para carregar a biblioteca Three.js via CDN.

## Publicar no GitHub Pages

No repositório, abra **Settings → Pages → Build and deployment**, selecione **Deploy from a branch**, branch `main` e pasta `/ (root)`. Se o GitHub não permitir publicar este repositório privado no seu plano, será necessário mudar a visibilidade para público em **Settings → General → Danger Zone**.

A URL esperada após habilitar e concluir o deploy é `https://gusstord.github.io/arcor-maquete-3d/`.

## Diretrizes

- O site **não é** uma planta técnica ou documentação para corte e montagem.
- A maquete utiliza geometria procedural aproximada: não foi calibrada com o levantamento as-built da Praça de Eventos Jardins.
- Não congelar RFID, NFC, materiais, mecânicas exatas, operação ou tecnologia da Fita de Autoria.
- A ordem narrativa é **Tortuguita → Block → Butter Toffees → Clímax → Bon o Bon**.
- Arcor é o sistema conector, não uma quarta estação independente.
- A proposta não tem vínculo comercial oficial com Arcor ou Shopping Eldorado.
