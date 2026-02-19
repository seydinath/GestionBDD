# Gestion BDD - Product Management API

A Node.js application demonstrating CRUD operations with both **NoSQL (MongoDB)** and **SQL (MySQL)** databases, using the same product data model.

## Features

- Dual database support (MongoDB + MySQL)
- Complete CRUD operations for both databases
- RESTful API endpoints
- Parameterized SQL queries (SQL injection prevention)
- Mongoose schema validation
- Error handling and proper HTTP status codes

## Product Model

| Field      | Type    | Required | Default | Description              |
|------------|---------|----------|---------|--------------------------|
| id         | Number  | Yes      | Auto    | Auto-generated ID        |
| name       | String  | Yes      | -       | Product name             |
| price      | Number  | Yes      | -       | Product price            |
| category   | String  |          | null    | Product category         |
| inStock    | Boolean |          | true    | Stock availability       |

## Installation

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and configure your database credentials:

```bash
cp .env.example .env
```

### 3. Set up MySQL database

Run the SQL schema to create the products table:

```bash
mysql -u root -p < schema.sql
```

Or manually execute the SQL commands in `schema.sql` in your MySQL client.

### 4. Ensure MongoDB is running

Make sure MongoDB is installed and running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

## Usage

### Start the server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### NoSQL (MongoDB) Endpoints

Base URL: `/api/nosql/products`

| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| POST   | `/api/nosql/products`       | Create a product      |
| GET    | `/api/nosql/products`       | Get all products      |
| GET    | `/api/nosql/products/:id`   | Get product by ID     |
| PUT    | `/api/nosql/products/:id`   | Update product        |
| DELETE | `/api/nosql/products/:id`   | Delete product        |

### SQL (MySQL) Endpoints

Base URL: `/api/sql/products`

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| POST   | `/api/sql/products`      | Create a product      |
| GET    | `/api/sql/products`      | Get all products      |
| GET    | `/api/sql/products/:id`  | Get product by ID     |
| PUT    | `/api/sql/products/:id`  | Update product        |
| DELETE | `/api/sql/products/:id`  | Delete product        |

## Example Requests

### Create a Product

```bash
# NoSQL
curl -X POST http://localhost:3000/api/nosql/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "inStock": true
  }'

# SQL
curl -X POST http://localhost:3000/api/sql/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "inStock": true
  }'
```

### Get All Products

```bash
# NoSQL
curl http://localhost:3000/api/nosql/products

# SQL
curl http://localhost:3000/api/sql/products

# With filters
curl "http://localhost:3000/api/nosql/products?category=Electronics&inStock=true"
```

### Get Product by ID

```bash
# NoSQL (MongoDB ObjectId)
curl http://localhost:3000/api/nosql/products/507f1f77bcf86cd799439011

# SQL (Integer ID)
curl http://localhost:3000/api/sql/products/1
```

### Update a Product

```bash
# NoSQL
curl -X PUT http://localhost:3000/api/nosql/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Laptop",
    "price": 899.99
  }'

# SQL
curl -X PUT http://localhost:3000/api/sql/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Laptop",
    "price": 899.99
  }'
```

### Delete a Product

```bash
# NoSQL
curl -X DELETE http://localhost:3000/api/nosql/products/507f1f77bcf86cd799439011

# SQL
curl -X DELETE http://localhost:3000/api/sql/products/1
```

## Project Structure

```
GestionBDD/
├── controllers/
│   ├── NoSQLcontroller.js    # MongoDB/Mongoose CRUD operations
│   └── SQLcontroller.js       # MySQL CRUD operations
├── models/
│   └── Product.js             # Mongoose schema
├── routes/
│   ├── noSQLRoutes.js         # NoSQL API routes
│   └── sqlRoutes.js           # SQL API routes
├── schema.sql                 # MySQL table schema
├── server.js                  # Express server setup
├── package.json               # Dependencies
└── .env.example               # Environment variables template
```

## Key Differences: NoSQL vs SQL

| Aspect           | NoSQL (MongoDB)          | SQL (MySQL)              |
|------------------|--------------------------|--------------------------|
| **ID Format**    | ObjectId (string)        | Integer                  |
| **Schema**       | Flexible, defined in code| Rigid, defined in DB     |
| **Queries**      | Mongoose methods         | SQL statements           |
| **Validation**   | Schema-level             | Application-level        |
| **Relationships**| References/Embedded      | Foreign keys/Joins       |

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **MySQL** - SQL database
- **mysql2** - MySQL client with promise support
- **dotenv** - Environment variables management
- **CORS** - Cross-origin resource sharing

## Error Handling

Both controllers implement comprehensive error handling:

- 400 Bad Request - Invalid input or validation errors
- 404 Not Found - Resource doesn't exist
- 500 Internal Server Error - Server/database errors

## Security Features

- Parameterized SQL queries (prevents SQL injection)
- Mongoose schema validation
- Input sanitization
- Connection pooling for MySQL
- Error messages don't expose sensitive information


