# 🎶 Sonar Backend

API REST que replica parte do System Design do **Spotify**, servindo como backend para um aplicativo de streaming de música (nível MVP). O projeto foi desenvolvido para demonstrar conhecimentos em arquitetura, banco de dados, cloud services e boas práticas de desenvolvimento backend.

<p>Caralho</p>

## Objetivo
O **Sonar** tem como objetivo oferecer uma API que permita:
- Gerenciar **usuários** e **artistas**.
- Criar e gerenciar **álbuns, músicas e letras** (com timestamps nas letras para sincronização em tempo real).
- Criar e gerenciar **playlists** de usuários.
- Armazenar e distribuir áudios com **AWS S3 + CloudFront** para garantir performance e escalabilidade.
# Indice

- [Tecnologia & Dependências](#Tecnologias-&-Dependências)
- [Funcionalidades](#Funcionalidades)
- [Exemplos De API](#Exemplos-De-API)
- [Instalação E Configuração](#Instalação-e-Configuração)
- [Deploy](#Deploy)
- [Variaveis De Ambiente](#Variáveis-de-ambiente)
- [Futuro Do Projeto](#Futuro-do-Projeto)
- [Contribuição](#Contribuição)
##  Tecnologias & Dependências
[![My Skills](https://skillicons.dev/icons?i=express,nodejs,js,sequelize,aws,mysql&perline=6)](https://skillicons.dev)
- **Node.js** + **Express.js**
- **Sequelize** (ORM) + **MySQL**
- **AWS SDK** (S3 + CloudFront)

**Dependências:**
```json
"@aws-sdk/client-s3": "^3.876.0",
"bcryptjs": "^3.0.2", (Hash De Senhas)
"cors": "^2.8.5", (Configuração Contra Ataques XSS)
"dotenv": "^17.2.1", (Configuração De Ambiente)
"express": "^5.1.0",
"jsonwebtoken": "^9.0.2", (Autenticação)
"multer": "^2.0.2", (Upload De Arquivos)
"mysql2": "^3.14.3",
"sequelize": "^6.37.7"
```
## Funcionalidades
- **CRUD completo** para usuários, artistas, álbuns, músicas e playlists.
- **Autenticação** de usuários e artistas (via JWT).
- **Upload e armazenamento de arquivos** (áudios, capas) usando **AWS S3**.
- **Distribuição de mídia** com **AWS CloudFront**.
- **Banco de dados relacional** com **MySQL**.
- Estrutura organizada em `/src` `/models` `/controllers` `/services` `/routes`.

### Principais Endpoints
- `GET /users` → Lista todos os usuários.  
- `GET /artists` → Lista todos os artistas.  
- `GET /albums` → Lista todos os álbuns.  
- `GET /lyrics` → Lista todas as letras.  
- `GET /lyrics/language/:language/music/:musicId` → Retorna a letra de uma música em uma linguagem específica.  
- Outros endpoints para CRUD de usuários, artistas, playlists, músicas e álbuns.
# Exemplos de API

## Receber Usuário
#### GET Request
```bash
curl -X GET https://localhost:3000/users/:id
```

#### Return
```json
{
  "id": 1,
  "name": "Lucas Santos",
  "email": "lucassantos@email.com",
  "userProfileCDN": "{Key Do Arquivo}",
  "birthdayDate": "2000-02-22T20:00:00.000Z",
  "isBanned": 0,
  "subscription": 2,
  "data_criacao": "2024-09-16T20:00:00.000Z",
  "data_modificacao": "2025-09-16T20:00:00.000Z"
}
```

## Receber Uma Letra De Musica
#### GET Request
```bash
curl -X GET https://localhost:3000/lyrics/language/en/music/12
```

#### Return
```json
{
  "id": 1,
  "musicId": 12,
  "lyrics": [
    { "start": "0:00", "end": "0:06", "content": "Her green plastic watering can" },
    { "start": "0:08", "end": "0:13", "content": "For her fake Chinese rubber plant" }
    ...
  ],
  "language": "en",
  "isDefault": 1,
  "data_criacao": "2024-09-16T20:00:00.000Z",
  "data_modificacao": "2025-09-16T20:00:00.000Z"
}
```


## Instalação e Configuração

### Pré-requisitos
[![My Skills](https://skillicons.dev/icons?i=nodejs,aws,mysql&perline=6)](https://skillicons.dev)
- Node.js (v18+ recomendado)
- MySQL 8
- Conta AWS (para usar S3 + CloudFront) **(Recomendo A AWS Em Geral Muito Boa 👍)**
- Certificados SSL (mesmo self-signed, para rodar com HTTPS) **(Pode Trocar Para HTTP)**

### Passo a passo
```bash
# Clone o repositório.
git clone https://github.com/Mistx144r/Sonar-Backend.git
cd Sonar-Backend

# Instale as dependências.
npm i

# Configure o arquivo .env
ls Sonar-Backend
nano .env

# Se Precisar Dos Certificados (Self Signed, Pode Dar Problemas Com O Navegador)

# Gerar As Keys Necessarias.
openssl req -new -newkey rsa:4096 -nodes -keyout key.pem -out csr.pem

# Assinar E Gerar O Certificado.
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

```

## Deploy
- O deploy atual foi feito em uma instância **AWS EC2**.  
- Passos:
  1. Clonar o repositório na EC2.
  2. Configurar variáveis de ambiente e certificados.
  3. Instalar o pacote PM2 **(Para Deixar O Servidor Rodando Mesmo Depois Do Console Fechado)**
  4. ```bash
     pm2 start rota/para/o/server.js
     ```
  5. `pm2 list` para listar todos os processos rodando.
#### Variáveis de ambiente .env
```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=bode_do_no

JWT_SECRET=senhadeexemploparajwttoken 

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
AWS_CLOUDFRONT_URL=

PORT=3000
```

### Rodando localmente
```bash
npm run dev
```

> ⚠️ Se estiver sem domínio e usando certificados self-signed **(Crie a pasta `/certs` na root do projeto e adicione os arquivos nela)**, será necessário aceitar o aviso de segurança do navegador para acessar via HTTPS **(Se ele for Self-Signed)**.  
> Para testes locais simples, pode trocar a configuração do express para HTTP no `server.js`.

### **Configuração HTTP:**
```javascript
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import musicRoutes from './routes/musicRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js'
import PlaylistMusicsRoutes from './routes/playlistMusicsRoutes.js'
import lyricsRoutes from './routes/lyricsRoutes.js'

const api = express();
const PORT = process.env.PORT || 3000;

api.use(cors({
    origin: "*", //Modifique O CORS Se Quiser Aceitar Requests Apenas De Um IP/Site Especifico.
}));

api.use(express.json());
api.use('/users', userRoutes);
api.use('/artists', artistRoutes);
api.use('/albums', albumRoutes);
api.use('/musics', musicRoutes);
api.use('/search', searchRoutes);
api.use('/playlists', playlistRoutes);
api.use('/playlistMusics', PlaylistMusicsRoutes);
api.use('/lyrics', lyricsRoutes);

api.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on https://localhost:${PORT}`);
})

```

# Futuro do Projeto

Algumas melhorias planejadas para as próximas versões da API do Sonar são:  

- **Integração com Redis** → para cache de requisições mais frequentes (ex: músicas populares, playlists).  
- **Filas com RabbitMQ** → para processar uploads de músicas de forma assíncrona, evitando sobrecarga no servidor e reduzindo erros em requisições de `POST`.  
- **Integração OAuth (Google / etc.)** → permitir login com provedores externos.  
## ♥ Contribuição
Pull Requests são bem-vindos!  
- Abra uma PR explicando **o que mudou** e **o motivo da mudança**.  
- Mantenha o padrão de código e a organização do projeto.

## Licença
Licença personalizada → **uso apenas pessoal**, sem autorização para uso comercial.

## Autor
**Lucas Mendonça (Mistx144)**  
- GitHub: [@Mistx144r](https://github.com/Mistx144r)  
- LinkedIn: [@lucasmendoncadev](https://www.linkedin.com/in/lucasmendoncadev/)  

### Agradecimentos Especiais
- Inspiração e referência: **Spotify** ♥
