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
| description |_(Optional)_ Short summary of the overall scenario purpose. |string |
| fragment |_(Optional)_ Defines if a scenario is a fragment or may be executed stand-alone. __Default:__ false |boolean |
| precendence |_(Optional)_ Defines the particular priority of the scenario during execution of independent scenarios. __Default:__ -1 |integer |
| timeout |_(Optional)_ Maximal time [ms] to wait for conditions to be true. __Default:__ 1000 |_One of:_<br/>[expression-schema](#expression-schema),<br/> integer |
| steps |Sequence of actions. |_Sequence of:_<br/>[step-schema](#step-schema) |
| if |_(Optional)_ If set, the scenario is only executed if the value evaluates to true |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the scenario is only executed if the value evaluates to false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


Using this properties, the following more comprehensive example can be created:

```yaml
name: full-featured-scenario
description: A full featured scenario
fragment: false
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
|  &ndash;  |A step represents the smallest identifiable user action. |_One of:_<br/>[open-step-schema](#open-step-schema),<br/> [include-step-schema](#include-step-schema),<br/> [store-step-schema](#store-step-schema),<br/> [ensure-step-schema](#ensure-step-schema),<br/> [click-step-schema](#click-step-schema),<br/> [select-step-schema](#select-step-schema),<br/> [enter-step-schema](#enter-step-schema),<br/> [move-step-schema](#move-step-schema),<br/> [wait-step-schema](#wait-step-schema) |



## Fragment Scenarios

Fragment scenarios can not be executed independently but can only be used in ```include``` actions of other scenarios or fragments.

```yaml
name: fragment-scenario
fragment: true
steps:
  - open: www.example.com
```


## Actions and Criteria
### Open
#### Open Step Schema

Like for a real user, ```open``` is often the very first action of a scenarios. It triggers the navigation to a particular URL inside the web browser.

| Property | Description | Type |
|---|---|---|
| open |The URL to which the navigation takes place as value or a complex open criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [open-criteria-schema](#open-criteria-schema) |


#### Open Criteria Schema

| Property | Description | Type |
|---|---|---|
| url |The URL to which the navigation takes place. |[expression-schema](#expression-schema) |
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Open Examples

Short notation example of ```open```:

```yaml
name: Open demonstration scenario
steps:
  - open: www.example.com
```

Complex example:

```yaml
name: Open demonstration scenario 2
steps:
  - open:
      url: www.example.com
      unless: ${isMobile}
  - open:
      url: m.example.com
      if: ${isMobile}
```

### Ensure
#### Ensure Step Schema

To verify the integrity of the page it may be reasonable to ensure the presence of a certain element. The action ```ensure``` verifies, whether the particular element is present on the page.

| Property | Description | Type |
|---|---|---|
| ensure |A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [ensure-criteria-schema](#ensure-criteria-schema) |


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
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


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
| move |A CSS selector as value or a complex move criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [move-criteria-schema](#move-criteria-schema) |


#### Move Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |_(Optional)_ CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>number,<br/> [expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |


#### Move Example

The following example depicts the usage of the ```move``` action.

```yaml
name: Move demonstation scenario
steps:
  - open: www.example.com
  - move:
      selector: a.help
      text: 'Need help?'
      parent:
        selector: .help-container
  - ensure: .help-tooltip
```

Complex example:

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
| click |A CSS selector as value or a mapping of criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [click-criteria-schema](#click-criteria-schema) |


#### Click Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |_(Optional)_ CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>number,<br/> [expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Click Examples

In the following short notation example click happens on an anchor element selected by CSS. 

```yaml
name: Click demonstration scenario
steps:
  - open: www.example.com
  - click: a.sign-up
```

The ```text``` criteria may be used to verify the wording of the target.
 
```yaml
name: Click demonstration scenario 2
steps:
  - open: www.example.com
  - click:
      selector: a.sign-up
      text: 'Join now for free!'
      if: ${isDesktop}
  - click:
      selector: a.sign-up
      text: 'Join now!'
      if: ${isMobile}
```


### Select
#### Select Step Schema

| Property | Description | Type |
|---|---|---|
| select |_(Optional)_ CSS selector of element to select or an object of select criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [select-criteria-schema](#select-criteria-schema) |


#### Select Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |_(Optional)_ CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| source |_(Optional)_ The element's value source. __Default:__ text |_Enum:_<br/>value,<br/> text,<br/> title |
| value |_(Optional)_ Value that should be checked against. |_One of:_<br/>[expression-schema](#expression-schema),<br/> number,<br/> boolean |
| mode |_(Optional)_ Value comparison mode. __Default:__ equals |_Enum:_<br/>equals,<br/> contains,<br/> regex |
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Select Example

Short notation example of ```select```:

```yaml
name: Select demonstration scenario (short notation)
steps:
  - open: www.example.com
  - select: '.actions option:first-child'
```

Complex example:

```yaml
name: Select demonstration scenario 2
steps:
  - open: www.example.com
  - select:
      selector: .title
      text: 'PROF DR'
  - select:
      selector: .country
      value: 'CH'
```


### Enter
#### Enter Step Schema

| Property | Description | Type |
|---|---|---|
| enter |Send a sequence of key strokes to an element. |_One of:_<br/>[enter-criteria-schema](#enter-criteria-schema) |


#### Enter Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |_(Optional)_ CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which contains the given text. |[expression-schema](#expression-schema) |
| timeout |_(Optional)_ Maximal time [ms] to wait for the element which meets the given criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| value |Value to set. |string |
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Enter Example

```yaml
name: Enter demonstration scenario
steps:
  - open: www.example.com
  - enter:
      selector: input.email
      value: 'me@example.com'
  - enter:
      selector: input.password
      value: 'secret'
  - click: button[type=submit]
```


### Wait
#### Wait Step Schema

| Property | Description | Type |
|---|---|---|
| wait |Time to wait in [ms] or an object of wait criteria. |_One of:_<br/>[wait-criteria-schema](#wait-criteria-schema),<br/> [expression-schema](#expression-schema),<br/> number |


#### Wait Criteria Schema

| Property | Description | Type |
|---|---|---|
| time |Time to wait in [ms]. |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Wait Example

Short notation example of ```wait```:

```yaml
name: Wait demonstration scenario
steps:
  - open: www.example.com
  - wait: 2000
```

#### Complex example
```yaml
name: Wait demonstration scenario 2
steps:
  - open: www.example.com
  - wait:
      time: 5000
      if: ${slowConnection}
```


### Include
#### Include Step Schema

| Property | Description | Type |
|---|---|---|
| include |Include criteria schema. |_One of:_<br/>[include-criteria-schema](#include-criteria-schema),<br/> [expression-schema](#expression-schema) |


#### Include Criteria Schema

| Property | Description | Type |
|---|---|---|
| scenario |The name of the scenario to include. |[expression-schema](#expression-schema) |
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Include Examples

Short notation example of ```include```:

```yaml
name: Include demonstation scenario
steps:
  - include: 'Click demonstration scenario'
```

Complex example:

```yaml
name: Include demonstation scenario
steps:
  - include:
      scenario: 'Click demonstration scenario'
      if: ${isDesktop}
```


### Store
#### Store Step Schema

| Property | Description | Type |
|---|---|---|
| store |_(Optional)_ A mapping of variables to be defined in the execution context. |object |


#### Store Criteria Schema

| Property | Description | Type |
|---|---|---|
| if |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| ^([a-zA-Z0-9_.])+$ |_(Optional)_ Random key matching the given pattern with a value. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean,<br/> number |


#### Store Examples

An example of simple usage of ```store```:

```yaml
name: Store demonstration scenario
steps:
  - store:
      language: 'en'
```

Complex example:

```yaml
name: Store demonstration scenario 2
steps:
  - store:
      display_resolution: '1024x768'
      isDesktop: true
      1080p: false
      width: 1024
      if: ${isOldComputer}
```


## Expressions
### Expression Schema

| Property | Description | Type |
|---|---|---|
|  &ndash;  |An expression is a evaluable statement that can be utilized on certain properties. |string |


## Shared Criteria
### Parent Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |_(Optional)_ CSS selector of element to select. |[expression-schema](#expression-schema) |
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

