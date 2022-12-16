const mongoose = require("mongoose");
const nodeCronScheduler = require("./helpers/nodeCronHelper");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // autoIndex: true,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASS,
  dbName: process.env.MONGODB_DBNAME
}, (err) => {
  if (!err) {
    return console.log("DB Connected");
  }

})

nodeCronScheduler();

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
}
