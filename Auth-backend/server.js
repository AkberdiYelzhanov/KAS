// auth-backend/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Драйвер для PostgreSQL
const bcrypt = require('bcrypt'); // Библиотека для хэширования паролей

const app = express();
const port = 3001;

// --- ВАЖНО: Настройка CORS ---
// Это разрешает вашему frontend-приложению (запущенному, например, на localhost:5173)
// отправлять запросы на этот backend-сервер (запущенный на localhost:3001)
app.use(cors()); 
app.use(bodyParser.json());

// --- ВАЖНО: Настройка подключения к вашей базе данных ---
// Замените эти значения на ваши реальные данные от PostgreSQL
const pool = new Pool({
  user: 'postgres',       // Имя пользователя БД
  host: 'localhost',
  database: 'auth_db',         // Имя вашей базы данных
  password: 'admin', // Пароль от пользователя БД
  port: 5432,
});

const saltRounds = 10; // Сложность хэширования

// --- Эндпоинт для регистрации ---
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[Register] Получен запрос для email: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    // Хэшируем пароль перед сохранением в базу
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    console.log(`[Register] Пользователь ${email} успешно создан.`);
    res.status(201).json({ message: 'Регистрация прошла успешно', user: result.rows[0] });

  } catch (error) {
    console.error('[Register] Ошибка:', error.message);
    if (error.code === '23505') { // Код ошибки для уникального ключа в PostgreSQL
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// --- Эндпоинт для входа ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[Login] Получен запрос для email: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log(`[Login] Ошибка: пользователь ${email} не найден.`);
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    // Сравниваем пароль из запроса с хэшем в базе данных
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log(`[Login] Ошибка: неверный пароль для пользователя ${email}.`);
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    console.log(`[Login] Пользователь ${email} успешно вошел.`);
    // Отправляем только email, как ожидает frontend
    res.status(200).json({ email: user.email });

  } catch (error) {
    console.error('[Login] Ошибка:', error.message);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});


app.listen(port, () => {
  console.log(`
  =======================================================
  Backend-сервер запущен на http://localhost:${port}
  Подключен к базе данных "${pool.options.database}".
  Ожидание запросов...
  =======================================================
  `);
});