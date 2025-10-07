![Biblio](./src/assets/logo.webp)

<h1 align="center">
    BE - Bibilo Book Selling Website
</h1>

## 🔧 Techstack:

- **NestJS**
- **TypeScript**
- **MySQL**
- **Sequelize**
- **Redis**
- **Elasticsearch**
- **RabbitMQ**

## 🚀 LAUNCH APPLICATION:

### 1. Configure information in **docker-compose.yml**

### 2. Start services:

```bash
docker compose up -d
```

### 3. Setup environment variables **.env** from **.env.example** theo information in **docker-compose**

### 4. Run the application

```bash
yarn dev
```

### 5. Run database migration

```bash
yarn db:migrate
```

### 6. Seed initial data

```bash
yarn db:seed
```
