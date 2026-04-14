# Open WebUI (live)

This stack runs **Open WebUI** from `ghcr.io/open-webui/open-webui:cuda` in the root `docker-compose.yml`, fronting **Ollama** at `OLLAMA_BASE_URL`.

- After `docker compose up`, open **http://localhost:3000** and complete the first-time admin setup in the browser.
- Point models at Ollama pulls (`docker exec -it ges-ollama ollama pull <model>`) or add other providers in the Open WebUI settings (API keys stay in the UI or env — never commit them).

See the root `README.md` for ports and security notes.
