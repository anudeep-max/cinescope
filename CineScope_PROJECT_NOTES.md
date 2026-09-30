# CineScope --- Project Notes

## 1. Project Goal

CineScope was built as a practical React project to learn how a real
frontend application works with live API data.

The final version uses the OMDb API.

## 2. Main Architecture

``` text
main.jsx
   ↓
App.jsx
   ↓
Pages
   ↓
Components
   ↓
API functions
   ↓
OMDb API
   ↓
JSON response
   ↓
React state
   ↓
UI
```

## 3. `main.jsx`

`main.jsx` is the entry point of the React application.

React finds:

``` html
<div id="root"></div>
```

and renders the `App` component inside it.

## 4. `App.jsx`

`App.jsx` controls the main application.

Responsibilities include:

-   Defining routes
-   Storing watchlist state
-   Loading the watchlist from `localStorage`
-   Saving watchlist changes
-   Passing props to pages/components

Routes:

``` text
/             → Home
/discover     → Discover
/watchlist    → Watchlist
```

## 5. React State

The watchlist is stored in React state.

Conceptually:

``` js
const [watchlist, setWatchlist] = useState([])
```

When the state changes, React re-renders the parts of the UI that depend
on it.

## 6. `localStorage`

The watchlist is persisted in the browser.

``` text
React state
    ↓
localStorage
    ↓
Browser remembers watchlist
```

`useEffect` is used to synchronize the state with browser storage.

## 7. `src/api/omdb.js`

API logic is separated from UI components.

General flow:

``` text
Component
   ↓
omdb.js function
   ↓
fetch()
   ↓
OMDb
   ↓
JSON
   ↓
Component state
```

This separation keeps API communication easier to maintain.

## 8. Components

### `MovieCard.jsx`

Displays one movie as a reusable card.

### `MovieGrid.jsx`

Receives a movie collection and renders multiple `MovieCard` components.

Conceptually:

``` text
movies array
    ↓
map()
    ↓
MovieCard
MovieCard
MovieCard
```

### `MovieDetails.jsx`

Displays detailed information about a selected movie.

### `Navbar.jsx`

Provides application navigation.

### `SearchBar.jsx`

Handles movie search input.

### `Loading.jsx`

Provides a reusable loading state.

## 9. Pages

### `Home.jsx`

Main landing page with the cinematic UI and movie content.

### `Discover.jsx`

Dedicated movie discovery/search experience using live OMDb data.

### `Watchlist.jsx`

Displays movies saved by the user.

## 10. Search Flow

``` text
User enters movie name
        ↓
Search function runs
        ↓
OMDb API request
        ↓
API returns JSON
        ↓
Movie data stored in state
        ↓
MovieGrid renders results
        ↓
MovieCard displays each movie
```

## 11. Environment Variables

The project uses:

``` env
VITE_OMDB_API_KEY=...
```

`.env` is ignored through `.gitignore`.

Important lesson: `VITE_*` variables are available to frontend code
after building. They should therefore not be treated as secure secrets.

For a production application, a backend proxy would keep the API key
server-side.

## 12. Styling

The UI uses custom CSS with:

-   Glassmorphism
-   Rounded cards
-   Cinematic typography
-   Cosmic background
-   Responsive layouts
-   Hover effects
-   Movie poster presentation

Main styling files:

``` text
src/App.css
src/index.css
```

## 13. Git Workflow

The project is maintained with Git.

Initial workflow:

``` bash
git init
git add .
git commit -m "Build CineScope movie discovery app"
git remote add origin https://github.com/anudeep-max/cinescope.git
git push -u origin main
```

Repository:

``` text
https://github.com/anudeep-max/cinescope
```

Initial commit:

``` text
1600784
Build CineScope movie discovery app
```

## 14. Cleanup

TMDB-only files were removed because the final application uses OMDb:

``` text
src/api/tmdb.js
src/components/WatchProviders.jsx
```

## 15. Concepts to Master

### React

-   JSX
-   Components
-   Props
-   State
-   Re-rendering
-   `useState`
-   `useEffect`
-   Event handlers
-   Conditional rendering
-   `.map()`

### APIs

-   HTTP requests
-   `fetch()`
-   Promises
-   `async/await`
-   JSON
-   Query parameters
-   Loading/error handling

### Browser

-   `localStorage`
-   Environment variables
-   DOM
-   Browser events

### React architecture

-   Component hierarchy
-   Parent → child props
-   Lifting state up
-   Separating API logic from UI
-   Client-side routing

### Git

-   Repository
-   Commit
-   Branch
-   Remote
-   Push
-   `.gitignore`

## 16. Learning Order

``` text
1. main.jsx
2. App.jsx
3. React Router
4. useState
5. useEffect
6. Home.jsx
7. omdb.js
8. fetch + async/await
9. API response structure
10. MovieGrid.jsx
11. MovieCard.jsx
12. MovieDetails.jsx
13. Watchlist logic
14. localStorage
15. CSS architecture
16. Git/GitHub
```

The goal is not to memorize the code.

The goal is to be able to explain:

> Why does this component exist, where does this data come from, how
> does it change, and what happens when the user interacts with it?
