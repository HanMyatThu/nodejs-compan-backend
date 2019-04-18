const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    remind_me_at: {
        type: Date,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: false
    },
    day_repeat: {
        type: Number,
        default: 0
    },
    repeat_frequency: {
        type: Number,
        default: 0
    },
    time_repeat: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Schedules = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedules;
