# 🥬 Bok — Your Local Asian Grocer Hub

> Snap a deal. Find cheap groceries. Skip the WeChat group.

Bok is a live deals platform for local Asian grocers in Melbourne. Shoppers can photograph a price tag in-store, and the AI pipeline extracts the product, price, and discount — in any language — and puts it on a searchable, map-based feed for everyone nearby.

Built at **BassHacks 2026 (Bass × EY Hackathon)**

---

## Features

- **Home feed** — today's top deals from Asian grocers near you
- **Map view** — live deal pins across Melbourne, filterable by cuisine and distance
- **Snap a tag** — photograph a price tag or flyer (Chinese, Japanese, Korean, Vietnamese supported), AI does the rest
- **Search** — find the cheapest version of a specific item within walking distance

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | TailwindCSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini (vision model) |
| Maps | Leaflet + OpenStreetMap |

---

## How the AI Pipeline Works

```
User uploads photo or text
        ↓
Google Gemini (vision + multilingual OCR)
        ↓
Extracts: product name · price · discount · category · store
        ↓
Uncertain fields → flagged for manual review (null returned, not guessed)
        ↓
Structured deal written to Supabase
        ↓
Appears on feed + map
```

Gemini handles OCR, translation, and extraction in a single prompt. Both the original-language name and an English version are stored so search works regardless of what language the user types in.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/your-org/bok.git
cd bok
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

The core table is `deals`:

```sql
create table deals (
  id          uuid primary key default gen_random_uuid(),
  store_name  text not null,
  product_en  text not null,
  product_raw text,
  price       numeric not null,
  was_price   numeric,
  discount    numeric,
  category    text,
  language    text,
  lat         numeric,
  lng         numeric,
  verified    boolean default false,
  created_at  timestamptz default now()
);
```

---

## Project Structure

```
bok/
├── app/
│   ├── page.tsx           # Home feed
│   ├── map/page.tsx       # Map view
│   ├── snap/page.tsx      # Deal submission
│   ├── search/page.tsx    # Search
│   └── api/
│       ├── extract/       # Gemini pipeline
│       └── deals/         # CRUD routes
├── components/
├── lib/
│   ├── supabase.ts
│   └── gemini.ts
└── public/
```

---

## Roadmap

| Timeline | Milestone |
|---|---|
| Q4 2026 | Deal verification system, more grocer on-boarding, improved extraction accuracy |
| 2027 | Wishlist alerts, predictive pricing analytics for businesses |
| 2028 | Expand across VIC and NSW |

---

## Team

| Name | Role |
|---|---|
| Luca Xu | — |
| Roy Zhang | — |
| Darren Ma | — |
| Sam Gomulya | — |

---

## License

MIT
