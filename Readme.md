# Receipt Processor

My submission for Fetch Backend Apprenticeship position. 

A simple Node.js application that processes receipts based on certain rules and calculates points.

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- Docker (optional, if you want to run the application using Docker)

## Installation

1. Clone the repository:
git clone https://github.com/bachdumpling/fetch-backend-apprenticeship
2. Navigate to the project directory:
cd receipt-processor
3. Install the dependencies:
npm install

## Running the Application

### Using Node.js

1. Start the application:
npm start

2. The application will be running at `http://localhost:3000`.

### Using Docker

1. Build the Docker image:
docker build -t receipt-processor .

2. Run a container based on the built image:
docker run -p 3000:3000 receipt-processor

3. The application will be running at `http://localhost:3000`.

## API Endpoints

### Process Receipt

- URL: `/receipts/process`
- Method: POST
- Request Body: Receipt JSON object
- Response: JSON object containing the generated receipt ID

- Example request:
```
curl -X POST -H "Content-Type: application/json" -d '{
  "retailer": "M&M Corner Market",
  "purchaseDate": "2022-03-20",
  "purchaseTime": "14:33",
  "items": [
    {
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    }
  ],
  "total": "9.00"
}' http://localhost:3000/receipts/process
```


- Example response:
```
{
    "id": "ced50096-bb92-4c26-a6a0-75368ddf7903"
}
```

### Get Points

- URL: `/receipts/:id/points`
- Method: GET
- URL Parameter: `id` - The ID of the receipt
- Response: JSON object containing the number of points awarded for the receipt
- Example request:
```
curl -X GET http://localhost:3000/receipts/{id}/points
```

- Example response:

```
{
    "points": 109
}
```