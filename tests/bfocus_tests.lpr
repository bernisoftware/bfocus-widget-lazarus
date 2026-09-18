program bfocus_tests;

{ Testes do núcleo (FPC/Lazarus, console):
    bfocus_tests [--scenarios <arquivo>] [--mock <http://127.0.0.1:porta>]
  tests/run-tests.mjs sobe o servidor simulado e passa --mock. Saída 0 = tudo verde. }

{$MODE DELPHI}{$H+}

uses
  SysUtils, BFocusTestKit, BFocusCoreTests, BFocusVMTests, BFocusIntegrationTests;

function Arg(const Name, Default: string): string;
var
  I: Integer;
begin
  Result := Default;
  for I := 1 to ParamCount - 1 do
    if ParamStr(I) = Name then
      Result := ParamStr(I + 1);
end;

var
  Scenarios, Mock: string;
begin
  Scenarios := Arg('--scenarios', ExtractFilePath(ParamStr(0)) + 'scenarios.json');
  Mock := Arg('--mock', '');
  RunCoreTests(Scenarios);
  RunVMTests;
  if Mock <> '' then
    RunIntegrationTests(Mock)
  else
    WriteLn('(integracao HTTP pulada: sem --mock)');
  Halt(Summary);
end.
