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
		this._preprocessGrammarXregExp();

		return this;
	},

	/**
	 * Build grammar levels
	 * level 1: doesn't contain another grammar
	 * level 2: contain level 1 grammar
	 * level 3: contain level 2 & level 1 grammar
	 *
	 * @param opt The option object, {processedGrammar: <Object>, grammarKeys: <String>}
	 * @return {level1: [], level2: [], level3[]}
	 */
	_devideGrammarLevel: function (opt) {

		// we devide grammars to three levels
		// level 1: doesn't contain another grammar
		// level 2: contain level 1 grammar
		// level 3: contain level 2 & level 1 grammar
		// note: we only need to process level 2 & 3
		var processedGrammar = opt.processedGrammar,
			grammarLevels = {},
			grammarKeys = opt.grammarKeys,
			grammarKeysReg = new RegExp(grammarKeys, 'g'),
			grammarKeyLevel1 = [],
			grammarKeyLevel2 = [],
			grammarKeyLevel3 = [],
			grammarKeyLevel2Reg;

		// level 2

		_.each(processedGrammar, function (value, key) {
			if (grammarKeysReg.test(value)) {
				grammarKeyLevel2.push('{{' + key + '}}');
				grammarLevels[key] = 2;
			} else {
				grammarLevels[key] = 1;
				grammarKeyLevel1.push(key);
			}
		});

		// level 3
		grammarKeyLevel2Reg = new RegExp(grammarKeyLevel2.join('|'), 'g');
		grammarKeyLevel2.length = 0;
		_.each(processedGrammar, function (value, key) {
			if (grammarLevels[key] === 2) {
				if (grammarKeyLevel2Reg.test(value)) {
					grammarLevels[key] = 3;
					grammarKeyLevel3.push(key);
				} else {
					grammarKeyLevel2.push(key);
				}
			}
		});

		return {
			level1: grammarKeyLevel1,
			level2: grammarKeyLevel2,
			level3: grammarKeyLevel3,
			grammarLevels: grammarLevels
		};
	},

	/**
	 * With each POS convert to {{<POS>}} format to adapt XRegExp style
	 *
	 * @param grammars The grammars, ex: { 'NP': '(DT|JJ|NN.*)+', 'PP': '(IN)(NP)'}
	 * @return {processedGrammar: { 'NP': '({{DT}}|{{JJ}}|{{NN}}.*)+', 'PP': '({{IN}})({{NP}})'}, grammarKeys: '{{NP}}|{{PP}}''}
	 */
	_preprocessGrammarSubPatterns: function (grammars) {
		var processedGrammar = {};
		var patternRegx = XRegExp('(?<pattern>\\w+)');
		var grammarKeys = [];
		
		_.each(grammars, function (value, key) {
			processedGrammar[key] = XRegExp.replace(value, patternRegx, '{{${pattern}}}', 'all');
			grammarKeys.push('{{' + key + '}}');
		});

		return {
			processedGrammar: processedGrammar,
			grammarKeys: grammarKeys.join('|')
		};
	},

	/**
	 * Build based on subpatterns & raw grammar, string format
	 */
	_preprocessGrammar: function (grammar) {
		// convert each grammar to XRegExp subpatterns type, ex: NN --> {{NN}}
		var preprocessGrammarSubPatterns = this._preprocessGrammarSubPatterns(grammar);
		
		// each grammar can depend on other grammar, ex: 'PP': '(IN)(NP)'
		// PP depend on NP
		// so we must convert sub grammar in each complex grammar to origin
		// ex: PP should be '(IN)((DT|JJ|NN.*)+)'
		var grammarKeyLevels = this._devideGrammarLevel(preprocessGrammarSubPatterns);

		// process level 2 & 3
		var processedGrammar = preprocessGrammarSubPatterns.processedGrammar;
		var keyReplaceRegx = null;

		// first, sub pattern keys should be keyLevel1
		// after processed, each key level 2 will be added
		var subPatternKeys = grammarKeyLevels.level1;
		_.each(grammarKeyLevels.level2.concat(grammarKeyLevels.level3), function (key) {
			_.each(subPatternKeys, function (keyLevel1) {
				keyReplaceRegx = new RegExp('({{' + keyLevel1 + '}})', 'g');
				processedGrammar[key] = XRegExp.replace(processedGrammar[key], keyReplaceRegx, processedGrammar[keyLevel1], 'all');
			});

			// if this is level2 key, add to subPatternKeys after processing
			if (grammarKeyLevels.grammarLevels[key] === 2) {
				subPatternKeys.push(key);
			}	
		});

		return processedGrammar;
	},

	/**
	 * Build based on subpatterns & raw grammar, XRegExp format
	 */
	_preprocessGrammarXregExp: function () {
		var processedGrammarStr = this._preprocessGrammar(this.grammar);
		var processedGrammar = this.processedGrammar = {};

		_.each(processedGrammarStr, function (value, key) {
			processedGrammar[key] = XRegExp.build(value, subpatterns);
		});
	}

};

/**
 * Expose Chunking
 */
exports.Chunking = Chunking;