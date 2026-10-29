# Changelog

## 0.1.1 — 2026-10-29

- Fim do chat: com `survey: false` na conversa (a empresa ou quem encerrou não manda a pesquisa
  de satisfação), `BFClosingOutcome` devolve `coPlain`: só o aviso de encerrada, sem o
  formulário de avaliação.

## 0.1.0 — 2026-09-15

Primeira versão.

- Pacote `bfocus_widget_lcl` com `TBFocusNativeWidget`: telas nativas LCL (lista de
  chamados, novo chamado, detalhe, chat ao vivo em modo poll, splash, banner e histórico
  de release notes), `TBFocusLauncherButton` e `TBFocusReleaseBadge`.
- Núcleo compartilhado com o pacote Delphi: cliente da API do widget, `launcher-state`,
  badge, pílula e Host Protocol v1; transporte `fphttpclient` (Linux/macOS) ou WinInet
  (Windows).
- Testes do núcleo com FPC sobre `scenarios.json` + integração com o servidor simulado.
