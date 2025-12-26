// 核心：用 import 引入 AngularJS（Webpack 4 经 exports-loader 转换后支持）
import angular from 'angular';

// 定义 AngularJS 模块和控制器（和原生用法一致）
const app = angular.module('myApp', []);

app.controller('HelloController', ['$scope', function($scope) {
  // 初始化数据
  $scope.message = 'Hello World (Webpack 4 + AngularJS)';

  // 点击事件
  $scope.handleClick = function() {
    $scope.message = '点击成功！Webpack 4 适配完成';
    alert('AngularJS 点击事件触发');
  };
}]);

// 若需引入 Bootstrap（可选）
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';