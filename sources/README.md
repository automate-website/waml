# WAML (draf-0.2)

**Notice**: WAML is currently in a very early draft version. Feel free to create a pull request in case you have useful suggestions.

Refer to the [changelog] for recent notable changes and modifications.

## Abstract

Web Automation Markup Language (WAML) is definition of action sequences which can be performed on web resources (e.g. regular web pages) within a context of a web browser to simulate user behavior. The WAML specification defines an application of [YAML 1.2] which allows an expirienced user to create a human and machine readable sequence at one go, reuse sequences in any order, and perform context dependent actions.

## Terminology

The underlying format for WAML is YAML so that it inherits all its benefits such as hosting of multiple document within one stream. A WAML stream may contain multiple _scenarios_. Every _scenario_ must be represented by a set of _metadata_ as well as sequence of _actions_ to execute. Every _action_ must have at least one _criteria_ which is represented as _scalar_ (string, integer, etc.) value or a _mapping_.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119].

## Schema

WAML is based on [JSON Schema] that lives at [waml-schema.org]. WAML schema is available in [YAML][waml-yaml] and [JSON][waml-json] formats. A scenario within a WAML stream may define the preferred schema version by defining ```$schema``` property, otherwise a default parser schema is used.


## Scenario Schema

A very basic scenario must contain a ```name``` and ```steps``` property. The list of actions may be empty, however, it is reasonable to have at least one action.

```yaml
{{ include('./sources/examples/scenario/simple-scenario.yaml') }}
```

This minimal example demonstrates the simplicity of WAML. The full list of supported metadata is depicted below.

{{ schema2md('./sources/schema/scenario-schema.yaml') }}

Using this properties, the following more comprehensive example can be created:

```yaml
{{ include('./sources/examples/scenario/full-featured-scenario.yaml') }}
```

## Steps Schema

The steps property must be represented as a sequence of actions. Every step represents the smallest identifiable user action.

{{ schema2md('./sources/schema/step-schema.yaml') }}

The actions could be:

1. Open a web page.
2. Verify the presence of a header with a certain class.

This would look like the following in WAML.

```yaml
{{ include('./sources/examples/scenario/steps-scenario.yaml') }}
```

## Actions

### Open

{{ schema2md('./sources/schema/steps/url-step-schema.yaml') }}

### Ensure

{{ schema2md('./sources/schema/steps/ensure-step-schema.yaml') }}


### Move

{{ schema2md('./sources/schema/steps/move-step-schema.yaml') }}

### Click

{{ schema2md('./sources/schema/steps/click-step-schema.yaml') }}

### Select

{{ schema2md('./sources/schema/steps/select-step-schema.yaml') }}

### Enter

{{ schema2md('./sources/schema/steps/enter-step-schema.yaml') }}

### Include

{{ schema2md('./sources/schema/steps/include-step-schema.yaml') }}


### Store

{{ schema2md('./sources/schema/steps/store-step-schema.yaml') }}

## Expressions

{{ schema2md('./sources/schema/expression-schema.yaml') }}


## Management of Multiple Scenarios

A single WAML file may contain multiple scenarios. Therefore, the capability of YAML to store multiple documents by splitting them with ```---``` is used.




[YAML 1.2]: http://yaml.org/spec/1.2/spec.html
[RFC 2119]: https://www.ietf.org/rfc/rfc2119.txt

[JSON Schema]: http://json-schema.org/
[changelog]: CHANGELOG.md
[waml-json]: dist/waml.json
[waml-yaml]: dist/waml.yaml
[waml-schema.org]: http://waml-schema.org

