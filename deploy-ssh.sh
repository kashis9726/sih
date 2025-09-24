#!/bin/bash

echo "🚀 AluVerse SSH Deployment Script"
echo "================================="

# Configuration
SERVER_USER="deployer"
SERVER_HOST="YOUR_SERVER_IP"
SERVER_PATH="/var/www/aliverse"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Checking build...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi

echo -e "${YELLOW}📤 Deploying to server...${NC}"
echo "Server: $SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# Create deployment directory if it doesn't exist
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"

# Upload files to server
echo -e "${YELLOW}📋 Uploading files...${NC}"
rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo -e "${GREEN}🌐 Your site should be available at:${NC}"
    echo "http://YOUR_SERVER_IP"
    echo ""
    echo -e "${YELLOW}💡 Make sure your web server (nginx/apache) is configured to serve from:${NC}"
    echo "$SERVER_PATH"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
