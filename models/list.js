const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todo: {
        type: String,
        required: true
    },
    is_done: {
        type: Boolean,
        default: false
    }
});

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    is_trashed: {
        type: Boolean,
        default: false
    },
    is_pinned: {
        type: Boolean,
        default: false
    },
    is_archived: {
        type: Boolean,
        default: false
    },
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
    todos: [todoSchema],
}, {
    timestamps: true
});

const Lists = mongoose.model('List', listSchema);

module.exports = Lists;
