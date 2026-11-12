
#!/usr/bin/env bash
set -euo pipefail

# BYOD deployment preparation
DEPLOY_DIR="$PWD/byod"

echo "=== BYOD Deployment Setup ==="

# Check dependencies
for cmd in npm npx curl python3 sudo; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Missing dependency: $cmd"
        exit 1
    fi
done

mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

echo
echo "Deployment directory: $DEPLOY_DIR"

# Authenticate with Surge
echo
echo "Starting Surge login..."
npx surge login

echo
read -r -p "Have you signed up for Surge? [y/N] " signed_up

if [[ "$signed_up" =~ ^[Yy]$ ]]; then
    echo "Verifying Surge account..."
    npx surge verify
else
    echo "Skipping verification."
fi

# Download deployment script
echo
echo "Downloading deploybyod.sh..."

curl -fL \
    -o deploy.sh \
    https://mpcplay.surge.sh/deploybyod.sh

# Choose deployment mode
echo
echo "Choose deployment mode:"
echo "1) One by one (recommended)"
echo "2) All at once (experimental)"

while true; do
    read -r -p "Selection [1/2]: " mode

    case "$mode" in
        1)
            MODE="sequential"
            break
            ;;
        2)
            MODE="parallel"
            break
            ;;
        *)
            echo "Please enter 1 or 2."
            ;;
    esac
done

# Patch deployment script
python3 - "$MODE" <<'PY'
import pathlib
import sys

mode = sys.argv[1]
path = pathlib.Path("deploy.sh")

content = path.read_text()

parallel = 'npx surge . "$domain" &'
sequential = 'npx surge . "$domain"'

if parallel not in content:
    print("ERROR: Expected deployment command was not found.")
    print("The downloaded script may have changed.")
    sys.exit(1)

if mode == "sequential":
    content = content.replace(parallel, sequential)
    print("Configured sequential deployment.")
else:
    print("Keeping experimental parallel deployment.")

path.write_text(content)
PY

chmod +x deploy.sh

# Create domains file if missing
touch domainswin81.txt

echo
echo "=== Deployment Script Review ==="
echo "The downloaded script has not been executed."
echo "Review it before deploying:"
echo
echo "  nano deploy.sh"
echo "  nano domainswin81.txt"

# Create interactive shell launcher
LAUNCHER="/tmp/byod-shell-$$"

{
    printf '#!/usr/bin/env bash\n'
    printf 'DEPLOY_DIR=%q\n' "$DEPLOY_DIR"

    cat <<'SHELL'
set -euo pipefail

cd "$DEPLOY_DIR"

echo "BYOD Deployment Environment"
echo "Directory: $DEPLOY_DIR"
echo "Type 'help' for available commands."
echo

while true; do
    read -r -p "byod> " command || break

    case "$command" in
        deploy)
            ./deploy.sh
            ;;
        domainset)
            "${EDITOR:-nano}" domainswin81.txt
            ;;
        login)
            npx surge login
            ;;
        verify)
            npx surge verify
            ;;
        clean)
            rm -rf ~/byod/win81
            ;;
        help)
            echo "Available commands:"
            echo "  deploy     Run deployment"
            echo "  domainset  Edit domains.txt"
            echo "  login      Log into Surge"
            echo "  verify     Verify Surge account"
            echo "  help       Show this help"
            echo "  exit       Exit BYOD shell"
            echo "  clean      Required: Clean up cache from deployment, required before deploying another time"
            ;;
        exit|quit)
            break
            ;;
        "")
            ;;
        *)
            echo "Unknown command: $command"
            echo "Type 'help' for available commands."
            ;;
    esac
done
SHELL
} > "$LAUNCHER"

chmod +x "$LAUNCHER"

sudo install -m 755 "$LAUNCHER" /usr/local/bin/byod
rm -f "$LAUNCHER"

echo
echo "=== Setup Complete ==="
echo "Deployment directory: $DEPLOY_DIR"
echo "Launcher installed: /usr/local/bin/byod"
echo
echo "Start your BYOD environment with:"
echo "  byod"
