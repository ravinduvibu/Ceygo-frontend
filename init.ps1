cmd.exe /c 'npx -y create-next-app@latest ceygo --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm'
Get-ChildItem -Path ceygo -Force | Move-Item -Destination . -Force
Remove-Item -Path ceygo -Recurse -Force
