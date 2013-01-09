/**
 * A simple Chunking tool (NLP) for node.js based on idea of nltk.
 */

/**
 * Dependencies
 */
var subpatterns = require('./subpatterns'),
	XRegExp = require('xregexp').XRegExp,
	_ = require('underscore');

var exports = module.exports;

/**
 * Default grammar
 */
exports.DefaultGrammar = {
	'NP': '(DT|JJ|NN.*)+',
	'PP': '(IN)(NP)',
	'VP': '(VB.*)(NP|PP)+$'

	// TODO: right now, module cannot solve cyclic problem
	// so please avoid pattern like that
	/*'VP': ['<VB.*><NP|PP|CLAUSE>+$'],
	'CLAUSE': ['<NP><VP>']*/
};

/**
 * @class Chunking
 * 
 * @param opt The options for Chunking task
 */
var Chunking = function (opt) {
	opt = opt || {};

	this.grammar = opt.grammar || exports.DefaultGrammar;
	this.processedGrammar = null; 
};

// Method definition
Chunking.prototype = {

	/**
	 * Parse sentence with POS format, ex: [ ['Rapunzel', 'NN'], ['her', 'PRP$'] ['long', 'JJ'] ['golden', 'JJ'], ['hair', 'NN'] ]
	 *
	 * @param sentencePos The sentence with POS format
	 * @return 
	 */
	parse: function (sentencePos, loop) {
		loop = loop || 0;

		if (!this.processedGrammar)
			throw "Please call init method first!";


	},

	/**
	 * Use builder pattern to preprocess some task, ex: grammar..
	 * This method must be call first before use any other public methods
	 */
	init: function () {
		if (this.processedGrammar)
			return this;

		// pre-processing grammar
		this._preprocessGrammar();

		return this;
	},

	/**
	 * Build based on subpatterns & raw grammar
	 */
	_preprocessGrammar: function () {
		// convert each grammar to XRegExp subpatterns type, ex: NN --> {{NN}}
		var processedGrammar = this.processedGrammar = {};
		var patternRegx = XRegExp('(?<pattern>\\w+)');
		var grammarKeys = [];
		
		_.each(this.grammar, function (value, key) {
			processedGrammar[key] = XRegExp.replace(value, patternRegx, '{{${pattern}}}', 'all');
			grammarKeys.push('{{' + key + '}}');
		});

		// each grammar can depend on other grammar, ex: 'PP': '(IN)(NP)'
		// PP depend on NP
		// so we must convert sub grammar in each complex grammar to origin
		// ex: PP should be '(IN)((DT|JJ|NN.*)+)'

		// we divide grammars to three levels
		// level 1: doesn't contain another grammar
		// level 2: contain level 1 grammar
		// level 3: contain level 2 & level 1 grammar
		// note: we only need to process level 2 & 3
		var grammarLevel = {},
			grammarKeys = grammarKeys.join('|'),
			grammarKeysReg = new RegExp(grammarKeys, 'g');
			grammarKeyLevel1 = [],
			grammarKeyLevel2 = [],
			grammarKeyLevel3 = [],
			grammarKeyLevel2Reg;

		// level 2
		_.each(processedGrammar, function (value, key) {
			if (grammarKeysReg.test(value)) {
				grammarKeyLevel2.push('{{' + key + '}}');
				grammarLevel[key] === 2;
			} else {
				grammarLevel[key] === 1;
				grammarKeyLevel1.push(key);
			}
		});

		// level 3
		grammarKeyLevel2Reg = new RegExp(grammarKeyLevel2.join('|'), 'g');
		grammarKeyLevel2 = [];
		_.each(processedGrammar, function (value, key) {
			if (grammarLevel[key] === 2 && grammarKeyLevel2Reg.test(value)) {
				grammarLevel[key] === 3;
				grammarKeyLevel3.push(key);
			} else {
				grammarKeyLevel2.push(key);
			}
		});


		// process level 2 & 3
		var keyReplaceRegx = null;
		_.each(grammarKeyLevel2.concat(grammarKeyLevel3), function (key) {
			_.each(grammarKeyLevel1, function (keyLevel1) {
				keyReplaceRegx = new RegExp('(?<pattern>{{' + keyLevel1 + '}})', 'g');
				processedGrammar[key] = XRegExp.replace(processedGrammar[key], keyReplaceRegx, '${pattern}', 'all');
			});
		})

	}

};

/**
 * Expose Chunking
 */
exports.Chunking = Chunking;