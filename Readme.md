# Receipt Processor

A simple Node.js application that processes receipts based on certain rules and calculates points.

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- Docker (optional, if you want to run the application using Docker)

## Installation

1. Clone the repository:
git clone https://github.com/your-username/receipt-processor.git
Copy
2. Navigate to the project directory:
cd receipt-processor
Copy
3. Install the dependencies:
npm install
Copy
## Running the Application

### Using Node.js

1. Start the application:
npm start
Copy
2. The application will be running at `http://localhost:3000`.

### Using Docker

1. Build the Docker image:
docker build -t receipt-processor .
Copy
2. Run a container based on the built image:
docker run -p 3000:3000 receipt-processor
Copy
3. The application will be running at `http://localhost:3000`.

## API Endpoints

### Process Receipt

- URL: `/receipts/process`
- Method: POST
- Request Body: Receipt JSON object
- Response: JSON object containing the generated receipt ID

### Get Points

- URL: `/receipts/:id/points`
- Method: GET
- URL Parameter: `id` - The ID of the receipt
- Response: JSON object containing the number of points awarded for the receipt

## Receipt JSON Format

The receipt JSON object should have the following structure:

```json
{
"retailer": "String",
"purchaseDate": "YYYY-MM-DD",
"purchaseTime": "HH:mm",
"items": [
 {
   "shortDescription": "String",
   "price": "X.XX"
 }
],
"total": "X.XX"
}