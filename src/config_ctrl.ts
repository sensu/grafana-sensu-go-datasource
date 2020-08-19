import InstanceSettings from './model/InstanceSettings';

/**
 * Controller responsible for the configuration ui.
 */
export class SensuConfigCtrl {
  static templateUrl = 'partials/config.html';

  // the current datasource settings
  current: InstanceSettings;

  /** @ngInject **/
  constructor($scope) {
    const that = this;
    $scope.$watch(() => that.current.url, (value) => that.current.jsonData.currentUrl = value);
    $scope.$watch(() => that.current.basicAuth, (value) => {
      if (value) {
        that.current.jsonData.useApiKey = false;
      }
    });
  }

  /**
   * When the "Use API Key" option is toggled.
   */
  onUseApiKeyToggle = () => {
    const current = this.current;
    if (current.jsonData.useApiKey) {
      current.basicAuth = false;
      this.resetApiKey();
    }
  }

  /**
   * Resets the currely set API key.
   */
  resetApiKey = () => {
    this.current.secureJsonFields.apiKey = false;
    this.current.secureJsonData = this.current.secureJsonData || {};
    this.current.secureJsonData.apiKey = '';
  }
}