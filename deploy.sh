#!/bin/bash

# Target directory
TARGET_DIR="/home/scrappy73/Projects/win81"
DOMAINS_FILE="$TARGET_DIR/domains.txt"
WEBHOOK_URL=""

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: Directory $TARGET_DIR does not exist."
    exit 1
fi

# CD into the directory
cd "$TARGET_DIR" || exit 1
echo "📁 Switched to directory: $(pwd)"

# Check if big.txt exists
if [ ! -f "domains.txt" ]; then
    echo "❌ Error: big.txt not found in $TARGET_DIR"
    exit 1
fi

echo "🚀 Starting deployment to Surge domains..."

# Loop through each line in big.txt
while IFS= read -r domain || [ -n "$domain" ]; do
    # Trim whitespace and skip empty lines or comments
    domain=$(echo "$domain" | xargs)
    [[ -z "$domain" || "$domain" =~ ^# ]] && continue

    echo "----------------------------------------"
    echo "🌐 Deploying to: $domain"
    echo "----------------------------------------"
    
    # Run surge deployment
    # Note: Current directory '.' is deployed to the specified domain
    npx surge@latest . "$domain" &

    if [ $? -eq 0 ]; then
        echo "✅ Successfully deployed to $domain"
        # Send success webhook
        curl -H "Content-Type: application/json" \
             -X POST \
             -d "{\"content\": \"Deployed latest commit to $domain\"}" \
             "$WEBHOOK_URL" > /dev/null 2>&1
    else
        echo "❌ Failed to deploy to $domain"
        # Send failure webhook
        curl -H "Content-Type: application/json" \
             -X POST \
             -d "{\"content\": \"Couldn't deploy latest commit to $domain\"}" \
             "$WEBHOOK_URL" > /dev/null 2>&1
    fi
done < "domains.txt"

echo "========================================"
echo "🎉 All deployments completed!"
