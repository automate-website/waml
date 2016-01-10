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
$schema: http://waml-schema.org/draft-02/scenario-schema#
name: Name of the scenario
steps:
  - url: www.example.com
```

This minimal example demonstrates the simplicity of WAML. The full list of supported metadata is depicted below.

| Property | Description | Type |
|---|---|---|
| name |Unique name that is used to reference a certain scenario. |string |
| title |_(Optional)_ Human readable scenario name. |string |
| description |_(Optional)_ Short summary of the overall scenario purpose. |string |
| type |_(Optional)_ Defines if a scenario may be executed stand-alone or only as a part of another scenario. __Default:__ doable |_Enum:_<br/>fragment<br/> doable |
| precendence |_(Optional)_ Defines the particular priority of the scenario during execution of independent scenarios. __Default:__ -1 |integer |
| timeout |_(Optional)_ Maximal time [ms] to wait for conditions to be true. __Default:__ 1000 |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> integer |
| steps | |_Sequence of:_<br/>[step-schema](#http://waml-schema.org/draft-02/step-schema#) |
| if |_(Optional)_ If set, the scenario is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the scenario is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |


Using this properties, the following more comprehensive example can be created:

```yaml
$schema: http://waml-schema.org/draft-02/scenario-schema#
title: Full featured scenario
name: full-featured-scenario
description: A full featured scenario
type: doable
precendence: 1
timeout: 1000
if: ${ true }
steps:
  - url: www.example.com
```

## Steps Schema

The steps property must be represented as a sequence of actions. Every step represents the smallest identifiable user action.

| Property | Description | Type |
|---|---|---|
|  &ndash;  |A step represents the smallest identifiable user action. |_One of:_<br/>[url-step-schema](#http://waml-schema.org/draft-02/url-step-schema#)<br/> [include-step-schema](#http://waml-schema.org/draft-02/include-step-schema#)<br/> [store-step-schema](#http://waml-schema.org/draft-02/store-step-schema#)<br/> [ensure-step-schema](#http://waml-schema.org/draft-02/ensure-step-schema#)<br/> [click-step-schema](#http://waml-schema.org/draft-02/click-step-schema#)<br/> [select-step-schema](#http://waml-schema.org/draft-02/select-step-schema#)<br/> [enter-step-schema](#http://waml-schema.org/draft-02/enter-step-schema#)<br/> [move-step-schema](#http://waml-schema.org/draft-02/move-step-schema#) |


The actions could be:

1. Open a web page.
2. Verify the presence of a header with a certain class.

This would look like the following in WAML.

```yaml
$schema: http://waml-schema.org/draft-02/scenario-schema#
name: Steps demonstation scenario
description: Verifies the presence of the header.
steps:
  - url: www.example.com
  - ensure: h1.greeting
```

## Actions

### Open

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| url |The url to which the navigation takes place. |[expression-schema](#http://waml-schema.org/draft-02/expression-schema#) |


### Ensure

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| ensure |_(Optional)_ A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> [ensure-criteria-schema](#http://waml-schema.org/draft-02/ensure-criteria-schema#) |



### Move

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| move |_(Optional)_ A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> [click-criteria-schema](#http://waml-schema.org/draft-02/click-criteria-schema#) |


### Click

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| click |_(Optional)_ A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> [click-criteria-schema](#http://waml-schema.org/draft-02/click-criteria-schema#) |


### Select

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| select |_(Optional)_ Criteria of the element to select. |[select-criteria-schema](#http://waml-schema.org/draft-02/select-criteria-schema#) |


### Enter

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| enter |_(Optional)_ Send a sequence of key strokes to an element. |[enter-criteria-schema](#http://waml-schema.org/draft-02/enter-criteria-schema#) |


### Include

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| include |The title of the scenario to include |[expression-schema](#http://waml-schema.org/draft-02/expression-schema#) |


Example:
```yaml
$schema: http://waml-schema.org/draft-02/include-step-schema#
include: another scenario
```

### Store

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#http://waml-schema.org/draft-02/expression-schema#)<br/> boolean |
| store |_(Optional)_ A hash of variables to be defined in the execution context. |object |


## Expressions

| Property | Description | Type |
|---|---|---|
|  &ndash;  |An expression is a evaluable statement that can be utilized on certain properties. |string |



## Management of Multiple Scenarios

A single WAML file may contain multiple scenarios. Therefore, the capability of YAML to store multiple documents by splitting them with ```---``` is used.




[YAML 1.2]: http://yaml.org/spec/1.2/spec.html
[RFC 2119]: https://www.ietf.org/rfc/rfc2119.txt

[JSON Schema]: http://json-schema.org/
[changelog]: CHANGELOG.md
[waml-json]: dist/waml.json
[waml-yaml]: dist/waml.yaml
[waml-schema.org]: http://waml-schema.org

