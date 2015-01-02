/**
 * Created by strawberry on 12/28/2014.
 */
angular.module("brailleapp", [])
    .controller("AppMainController", function ($scope, TextToBraille) {
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

        $scope.$watch('data.text', function () {
            var convert = new TextToBraille();
            convert.textToBraille($scope.data.text);
            $scope.data.dots = convert.dots;
        });
    })
;
