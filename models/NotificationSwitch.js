const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define notification switch schema
const NotificationSwitchSchema = new Schema({
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  userId: {
    type: String,
    rquired: true
  },
  eventType: {
    type: String,
    enum: ['newNFT', 'bidPlaced', 'auctionWon', 'saleMade'],
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  }
});

// Export notification switch model
module.exports = mongoose.model('NotificationSwitch', NotificationSwitchSchema);
