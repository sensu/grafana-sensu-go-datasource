# Sensu Go Datasource for Grafana

## Using the Sensu Go Datasource

### Configuring the Datasource

Adding a new Sensu Go Datasource is quite easy.

All you have to do is to set the `HTTP URL` to match your Sensu Go API server. For example, if your API is available at `http://127.0.0.1:8080/api/core/v2/` you just have to enter: `http://localhost:8080`

In addition, you have to enable `Basic Auth`. In the appearing _Basic Auth Details_ form you have to enter the credentials of your Sensu backend.

### Using the Datasource

The use of the datasource should be mostly self-explanatory. A short description of the available fields is following:

SENSU GO API
: The Sensu GO API which your query is targeting.

NAMESPACE
: The namespace which should be used to retrieve data.

QUERY TYPE
: The type of the query. You can choose `Field Selection` or `Aggregation`.
If you choose `Field Selection` you can specify one or multiple attributes which should be selected/extracted of each object which is returned by the Sensu backend. This option is good for tables, e.g. to list all availalbe entity hostnames.
If you choose `Aggregation` you can specify an aggregation function which is used to aggregate the data which is returned by the Sensu backend. This option is good for Singlestats, e.g. you can count how many checks exist whose status is not `0`.

FILTER
: Filters can be specified to filter the data returned by the Sensu backend.

FIELDS
: This option is only available in the `Field Selection` query type.
Here, you can specify which fields of the data should be returned by the datasource.

LIMIT
: This option is only available in the `Field Selection` query type.
Using this option you can limit the size of the resulting data set. By default, the limit is set to `100`. If you don't want to use any limit, you can disable the limit by setting the limit to `0`.

AGGREGATION
: This option is only available in the `Aggregation` query type.
Using this option, you can specify how the data returned by the Sensu backend should be aggregated. E.g. `count` will just give you the number of objects in the data set.

### Using the Datasource for Template Variables

The Sensu Go Datasource is supporting fetching of template variables. In this case, Grafana requires to enter a query string which specifies which data is used as template variables.

You can see a string representation of a query when collapsing the query editor. It is important to state that the query string used for fetching of template variables is not supporting aggregation, limits and only a single field can be queried.

A query string is structured as follows:

    QUERY API (entity|events) IN NAMESPACE (namespace) SELECT (field-key) [WHERE (field-key)(=|!=|=~|!~|<|>)(field-value) [AND (field-key)(=|!=|=~|!~|<|>)(field-value)]]

**Example**: the following query returns all hostnames which contains the string `novatec` in the `default` namespace:

    QUERY API entity IN NAMESPACE default SELECT system.hostname WHERE system.hostname=~/novatec/

**Example**: the following query returns all hostnames whose status check is larger than `0`:

    QUERY API events IN NAMESPACE default SELECT entity.system.hostname WHERE check.status>0

_Note: currently the query is case sensitive and requires to use a single whitespaces between its segments!_

## Developing and Building the Datasource

### Developing

This project is managed using NPM, so please ensure that NPM is installed on your system.

First, run the `npm install` command for installing all required dependencies.

If the plugin is under development, the command `npm run watch` can be used to start a watch server which rebuilds the source files when a change is detected. The built files will be located in the `dist` directory.

It is very handy to link the `dist` directory into Grafana's plugin directory, thus, Grafana always has the latest version available.

If the project should just be build the command `npm run build` can be used.

### Releasing and Bundling

This project uses the [release-it](https://www.npmjs.com/package/release-it) plugin for creating a release bundle.

The release bundle will be a zip archive, containing the datasource which is ready for mounting into Grafana or using in combination with Grafana's provisioning mechanisms.

In order to create a release bundle, ensure `release-it` is installed.

    npm install --global release-it

The command for building a release bundle will be:

    release-it [--no-git.requireCleanWorkingDir]

Running `release-it` will create a `releases` directory containing the built zip archive.
