<p>
  <a href="https://www.sensu.io/">
    <img alt="Sensu hearts Grafana"
      src="/images/sensu-heart-grafana.png"
      width="300"
    />
  </a>
</p>

## Sensu Go Data Source for Grafana

[Setup](#setup) | [Using the Sensu Go Data Source](#using-the-sensu-go-data-source) | [Contributing](#contributing) | [Code of conduct](https://sensu.io/conduct)

<p>
  <a href="https://github.com/sensu/grafana-sensu-go-datasource/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/sensu/web.svg?style=flat" />
  </a>
</p>

Sensu Go Data Source is a [Grafana plugin][1] that allows Grafana to connect to the Sensu API.
You can use the Sensu Go Data Source to customize your monitoring dashboards with information about Sensu entities and events.

## Setup

### 1. Identify release

Grab the URL for [the latest release zip file][2].

### 2. Add to Grafana

1. Use [`grafana-cli`][3] to install the plugin by providing the plugin zip URL as the value of the `--pluginUrl` flag:

```
$ sudo grafana-cli --pluginUrl https://github.com/sensu/grafana-sensu-go-datasource/releases/download/1.0.1/sensu-sensugo-datasource-1.0.1.zip plugins install sensu-sensugo-datasource
installing sensu-sensugo-datasource @
from url: https://github.com/sensu/grafana-sensu-go-datasource/releases/download/1.0.1/sensu-sensugo-datasource-1.0.1.zip
into: /var/lib/grafana/plugins

✔ Installed sensu-sensugo-datasource successfully

Restart grafana after installing plugins . <service grafana-server restart>
```

2. Restart `grafana-server` to enable the data source plugin.

### 3. Configure

In Grafana, select Configuration and Data Sources from the side menu.
Select Add data source, and choose Sensu Go.

To configure the Sensu Go Data Source:

1. **Add your Sensu backend API URL** (default: `http://localhost:8080`). When connecting to a Sensu cluster, connect to any single backend in the cluster. For more information about configuring the Sensu API URL, see the [Sensu docs][4].
2. **Configure the authentification mechanism**. Since version 1.1.0 of the data source it is possible to choose between **API key** and **Basic Auth** authentication.

   * **Basic Auth**
     * **Check the option for Basic Auth**.
     * **Add a Sensu username and password** with get and list permissions for entities, events, and namespaces (default admin user: username `admin`, password `P@ssw0rd!`). For more information about creating a Sensu cluster role, see the [Sensu docs][5].
     <img alt="Grafana user interface showing the configuration settings for the Sensu Go Data Source"
  src="/images/configure-data-source.png"
  width="750"
/>
   * **API Key Auth**
     * **Enable the option for the usage of an API key**.
     * **Enter the API key which you want to use**. See the Sensu Go documentation for information on [how to create an API key][api_key_doc].
       ![API key configuration in the Sensu So Data Source](/images/configure-api-key.png)

3. Select Save & Test. You should see a banner confirming that Grafana is connected to Sensu Go.
   <img alt="Confirmation banner with the message: Successfully connected against the Sensu Go API"
  src="/images/configure-success.png"
  width="750"
/>

## Using the Sensu Go Data Source

To build a query, select the Sensu Go data source and the Entity, Events, or Namespaces API.
See the Sensu docs to learn about available attributes for [entities][6], [events][7], and [namespaces][8].
To learn more about building dashboards, see the [Grafana docs][9].

<img alt="Grafana user interface showing the query builder with Sensu Go and the Entity API selected"
  src="/images/build-query.png"
  width="750"
/>

The Sensu Go Data Source supports query strings with the structure:

    QUERY API (entity|events|namespaces) [IN NAMESPACE (namespace)] SELECT (field-key) [WHERE (field-key)(=|!=|=~|!~|<|>)(field-value) [AND (field-key)(=|!=|=~|!~|<|>)(field-value)]] [LIMIT (limit)]

> Note: Query keywords are case sensitive.

You can use `IN NAMESPACE` with the entity and events APIs to restrict queries to a specified namespace. When omitted, `IN NAMESPACE` defaults to the `default` namespace.

For example, the following query returns hostnames containing the string `webserver` within the `default` namespace:

```
QUERY API entity SELECT system.hostname WHERE system.hostname=~/webserver/
```

The following query returns 100 entity hostnames with active, non-OK events within the `ops` namespace:

```
QUERY API events IN NAMESPACE ops SELECT entity.system.hostname WHERE check.status>0 LIMIT 100
```

The following query returns all namespaces with names starting with `x`:

```
QUERY API namespaces SELECT name WHERE name=~/^x/
```

## Contributing

### Local development

This project requires [npm].

To install required dependencies:

```
npm install
```

To build the project:

```
npm run build
```

You can run `npm run watch` to start a watch server which rebuilds the source files when a change is detected.
The built files are located in the `dist` directory.
For an easier development workflow, link the `dist` directory into Grafana's plugin directory, so Grafana always has the latest version available.

### Releasing and bundling

This project uses the [release-it][10] plugin to create release bundles: zip archives ready for mounting into Grafana or using in combination with Grafana's provisioning mechanisms.

To create a release bundle, ensure `release-it` is installed:

```
npm install --global release-it
```

To build a release bundle:

```
release-it [--no-git.requireCleanWorkingDir]
```

Running `release-it` creates a `releases` directory containing the built zip archive.

[1]: https://grafana.com/docs/plugins/
[2]: https://github.com/sensu/grafana-sensu-go-datasource/releases
[3]: https://grafana.com/docs/plugins/installation/
[4]: https://docs.sensu.io/sensu-go/latest/reference/backend/#general-configuration-flags
[5]: https://docs.sensu.io/sensu-go/latest/reference/rbac/#assigning-group-permissions-across-all-namespaces
[6]: https://docs.sensu.io/sensu-go/latest/reference/entities/
[7]: https://docs.sensu.io/sensu-go/latest/reference/events/
[8]: https://docs.sensu.io/sensu-go/latest/reference/rbac/#namespaces
[9]: https://grafana.com/docs/guides/basic_concepts/
[10]: https://www.npmjs.com/package/release-it
[npm]: https://www.npmjs.com/get-npm
[api_key_doc]: https://docs.sensu.io/sensu-go/latest/reference/apikeys/
