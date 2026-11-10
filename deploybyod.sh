#!/bin/bash

# Target directory
TARGET_DIR="~/byod/win81"
DOMAINS_FILE="$TARGET_DIR/../domainswin81.txt"
WEBHOOK_URL=""
install_git() {
    # Use sudo only if we're not root and sudo exists
    local SUDO=""
    if [ "$(id -u)" -ne 0 ]; then
        if command -v sudo >/dev/null 2>&1; then
            SUDO="sudo"
        else
            echo "Error: need root privileges or sudo to install git." >&2
            return 1
        fi
    fi

    if command -v apt-get >/dev/null 2>&1; then
        $SUDO apt-get update && $SUDO apt-get install -y git
    elif command -v dnf >/dev/null 2>&1; then
        $SUDO dnf install -y git
    elif command -v yum >/dev/null 2>&1; then
        $SUDO yum install -y git
    elif command -v pacman >/dev/null 2>&1; then
        $SUDO pacman -Sy --noconfirm git
    elif command -v zypper >/dev/null 2>&1; then
        $SUDO zypper install -y git
    elif command -v apk >/dev/null 2>&1; then
        $SUDO apk add git
    elif command -v brew >/dev/null 2>&1; then
        brew install git
    elif command -v pkg >/dev/null 2>&1; then
        $SUDO pkg install -y git
    else
        echo "Error: no supported package manager found. Install git manually." >&2
        return 1
    fi
}
if command -v git >/dev/null 2>&1; then
    echo "git is already installed: $(git --version)"
else
    echo "git not found. Installing..."
    if install_git && command -v git >/dev/null 2>&1; then
        echo "git installed successfully: $(git --version)"
    else
        echo "Failed to install git." >&2
        exit 1
    fi
fi
# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Cloning repo with git..."
    mkdir ~/byod/
    cd ~/byod/
    git clone https://github.com/fidgetsetc/blockingames.git "win81"
else
rm -rf win81
echo "Cloning repo with git..."
    mkdir ~/byod/
    cd ~/byod/
    git clone https://github.com/fidgetsetc/blockingames.git "win81"
fi
sleep 1
# CD into the directory
cd
cd byod
cd win81
echo "Switched to directory: $(pwd)"

# Check if big.txt exists
if [ ! -f "../domainswin81.txt" ]; then
    echo "Create domainswin81.txt in byod and input domains on each new line."
    exit 1
fi

echo "Starting deployment to your domains..."

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
    npx surge . "$domain" &

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
done < "../domainswin81.txt"

echo "========================================"
echo "🎉 All deployments completed!"
