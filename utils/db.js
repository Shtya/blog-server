const mongoose = require("mongoose")

const connectiondb = () => {
mongoose.connect(process.env.DB , )
  .then(res => console.log(`connect in ${res.connection.host}`)).catch(err => console.log(err))
}
mongoose.set('strictQuery', true);
module.exports = connectiondb