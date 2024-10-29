
# API RESTful - PIM IV

Olá a todos, apresento a vocês um projeto com intuito acadêmico que consiste em um API RESTful multiplataforma que deverá ser consumida por 3 diferentes sistemas, sendo eles, Web, Desktop e Mobile. A API deve rodar na nuvem em conjunto com o banco de dados. Para o banco de dados foi usado o serviço Tembo.io que é resposável por gerenciar no banco PostgreSQL na nuvem gratuitamente. Enquando o serviço que hospeda a API é o Render que utiliza do GitHub como meio de atualizações.

O objetivo desta API é fazer com que o desenvolvimento entre as três aplicações sejam padronizados, além de fazer com que eles conversem entre si e que ajude no desenvolvimento dos 3 sistemas, de que modo ? Fazendo com que a API haja como o back-end das três aplicações, sendo assim requisições e responstas tanto do banco de dados quanto do front-end passam pela API que trabalha esse dados e responde da maneira como cada tecnologia aceita. O real objetivo é diminuir as possíveis falhas de integração com o banco e diminuir a quantidade de código, seria alguns dos problemas que poderiam ocorrer caso cada sistema tivesse um back-end próprio.

A API foi desenvolvida em JavaScript utilizando o ambiente NodeJS, e alguns frameworks e bibliotecas como o ExpressJS, Bcrypt, JWT, PG, dentre outras.
## Funcionalidades

Atualmente a API conta apenas com a funcionalidade de Usuários, brevemente ela deverá contar com funcionalidades de gerenciamento de Fornecedores, Produções e Vendas. Cada uma dessas Funcionalidades devem fornecer também subfuncionalidades que complementarão as funcionalidades principais. As funcionalidades serão sempre acessadas através de rotas HTTP, que por sua URL já são auto intuitivas do que fazem. As operações são protegidas com Bearer Token, então para acessar as funcionalidades o usuário deve estar autenticado.

### Usuários
As funcionalidades são feitas para manipular os usuários, além de autentica-los, sendo elas:

- Get All Users (Consulta todos os usuários);
- Get One User (Consulta um usuário);
- Post New User (Cria um novo usuário);
- Put One User (Altera todo o registro de um usuário);
- Patch One User (Altera um campo de um usuário);
- Delete One User (Deleta um usuário); 
- Get All Archived Users (Consulta todos os usuários arquivados);
- Get One Archived User (Consulta um usuário arquivado);
- Authentication (Autentica um usuário).

A funcionalidade tem diversos tratamento de erros e retorna isso diretamento ao consumidor da API, erros esses que se referem aos campos que devem ser inseridos, tentativas de autenticação, usuários não encontrados ou não existentes e etc.
A funcionalidade tem 100% de cobertura de teste para somando 39 teste, sendo de retornos de negativos ou possitivos.

## Documentação da API

#### Retorna todos os usuários

```http
  GET /APIURL/users
```

#### Retorna um usuário

```http
  GET /APIURL/user/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário que você quer |

#### Retorna todos os usuários arquivados

```http
  GET /APIURL/users/arc
```

#### Retorna um usuário arquivado

```http
  GET /APIURL/user/arc/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário arquivado que você quer |

#### Cria um novo usuário

```http
  POST /APIURL/user
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Nome`      | `string` | **Obrigatório**. O Nome do usuário que você quer criar |
| `Email`      | `string` | **Obrigatório**. O Email do usuário que você quer criar |
| `Senha`      | `string` | **Obrigatório**. A Senha do usuário que você quer criar |
| `Role`      | `string` | **Obrigatório**. O Nível de acesso do usuário que você quer criar |

#### Altera um registro de usuário

```http
  PUT /APIURL/user/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário arquivado que você quer alterar |
| `Nome`      | `string` | **Obrigatório**. O Nome do usuário que você quer alterar |
| `Email`      | `string` | **Obrigatório**. O Email do usuário que você quer alterar |
| `Senha`      | `string` | **Obrigatório**. A Senha do usuário que você quer alterar |
| `Role`      | `string` | **Obrigatório**. O Nível de acesso do usuário que você quer alterar |

#### Altera um campo de dado de usuário

```http
  PATCH /APIURL/user/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário arquivado que você quer alterar |
| `Nome`      | `string` | O Nome do usuário que você quer alterar |
| `Email`      | `string` | O Email do usuário que você quer alterar |
| `Senha`      | `string` | A Senha do usuário que você quer alterar |
| `Role`      | `string` | O Nível de acesso do usuário que você quer alterar |

#### Deleta um usuário

```http
  DELETE /APIURL/user/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário arquivado que você quer alterar |

#### Autenticar usuário

```http
  POST /APIURL/auth/login
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Email`      | `string` | **Obrigatório**. O Email do usuário que você quer autenticar |
| `Senha`      | `string` | **Obrigatório**. A Senha do usuário que você quer autenticar |
## Deploy

Para fazer o instalar o projeto localmente utilize:

```bash
  npm install
```

E altere as informações referente ao banco de dados para seu banco Postgres local.