# Hotel Offer Orchestrator

A production-ready hotel offer orchestration system built with Node.js, Express, Temporal.io, and Redis. This system fetches hotel offers from multiple suppliers, deduplicates them, selects the cheapest prices, and caches results in Redis.

## Architecture

```
Client → Express API → Temporal Workflow → Temporal Activities → Redis → Response
```

All business logic and orchestration is handled by Temporal Workflows, ensuring reliability, scalability, and fault tolerance.

## Tech Stack

- **Node.js** (TypeScript)
- **Express** - REST API server
- **Temporal.io** - Workflow orchestration
- **Redis** - Caching and data storage
- **Docker & Docker Compose** - Containerization

## Prerequisites

- Docker
- Docker Compose
- Node.js 20+ (for local development)

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel-offer-orchestrator
```

2. Build and start all services:
```bash
docker compose up --build
```

This will start:
- **Express API** on port `3000`
- **Temporal Server** on port `7233`
- **Temporal UI** on port `8233`
- **Temporal Worker** (background process)
- **Redis** on port `6379`

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start Temporal Server and Redis (using Docker):
```bash
docker compose up temporal temporal-postgresql redis -d
```

3. Build the project:
```bash
npm run build
```

4. Start the API server (in one terminal):
```bash
npm start
```

5. Start the Temporal Worker (in another terminal):
```bash
npm run worker
```

## API Endpoints

### 1. Get Hotels (with Temporal Workflow)

Fetches hotels from suppliers, deduplicates by name, selects cheapest prices, and caches in Redis.

**Endpoint:** `GET /hotel?city=delhi`

**Query Parameters:**
- `city` (required) - City name (e.g., "delhi")

**Example Request:**
```bash
curl "http://localhost:3000/hotel?city=delhi"
```

### 2. Get Hotels with Price Filter (from Redis)

Fetches cached hotels from Redis and filters by price range.

**Endpoint:** `GET /hotel?city=delhi&minPrice=5000&maxPrice=7000`

**Query Parameters:**
- `city` (required) - City name
- `minPrice` (optional) - Minimum price filter
- `maxPrice` (optional) - Maximum price filter

**Example Request:**
```bash
curl "http://localhost:3000/hotel?city=delhi&minPrice=5000&maxPrice=7000"
```

### 3. Health Check

Checks the health status of supplier APIs.

**Endpoint:** `GET /health`

### Mock Supplier APIs

The application includes mock supplier endpoints for testing:

- `GET /supplier/supplierA/hotels?city=delhi`
- `GET /supplier/supplierB/hotels?city=delhi`

## How It Works

1. **Client Request**: Client calls `/hotel?city=delhi`
2. **Temporal Workflow**: Express API triggers a Temporal Workflow
3. **Parallel Fetching**: Workflow executes two activities in parallel:
   - `fetchSupplierA(city)`
   - `fetchSupplierB(city)`
4. **Deduplication**: Hotels are deduplicated by name (case-insensitive)
5. **Price Selection**: For duplicate hotels, the cheapest price is selected
6. **Caching**: Final deduplicated list is saved to Redis with key `hotels:<city>`
7. **Response**: Results are returned to the client

### Price Filtering

When `minPrice` or `maxPrice` parameters are provided:
- Data is fetched **only from Redis** (no workflow execution)
- Price filtering is applied to cached results
- If no cached data exists, an error is returned

## Project Structure

```
hotel-offer-orchestrator/
├── src/
│   ├── temporal/            # Temporal client, worker, activities
│   │   ├── client.ts
│   │   ├── worker.ts
│   │   └── activities.ts
│   ├── workflows/           # Temporal workflows
│   │   └── hotelWorkflow.ts
│   ├── redis/               # Redis client and utilities
│   │   ├── client.ts
│   │   └── hotelCache.ts
│   ├── module/              # Feature modules (routes + domain logic)
│   │   ├── hotel/
│   │   │   ├── hotel.routes.ts
│   │   │   └── hotel.constants.ts
│   │   ├── health/
│   │   │   ├── health.routes.ts
│   │   │   └── health.constants.ts
│   │   └── supplier/
│   │       ├── supplier.routes.ts
│   │       ├── supplier.data.ts
│   │       └── supplier.constants.ts
│   ├── routes/
│   │   └── main.routes.ts   # Mounts feature routes
│   ├── middleware/          # Global error handling
│   │   └── globalErrorMiddleware.ts
│   ├── constants/           # Common enums/messages
│   │   └── common.constants.ts
│   ├── utils/
│   │   └── sendResponse.ts
│   ├── error/
│   │   └── AppError.ts
│   ├── logger/
│   │   ├── index.ts
│   │   ├── devLogger.ts
│   │   └── prodLogger.ts
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
├── postman/                 # Postman collection
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

- `PORT` - Express server port (default: 3000)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `TEMPORAL_ADDRESS` - Temporal server address (default: localhost:7233)
- `API_BASE_URL` - Base URL for supplier APIs (default: http://localhost:3000)
- `NODE_ENV` - Environment (default: DEV, set PRODUCTION for prod logging)

## Redis Key Format

- Hotel cache: `hotels:<city>` (e.g., `hotels:delhi`)
- TTL: 3600 seconds (1 hour)

## Temporal UI

Access the Temporal UI at: `http://localhost:8233`

## Testing

Use the provided Postman collection in the `postman/` directory to test all endpoints.

## Error Handling

- Invalid requests return `400 Bad Request`
- Missing cached data returns `404 Not Found`
- Server errors return `500 Internal Server Error`
- All errors include descriptive error messages

## License

ISC
