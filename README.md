# bFocus Widget para Lazarus

> **English summary.** Lazarus (LCL) package `bfocus_widget_lcl` with the bFocus support
> widget (tickets, live chat in poll mode, release notes) rendered as **native LCL
> screens** built in code, following the web widget's behavior spec. Works on Windows
> (WinInet), Linux and macOS (fphttpclient + OpenSSL). Put only the public key `bf_pk_…`
> and a `userHash` computed **on your server** in the app. MIT licensed.

Pacote LCL do widget de suporte do bFocus: chamados, chat ao vivo e release notes com
**telas nativas** (Fase 6), com o mesmo comportamento do widget web
(`docs/widget-behavior-spec.md`). O núcleo é o mesmo do pacote Delphi.

## Instalação

1. Clone o repositório (distribuição pelo GitHub; o OPM vem depois).
2. No Lazarus: Package > Open Package File… > `package/bfocus_widget_lcl.lpk` >
   **Compile** e **Use > Install** (paleta **bFocus**: `TBFocusNativeWidget`,
   `TBFocusLauncherButton`, `TBFocusReleaseBadge`).
3. No seu projeto, acrescente a dependência `bfocus_widget_lcl`.

No Linux/macOS o HTTPS usa o OpenSSL do sistema (`libssl`). No Windows usa o WinInet (sem
DLL extra). Projetos Lazarus no Unix precisam de `cthreads` como primeira unit do `.lpr` (as
chamadas à API rodam em threads) — o modelo padrão do Lazarus já faz isso.

**HtmlViewer (opcional):** com o [HtmlViewer](https://github.com/BerndGabriel/HtmlViewer)
(pacote `FrameViewer09`) o HTML do conteúdo é renderizado com formatação e links; sem ele,
vira texto. Para ligar: adicione a dependência `FrameViewer09` ao pacote e
`-dBFOCUS_HTMLVIEWER` em Opções do pacote > Opções do compilador > Opções personalizadas.

## Uso

```pascal
uses BFocusConfig, BFocusNativeWidget, BFocusGraphics;

procedure TMainForm.FormCreate(Sender: TObject);
begin
  BFocus := TBFocusNativeWidget.Create(Self);
  BFocus.Config.PublishableKey := 'bf_pk_...';     // chave PÚBLICA
  BFocus.Config.AppId := 'com.suaempresa.erp';     // origem app://com.suaempresa.erp
  BFocus.Config.User.ExternalId := Usuario.Id;
  BFocus.Config.User.Name := Usuario.Nome;
  BFocus.Config.Customer.ExternalId := Cliente.Id;
  BFocus.Config.Customer.Name := Cliente.Nome;
  BFocus.Config.UserHash := BuscarUserHashNoMeuServidor(Usuario.Id, Cliente.Id);
  BFocus.Config.Notifications := True;
  BFocus.OnError := WidgetErro;
  BFocus.Init;

  LauncherButton.Widget := BFocus;   // botão de 56 px com badge (opcional)
  ReleaseBadge.Widget := BFocus;     // pílula "v4.2.0" (opcional)
end;
```

Cadastre o `appId` no bFocus em **Integrações → Apps nativos**. A API completa
(configuração, métodos `Open`/`Close`/`OpenReleaseNotesHistory`/`Refresh`/`Logout`, eventos
`OnBadgeChanged`/`OnReleaseNotesChanged`/`OnError`/`OnOpen`/`OnClose`/`OnUserHashRequest`,
códigos de erro) é a mesma do pacote Delphi — veja o README do `bfocus-widget-delphi`.

Resumo:
- a consulta do `launcher-state` roda a cada `PollIntervalSeconds` (60) enquanto o app está
  aberto, mesmo sem foco, com o widget fechado;
- `Notifications = True` mostra um balão na bandeja (`TTrayIcon`) quando o "•" acende;
- `OnError` recebe `WIDGET_USER_HASH_INVALID`/`WIDGET_USER_HASH_EXPIRED`/`WIDGET_VERIFIED_SESSION_REQUIRED` (depois de
  uma tentativa com hash novo via `OnUserHashRequest`, se houver), `HTTP_<status>` e
  `WIDGET_CONFIG_FAILED`, uma vez por código;
- push é só mobile: `RegisterPushToken`/`HandlePush` existem por completude.

## O que as telas cobrem

Lista de chamados (status com as cores dos tokens, "não lido" com a mesma regra do web e
leitura guardada localmente, cartão do chat), novo chamado (tipo, prioridade, departamento,
título até 500, descrição, anexos por seletor ou arrastando), detalhe (conversa, anexos com
"salvar como", conversa do chat recolhível, reabrir ao responder um resolvido, fechado sem
caixa de resposta), chat ao vivo (fila de envio com "tentar de novo"/"descartar",
agrupamento de 2 min, encerrar com confirmação, "falar com um atendente", CSAT, continuar
conversa), splash de novidades, banner de ciência com trava de rolagem e histórico. Textos em
pt_BR, en e es.

Diferenças aceitas (behavior spec §10): editor com marcação leve (negrito, itálico,
riscado, listas, citação, código e link — o campo de link aplica com Enter, cancela com Esc,
remove quando vazio e completa `https://`), HTML pelo HtmlViewer (ou texto), chat em modo
poll (5 s).

## Segurança

- No app vão **só** a chave pública `bf_pk_…` e o `userHash`. **Nunca** `bf_whs_…`,
  `bf_live_…` ou `bf_sk_…` (o `Init` recusa).
- `userHash = hex(HMAC-SHA256(segredo, "v1:" + user.externalId + ":" + customer.externalId))`,
  calculado no **seu servidor** com os SDKs do bFocus (`sign_widget_identity`).
- `http://` só é aceito para 127.0.0.1/localhost (testes).

## Testes

```
sh tests/build-fpc.sh tests/out
node tests/run-tests.mjs tests/out/bfocus_tests
```

Cenários de `scenarios.json`, view-models das telas e integração HTTP com o servidor
simulado (`tests/conformance/`).

## Manutenção (monorepo)

As units de `source/` e os testes compartilhados são **cópias** do pacote Delphi
(`widgets-native/delphi/`). Edite lá e rode:

```
node widgets-native/lazarus/tools/sync-from-delphi.mjs
```

`--check` falha se alguma cópia estiver desatualizada.

## Dependências

LCL e FCL (fphttpclient, opensslsockets). Opcional: HtmlViewer (MIT). Nenhuma outra.

## Licença

MIT — Copyright (c) 2026 Berni Software.
