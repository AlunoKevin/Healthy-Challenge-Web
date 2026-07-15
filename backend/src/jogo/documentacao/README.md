# Jogo da Memória - Documentação da API

## Objetivo

O jogo da memória é um desafio integrado ao Healthy Challenge. O usuário deve memorizar as posições destacadas em uma matriz e reproduzi-las corretamente dentro de um tempo limite.

Ao concluir todas as rodadas, o desafio é registrado como concluído utilizando o mesmo fluxo dos demais desafios da aplicação, atualizando automaticamente pontuação, liga e estatísticas do perfil.

---

# Funcionamento Geral

```text
Usuário
    │
    ▼
POST /jogo/iniciar
    │
    ▼
Backend gera a matriz
    │
    ▼
Frontend mostra a matriz
    │
    ▼
Tempo de memorização termina
    │
    ▼
Frontend esconde a matriz
    │
    ▼
Usuário seleciona as posições
    │
    ▼
POST /jogo/jogada
    │
    ▼
Backend verifica a jogada
    │
    ├───────────────┐
    ▼               ▼
Acertou          Errou
    │               │
Nova rodada      Fim da partida
    │
    ▼
Última rodada?
    │
    ├───────────────┐
    ▼               ▼
Não            Sim
    │               │
Nova matriz     Desafio concluído
```

---

# Regras Gerais

* A matriz **não é armazenada no banco de dados**.
* Cada partida existe apenas em memória.
* Ao finalizar o jogo, toda a estrutura da partida é removida.
* O backend é responsável por gerar e validar toda a lógica do jogo.
* O frontend apenas exibe a matriz e envia as posições selecionadas.

---

# Dificuldades

A dificuldade é definida automaticamente pelo perfil do usuário.

## Fácil

* Matriz 5x5
* 2 posições ativas iniciais
* 4 segundos para memorização
* 4 minutos de tempo total
* Multiplicador x1

---

## Médio

* Matriz 6x6
* 4 posições ativas iniciais
* 3,5 segundos para memorização
* 4 minutos de tempo total
* Multiplicador x1.5

---

## Difícil

* Matriz 7x7
* 6 posições ativas iniciais
* 3 segundos para memorização
* 4 minutos de tempo total
* Multiplicador x2

---

# Progressão

A dimensão da matriz **não aumenta** durante o jogo.

A dificuldade aumenta apenas através da quantidade de posições ativas.

Exemplo:

Rodada 1

```
■■□□□
□■□□□
□□□□□
□□□□□
□□□□□
```

2 posições.

Rodada seguinte:

```
■■■□□
□■□□□
□□□□□
□□□□□
□□□□□
```

3 posições.

A cada rodada correta:

* aumenta uma posição ativa;
* soma pontos;
* adiciona 10 segundos ao cronômetro.

A cada três rodadas completas:

* aumenta o nível interno da partida.

O nível representa apenas a progressão do desafio, sem alterar a dimensão da matriz.

---

# Sistema de Tempo

Existem dois tempos diferentes.

## Tempo de Memorização

Durante a exibição da matriz:

* o cronômetro da partida permanece pausado;
* o jogador apenas memoriza as posições.

Após esse período a matriz é escondida.

---

## Tempo Total

Após esconder a matriz, inicia-se o cronômetro da partida.

Tempo inicial:

```
04:00
```

Sempre que o jogador concluir corretamente uma rodada:

* recebe +10 segundos.

O tempo máximo nunca poderá ultrapassar o limite definido para a dificuldade.

Caso o tempo termine:

* a partida é encerrada imediatamente.

---

# Sistema de Pontuação

Cada rodada concede pontos utilizando:

```
Pontos =
(Pontos Base × Quantidade de Casas Ativas × Multiplicador da Dificuldade × Multiplicador de Combo)
+ Bônus de Tempo
```

Onde:

* Pontos Base = 10
* Multiplicador Fácil = 1
* Multiplicador Médio = 1.5
* Multiplicador Difícil = 2

O multiplicador de combo aumenta conforme o jogador completa rodadas consecutivas sem erros.

Ao errar uma rodada:

* o combo retorna ao valor inicial.

---

# Estado da Partida

Cada usuário possui apenas uma partida ativa.

Estrutura armazenada em memória:

```javascript
{
    idUsuario,

    dificuldade,

    nivel,

    rodada,

    pontos,

    tempoRestante,

    dimensao,

    quantidadeAtivos,

    multiplicador,

    matriz
}
```

Ao término da partida:

```javascript
delete partidas[idUsuario];
```

Nenhuma matriz permanece armazenada.

---

# API

## Iniciar partida

### Endpoint

```
POST /jogo/iniciar
```

### Header

```
Authorization: Bearer <token>
```

O backend utiliza automaticamente:

* usuário autenticado;
* dificuldade do perfil.

### Resposta

```json
{
    "rodada": 1,
    "nivel": 1,
    "dimensao": 5,
    "tempo_memorizacao": 4,
    "tempo_restante": 240,
    "quantidade_ativos": 2,
    "matriz": [
        [0,0,1,0,0],
        [0,1,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
    ]
}
```

Após receber essa resposta, o frontend deve:

1. destacar todas as posições com valor **1**;
2. aguardar o tempo de memorização;
3. esconder a matriz;
4. iniciar o cronômetro.

---

# Enviar Jogada

### Endpoint

```
POST /jogo/jogada
```

### Corpo

```json
{
    "posicoes": [
        [0,2],
        [1,1]
    ],
    "tempo_restante": 215
}
```

---

## Resposta - Acertou

```json
{
    "resultado": "acertou",
    "rodada": 2,
    "nivel": 1,
    "pontos_ganhos": 20,
    "pontos_totais": 20,
    "bonus_tempo": 10,
    "tempo_restante": 225,
    "tempo_memorizacao": 4,
    "quantidade_ativos": 3,
    "matriz": [
        [0,0,0,0,1],
        [0,1,0,0,0],
        [1,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
    ]
}
```

Após receber essa resposta:

* atualizar pontuação;
* atualizar cronômetro;
* mostrar a nova matriz;
* repetir o fluxo.

---

## Resposta - Derrota

Erro por posição incorreta:

```json
{
    "resultado": "derrota",
    "motivo": "posicao_incorreta",
    "pontos_totais": 80,
    "rodadas": 6
}
```

Erro por tempo:

```json
{
    "resultado": "derrota",
    "motivo": "tempo_esgotado",
    "pontos_totais": 80,
    "rodadas": 6
}
```

Ao receber qualquer resposta de derrota:

* finalizar a partida;
* remover o estado armazenado em memória.

---

## Resposta - Vitória

```json
{
    "resultado": "vitoria",
    "pontos_totais": 420,
    "desafio_concluido": true,
    "liga_atualizada": true
}
```

Nesse momento o backend deverá:

* registrar a conclusão do desafio de memória;
* atualizar a pontuação do usuário;
* atualizar a liga, quando necessário;
* atualizar o leaderboard;
* remover a partida da memória.

---

# Responsabilidades

## Backend

* Gerar matrizes aleatórias.
* Definir posições ativas.
* Controlar tempo da partida.
* Validar jogadas.
* Calcular pontuação.
* Gerenciar combo.
* Gerenciar progressão.
* Registrar conclusão do desafio.
* Atualizar ranking e liga.
* Destruir a partida ao término.

---

## Frontend

* Exibir a matriz.
* Destacar posições ativas.
* Controlar a animação de memorização.
* Esconder as posições.
* Capturar os cliques do usuário.
* Enviar as posições selecionadas.
* Exibir cronômetro.
* Exibir pontuação.
* Exibir vitória ou derrota.

---

# Observações

* O backend é a única fonte de verdade da partida.
* O frontend nunca decide se o jogador acertou ou errou.
* Toda validação ocorre no backend.
* O banco de dados registra apenas o resultado final do desafio.
* Nenhuma matriz ou estado intermediário é persistido após o término da partida.
