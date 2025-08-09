# Nimo Demo - Cryptocurrency Market Data

This project is a React application that presents cryptocurrency market data in a table format, styled with Material-UI. It allows users to view a list of cryptocurrencies and see detailed information for each one.

## Features

*   **Cryptocurrency List**: Displays a comprehensive list of cryptocurrencies with relevant data points.
*   **Cryptocurrency Detail Page**: Shows more detailed information about a selected cryptocurrency.
*   **Responsive Design**: The application is designed to be responsive and work on various screen sizes.
*   **Routing**: Uses `react-router-dom` for navigation between the list and detail pages.
*   **API Integration**: Fetches data from the CoinGecko API.

## Tech Stack

*   **React**: A JavaScript library for building user interfaces.
*   **Vite**: A fast build tool for modern web development.
*   **TypeScript**: A typed superset of JavaScript.
*   **Material-UI (MUI)**: A popular React UI framework.
*   **React Router**: For declarative routing in React applications.
*   **Axios**: A promise-based HTTP client for the browser and Node.js.
*   **Recharts**: A composable charting library built on React components.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v22.18.0)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/shashankNb/nimo-demo.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
    
3. Create .env file add variables to it

* VITE_API_BASE_URL=https://api.coingecko.com/api/v3
* VITE_USER_NAME=user@demo.com
* VITE_USER_PASSWORD=demo


### Running the Application

To run the app in development mode, run the following command:

```sh
npm run dev
```

This will start the development server, and you can view the application at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.

## Project Structure

The project structure is organized as follows:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Buttons/
│   │   ├── Layouts/
│   │   ├── Loaders/
│   │   ├── Status/
│   │   ├── Table/
│   │   └── Widgets/
│   ├── core/
│   ├── pages/
│   │   ├── Auth/
│   │   └── Crypto/
│   ├── providers/
│   ├── routes/
│   └── utils/
├── .env
├── .gitignore
├── index.html
├── package.json
└── vite.config.ts
```

Key directories:

*   `src/components`: Contains reusable UI components.
*   `src/pages`: Contains the main pages of the application.
*   `src/core`: Contains core functionalities like API interceptors.
*   `src/routes`: Contains the routing configuration.
*   `src/utils`: Contains utility functions.

Note :- Making too much request to coingekoAPI causes api to fail sometimes. So might have to wait a minute or two to refresh the api and get the data back.
