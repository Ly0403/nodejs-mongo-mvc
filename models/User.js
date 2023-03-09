const mongoose = require("mongoose");

const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Kullanıcı Adını Boş Bıraktnız"],
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Email Boş Bıraktnız"],
    match: [/\S+@\S+\.\S+/, "Email Geçersiz"],
    index: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: [6, "En az 6 karakter"],
  },
  token: {
    type: String,
    default: ''
  },
  verified: {
    type: Number,
    unique:false,
    default: 0
  },  
  tokenused: {
    type: Number,
    unique:false,
    default: 1
  },    
  photo: {
    type: String,
    unique:false,
    default: "/images/avatar.png"
  },

});

module.exports = mongoose.model("users", User);
