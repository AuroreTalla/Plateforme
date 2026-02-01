a l'installation locale 

Créer le fichier .env
cd deploy
cp .env.example .env
DB_ROOT_PASSWORD=root123
DB_NAME=plateformeBD
DB_USER=root
DB_PASSWORD=root

JWT_SECRET=608f36e92dc66d97d5933f0e6371493cb4fc05b1aa8f8de64014732472303a7c
JWT_EXPIRATION_ACCESS=1800000
JWT_EXPIRATION_REFRESH=604800000

APP_COOKIE_SECURE=false
APP_COOKIE_SAMESITE=Lax

FRONTEND_URL=http://localhost
VITE_API_URL=http://localhost:8081

lancer l'appli
docker-compose up --build -d