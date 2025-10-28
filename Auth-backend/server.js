// server.js

// 1. Импортируем все необходимые библиотеки
require('dotenv').config(); // Загружает переменные из .env файла
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg'); // Драйвер для PostgreSQL

// 2. Настраиваем подключение к базе данных, используя данные из .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 3. Создаем наше приложение Express
const app = express();
const PORT = 3001; // Порт, на котором будет работать наш бэкенд

// 4. Подключаем "посредники" (middleware)
app.use(cors()); // Разрешаем CORS-запросы
app.use(express.json()); // Позволяем серверу принимать JSON в теле запроса

// 5. Создаем маршруты (endpoints) для нашего API

// Маршрут для регистрации
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Простая проверка, что email и пароль пришли
  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Добавляем нового пользователя в базу данных
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser.rows[0] });

  } catch (error) {
    console.error(error);
    // Обрабатываем ошибку, если пользователь с таким email уже существует
    if (error.code === '23505') {
        return res.status(409).json({ message: 'Пользователь с таким логином уже существует' });
    }
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
});

// Маршрут для входа (логина)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    // Ищем пользователя в базе по email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    // Если пользователь не найден
    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    // Сравниваем присланный пароль с хешем в базе
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // Если пароли не совпадают
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    // Если все в порядке, отправляем успешный ответ
    res.status(200).json({ message: 'Вход выполнен успешно', email: user.email });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
});

// 6. Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен и слушает порт ${PORT}`);
});