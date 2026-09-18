program native_demo;

{ Exemplo mínimo do Lazarus: telas nativas LCL do widget bFocus. Abra native_demo.lpi
  (depende do pacote bfocus_widget_lcl). }

{$MODE DELPHI}{$H+}

uses
  {$IFDEF UNIX}
  cthreads, // as chamadas à API rodam em threads
  {$ENDIF}
  Interfaces, Forms, DemoNativeMain;

begin
  Application.Scaled := True;
  Application.Initialize;
  Application.CreateForm(TDemoForm, DemoForm);
  Application.Run;
end.
