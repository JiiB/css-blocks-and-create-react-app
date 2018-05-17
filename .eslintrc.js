module.exports = {
	"extends": "airbnb",
	"env": {
		"browser": true,
		"node": true,                                                                  
	},
    "rules": {
		"indent": ["error", "tab"],
		"prefer-const": 0,
		"import/extensions": 0,
		"linebreak-style": 0,
		"no-use-before-define": 0,
		"import/no-dynamic-require": 0,
        "react/jsx-indent": [1, "tab"],
        "no-tabs": 0,
        "semi": 0,
        "max-len": [1, 120, 2, { ignoreComments: true }],
        "quote-props": [1, "consistent-as-needed"],
        "no-cond-assign": [2, "except-parens"],
        "radix": 0,
        "space-infix-ops": 0,
        "no-unused-vars": [1, {"vars": "local", "args": "none"}],
      }
};