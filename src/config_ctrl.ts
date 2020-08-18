/**
 * Controller responsible for the configuration ui.
 */
export class SensuConfigCtrl {
  static templateUrl = 'partials/config.html';

  /** @ngInject **/
  constructor($scope,) {
    const that = (<any>this);
    $scope.$watch(() => that.current.url, () => that.current.jsonData.currentUrl = that.current.url);
    $scope.$watch(() => that.current.basicAuth, () => {
      if (that.current.basicAuth) {
        that.current.jsonData.useApiKey = false;
      }
    });
  }

  onUseApiKeyToggle = () => {
    const current = (<any>this).current;
    if (current.jsonData.useApiKey) {
      current.basicAuth = false;
      current.secureJsonFields.appInsightsApiKey = false;
    }
  }
}
