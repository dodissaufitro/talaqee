#!/bin/bash
# ================================================================
# TALAQEE - Production Fix & Deployment Script
# Jalankan di server production: bash deploy_fix.sh
# ================================================================

set -e

echo "================================================"
echo "  TALAQEE - Production Fix & Optimization Script"
echo "================================================"

# 1. Hapus file dev Vite 'hot' jika ada
echo ""
echo "[1/7] Menghapus file public/hot jika ada..."
rm -f public/hot
echo "  OK."

# 2. Cek & pastikan storage symlink terhubung
echo ""
echo "[2/7] Memeriksa storage symlink..."
php artisan storage:link || true
echo "  OK."

# 3. Perbaiki permissions folder storage dan bootstrap/cache
echo ""
echo "[3/7] Mengatur izin folder storage & bootstrap/cache..."
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || \
chown -R www:www storage bootstrap/cache 2>/dev/null || \
chown -R nginx:nginx storage bootstrap/cache 2>/dev/null || true
echo "  OK."

# 4. Jalankan migrasi database
echo ""
echo "[4/7] Menjalankan migrasi database..."
php artisan migrate --force
echo "  OK."

# 5. Bersihkan cache lama
echo ""
echo "[5/7] Membersihkan cache lama..."
php artisan optimize:clear
echo "  OK."

# 6. Rebuild cache produksi
echo ""
echo "[6/7] Membangun cache produksi (config, route, view)..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "  OK."

# 7. Restart PHP-FPM & Web Server
echo ""
echo "[7/7] Merestart PHP-FPM & Web Server..."
if command -v systemctl >/dev/null 2>&1; then
    sudo systemctl restart php8.3-fpm 2>/dev/null || \
    sudo systemctl restart php8.2-fpm 2>/dev/null || \
    sudo systemctl restart php8.1-fpm 2>/dev/null || \
    sudo systemctl restart php-fpm 2>/dev/null || true

    sudo systemctl reload openresty 2>/dev/null || \
    sudo systemctl reload nginx 2>/dev/null || true
    echo "  Layanan berhasil direstart."
else
    echo "  (systemctl tidak ditemukan, silakan restart PHP-FPM via panel/aaPanel jika perlu)"
fi

echo ""
echo "================================================"
echo "  SELESAI! Silakan akses kembali website Anda."
echo "================================================"
