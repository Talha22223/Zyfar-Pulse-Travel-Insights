#!/bin/bash

# Automated backup script for Zyfar Pulse survey data
# Add to crontab for daily backups: 0 2 * * * /var/www/zyfar-pulse/backend/backup.sh

set -e

# Configuration
DATA_DIR="/var/zyfar_pulse/data"
BACKUP_DIR="/var/zyfar_pulse/backups"
SURVEYS_FILE="surveys.json"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="surveys_backup_${DATE}.json"
KEEP_DAYS=30  # Keep backups for 30 days

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting backup process..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if source file exists
if [ ! -f "$DATA_DIR/$SURVEYS_FILE" ]; then
    echo -e "${RED}Error: Source file not found: $DATA_DIR/$SURVEYS_FILE${NC}"
    exit 1
fi

# Create backup
cp "$DATA_DIR/$SURVEYS_FILE" "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup created: $BACKUP_DIR/$BACKUP_FILE${NC}"
    
    # Get file size
    SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "  Size: $SIZE"
    
    # Count surveys
    COUNT=$(jq '. | length' "$BACKUP_DIR/$BACKUP_FILE" 2>/dev/null || echo "N/A")
    echo "  Surveys: $COUNT"
else
    echo -e "${RED}Error: Backup failed${NC}"
    exit 1
fi

# Clean up old backups
echo "Cleaning up backups older than $KEEP_DAYS days..."
find "$BACKUP_DIR" -name "surveys_backup_*.json" -type f -mtime +$KEEP_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/surveys_backup_*.json 2>/dev/null | wc -l)
echo "Total backups: $BACKUP_COUNT"

# Disk usage
echo "Backup directory size: $(du -sh $BACKUP_DIR | cut -f1)"

echo -e "${GREEN}Backup completed successfully!${NC}"
