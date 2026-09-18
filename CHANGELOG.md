# Changelog

## 0.1.0 — 2026-09-15

Primeira versão.

- Pacote `bfocus_widget_lcl` com `TBFocusNativeWidget`: telas nativas LCL (lista de
  chamados, novo chamado, detalhe, chat ao vivo em modo poll, splash, banner e histórico
  de release notes), `TBFocusLauncherButton` e `TBFocusReleaseBadge`.
- Núcleo compartilhado com o pacote Delphi: cliente da API do widget, `launcher-state`,
  badge, pílula e Host Protocol v1; transporte `fphttpclient` (Linux/macOS) ou WinInet
  (Windows).
- Testes do núcleo com FPC sobre `scenarios.json` + integração com o servidor simulado.
