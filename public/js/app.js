(function() {

  angular.module('sherpa-dash', ['ngRoute']);

  angular.module('sherpa-dash').run(['$rootScope',
    function($rootScope) {

      $rootScope.empty = function(value) {
        return _.isEmpty(value);
      };

      $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
          if (fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };
    }
  ]);

  angular.module('sherpa-dash').controller('HomeController', ['$scope', '$location', '$http',
    function($scope, $location, $http) {

      $http.get('/sherpadash/usageSummary')
        .success(function(result) {
          console.log(result);

          $scope.Stats = result;
        });

      $http.get('/sherpadash/newUsers')
        .success(function(result) {
          var userData = result, 
            extent = [_.min(_.pluck(userData, 'cnt')), _.max(_.pluck(userData, 'cnt'))];

          var scale = d3.scale.linear()
            .domain(extent)
            .range([200, 600]);

          d3.select('#newUsers')
            .selectAll('div')
            .data(userData)
            .enter()
            .append('div')
            .text(function(d) {
              return 'Year ' + d.year + ', Month ' + d.month + ': ';
            })
            .style('width', '200px')
            .transition()
            .duration(2000)
            .style('width', function(d, i) {
              return scale(d.cnt) + 'px';
            })
            .attr('class', 'bar');
        });

      $http.get('/sherpadash/tickets/month')
        .success(function(result) {
          var data = result, 
            extent = [_.min(_.pluck(data, 'cnt')), _.max(_.pluck(data, 'cnt'))];

          var scale = d3.scale.linear()
            .domain(extent)
            .range([200, 600]);

          d3.select('#ticketsPerMonth')
            .selectAll('div')
            .data(data)
            .enter()
            .append('div')
            .text(function(d) {
              return 'Month ' + d.month;
            })
            .style('width', '200px')
            .transition()
            .duration(2000)
            .style('width', function(d, i) {
              return scale(d.cnt) + 'px';
            })
            .attr('class', 'bar');
        });

    }
  ]);

}());
