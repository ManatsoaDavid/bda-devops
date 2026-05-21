# Image officielle PHP 8.3 avec Apache intégré
FROM php:8.3-apache

# Installer l'extension PDO pour PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Activer mod_rewrite pour les API REST
RUN a2enmod rewrite headers

# Copier votre code PHP dans le dossier Apache
COPY . /var/www/html/

# Permissions correctes pour Apache
RUN chown -R www-data:www-data /var/www/html

# Variables d'environnement (surchargeables au runtime)
ENV DB_HOST=postgres \
    DB_NAME=versements \
    DB_USER=manatsoa_user \
    DB_PORT=5432

EXPOSE 80