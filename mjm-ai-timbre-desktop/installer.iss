; Inno Setup Script สำหรับ MJM AI Timbre Arpeggiator
; ดาวน์โหลดและติดตั้ง Inno Setup: https://jrsoftware.org/isdl.php#stable

[Setup]
; แอพพลิเคชัน
AppName=MJM AI Timbre Arpeggiator
AppVersion=1.0.0
AppPublisher=MJM AI Timbre
AppSupportURL=https://github.com/your-username/mjm-ai-timbre
AppUpdatesURL=https://github.com/your-username/mjm-ai-timbre/releases

; ไฟล์ติดตั้ง
DefaultDirName={autopf}\MJM AI Timbre Arpeggiator
DefaultGroupName=MJM AI Timbre Arpeggiator
AllowNoIcons=yes
LicenseFile=
OutputDir=installer-output
OutputBaseFilename=MJM-AI-Timbre-Arpeggiator-Setup-1.0.0
SetupIconFile=
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

; สิทธิ์ผู้ดูแลระบบ
PrivilegesRequired=admin
PrivilegesRequiredOverridesAllowed=dialog

; การแสดง
DisableWelcomePage=no
DisableProgramGroupPage=yes
DisableReadyPage=no

; การลงทะเบียน (ไม่จำเป็น)
DisableReadyMemo=no
ShowLanguageDialog=auto

; ไอคอน
SetupIconFile=icon.ico
UninstallDisplayIcon={app}\mjm-ai-timbre-desktop.exe

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "thai"; MessagesFile: "compiler:Languages\Thai.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode

[Files]
; คัดลอกไฟล์ทั้งหมดจากโฟลเดอร์แอพ
Source: "..\dist\mjm-ai-timbre-desktop-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; หมายเหตุ: อย่าใช้ Flags: "recursesubdirs" กับไฟล์ที่ลิงก์ไปยัง "{app}\{uninstallexe}"

[Icons]
Name: "{group}\MJM AI Timbre Arpeggiator"; Filename: "{app}\mjm-ai-timbre-desktop.exe"
Name: "{group}\{cm:UninstallProgram,MJM AI Timbre Arpeggiator}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\MJM AI Timbre Arpeggiator"; Filename: "{app}\mjm-ai-timbre-desktop.exe"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\MJM AI Timbre Arpeggiator"; Filename: "{app}\mjm-ai-timbre-desktop.exe"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\mjm-ai-timbre-desktop.exe"; Description: "{cm:LaunchProgram,MJM AI Timbre Arpeggiator}"; Flags: nowait postinstall skipifsilent

[Code]
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  Result := True;
  
  // ตรวจสอบว่ารันบน Windows 10 ขึ้นไปหรือไม่
  if (GetWindowsVersion < $0A000000) then
  begin
    MsgBox('This application requires Windows 10 or later.', mbError, MB_OK);
    Result := False;
  end;
end;
