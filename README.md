# 🏦 Bank API (Node.js + Express + MongoDB)

A production-style banking backend system implementing **account management, ledger-based accounting, and transactional integrity** using **Node.js, Express, and MongoDB (Mongoose)**.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based auth (cookie + header support)
  - Role-based access (`systemUser` for privileged operations)

- 💰 **Account Management**
  - One account per user
  - Account status control (`ACTIVE`, `FROZEN`, `CLOSED`)

- 📒 **Ledger-Based Accounting System**
  - Immutable ledger entries
  - Credit/Debit tracking for accurate balance

- 🔁 **Transaction System**
  - Idempotent transactions (prevents duplicate execution)
  - Supports:
    - User-to-user transfers
    - System-to-user funding

- ⚡ **Data Consistency**
  - Designed to avoid race conditions
  - Safe balance updates via ledger model

---

## 📂 Project Structure

```

.
├── server.js                # Entry point
├── src/
│   ├── app.js              # Express app config & routes
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Account.js
│   │   ├── Ledger.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── authSystemUserMiddleware.js

````

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd bank-api
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run Application

```bash
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## 🧠 Core Concepts Used

* REST API design
* JWT Authentication
* Middleware-based authorization
* MongoDB relationships (Mongoose)
* Idempotency handling
* Ledger-based accounting
* Data immutability

---

## 🗄️ Database Models

### 👤 User

| Field      | Type    | Description                |
| ---------- | ------- | -------------------------- |
| email      | String  | Unique email               |
| username   | String  | Username                   |
| password   | String  | Hashed (bcrypt)            |
| systemUser | Boolean | Access to system endpoints |

---

### 🏦 Account

| Field    | Type      | Description                  |
| -------- | --------- | ---------------------------- |
| user     | Ref(User) | One-to-one mapping           |
| status   | Enum      | `ACTIVE`, `FROZEN`, `CLOSED` |
| currency | String    | Default: `INR`               |

#### 💡 Balance Calculation

Balance is computed dynamically using ledger:

balance = SUM(CREDITS) - SUM(DEBITS)

---

### 📒 Ledger

| Field       | Type             | Description        |
| ----------- | ---------------- | ------------------ |
| account     | Ref(Account)     | Linked account     |
| amount      | Number           | Transaction amount |
| transaction | Ref(Transaction) | Parent transaction |
| type        | Enum             | `CREDIT`, `DEBIT`  |

#### 🔒 Rules

* Immutable after creation
* No update/delete allowed

---

### 🔁 Transaction

| Field          | Type         | Description                                  |
| -------------- | ------------ | -------------------------------------------- |
| fromAccount    | Ref(Account) | Sender                                       |
| toAccount      | Ref(Account) | Receiver                                     |
| status         | Enum         | `PENDING`, `COMPLETED`, `FAILED`, `REVERSED` |
| idempotencyKey | String       | Prevents duplicate execution                 |

---

## 🔐 Authentication

Use JWT token:

```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### 🔑 Auth

#### Register

```
POST /api/auth/register
```

```json
{
  "email": "test@gmail.com",
  "username": "testuser",
  "password": "123456"
}
```

#### Login

```
POST /api/auth/login
```

---

### 🏦 Account

#### Create Account

```
POST /api/accounts
```

(Requires authentication)

---

### 🔁 Transactions

#### Transfer Money

```
POST /transaction
```

```json
{
  "fromAccount": "accountId1",
  "toAccount": "accountId2",
  "amount": 1000,
  "idempotencyKey": "unique-key-123"
}
```

#### System Initial Funding

POST /transaction/system/initial-funds

{
  "toAccount": "accountId",
  "amount": 5000,
  "idempotencyKey": "init-fund-123"
}

(Requires `systemUser`)

---

## ⚠️ Important Design Decisions

### 1. Ledger Instead of Balance Field

* Prevents inconsistency
* Fully traceable transaction history

### 2. Idempotency Key

* Avoids duplicate transactions (e.g., retries)

### 3. Immutable Ledger

* Ensures financial correctness
* No accidental tampering

---

## 🧪 Future Improvements

* Add MongoDB transactions (ACID guarantees)
* Add rate limiting & security (Helmet, Redis)
* Add audit logs
* Add pagination for transactions
* Add multi-currency support

---

## 🧑‍💻 Author

Built for learning **backend system design + fintech concepts** 🚀

```
```
