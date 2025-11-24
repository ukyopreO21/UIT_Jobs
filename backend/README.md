## Getting Started

First, create .env:

```
PORT (default 3000)
JWT_SECRET
```

Second, create localhost database "uit_jobs" with username "root" and password "root" on port 3306 or edit connection in src/config/db.js

```
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "uit_jobs",
};
```

Next, run the development server:

```bash
npm run dev
```
