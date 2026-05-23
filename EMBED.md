# Insura Chat — Embed on other websites

Partners add **one line**. Host and API are resolved on your side automatically.

## What partners add

```html
<script src="https://YOUR-INSURANCELAB-DOMAIN.com/insura-chat-loader.js" async></script>
```

Nothing else. No `data-host`, no API URL.

The loader reads your domain from the script `src` and opens `/embed/chat` on that same domain.

## What you configure (your server only)

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-internal-api.com
```

Used inside your app when chat is wired to the backend. Not exposed to partner sites.

## Local dev test

```html
<script src="http://localhost:3000/insura-chat-loader.js" async></script>
```

Or open: [http://localhost:3000/embed/chat](http://localhost:3000/embed/chat)

## iframe alternative

```html
<iframe
  src="https://YOUR-INSURANCELAB-DOMAIN.com/embed/chat"
  title="Insura Chat"
  style="position:fixed;bottom:0;right:0;width:420px;height:720px;max-height:100vh;border:none;background:transparent;z-index:999999;"
></iframe>
```

## Routes

| URL                      | Purpose              |
| ------------------------ | -------------------- |
| `/`                      | Main site + chat     |
| `/embed/chat`            | Chat-only (iframe)   |
| `/insura-chat-loader.js` | Script for partners  |
