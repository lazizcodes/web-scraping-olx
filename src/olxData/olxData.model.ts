import * as mongoose from 'mongoose';

export const OlxData = new mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  imgUrl: {
    type: String,
  },
  location: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});
