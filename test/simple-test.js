var assert = require('assert'),
    vows = require('vows');

vows.describe('node-chunking/simple').addBatch({
    'When using node-chunking': {
        'and when do an simple test': {
            topic: function (reader, _, options) {
                var self = this;

                self.callback(null, 10);
            },
            'it should right number': function (number) {
                assert.equal(number, 10);
            }
        }
    }
}).export(module);