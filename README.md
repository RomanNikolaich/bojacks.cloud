# ☁️ My Cloud — Облачное хранилище файлов

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![Django](https://img.shields.io/badge/Django-6.x-green?logo=django)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow)

**BoJack's Cloud** — полнофункциональное веб-приложение для загрузки, хранения и управления файлами в облаке. Реализовано по архитектуре **SPA (Single Page Application)** с разделением на независимые frontend и backend.

## 👤 Автор

**Роман Николаевич**  
📧 your.email@example.com  
💼 [GitHub](https://github.com/RomanNikolaich)


## 📄 Лицензия
Этот проект не является коммерческим продуктом, создан в рамках выпускной квалификационной работы.


## 📖 Описание проекта

Приложение решает задачу организации персонального файлового хранилища с возможностью:
- 📤 Загрузки файлов любого типа и размера
- 📥 Скачивания файлов по специальным ссылкам (без авторизации)
- 👁 Просмотра файлов прямо в браузере (PDF, изображения, видео)
- 🔐 Безопасной аутентификации через JWT-токены
- 👥 Разграничения прав доступа (пользователь / администратор)
- 📊 Администрирования пользователей и их файлов


## ✨ Возможности

### Для пользователей
- ✅ Регистрация и вход в систему
- ✅ Загрузка файлов через Web Worker (без блокировки UI)
- ✅ Просмотр списка своих файлов с метаданными
- ✅ Редактирование комментариев к файлам
- ✅ Удаление файлов
- ✅ Открытие файлов в браузере (inline)
- ✅ Скачивание файлов по уникальной ссылке (UUID-токен)
- ✅ Автоматическое обновление даты последнего скачивания

### Для администраторов
- ✅ Просмотр списка всех пользователей
- ✅ Создание новых пользователей
- ✅ Изменение ролей пользователей
- ✅ Удаление пользователей и их файлов
- ✅ Доступ к Django Admin для тонкой настройки


## 🛠 Технологический стек

### Frontend
| Технология | Назначение |
|------------|-----------|
| React 18   | UI-библиотека |
| Vite       | Сборщик |
| Zustand    | Управление состоянием |
| fetch      | HTTP-клиент |
| CSS Modules | Стилизация |

### Backend
| Технология | Назначение |
|------------|-----------|
| Python 3.11+ | Язык программирования |
| Django 6.x | Веб-фреймворк |
| Django REST Framework | API |
| SimpleJWT | JWT-аутентификация |
| PostgreSQL 17 | База данных |
| Gunicorn | WSGI-сервер |
| Nginx | Reverse-proxy |

### Инфраструктура
- **Git** — система контроля версий


## 🏗 Архитектура проекта

Проект построен по принципу **разделения ответственности**:

┌─────────────────────────────────────────────────────────┐
│ Клиент (браузер) │
└───────────────────────┬─────────────────────────────────┘
│ HTTP/HTTPS
▼
┌─────────────────────────────────────────────────────────┐
│ Nginx (порт 80/443) │
│ ┌──────────────┬──────────────┬──────────────────────┐ │
│ │ / (статика) │ /api/* │ /admin/, /static/ │ │
│ │ Frontend │ → Gunicorn │ → Gunicorn │ │
│ └──────────────┴──────────────┴──────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ Gunicorn (порт 8000, localhost) │
│ ┌─────────────────────────┐ │
│ │ Django + DRF (WSGI) │ │
│ └─────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ PostgreSQL 17 / SQLite │
└─────────────────────────────────────────────────────────┘

**Ключевые принципы:**
- **Frontend** отвечает за UI и клиентскую логику
- **Backend** отвечает за бизнес-логику, данные и безопасность
- **Nginx** — единая точка входа, отдаёт статику и проксирует API
- **JWT-токены** — stateless-аутентификация без сессий


## ⚙️ Системные требования

- **Python** 3.11+
- **Node.js** 18+ и **Yarn**
- **PostgreSQL** 17
- **Git**
- **Ubuntu** (для продакшена)
- **Gunicorn** (для продакшена)
- **Nginx** (для продакшена)


## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/RomanNikolaich/bojacks.cloud.git
cd my-cloud
```

### 2. Запуск Backend

cd backend

#### Создание виртуального окружения
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
#### .venv\Scripts\activate         # Windows

#### Установка зависимостей
pip install -r requirements.txt

#### Настройка .env
Создайте файл .env вручную или скопируйте из примера
nano .env
Или, если есть .env.example:
cp .env.example .env

#### Применение миграций
python manage.py migrate

#### Создание суперпользователя (администратора)
python manage.py createsuperuser

#### Запуск сервера разработки
python manage.py runserver

Backend будет доступен по адресу: http://localhost:8000

### 3. Запуск Frontend
cd frontend

#### Установка зависимостей
yarn install

#### Запуск dev-сервера
yarn dev

Frontend будет доступен по адресу: http://localhost:5173


## 📁 Структура проекта

my-cloud/
├── backend/                    # Django-приложение (API)
│   ├── config/                 # Настройки проекта
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/                  # Приложение: пользователи
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
|   |   └── urls.py
|   |   └── signals.py
│   ├── users_files/            # Приложение: файлы
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── permissions.py
|   |   └── urls.py
|   |   └── signals.py
│   ├── media/                  # Загруженные файлы
│   ├── .env                    # Переменные окружения
│   ├── requirements.txt
│   └── README.md               # Детальная документация backend
│
├── frontend/                   # React-приложение (UI)
│   ├── src/
│   │   ├── components/         # UI-компоненты
│   │   ├── assets/             # Картинки
│   │   ├── store/              # Zustand store
│   │   ├── webWorkers/         # Воркеры
│   │   └── App.jsx
│   │   └── router.jsx          # Роутер
│   ├── dist/                   # Сборка для продакшена
│   ├── .gitignore
│   ├── package.json
│   └── README.md               # Детальная документация frontend
└── README.md                   # ← Вы здесь


## 🔐 Переменные окружения

### Backend (backend/.env)
| Переменная | Описание | Пример |
|------------|----------|----------|
| SECRET_KEY | Секретный ключ Django | django-insecure-... |
| DEBUG | Режим отладки | True / False |
| ALLOWED_HOSTS | Разрешённые хосты | localhost,example.com |
| DB_ENGINE | Движок БД | django.db.backends.postgresql |
| DB_NAME | Имя базы данных | my_cloud |
| DB_USER | Пользователь БД | postgres |
| DB_PASSWORD | Пароль БД| secret|
| DB_HOST | Хост БД | localhost |
| DB_PORT | Порт БД | 5432 |

### Frontend (frontend/.env)
| Переменная | Описание | Пример |
|------------|----------|----------|
| VITE_API_URL | URL backend API | http://localhost:8000/api |


## 📚 Документация компонентов
Для детальной информации по каждому компоненту перейдите в соответствующий README:

| Компонент | Описание                          | README                                     |
|----------|------------------------------------|--------------------------------------------|
| Backend | API, модели, аутентификация, деплой | [`backend/README.md`](./backend/README.md) |
| Frontend | UI-компоненты, роутинг, состояние | [`frontend/README.md`](./frontend/README.md) |


## 🚢 Развёртывание в продакшене

В продакшене используется связка **Nginx + Gunicorn**, где Nginx выступает единой точкой входа.

### 📋 Системные требования для сервера

- **ОС:** Ubuntu 22.04+ (рекомендуется) или другой Linux-дистрибутив
- **Python:** 3.11+
- **PostgreSQL:** 17+
- **Nginx:** 1.18+
- **Git**
- **Домен:** настроенный DNS (например, `mycloud.example.com`)

### 🔧 Шаг 1: Установка системных зависимостей

```bash
# Обновление пакетов
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y python3.11 python3.11-venv python3-pip
sudo apt install -y postgresql postgresql-contrib
sudo apt install -y nginx
sudo apt install -y git
```

### 🗄️ Шаг 2: Настройка PostgreSQL
```bash
# Вход в PostgreSQL
sudo -u postgres psql

# В консоли PostgreSQL выполните:
CREATE DATABASE my_cloud;
CREATE USER my_cloud_user WITH PASSWORD 'your_secure_password';

# Настройка параметров пользователя
ALTER ROLE my_cloud_user SET client_encoding TO 'utf8';
ALTER ROLE my_cloud_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE my_cloud_user SET timezone TO 'UTC';

# Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE my_cloud TO my_cloud_user;

# Выход
\q
```

### 📥 Шаг 3: Клонирование проекта
```bash
# Перейдите в директорию для проектов
cd ~/bojacks.cloud

# Клонируйте репозиторий
sudo git clone https://github.com/RomanNikolaich/bojacks.cloud.git
cd bojacks.cloud

'''# Установка владельца (замените www-data на вашего пользователя)
sudo chown -R www-data:www-data /var/www/my-cloud
```

### ⚙️ Шаг 4: Настройка Backend
```bash
cd bojacks.cloud/backend

# Создание виртуального окружения
python3.11 -m venv venv

# Активация окружения
source venv/bin/activate

# Установка зависимостей
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn  # WSGI-сервер

# Создание .env файла
nano .env
```

SECRET_KEY=your-super-secret-key-generate-this
DEBUG=False
ALLOWED_HOSTS=mycloud.example.com,www.mycloud.example.com

- Содержимое .env:

- PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_NAME=my_cloud
DB_USER=my_cloud_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

- Файловое хранилище
MEDIA_ROOT=/var/www/bojacks.cloud/backend/media
MEDIA_URL=/media/

```bash
# Применение миграций
python manage.py migrate --noinput

Перейти в bojacks.cloud/backend/config/settings.py и добавить STATIC_ROOT = BASE_DIR / 'static'.
В ALLOWED_HOSTS = [] нужнsq IP-адрес сервера

# Сборка статики Django
python manage.py collectstatic --noinput

# Создание суперпользователя (администратора)
python manage.py createsuperuser

# Деактивация виртуального окружения
deactivate
```


### 🎨 Шаг 5: Сборка Frontend
```bash
cd /home/`username`/bojack.cloud/frontend

# Установка Node.js (если не установлен)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка Yarn
sudo npm install -g yarn

# Установка зависимостей
yarn install

# Сборка для продакшена
yarn build

# Установка владельца
sudo chown -R www-data:www-data /home/`username`/bojack.cloud/frontend/dist
```

### 🔐 Шаг 6: Настройка прав доступа
```bash
# Права на медиа-файлы
sudo chown -R www-data:www-data /home/w`username`ww/bojack.cloud/backend/media
sudo chmod -R 755 /var/www/bojack.cloud/backend/media

# Права на статику
sudo chown -R www-data:www-data /home/`username`/bojack.cloud/backend/staticfiles
sudo chmod -R 755 /home/`username`/bojack.cloud/backend/staticfiles

# Права на фронтенд
sudo chown -R www-data:www-data /home/`username`/bojack.cloud/frontend/dist
sudo chmod -R 755 /var/www/bojack.cloud/frontend/dist
```

### 🚀 Шаг 7: Создание systemd-сервиса для Gunicorn
```bash
sudo nano /etc/systemd/system/gunicorn.service

Содержимое файла:
[Unit]
Description=Gunicorn daemon for My Cloud
After=network.target

[Service]
User=`username`
Group=`username`
WorkingDirectory=/home/`username`/bojack.cloud/backend
Environment="PATH=/var/www/bojack.cloud/backend/venv/bin"
EnvironmentFile=/var/www/bojack.cloud/backend/.env
ExecStart=/home/`username`/bojacks.cloud/backend/env/bin/gunicorn --access-logfile - \
        --workers 3 --bind unix:/home/`username`/bojacks.cloud/backend/config/project.sock \
        config.wsgi:application
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# Запуск и активация сервиса
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Проверка статуса
sudo systemctl status gunicorn
```

### 🌐 Шаг 8: Настройка Nginx
```bash
sudo nano /etc/nginx/sites-available/bojacks-cloud

# Содержимое файла:

server {
    listen 80;
    server_name 194.67.111.246;

    location /api/ {
        proxy_pass http://unix:/home/`username`/bojacks.cloud/backend/config/project.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    .}

    location /admin/ {
        proxy_pass http://unix:/home/`username`/bojacks.cloud/backend/config/project.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    .}

    location /static/ {
        alias /home/`username`/bojacks.cloud/backend/static/;
    .}

    location /media/ {
        alias /home/`username`/bojacks.cloud/backend/media/;
    .}

    location /assets/ {
        alias /home/`username`/bojacks.cloud/frontend/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    .}

    location / {
        root /home/`username`/bojacks.cloud/frontend/dist;
        try_files $uri $uri/ /index.html;
    .}
.}

# Активация сайта
sudo ln -s /etc/nginx/sites-available/my-cloud /etc/nginx/sites-enabled/

# Удаление дефолтного сайта
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### ✅ Шаг 9: Проверка работоспособности
```bash
# Проверка статуса сервисов
sudo systemctl status gunicorn
sudo systemctl status nginx
sudo systemctl status postgresql

# Проверка логов
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u gunicorn -f

# Проверка доступности
curl http://localhost:80  # Должен вернуть HTML фронтенда
curl http://localhost:80/api/  # Должен вернуть JSON от API
```

## 🔒 Безопасность
✅ Пароли хэшируются алгоритмом PBKDF2 (стандарт Django)
✅ JWT-токены с коротким временем жизни access-токена
✅ Защита от CSRF-атак
✅ Разграничение прав доступа (пользователь / админ)
✅ Валидация всех входных данных через DRF-сериализаторы
✅ Чувствительные данные вынесены в .env (не коммитятся в Git)
✅ Secure-флаги для cookie в продакшене


## 📊 Особенности реализации
Web Worker для загрузки файлов — UI не блокируется при передаче больших файлов
UUID-токены для публичного доступа — безопасные ссылки без авторизации
Inline-просмотр файлов в браузере с правильной обработкой MIME-типов и UTF-8
Object-level permissions — пользователи видят только свои файлы
Логирование всех событий через стандартный модуль logging
Модульная архитектура — разделение на приложения users и users_files


## 🤝 Вклад в проект
Форкните репозиторий
Создайте ветку для новой функции (git checkout -b feature/amazing-feature)
Закоммитьте изменения (git commit -m 'Add amazing feature')
Запушьте в ветку (git push origin feature/amazing-feature)
Откройте Pull Request