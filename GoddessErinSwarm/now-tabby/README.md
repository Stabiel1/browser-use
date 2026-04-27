# Tabby (optional)

**Tabby** code completion / chat server is included as an optional Compose profile so the default stack stays lighter.

Start with Tabby:

```bash
docker compose --profile tabby up -d
```

- Default URL: **http://localhost:8088** (mapped from container port 8080).
- Models and cache live in the `tabby_data` volume. Set `TABBY_MODEL` and `TABBY_CHAT_MODEL` in `.env` if you want different weights.
