/**
Sub pattern for TAGS:

    CC Coord Conjuncn           and,but,or
    CD Cardinal number          one,two
    DT Determiner               the,some
    EX Existential there        there
    FW Foreign Word             mon dieu
    IN Preposition              of,in,by
    JJ Adjective                big
    JJR Adj., comparative       bigger
    JJS Adj., superlative       biggest
    LS List item marker         1,One
    MD Modal                    can,should
    NN Noun, sing. or mass      dog
    NNP Proper noun, sing.      Edinburgh
    NNPS Proper noun, plural    Smiths
    NNS Noun, plural            dogs
    POS Possessive ending       Õs
    PDT Predeterminer           all, both
    PP$ Possessive pronoun      my,oneÕs
    PRP Personal pronoun         I,you,she
    RB Adverb                   quickly
    RBR Adverb, comparative     faster
    RBS Adverb, superlative     fastest
    RP Particle                 up,off
    SYM Symbol                  +,%,&
    TO ÒtoÓ                     to
    UH Interjection             oh, oops
    URL url                     http://www.google.com/
    VB verb, base form          eat
    VBD verb, past tense        ate
    VBG verb, gerund            eating
    VBN verb, past part         eaten
    VBP Verb, present           eat
    VBZ Verb, present           eats
    WDT Wh-determiner           which,that
    WP Wh pronoun               who,what
    WP$ Possessive-Wh           whose
    WRB Wh-adverb               how,where
    , Comma                     ,
    . Sent-final punct          . ! ?
    : Mid-sent punct.           : ; Ñ
    $ Dollar sign               $
    # Pound sign                #
    " quote                     "
    ( Left paren                (
    ) Right paren               )
 */
module.exports = {
	'CC': /[0-9]+CC/,
	'CD': /[0-9]+CD/,
	'DT': /[0-9]+DT/,
	'EX': /[0-9]+EX/,
	'FW': /[0-9]+FW/,
	'IN': /[0-9]+IN/,
	'JJ': /[0-9]+(JJ)($|[0-9]){1}/,
	'JJR': /[0-9]+JJR/,
	'JJS': /[0-9]+JJS/,
	'LS': /[0-9]+LS/,
	'MD': /[0-9]+MD/,
	'NN': /[0-9]+(NN)($|[0-9]){1}/,
	'NNP': /[0-9]+(NNP)($|[0-9]){1}/,
	'NNPS': /[0-9]+NNPS/,
	'NNS': /[0-9]+NNS/,
	'POS': /[0-9]+POS/,
	'PDT': /[0-9]+PDT/,
	'PP$': /[0-9]+PP\$/,
	'PRP': /[0-9]+PRP/,
	'RB': /[0-9]+(RB)($|[0-9]){1}/,
	'RBR': /[0-9]+RBR/,
	'RBS': /[0-9]+RBS/,
	'RP': /[0-9]+RP/,
	'SYM': /[0-9]+SYM/,
	'TO': /[0-9]+TO/,
	'UH': /[0-9]+UH/,
	'URL': /[0-9]+URL/,
	'VB': /[0-9]+(VB)($|[0-9]){1}/,
	'VBD': /[0-9]+VBD/,
	'VBG': /[0-9]+VBG/,
	'VBN': /[0-9]+VBN/,
	'VBP': /[0-9]+VBP/,
	'VBZ': /[0-9]+VBZ/,
	'WDT': /[0-9]+WDT/,
	'WP': /[0-9]+(WP)($|[0-9]){1}/,
	'WP$': /[0-9]+WP\$/,
	'WRB': /[0-9]+WRB/,
	',': /[0-9]+\,/,
	'.': /[0-9]+\./,
	':': /[0-9]+\:/,
	'$': /[0-9]+\$/,
	'#': /[0-9]+\#/,
	'"': /[0-9]+\"/,
	'(': /[0-9]+\(/,
	')': /[0-9]+\)/
};