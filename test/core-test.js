var assert = require('assert'),
    vows = require('vows'),
    Chunking = require('../lib/chunking').Chunking;

vows.describe('node-chunking/core').addBatch({
    'When call init method': {
        topic: function (reader, _, options) {
        	// chunking with default grammar
            var chunking = new Chunking();

            this.callback(null, chunking);
        },
        'and when do call parse before call init': function (err, chunking) {
        	try {
        		chunking.parse([]);
        	} catch (e) {
        		assert.equal(e, 'Please call init method first!');
        		return;
        	};
        	// should not come to this line
        	assert.isFalse(true);
        },
        'and when do call init with default grammar': function (err, chunking) {
        	chunking.init();

            var processedGrammar = chunking.processedGrammar;

        	assert.isNotNull(processedGrammar);
            assert.equal(processedGrammar['NP'], '({{DT}}|{{JJ}}|{{NN}}.*)+');
            assert.equal(processedGrammar['PP'], '({{IN}})({{NP}})');
            assert.equal(processedGrammar['VP'], '({{VB}}.*)({{NP}}|{{PP}})+$');
        },
    }
}).export(module);