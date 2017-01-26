(function(){
    var string_formatparser = function(str) {
        var IMPLICIT = 0;
        var EXPLICIT = 1;

        var stringlength = str.length;
        var tokens = [];

        var depth = 0;
        var curtoken = "";
        var starttoken = 0;

        var positional_found = undefined;
        var positional_counter = 0;

        // tokenize
        // Works: find a {, store start position and depth,
        // when depth depleted, stick in a token and start a new one
        for (var i = 0; i < stringlength; i++) {
            if (str[i] == "{") {
                // Token start
                if (depth === 0) {
                    if (curtoken.length > 0) {
                        tokens.push(curtoken);
                        curtoken = "";
                    }
                    starttoken = i;
                }
                depth += 1;
            }
            else if (str[i] == "}") {
                // Token end
                depth = Math.max(depth - 1, 0);
                if (depth === 0) {
                    var tok = str.substring(starttoken, i + 1);
                    // sanity checks
                    if (tok.length === 2) {
                        if (positional_found === EXPLICIT) {
                            // Raise error
                            throw new Error("cannot switch from manual field specification to automatic field numbering");
                        }
                        positional_found = IMPLICIT;

                        // Rewrite token to explicit for internal use (don't tell the cops)
                        tok = "{" + positional_counter++ + "}";
                    }
                    else if (/\d+/.test(tok)) {
                        if (positional_found === IMPLICIT) {
                            // Raise error
                            throw new Error("cannot switch from automatic field numbering to manual field specification");
                        }
                        positional_found = EXPLICIT;
                    }
                    tokens.push(tok);
                    curtoken = "";
                    continue;
                }
            }

            curtoken += str[i];
        }

        if (curtoken.length > 0) {
            tokens.push(curtoken);
        }

        return tokens;
    };

    var token_type = function(token) {
        if (token[0] !== '{' || token[token.length - 1] !== '}') {
            return {
                type: 'normal',
                value: token
            };
        }

        if (token.length === 2) {
            throw new Error("Invalid token found during token typing.");
        }

        var tokenbody = token.substring(1, token.length - 1);

        if (/\d+/.test(tokenbody)) {
            return {
                type: 'token-positional',
                value: tokenbody
            }
        }
        else {
            return {
                type: 'token-named',
                value: tokenbody
            }
        }
    }

    if (!String.prototype.dsf) {
        String.prototype.dsf = function() {
            var str = this.toString();
            if (!arguments.length)
                return str;

            var tokens = string_formatparser(str);
            var positional_arguments = [];
            var keyword_arguments = {};
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === "object") {
                    keyword_arguments = arguments[i];
                    break;
                }
                else {
                    positional_arguments.push(arguments[i]);
                }
            }

            var rebuild_string = [];
            var token_counter = 0;
            for (var i = 0; i < tokens.length; i++) {
                var cur_token = token_type(tokens[i]);
                if (cur_token.type === 'token-positional') {
                    var rpl_value = positional_arguments[cur_token.value];
                }
                else if (cur_token.type === 'token-named') {
                    var rpl_value = keyword_arguments[cur_token.value];
                }
                else {
                    var rpl_value = cur_token.value;
                }
                if (rpl_value === undefined) {
                    throw new Error("Unmatched argument " + tokens[i]);
                }
                rebuild_string.push(rpl_value);
            }
            return rebuild_string.join('');
        }
    }
})();
