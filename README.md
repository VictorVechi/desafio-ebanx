# Desafio Ebanx

Esse projeto foi desenvolvido para solucionar o desafio proposto pela empresa Ebanx.

## Stacks
- NestJs [https://docs.nestjs.com/]
- Prisma orm [https://www.prisma.io/docs]
- Docker [https://docs.docker.com/]
- Ngrok [https://ngrok.com/docs/]
- Typescript [https://www.typescriptlang.org/docs/]

## Instalação

Esse projeto pode ser executado em sua máquina localmente com o Node 22.2.0 ou utilizando Docker

```bash
 --"intalação local"--
$ cp .env.example .env
$ npm install
$ npx prisma generate
$ npx prisma studio
$ npm run start:dev
```

```bash
 --"intalação docker"--
$ cp .env.example .env
$ docker compose build
$ docker compose up -d
```

## Uso

O projeto consiste em apenas 3 rotas


## GET - Rota '/balance'

#### Entrada: paramêtro account_id

```bash
  http://localhost:3000/balance?account_id=10
```

#### Saida: 200 - Saldo conta
#### Saida: 404 - 0

## POST - Rota '/reset'

#### Entrada: No body

#### Saida: 200 - Ok

## POST - Rota '/event'

#### Entrada destino existente ou não: 
```json
{
  "type": "deposit",
  "destination": "100",
  "amount": 15
}
```
#### Saida: 201
```json
{
  "destination": {
    "id": "100",
    "balance": 15
  }
}
```
#### Entrada origem existente: 
```json
{
	"type": "withdraw",
	"origin": "100",
	"amount": 10
}
```
#### Saida: 201
```json
{
	"origin": {
		"id": "100",
		"balance": 5
	}
}
```
#### Entrada origem não registrada:
```json
{
	"type": "withdraw",
	"origin": "10",
	"amount": 10
}
```
#### Saida: 404 - 0

#### Entrada origem existente e destino existente ou não: 
```json
{
	"type": "transfer",
	"origin": "100",
	"amount": 5,
	"destination": "300"
}
```
#### Saida: 201
```json
{
	"origin": {
		"id": "100",
		"balance": 0
	},
	"destination": {
		"id": "300",
		"balance": 5
	}
}
```

#### Entrada origem não registrada: 
```json
{
	"type": "transfer",
	"origin": "1",
	"amount": 5,
	"destination": "300"
}
```
#### Saida: 404 - 0


## Author

#### https://github.com/VictorVechi