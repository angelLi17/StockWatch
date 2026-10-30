# StockWatch

Search stocks, keep a personal watchlist, and get price alerts. Built for the Full Stack Decal APImagination project.

- **client/**: React (Vite + TypeScript), React Router, Axios, Tailwind CSS, Firebase Auth
- **server/**: Express, MongoDB (Mongoose), Firebase Admin, Finnhub stock API, node-cron alert checker

```
React ──Firebase SDK──► Firebase Auth (login, returns ID token)
React ──Axios + Bearer token──► Express ──verifyIdToken──► uid
                                Express ──► MongoDB (watchlist, alerts, symbol cache)
                                Express ──► Finnhub (quotes, search, profiles)
```

## Setup

1. `cp server/.env.example server/.env` and fill in MongoDB, Finnhub, and Firebase Admin values.
2. `cp client/.env.example client/.env.local` and fill in the Firebase web config.
3. Install and run (two terminals):

```sh
cd server && npm install && npm run dev   # http://localhost:4000
cd client && npm install && npm run dev   # http://localhost:5173
```

`.env` files are gitignored. Never commit real keys.

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/symbols/search?q=` | – | Search tickers |
| GET | `/api/symbols/:ticker` | – | Quote + company info |
| GET / POST | `/api/watchlist` | ✓ | User's symbols with price, change, market cap, P/E, sector / add `{ ticker }` |
| GET | `/api/watchlist/tickers` | ✓ | Just the user's tickers |
| GET | `/api/watchlist/analysis` | ✓ | Buy / Hold / Sell rating + summary per symbol (from analyst consensus) |
| DELETE | `/api/watchlist/:ticker` | ✓ | Remove a symbol |
| GET / POST | `/api/alerts` | ✓ | List / create `{ ticker, condition: above\|below\|percentUp\|percentDown, value }` |
| PATCH / DELETE | `/api/alerts/:id` | ✓ | Update or re-arm / delete |

Alerts are checked every minute by a cron job. If `SMTP_*` is set in `server/.env`, triggered alerts are also emailed.

## Design

Figma mockups: [StockWatch design](https://www.figma.com/design/ThiuE9hioDbE2DJJG7njOw/Project-2?node-id=8-26&p=f&t=jr1ha6h59wtgF2Bp-0)

