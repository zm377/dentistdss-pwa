#!/bin/bash

# Create a backup branch
git checkout -b backup_before_cleanup

# Remove sensitive content from .env
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch .env" \
--prune-empty --tag-name-filter cat -- --all

# Remove sensitive content from src/config.js
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch src/config.js" \
--prune-empty --tag-name-filter cat -- --all

# Remove certs/privkey.pem
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch certs/privkey.pem" \
--prune-empty --tag-name-filter cat -- --all

# Force garbage collection
git gc --aggressive --prune=now

# Force push the changes
echo "Please review the changes and then run:"
echo "git push origin --force --all"
echo "git push origin --force --tags"