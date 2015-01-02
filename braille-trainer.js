/**
 * Created by strawberry on 1/2/2015.
 */
angular.module("brailleapp")
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
