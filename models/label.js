const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#2196f3'
    }
});

module.exports = mongoose.model('Label', labelSchema);
