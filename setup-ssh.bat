@echo off
echo 🔧 AluVerse SSH Deployment Setup
echo ================================
echo.

echo 📋 Manual Setup Steps:
echo ======================
echo.
echo 1. Generate SSH Key (if you don't have one):
echo    ssh-keygen -t rsa -b 4096 -f %%USERPROFILE%%\ .ssh\id_rsa -N ""
echo.
echo 2. Get your public key:
echo    type %%USERPROFILE%%\.ssh\id_rsa.pub
echo.
echo 3. On your server, add this key to authorized_keys
echo.
echo 4. Update deploy-ssh.bat with your server details:
echo    - Replace YOUR_SERVER_IP with your actual IP
echo    - Replace deployer with your username
echo.
echo 5. Install required software on server:
echo    - Node.js 18+
echo    - nginx or apache web server
echo.
echo 6. Configure your web server to serve from /var/www/aliverse
echo.
echo 7. Run: deploy-ssh.bat
echo.
echo 🌐 Your deployment files are ready:
echo    - deploy-ssh.bat (Windows)
echo    - deploy-ssh.sh (Linux/Mac)
echo    - nginx.conf (web server config)
echo    - setup-ssh.sh (setup guide)
echo.
pause
