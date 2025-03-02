# Crypto Testing Backend

This is the backend service for the **Crypto Testing** project. It provides real-time cryptocurrency data using **NestJS**, **Sequelize**, **PostgreSQL**, and **WebSockets**.

## Features

- **Real-time WebSocket updates** for cryptocurrency prices
- **Scheduled price updates** from CoinGecko API
- **REST API** endpoints for managing cryptocurrencies
- **PostgreSQL database** for persistence
- **Swagger API documentation**
- **Docker Compose** support for easy deployment

## Technologies Used

- **NestJS 11** (Framework)
- **Sequelize ORM** (Database ORM)
- **PostgreSQL** (Database)
- **CoinGecko API** (Price updates)
- **WebSockets** (Real-time updates)
- **Docker & Docker Compose** (Containerized deployment)

---

## **Setup & Installation**

### **1. Clone the Repository**

```sh
  git clone https://github.com/Benz-srg/crypto-testing.git
  cd crypto-testing
```

### **2. Setup Environment Variables**

Create a `.env` file in the project root with the following values:

```env
DB_HOST=crypto_db
DB_PORT=5432
DB_USER=crypto_testing
DB_PASSWORD=crypto_testing_password
DB_NAME=crypto_testing
```

### **3. Run with Docker Compose**

To start the backend server along with the database:

```sh
docker-compose up -d --build
```

This will:

- Start the **NestJS** server
- Start a **PostgreSQL** database instance

### **4. Migrate & Seed the Database**

Once the services are running, apply database migrations:

```sh
docker exec -it crypto-testing yarn migrate
```

(Optional) Seed initial data:

```sh
docker exec -it crypto-testing yarn seed
```

### **5. Access API & WebSocket**

- API: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/docs`
- WebSocket: `ws://localhost:3000`

---

## **Development**

To run the backend locally without Docker:

### **1. Install Dependencies**

```sh
yarn install
```

### **2. Start the Server**

```sh
yarn start:dev
```

### **3. Run Tests**

```sh
yarn test
```

---

## **Cron Job - Automatic Price Updates**

The backend fetches live crypto prices every **20 seconds** from Binance API.

To check if the cron job is running:

```sh
docker logs crypto-testing | grep CryptoSchedulerService
```

---

## **Stopping & Cleaning Up**

To stop the backend:

```sh
docker-compose down
```

To remove all containers, volumes, and cache:

```sh
docker system prune -af
```

---

## **Contributing**

Feel free to contribute to this project. Open an issue or submit a pull request!

### **Repository**

🔗 GitHub: [Crypto Testing](https://github.com/Benz-srg/crypto-testing.git)
