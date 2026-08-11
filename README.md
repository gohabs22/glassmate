# GlassMate

Beer-to-glass matching app — scan a beer, see the best glass from your host's collection.

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/gohabs22/glassmate.git
   cd glassmate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment file from the example:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required values (Firebase config, etc.) in `.env.local`.

4. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.
