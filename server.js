const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const moment = require("moment-timezone");
require("dotenv").config();

// Load environment variables (ensure these are set in your .env file)
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7834509942:AAH-vkrOCANCKxO1gRevo3fbJwWW9o3VD7E'; // Replace with your actual token
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-4791497238'; // Replace with your actual chat ID

// Initialize Telegram bot
const bot = new TelegramBot(TOKEN, { polling: true });

// Messages with their respective times
const scheduleData = [
  { time: "12:15", message: "Reply rocket greetings on time. Update daily report on time. Otherwise, you will get fine." },
  { time: "14:15", message: "Reply rocket greetings on time. Update daily report on time. Otherwise, you will get fine." },
  { time: "16:15", message: "Reply rocket greetings on time. Update daily report on time. Otherwise, you will get fine." },
  { time: "18:15", message: "Reply rocket greetings on time. Update daily report on time. Otherwise, you will get fine." },
  { time: "20:15", message: "Reply rocket greetings on time. Update daily report on time. Otherwise, you will get fine." },
  { time: "21:55", message: "Who has phone in model room. Please kindly take back your phone. Otherwise you will get fined." },
  { time: "21:30", message: "Update daily and monthly reports faster." }
];

// Function to schedule messages at German time (CET/CEST)
const scheduleMessage = (hour, minute, message) => {
  // Ensure the minute is two digits (e.g., '9' becomes '09')
  const formattedMinute = minute.toString().padStart(2, '0');

  // Debugging: Log the formatted time for scheduling
  console.log(`Scheduling message at Berlin Time: ${hour}:${formattedMinute}`);

  // Convert to UTC format for cron job scheduling (moment handles timezone)
  const utcCronTime = moment.tz(`2025-03-01 ${hour}:${formattedMinute}:00`, "Europe/Berlin")
    .utc()
    .format("m H * * *"); // Convert to UTC cron format
  
  // Debugging: Log the cron time in UTC format
  console.log(`Cron Time in UTC: ${utcCronTime}`);

  // Schedule the message at the specified time
  cron.schedule(utcCronTime, () => {
    bot.sendMessage(CHAT_ID, message)
      .then(() => {
        console.log(`📩 Sent message at Berlin Time: ${hour}:${formattedMinute}`);
      })
      .catch((err) => {
        console.error("❌ Error sending message:", err);
      });
  });

  console.log(`✅ Scheduled message at Berlin Time: ${hour}:${formattedMinute}`);
};

// Loop through schedule data and schedule messages
scheduleData.forEach(({ time, message }) => {
  const [hour, minute] = time.split(":").map(Number);
  scheduleMessage(hour, minute, message);
});

console.log("🚀 Telegram bot scheduler is running...");
