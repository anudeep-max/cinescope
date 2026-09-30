# 🎬 CineScope

CineScope is a React-based movie discovery web app built with live OMDb
API data. Users can search for movies, explore details, and maintain a
personal watchlist.

## ✨ Features

-   Search movies using the OMDb API
-   Browse real movie results and posters
-   View movie details
-   Add/remove movies from a personal watchlist
-   Persist the watchlist with `localStorage`
-   Home, Discover, and Watchlist pages
-   Loading states for API requests
-   Responsive glassmorphism-style UI
-   Cinematic cosmic background

## 🛠️ Tech Stack

-   React
-   JavaScript
-   Vite
-   React Router
-   CSS
-   OMDb API
-   Browser `localStorage`

## 📁 Project Structure

``` text
src/
├── api/omdb.js
├── components/
│   ├── Loading.jsx
│   ├── MovieCard.jsx
│   ├── MovieDetails.jsx
│   ├── MovieGrid.jsx
│   ├── Navbar.jsx
│   └── SearchBar.jsx
├── pages/
│   ├── Discover.jsx
│   ├── Home.jsx
│   └── Watchlist.jsx
├── App.jsx
├── App.css
├── index.css
└── main.jsx

public/
└── cinescope-bg.png
```

## 🚀 Run Locally

``` bash
git clone https://github.com/anudeep-max/cinescope.git
cd cinescope
npm install
```

Create `.env` in the project root:

``` env
VITE_OMDB_API_KEY=your_api_key_here
```

Then:

``` bash
npm run dev
```

The `.env` file is ignored by Git.

## 🔐 API Key Note

Vite `VITE_*` variables are exposed to frontend code, so they are not
true secrets. This setup is suitable for a portfolio/demo application. A
production version should use a backend/API proxy to keep the API key
server-side.

## 📚 What I Learned

-   React components and JSX
-   Props and state
-   `useState` and `useEffect`
-   React Router
-   REST API requests with `fetch`
-   Async/await and JSON
-   Conditional rendering
-   Mapping API data into reusable components
-   `localStorage`
-   Vite environment variables
-   Responsive CSS
-   Git and GitHub workflow

## 📌 Future Improvements

-   User authentication
-   Backend database for watchlists
-   Server-side API proxy
-   Better recommendations
-   Pagination/infinite scrolling
-   Debounced search
-   Advanced filters
-   User ratings and reviews

## 👨‍💻 Author

**Anudeep Goud**\
Mathematics & Computing --- IIT Delhi

GitHub: https://github.com/anudeep-max
