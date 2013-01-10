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
        'and when do call private method _devideGrammarLevel & _preprocessGrammarSubPatterns': function (err, chunking) {
            //_preprocessGrammarSubPatterns
            var preprocessGrammarSubPatterns = chunking._preprocessGrammarSubPatterns(chunking.grammar); 
            assert.isNotNull(preprocessGrammarSubPatterns);
            assert.equal(preprocessGrammarSubPatterns.processedGrammar['NP'], '({{DT}}|{{JJ}}|{{NN}}.*)+');
            assert.equal(preprocessGrammarSubPatterns.processedGrammar['PP'], '({{IN}})({{NP}})');
            assert.equal(preprocessGrammarSubPatterns.processedGrammar['VP'], '({{VB}}.*)({{NP}}|{{PP}})+$');
            assert.equal(preprocessGrammarSubPatterns.grammarKeys, '{{NP}}|{{PP}}|{{VP}}');

            //_devideGrammarLevel
            var grammarKeyLevels = chunking._devideGrammarLevel(preprocessGrammarSubPatterns);
            assert.isNotNull(grammarKeyLevels);
            assert.deepEqual(grammarKeyLevels.level1, ['NP']);
            assert.deepEqual(grammarKeyLevels.level2, ['PP']);
            assert.deepEqual(grammarKeyLevels.level3, ['VP']);
        },
        'and when do call private method _preprocessGrammar': function (err, chunking) {
            var processedGrammar = chunking._preprocessGrammar(chunking.grammar);

        	assert.isNotNull(processedGrammar);
            assert.equal('({{DT}}|{{JJ}}|{{NN}}.*)+', processedGrammar['NP']);
            assert.equal('({{IN}})(({{DT}}|{{JJ}}|{{NN}}.*)+)', processedGrammar['PP']);
            assert.equal('({{VB}}.*)(({{DT}}|{{JJ}}|{{NN}}.*)+|({{IN}})(({{DT}}|{{JJ}}|{{NN}}.*)+))+$', processedGrammar['VP']);
        },
        'and when do call init': function (err, chunking) {
            chunking.init();
            var processedGrammar = chunking.processedGrammar;

            assert.isNotNull(processedGrammar);
        },
    }
}).export(module);