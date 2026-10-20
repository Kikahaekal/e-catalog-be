#!/bin/sh
set -e

echo "============================================"
echo "  E-Catalog Backend - Docker Entrypoint"
echo "============================================"

# ── Wait for database ───────────────────────────
echo "⏳ Checking database connection..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if node --input-type=commonjs -e "
    const net = require('net');
    const s = new net.Socket();
    s.setTimeout(2000);
    s.connect(${DB_PORT:-5432}, '${DB_HOST:-db}', () => { s.destroy(); process.exit(0); });
    s.on('error', () => process.exit(1));
    s.on('timeout', () => { s.destroy(); process.exit(1); });
  " 2>/dev/null; then
    echo "✅ Database connection established!"
    break
  fi

  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "  ⏳ Waiting for database... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
  echo "❌ Failed to connect to database after $MAX_RETRIES attempts"
  exit 1
fi

# ── Run migrations (optional) ──────────────────
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo ""
  echo "🔄 Preparing Prisma environment..."
  
  # Generate Prisma Client first (required for migrations)
  echo "  📦 Generating Prisma Client..."
  npx prisma generate || {
    echo "⚠️  Prisma Client generation failed"
  }
  
  # Emit contract (for Prisma 8)
  echo "  📝 Emitting contract..."
  npm run contract:emit || {
    echo "⚠️  Contract emit failed, continuing anyway..."
  }
  
  # Run migrations
  echo "  🔄 Running database migrations..."
  npx prisma db init || {
    echo "⚠️  Migration failed — you may need to run them manually:"
    echo "    docker compose exec backend npx prisma generate"
    echo "    docker compose exec backend npm run contract:emit"
    echo "    docker compose exec backend npx prisma db migrate"
  }
  echo ""
fi

# ── Start server ───────────────────────────────
echo "🚀 Starting E-Catalog Backend on port ${PORT:-3000}..."
exec "$@"
