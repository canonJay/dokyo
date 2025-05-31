# Используем официальный образ PostgreSQL
FROM postgres:latest

# Опционально: задаем переменные среды для настройки PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=postgres

# Опционально: можно добавить скрипты инициализации базы данных
# COPY init.sql /docker-entrypoint-initdb.d/

# Порт, который будет слушать PostgreSQL
EXPOSE 5432

# Команда запуска PostgreSQL (уже включена в базовый образ)
CMD ["postgres"]