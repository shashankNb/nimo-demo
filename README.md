# Nimo Demo - Cryptocurrency Market Data

This project is a React application that presents cryptocurrency market data in a table format, styled with Material-UI. It allows users to view a list of cryptocurrencies and see detailed information for each one.

## Live Demo (Vercel)
[https://nimo-demo.vercel.app](https://nimo-demo.vercel.app)

## Features

### Required
- **Cryptocurrency Table:** List of coins with name, symbol, price, 24h change, market cap, and volume.
- **Detail Page:** `/detail/:cryptoId` showing more details about each cryptocurrency.
- **Clear run instructions** provided below.

### Enhancements
- Responsive design for desktop, tablet, and mobile.
- Loading indicators and error messages.
- Pagination, column sorting, and search.
- Deployed to Vercel for easy access.

---

## Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **UI Library:** Material UI (MUI) v7.3.1
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Hosting:** Vercel

---

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


## Data Handling
- **Source:** [CoinGecko API](https://www.coingecko.com/) (free endpoints)
- Endpoints used:
    - `/coins/markets` for list view
    - `/global` for global data (aggregated)
    - `/search/trending` for trending coins data
    - `/coins/{id}` for detail view
    - `/coins/{id}/market_charts` for chart data
- **Error handling:** User-friendly messages and retry options.
- **Loading state:** Spinners for data fetch.

---

## Project Structure

The project structure is organized as follows:

```markdown
.
├── 📁 public
│   ├── 🖼️ background.png
│   ├── 🖼️ logo.png
│   ├── 🖼️ vite.svg
│   └── 📁 loaders
│       └── 🖼️ loader.svg
├── 📁 src
│   ├── 📄 App.css
│   ├── 📄 App.tsx
│   ├── 📄 index.css
│   ├── 📄 main.tsx
│   ├── 📄 vite-env.d.ts
│   ├── 📁 assets
│   │   └── 🖼️ react.svg
│   ├── 📁 components
│   │   ├── 📁 Buttons
│   │   │   └── 📄 BackButton.tsx
│   │   ├── 📁 Layouts
│   │   │   └── 📄 MainLayout.tsx
│   │   ├── 📁 Loaders
│   │   │   ├── 📄 Loaders.css
│   │   │   └── 📄 Loading.tsx
│   │   ├── 📁 Status
│   │   │   └── 📄 Status.tsx
│   │   ├── 📁 Table
│   │   │   ├── 📄 MuiTableHoc.tsx
│   │   │   └── 📄 table.types.ts
│   │   └── 📁 Widgets
│   │       └── 📄 TrendingCard.tsx
│   ├── 📁 core
│   │   ├── 📄 api.interceptor.ts
│   │   └── 📄 context.ts
│   ├── 📁 pages
│   │   ├── 📁 Auth
│   │   │   └── 📄 Login.tsx
│   │   └── 📁 Crypto
│   │       ├── 📄 Crypto.Types.ts
│   │       ├── 📄 CryptoAPI.tsx
│   │       ├── 📄 CryptoDetail.tsx
│   │       └── 📄 CryptoList.tsx
│   ├── 📁 providers
│   │   └── 📄 HistoryProvider.tsx
│   ├── 📁 routes
│   │   ├── 📄 AuthenticatedRoute.tsx
│   │   ├── 📄 MainRoute.tsx
│   │   └── 📄 UnauthenticatedRoute.tsx
│   └── 📁 utils
│       └── 📄 app.util.ts
├── 📄 .env
├── 📄 .gitignore
├── 📄 eslint.config.js
├── 📄 index.html
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 README.md
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
└── 📄 vite.config.ts
```


Key directories:

*   `src/components`: Contains reusable UI components.
*   `src/pages`: Contains the main pages of the application.
*   `src/core`: Contains core functionalities like API interceptors.
*   `src/routes`: Contains the routing configuration.
*   `src/utils`: Contains utility functions.

Note :- Making too much request to coingekoAPI causes api to fail sometimes. So might have to wait a minute or two to refresh the api and get the data back.
