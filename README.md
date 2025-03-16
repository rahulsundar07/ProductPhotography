# ProductPhotography

A React application for generating creative backgrounds for product images using AI.

## Features

- Upload product images
- Generate custom backgrounds using AI
- Download the resulting images
- User-friendly interface with real-time progress updates

## Setup for Development

### Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- A Flowscale API account with valid credentials

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rahulsundar07/ProductPhotography.git
   cd ProductPhotography
   ```
2. Install dependencies
``
npm install
 ```

3. Create a .env file based on .env.example
```
cp .env.example .env
 ```

4. Update the .env file with your Flowscale API credentials:
- VITE_API_BASE_URL : Your Flowscale API URL
- VITE_WORKFLOW_ID : Your workflow ID
- VITE_API_KEY : Your API key

5. Start the development server
npm run dev
