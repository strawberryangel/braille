/**
 * Created by strawberry on 1/2/2015.
 */
angular.module("brailleapp")
    // Factory returns what your function returns.
    // Service returns an instance of the class/function you return, i.e. new <returned function>().
    // But both are singletons. Service doesn't return a new instance each time.
    // If you want to provide a class that can be instantiated over and over then use a factory to
    // returns a function. (JavaScript classes suck.)
    .factory('TextToBraille', function() {
        return function() {
            // I don't understand why this is done but sometimes things don't work if you don't.
            var self = this;

            self.text = "";
            self.dots = [];

            // Private data
            var convert = {
                A: '100000',
                B: '110000',
                C: '100100',
                D: '100110',
                E: '100010',
                F: '110100',
                G: '110110',
                H: '110010',
                I: '010100',
                J: '010110',
                "!": "011010",
                "'": "001000",
                "-": "001001",
                ".": "010011",
                ",": "010000",
                "?": "011001",
                " ": "000000"
            };

            // Private method
            function addBlackDots(binary) {
                // So it looks like I didn't do the display right.
                // http://braillebug.afb.org/braille_deciphering.asp
                // That page says that they're numbered going down column-wise rather than row-wise.
                // So here we convert from binary to the way that the directive wants it.
                var dots = "";
                dots += binary[0] === "1" ? "B" : "W";
                dots += binary[3] === "1" ? "B" : "W";
                dots += binary[1] === "1" ? "B" : "W";
                dots += binary[4] === "1" ? "B" : "W";
                dots += binary[2] === "1" ? "B" : "W";
                dots += binary[5] === "1" ? "B" : "W";

                self.dots.push(dots);
            }

            // Private method
            function makeCapital (letter) {
                // If it's a capital letter then add the capital letter sign.
                // The rules on http://braillebug.afb.org/braille_deciphering.asp
                // say to do differently if the word is all capital letters
                // but I'm being a lazy ass and not doing that.
                if ("A"  <= letter && letter <= "Z") {
                    addBlackDots("000001");
                }
            }

            // Public method
            self.textToBraille = function(text) {
                self.dots = [];
                if (!text) {
                    return;
                }

                var numberMode = false;
                var code;
                for (var i = 0; i < text.length; i++) {
                    var result = "";
                    var letter = text[i];
                    var capital = letter.toUpperCase();

                    if (capital === "W") {
                        // W is special since it's not really used in French.
                        numberMode = false;
                        makeCapital(letter);
                        addBlackDots("010111");
                    } else if ("A" <= capital && capital <= "J") {
                        // So the core set of letters is A to J.
                        numberMode = false;
                        makeCapital(letter);
                        addBlackDots(convert[capital]);
                    } else if ("K" <= capital && capital <= "T") {
                        // K through T is like A to J but with dot 2 set also.
                        numberMode = false;
                        makeCapital(letter);
                        code = String.fromCharCode(capital.charCodeAt(0) - 10);
                        result = convert[code].split("");
                        result[2] = "1";
                        addBlackDots(result.join(""));
                    } else if (capital === "U" || capital === "V") {
                        // U and V are like A and B but with bottom dots.
                        // (If you leave W out then U to Z work like K to T, but there's the W thing.)
                        numberMode = false;
                        makeCapital(letter);
                        code = String.fromCharCode(capital.charCodeAt(0) - 20);
                        result = convert[code].split("");
                        result[2] = "1";
                        result[5] = "1";
                        addBlackDots(result.join(""));
                    } else if ("X" <= capital && capital <= "Z") {
                        // X, Y and Z are kind of a mess because of W.
                        // (If you leave W out then U to Z work like K to T, but there's the W thing.)
                        numberMode = false;
                        makeCapital(letter);
                        code = String.fromCharCode(capital.charCodeAt(0) - 21);
                        result = convert[code].split("");
                        result[2] = "1";
                        result[5] = "1";
                        addBlackDots(result.join(""));
                    } else if ("0" <= capital && capital <= "9") {
                        // So like 0 through 9 are A-J but with a number sign at the beginning.
                        // So turn on "number mode" if it's not set and start doing the numbers.
                        // Other stuff turns number mode off ~ wait.
                        // Except , is also valid with numbers. Oh hell. You know what?
                        // I bet this is because of French numbers and that's the decimal point.
                        // English 123,456.789 is French 123 456,789.
                        // -_- shit the directions on the web site don't say how to handle this in English.
                        // Looking at the web site my guess is that , and . are used in English braille like in English.
                        if (!numberMode) {
                            addBlackDots("001111");
                            numberMode = true;
                        }
                        code = String.fromCharCode(capital.charCodeAt(0) + 17);
                        addBlackDots(convert[code]);
                    } else if (letter === "." || letter === ",") {
                        // Look at the number comments why this is special.
                        // I'm not turning off number mode guessing that , and . work the same as in English numbers.
                        addBlackDots(convert[letter]);
                    } else if (convert[letter]) {
                        // Everything else turn off the number mode.
                        numberMode = false;
                        addBlackDots(convert[letter]);
                    }
                }
            }
        };
    })
;
