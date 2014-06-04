(function() {

  angular.module('trending', []);


  angular.module('trending').controller('MainController', ['$scope', '$location', '$http',
    function($scope, $location, $http) {

      // load all current trends
      loadTrends();

      $scope.submit = function() {
        $http.post('/trending/v1/trend', $scope.Trend)
          .success(function() {
            loadTrends();
          });
      };

      // handle voting
      $scope.vote = function(trend, amt) {
        console.log(trend, amt);

        var dir = 'up',
          num = amt;
        if (amt < 0) {
          dir = 'down';
          num = -(amt);
        }

        $http({
          method: 'PATCH',
          url: '/trending/v1/trend/' + trend._id + '?' + dir + '=' + num
        })
          .success(function() {
            loadTrends(); // BEER: should really just inline replace numbers...
          });
      };


      function loadTrends() {
        $http.get('/trending/v1/trend')
          .success(function(result) {
            console.log(result);

            // pre-process the trends
            $scope.Trends = _.map(result, function(trend) {
              trend.totalUp = _.reduce(trend.trend, function(memo, date) {
                return date.up + memo
              }, 0);
              trend.totalDown = _.reduce(trend.trend, function(memo, date) {
                return date.down + memo
              }, 0);
              return trend;
            });
          });
      }

    }
  ]);


}());