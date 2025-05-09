// app.js
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function isValidDate(dateStr) {
  const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return false;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
}

function processInput(input) {
  const tokens = input.trim().split(/\s+/);
  if (tokens.length !== 6) {
    throw new Error(`IllegalArgumentException: Ожидалось 6 параметров, получено ${tokens.length}.`);
  }

  let birthDate = null;
  let phoneNumber = null;
  let gender = null;
  const names = [];

  tokens.forEach((token) => {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(token)) {
      if (birthDate !== null) {
        throw new Error('Найдено более одного значения даты рождения.');
      }
      if (!isValidDate(token)) {
        throw new Error(`Неверный формат или несуществующая дата: ${token}`);
      }
      birthDate = token;
    } else if (/^\d+$/.test(token)) {
      if (phoneNumber !== null) {
        throw new Error('Найдено более одного значения номера телефона.');
      }
      phoneNumber = Number(token);
      if (isNaN(phoneNumber)) {
        throw new Error(`Неверный формат номера телефона: ${token}`);
      }
    } else if (token.length === 1 && (token.toLowerCase() === 'f' || token.toLowerCase() === 'm')) {
      if (gender !== null) {
        throw new Error('Найдено более одного значения пола.');
      }
      gender = token.toLowerCase();
    } else {
      names.push(token);
    }
  });

  if (names.length !== 3) {
    throw new Error(`Неверное количество данных для Ф.И.О. Ожидалось 3 значения, получено ${names.length}.`);
  }

  const surname = names[0];
  const firstName = names[1];
  const patronymic = names[2];

  if (!birthDate || phoneNumber === null || !gender) {
    throw new Error('Не все обязательные параметры введены или они имеют неверный формат.');
  }

  const record = `${surname} ${firstName} ${patronymic} ${birthDate} ${phoneNumber} ${gender}\n`;
  const fileName = `${surname}.txt`;

  try {
    fs.appendFileSync(fileName, record);
    console.log(`Данные успешно записаны в файл: ${fileName}`);
  } catch (err) {
    console.error('Ошибка при работе с файлом:');
    console.error(err.stack);
  }
}

rl.question(
  'Введите данные через пробел (Фамилия Имя Отчество дата_рождения номер_телефона пол):\n',
  (input) => {
    try {
      processInput(input);
    } catch (error) {
      console.error('Ошибка:', error.message);
    } finally {
      rl.close();
    }
  }
);
