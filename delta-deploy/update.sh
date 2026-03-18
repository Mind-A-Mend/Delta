#!/bin/bash
# update.sh — Replace delta-app.jsx from Claude and fix for deployment
# Usage: ./update.sh path/to/delta-app.jsx

if [ -z "$1" ]; then
  echo "Usage: ./update.sh <path-to-delta-app.jsx>"
  echo "Example: ./update.sh ~/Downloads/delta-app.jsx"
  exit 1
fi

cp "$1" src/DeltaApp.jsx

# Replace window.storage with localStorage
sed -i 's/window\.storage\.set("\([^"]*\)", JSON\.stringify(\([^)]*\)))/localStorage.setItem("\1", JSON.stringify(\2))/g' src/DeltaApp.jsx
sed -i 's/await window\.storage\.get("\([^"]*\)")/{ value: localStorage.getItem("\1") }/g' src/DeltaApp.jsx

echo "✅ Updated src/DeltaApp.jsx"
echo "   - Replaced window.storage.set → localStorage.setItem"
echo "   - Replaced window.storage.get → localStorage.getItem"
echo ""
echo "Next: git add . && git commit -m 'Update from Claude' && git push"
