import {InstanceSettings} from './types';

/**
 * Controller responsible for the configuration ui.
 */
export class SensuConfigCtrl {
  static templateUrl = 'partials/config.html';

  // the current datasource settings
  current: InstanceSettings;

  /** @ngInject **/
  constructor($scope) {
    $scope.$watch(
      () => this.current.url,
      value => (this.current.jsonData.currentUrl = value)
    );
    $scope.$watch(
      () => this.current.basicAuth,
      value => {
        if (value) {
          this.current.jsonData.useApiKey = false;
        }
      }
    );
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
  };

  /**
   * Resets the currely set API key.
   */
  resetApiKey = () => {
    this.current.secureJsonFields.apiKey = false;
    this.current.secureJsonData = this.current.secureJsonData || {};
    this.current.secureJsonData.apiKey = '';
  };
}
