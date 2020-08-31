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

### Raw Queries

The Sensu Go Data Source supports query strings (e.g. for template variables) with the following structure:

    QUERY API (entity|events|namespaces) [IN NAMESPACE (namespace)[|(namespace)]] SELECT (field-key) [WHERE <FILTER|IN_BROWSER_FILTER> [AND <FILTER|IN_BROWSER_FILTER>]] [LIMIT (limit)]

> Note: Query keywords are case sensitive.

##### Filter and In-Browser Filter

    Filter: (fieldSelector|labelSelector):(filter-key) (==|!=|in|notin|matches) (field-value)

    In-Browser Filter: (field-key) (==|!=|=~|!~|<|>) (field-value)

The data source supports the response filter feature of the Sensu Go backend server.
With this filter option, the data is filtered by the Sensu Go server before it is transferred to Grafana, reducing the data to be sent.
See the [Sensu Go documentation][response-filtering] for more details.

Using the _"In-Browser"_ filter option, the data returned by the Sensu Go server can be filtered again. It is important to note that this filtering is done in the browser by Grafana. This means that a lot of data could be transferred before the filters are applied. Furthermore, in combination with a limit, it can lead to misleading results, because only a subset of the data is used. For this reason it is recommended to use the "normal" filter option as far as possible.

##### Query by Namespace

You can use `IN NAMESPACE` with the entity and events APIs to restrict queries to a specified namespace.
When omitted, `IN NAMESPACE` defaults to the `default` namespace.
The data source provides support for querying from "all namespaces".
For this purpose, the data source accepts `*` as namespace name resulting in querying all namespaces.

#### Query Examples

The following query returns hostnames containing the string `webserver` within the `default` namespace:

```
QUERY API entity SELECT system.hostname WHERE system.hostname=~/webserver/
```

The following query returns all events with a `linux` subscription within the `default` namespace:

```
QUERY API events SELECT * WHERE fieldSelector:"linux" IN event.check.subscriptions
```

The following query returns 100 entity hostnames with active, non-OK events within the `ops` namespace:

```
QUERY API events IN NAMESPACE ops SELECT entity.system.hostname WHERE check.status>0 LIMIT 100
```

The following query returns all namespaces with names cotnaing `other-`:

```
QUERY API namespaces SELECT name WHERE fieldSelector:namespace.name MATCHES "other-"
```

The following query returns all entity names across all namespaces:

```
QUERY API entity IN NAMESPACE * SELECT metadata.name
```

The following query returns all entity names across all namespaces:

```
QUERY API entity IN NAMESPACE * SELECT metadata.name
```

The following query returns the total count of entities in the `default` and `other` namespace:

```
QUERY API entity IN NAMESPACE default|other AGGREGATE count
```

The following query returns all silenced events for all namespaces:

```
QUERY API events IN NAMESPACE * SELECT * WHERE fieldSelector:event.check.is_silenced == true
```

### Using Template Variables for Namespace Selection

As already mentioned, the data source is able to fetch existing namespaces.
For example, the following query returns all existing namespaces: `QUERY API namespaces SELECT name`

This is useful in case a template variable should be used to dynamically switch between namespaces.

Since data source version `1.1.0`, it is also supported to query all namespaces at once using the data source's special namespace value `*`.
If it is desired that all namespaces can be queried using a template variable, the variable's "All"-option must be adapted.
This can be achieved by enabling the `Include All option` option and set the value of the `Custom all value` option to `*`.

![Configuration of a namespace template variable with custom All-option.](/images/all-namespaces-variable.png)

### Data Aggregation and Group-By

The data source is able to aggregate the data which is returned by the Sensu Go backend server.
Currently, a `count` and `sum` aggregation is supported. The `count` aggregation counts all elements in the data set, whereas the `sum` aggregation calculates the sum of a specific attribute.

> Note that the aggregation is done in the browser by the data source! In combination with a limit, it can lead to misleading results, because only a subset of the data is used.

Since version 1.1.0 the data source also supports a grouping of the data. Thus an aggregation can be made with respect to a certain attribute. For example, in the following screenshot we get the count of elements in all namespaces, splitted by their `entity_class`.

![Splitting the aggregation result based on a specific attribute.](/images/group-by.png)

> Note that many panels require a _time series_ format.

## Sample Dashboards

If you don't want to create your own dashboard or just want to test the data source quickly, you can use one of the sample dashboards.
The sample dashboards are located in the "x" folder and can be used with Grafana version 6.0.0 and higher.

Some of the sample dashboards use the pie chart panel, which is only included in Grafana from version 7 on, but can also be [installed into an earlier version via the marketplace](https://grafana.com/grafana/plugins/grafana-piechart-panel).

* Sample Dashboard 01
  ![Screenshot of a sample dashboard 01 using the Sensu Go data source.](/images/demo-dashboard-01.png)

* Sample Dashboard 02
  ![Screenshot of a sample dashboard 02 using the Sensu Go data source.](/images/demo-dashboard-02.png)

* _Event Overview_ & _Event Details_

  These dashboards can be used to visualize events existing in selected namespaces.
  Furthermore, the dashboards are linked together, thus, from the overview dashboard you can drill down into events and see more information about it. Please note, that the table's link has to be adjusted in case the name or id of the dashboard is changed.
  ![Screenshot of the event overview dashboard.](/images/event-overview.png)

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
[response-filtering]: https://docs.sensu.io/sensu-go/latest/api/#response-filtering
