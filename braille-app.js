/**
 * Created by strawberry on 12/28/2014.
 */
angular.module("brailleapp", [])
    .controller("AppMainController", function ($scope) {
        // This is where program logic would go.

        // The AngularJS stuff that's in the HTML file can access data on the $scope variable.
        //
        // But JavaScript is really really annoying and it's best to not put changing stuff right on $scope
        // because you get into cases where the screen is changing something on $scope but gets its own
        // private copy of $scope, and then then controller's $scope doesn't get updated. Then you pound your
        // head on the keyboard for a while screaming.
        //
        // However, if you manipulate stuff in an object on $scope, then you don't get that problem.
        // Maybe I misunderstand details, but I got bitten before and it took days for me to figure out
        // the problem.
        //
        // I just know you're fine if I put my information on $scope.data an don't put other variables on $scope.
        // You can add functions to $scope and call them from the HTML without problems.
        //
        // Inheritance in JavaScript is a godawful mess. Don't do it.

        $scope.data = {
            title: "Type Something", // Anything put on $scope can be seen by the HTML file.
            // is really brain dead. I'm setting the dots with the value in source="123456" where each character can
            // be B (black), W (white), R (red) or G (green).
            text: "",
            dots: []
        };

        $scope.clear = function () {
            $scope.data.text = "";
            $scope.data.dots = [];
        };

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

            $scope.data.dots.push(dots);
        }

        function makeCapital (letter) {
            // If it's a capital letter then add the capital letter sign.
            // The rules on http://braillebug.afb.org/braille_deciphering.asp
            // say to do differently if the word is all capital letters
            // but I'm being a lazy ass and not doing that.
            if ("A"  <= letter && letter <= "Z") {
                addBlackDots("000001");
            }
        }

        function textToBraille() {
            $scope.data.dots = [];
            var text = $scope.data.text;
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

        $scope.$watch('data.text', function () {
            textToBraille();
        });


        return this;
    })
    .directive("brailleTrainer", function () {
        return {
            controller: function ($scope, $log) {
                // $log.debug("Entering <braille-trainer> controller. :) ");
                // $log.debug("data is ", $scope.data);
                $scope.decode = function (index) {
                    if ($scope.data.length <= index) {
                        return null;
                    }
                    var value = $scope.data[index];
                    var decoder = {
                        // Make these match the CSS that controls the table cells.
                        "W": "bwhite",
                        "R": "bred",
                        "G": "bgreen",
                        "B": "bblack"
                    };
                    return decoder[value];
                };
                //$log.debug("decode is ", $scope.decode);
                //$log.debug("decode{0} is ", $scope.decode(0));
                //$log.debug("decode{1} is ", $scope.decode(1));
                //$log.debug("decode{2} is ", $scope.decode(2));
                //$log.debug("decode{3} is ", $scope.decode(3));
                //$log.debug("decode{4} is ", $scope.decode(4));
                //$log.debug("decode{5} is ", $scope.decode(5));
            },
            require: "source",
            restrict: "E", // Let braille-trainer be an HTML entity only, not an attribute or anything else.

            // Map HTML attributes to JavaScript.
            scope: {
                data: "=source" // <braille-trainer source="strawberry" ... will make $scope.data be "strawberry"
            },
            // Web browser work around here. We can't do like normal and put this in its own HTML file.
            // So we have to put it as text.
            //
            // If we could use a small server like NodeJS then we could have it in its own file.
            template: "" +
            "<table class='btable' width=64 ><col width=32><col width=32>" +
            "<tr class='btr'>" +
            "<td class='btd' ng-class='decode(0)'>&#x25cf;</td>" +
            "<td class='btd' ng-class='decode(1)'>&#x25cf;</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='btd' ng-class='decode(2)'>&#x25cf;</td>" +
            "<td class='btd' ng-class='decode(3)'>&#x25cf;</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='btd' ng-class='decode(4)'>&#x25cf;</td>" +
            "<td class='btd' ng-class='decode(5)'>&#x25cf;</td>" +
            "</tr>" +
            "</table>" +
            ""
        };
    })
;
