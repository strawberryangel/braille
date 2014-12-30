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
            title: "Hello Mr. Racette", // Anything put on $scope can be seen by the HTML file.
            // is really brain dead. I'm setting the dots with the value in source="123456" where each character can
            // be B (black), W (white), R (red) or G (green).
            dots: [
            'BWBBWW',  // H
            'BWWBWW',  // E
            'BWBWBW',  // L
            'BWBWBW',  // L
            'BWWBBW',  // O
            'WWWWWW',  //
            'GGWWGW',  // M
            'GWGGGW',  // R
            'WWGGWG',  // .
            'WWWWWW',  //
            'RWRRRW',  // R
            'RWWWWW',  // A
            'RRWWWW',  // C
            'RWWRWW',  // E
            'WRRRRW',  // T
            'WRRRRW',  // T
            'RWWRWW'   // E
        ]
        };


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
