# WAML (draft-0.2)

**Notice**: WAML is currently in a very early draft version. Feel free to create a pull request in case of useful suggestions.

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
name: Name of the scenario
steps:
  - open: www.example.com
```

This minimal example demonstrates the simplicity of WAML. The full list of supported metadata is depicted below.

| Property | Description | Type |
|---|---|---|
| name |Unique name that is used to reference a certain scenario. |string |
| title |_(Optional)_ Human readable scenario name. |string |
| description |_(Optional)_ Short summary of the overall scenario purpose. |string |
| type |_(Optional)_ Defines if a scenario may be executed stand-alone or only as a part of another scenario. __Default:__ doable |_Enum:_<br/>fragment,<br/> doable |
| precendence |_(Optional)_ Defines the particular priority of the scenario during execution of independent scenarios. __Default:__ -1 |integer |
| timeout |_(Optional)_ Maximal time [ms] to wait for conditions to be true. __Default:__ 1000 |_One of:_<br/>[expression-schema](#expression-schema),<br/> integer |
| steps |Sequence of actions. |_Sequence of:_<br/>[step-schema](#step-schema) |
| if |_(Optional)_ If set, the scenario is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the scenario is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


Using this properties, the following more comprehensive example can be created:

```yaml
title: Full featured scenario
name: full-featured-scenario
description: A full featured scenario
type: doable
precendence: 100
timeout: 5000
if: ${ true }
steps:
  - open: www.example.com
```

## Step Schema

The steps property must be represented as a sequence of actions. Every step represents the smallest identifiable user action.

| Property | Description | Type |
|---|---|---|
|  &ndash;  |A step represents the smallest identifiable user action. |_One of:_<br/>[open-step-schema](#open-step-schema),<br/> [include-step-schema](#include-step-schema),<br/> [store-step-schema](#store-step-schema),<br/> [ensure-step-schema](#ensure-step-schema),<br/> [click-step-schema](#click-step-schema),<br/> [select-step-schema](#select-step-schema),<br/> [enter-step-schema](#enter-step-schema),<br/> [move-step-schema](#move-step-schema) |




## Actions and Criteria
### Open
#### Open Step Schema

Like for a real user, ```open``` is often the very first action of a scenarios. It triggers the navigation to a particular URL inside the web browser.

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| open |The URL to which the navigation takes place. |[expression-schema](#expression-schema) |


#### Open Criteria Schema

The ```open``` action has no additional criteria.

### Ensure
#### Ensure Step Schema

To verify the integrity of the page it may be reasonable to ensure the presence of a certain element. The action ```ensure``` verifies, whether the particular element is present on the page.

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| ensure |_(Optional)_ A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [ensure-criteria-schema](#ensure-criteria-schema) |


#### Ensure Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |_(Optional)_ CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>number,<br/> [expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| source |_(Optional)_ The element's value source __Default:__ text |_Enum:_<br/>value,<br/> text,<br/> title |
| value |_(Optional)_ Value that should be checked against |_One of:_<br/>number,boolean,<br/> [expression-schema](#expression-schema) |
| mode |_(Optional)_ Value comparison mode. __Default:__ equals |_Enum:_<br/>equals,<br/> contains,<br/> regex |


#### Ensure Examples
The following simple scenario can be created using the shot-notation of ```ensure``` action:

1. Open a web page.
2. Verify the presence of a header with a certain class.

This would look like the following in WAML.

```yaml
name: Ensure demonstation scenario
steps:
  - open: www.example.com
  - ensure: h1.greeting
```

Using the additional criteria not only the presence of the element can be ensured but also elements content and its appearance within a defined a time constraint.

```yaml
name: Ensure demonstation scenario with additional contstraints
steps:
  - open: www.example.com
  - ensure:
      selector: h1.greeting
      timeout: 400
      value: 'Welcome to example.com!'
```

### Move
#### Move Step Schema

For hidden elements which appear only after the user has hovered a certain element the (mouse) ```move``` action can be used.  

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| move |_(Optional)_ A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [click-criteria-schema](#click-criteria-schema) |


#### Move Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>number,<br/> [expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |


#### Move Example

The following example depicts the usage of the ```move``` action.

```yaml
name: Move demonstation scenario
steps:
  - open: www.example.com
  - move: a.help
  - ensure:
      selector: .help-tooltip
      text: 'Click here to get help.'
```


### Click
#### Click Step Schema

Every kind of clicks can be simulated with the ```click``` action.

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| click |_(Optional)_ A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [click-criteria-schema](#click-criteria-schema) |


#### Click Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>number,<br/> [expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |


#### Click Examples

In the following short-notation example click happens on an anchor element selected by CSS. 

```yaml
name: Click demonstation scenario
steps:
  - open: www.example.com
  - click: a.sign-up
```

The ```text``` criteria may be used to verify the wording of the target.
 
```yaml
name: Click demonstation scenario 2
steps:
  - open: www.example.com
  - click:
      selector: a.sign-up
      text: 'Join now for free!'
```

### Select
#### Select Step Schema

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| select |_(Optional)_ Criteria of the element to select. |[select-criteria-schema](#select-criteria-schema) |


#### Select Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>number,<br/> [expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| source |_(Optional)_ The element's value source __Default:__ text |_Enum:_<br/>value,<br/> text,<br/> title |
| value |Value that should be checked against |_One of:_<br/>number,boolean,<br/> [expression-schema](#expression-schema) |
| mode |_(Optional)_ Value comparison mode. __Default:__ equals |_Enum:_<br/>equals,<br/> contains,<br/> regex |


### Enter

#### Enter Step Schema

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| enter |_(Optional)_ Send a sequence of key strokes to an element. |[enter-criteria-schema](#enter-criteria-schema) |


#### Enter Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>number,<br/> [expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| value |Value to set. |string |


### Include
#### Include Step Schema

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| include |The title of the scenario to include |[expression-schema](#expression-schema) |


#### Include Criteria Schema

The ```include``` action has no additional criteria.

### Store
#### Store Step Schema

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| store |_(Optional)_ A hash of variables to be defined in the execution context. |object |


#### Store Criteria Schema

The ```store``` action has no additional criteria.

## Expressions
### Expression Schema

| Property | Description | Type |
|---|---|---|
|  &ndash;  |An expression is a evaluable statement that can be utilized on certain properties. |string |


## Shared Criteria
### Parent Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |



## Management of Multiple Scenarios

A single WAML file may contain multiple scenarios. Therefore, the capability of YAML to store multiple documents by splitting them with ```---``` is used.




[YAML 1.2]: http://yaml.org/spec/1.2/spec.html
[RFC 2119]: https://www.ietf.org/rfc/rfc2119.txt

[JSON Schema]: http://json-schema.org/
[changelog]: CHANGELOG.md
[waml-json]: dist/waml.json
[waml-yaml]: dist/waml.yaml
[waml-schema.org]: http://waml-schema.org

