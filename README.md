<!--#
title: 'Web Automation Markup Language 2.0'
description: 'Human-readable way to define action sequences to perform on a web resources.'
#-->

# WAML 2.0

[![Build Status](https://travis-ci.org/automate-website/waml.svg?branch=master)](https://travis-ci.org/automate-website/waml) [![Gitter](https://badges.gitter.im/automate-website/waml.svg)](https://gitter.im/automate-website/waml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![RFC 2119](https://img.shields.io/badge/RFC-2119-blue.svg)](https://www.ietf.org/rfc/rfc2119.txt) ![WAML 2.0](https://img.shields.io/badge/WAML-2.0-ee2a7b.svg)

[![Example Scenario](img/scenario-register-at-automate-website-write-and-run.gif)](img/scenario-register-at-automate-website-write-and-run.gif)


**Notice**: WAML 2.0 is currently under development. Feel free to create a pull request in case of useful suggestions.

Refer to the [changelog] for recent notable changes and modifications.

## Abstract
```yaml
name: Order Pizza
steps:
  - open: www.mypizza.com/login
  - enter:
      selector: input[name=email]
      input: alessandro@volta.it
  - enter:
      selector: input[name=password]
      input: el3ctric
  - click: button[type=submit]
  - select:
      selector: '#pizza-margarita.count'
      value: '2'
  - click:
      selector: a
      text: 'Order now!'
  - ensure:
      selector: h1.confirm
      text: Thanks, your pizza will be there soon!
```

Web Automation Markup Language (WAML) is definition of action sequences which can be performed on web resources (e.g. regular web pages) within a context of a web browser to simulate user behavior. The WAML specification defines an application of [YAML 1.2] which allows an expirienced user to create a human and machine readable sequence at one go, reuse sequences in any order, and perform context dependent actions.

## Overview
### Syntax

The underlying format for WAML is YAML so that it inherits all its benefits such as hosting of multiple document within 
one stream. 

The structure of WAML is limited to 4-tier hierarchy:
- Scenario
  - Metadata
  - Step
    - Action
      - Criterion
    - Decorator
  - Decorator
  
#### Scenario

```yaml
name: Play Radio
steps:
  - open: radio.com
  - click: button#play
```

A scenario is a (reusable) set of actions performed by a user, executed in the predefined order, and resulting in a 
particular state.

A WAML stream may contain multiple scenarios (separated by `---`, as specified in [YAML 1.2]). Every scenario must be 
represented by a set of metadata as well as sequence of steps to execute.


#### Metadata

Metadata is a part of a scenario which describes scenario-wide settings (such as global `timeout`) and explains the
purpose of the scenario (e.g. `name` or `description`). 


#### Step

```yaml
# Partial!
open: www.vacation-planner.me
```

A step must contain exactly ona action and may contain multiple decorators. Within the step the interacting with web 
elements based on underlying criteria text place. Further, certain actions may modify the web context.


#### Action

The action is a part of a step which performs operation on the web context. The actions can be classified as following:
- State validation actions
  - [Ensure](#ensure)
- State mutation actions
  - [Open](#open)
  - [Click](#click)
  - [Enter](#enter)
  - [Select](#select)
  - [Move](#move)
  - [Define](#define)
- Support actions
  - [Wait](#wait)
  - [Debug](#debug)
  - [Include](#include)
  - [Alert](#alert)
  - [Execute](#execute)


#### Criterion

```yaml
# Partial!
enter:
  selector: input[name=email]
  input: alessandro@volta.it
```

A criterion is a part of the action which describes a constraint applied on the web elements. Further, criteria of 
modifying actions perform may manipulations on the web context. 

Every step must have at least one criteria which is represented as scalar (string, integer, etc.) value or a mapping.

The criteria can be classified as following:
- Element filter criteria
  - Text
  - Selector
  - Value
  - Parent
  - Element
- State mutation criteria
  - Input
  - Url


#### Decorator

```yaml
# Partial: Slow loading page
open: www.vacation-planner.me
timeout: 10
```

A decorator adds an additional behavior on the top of a scenario or action. It does not affect the action's internal logic.

The decorators can be classified as following:
- Conditional decorators
  - When
  - Unless
- Logical decorators
  - Invert
- State decorators
  - Register
  - Timeout

### Expression

```yaml
name: Open non-responsive page
steps:
  - store:
      regularUrl: www.vacation-planner.com
      mobileUrl: mobile.vacation-planner.com
  - unless: ${isMobule}
    open: ${regularUrl}
  - when: ${isMobile}
    open: ${mobileUrl}
```

Expressions apply to metadata, criterion, and decorator values. Their aim is to promote reusability and allow to 
utilize the result of arbitrary operations on context values.

Expression parser must support variable substitution. It also may support other features (e.g. filters). 


## Schema

WAML is based on [JSON Schema] that lives at [waml-schema.org]. WAML schema is available in [YAML][waml-yaml] and [JSON][waml-json] formats. A scenario within a WAML stream may define the preferred schema version by defining ```$schema``` property, otherwise a default parser schema is used.


## Scenario Schema

```yaml
name: full-featured-scenario
description: A full featured scenario
fragment: false
precendence: 100
timeout: 5
when: ${ true }
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
| steps |Sequence of actions. |_Sequence of:_<br/>[step-schema](#step-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


Using this properties, the following more comprehensive example can be created:


## Step Schema

The steps property must be represented as a sequence of actions. Every step represents the smallest identifiable user action.

| Property | Description | Type |
|---|---|---|
|  &ndash;  |A step represents the smallest identifiable user action. |_One of:_<br/>[ensure-step-schema](#ensure-step-schema),<br/> [open-step-schema](#open-step-schema),<br/> [click-step-schema](#click-step-schema),<br/> [enter-step-schema](#enter-step-schema),<br/> [execute-step-schema](#execute-step-schema),<br/> [select-step-schema](#select-step-schema),<br/> [move-step-schema](#move-step-schema),<br/> [store-step-schema](#store-step-schema),<br/> [wait-step-schema](#wait-step-schema),<br/> [debug-step-schema](#debug-step-schema),<br/> [include-step-schema](#include-step-schema) |



## Fragment Scenarios

```yaml
name: Fragment scenario
fragment: true
steps:
  - open: www.example.com
```
```yaml
name: Fragment consumer scenario
steps:
  - include: 'Fragment scenario'
```

Fragment scenarios can not be executed independently and thus can be only be used in `include` actions of other 
scenarios or fragments. Fragments promote reusability and enable complex project structure.


## Actions and Criteria
### Open

```yaml
# Short notation
name: Open demonstration scenario
steps:
  - open: www.example.com
```
```yaml
# Full notation
name: 'Open demonstration scenario 2'
steps:
  - unless: ${isMobile}
    open:
      url: www.example.com
  - when: ${isMobile}
    open:
      url: m.example.com
```

Like for a real user, `open` is often the very first action of a scenarios. It triggers the navigation to a particular URL inside the web browser.
The `http://` scheme should be automatically added to the `url` if no scheme is specified.

#### Open Step Schema

| Property | Description | Type |
|---|---|---|
| open |The URL to which the navigation takes place as value or a complex open criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [open-criteria-schema](#open-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Open Criteria Schema

| Property | Description | Type |
|---|---|---|
| url |The URL to which the navigation takes place. |[expression-schema](#expression-schema) |


### Ensure

```yaml
# Short notation of 'ensure'
name: Ensure demonstation scenario
steps:
  - open: www.example.com
  - ensure: h1.greeting
```
```yaml
# Full notation
name: Ensure scenario with additional contstraints
steps:
  - open: www.example.com
  - timeout: 4
    ensure:
      selector: h1.greeting
      value: 'Welcome to example.com!'
```

To verify the integrity of the page it may be reasonable to ensure the presence of a certain element. The action ```ensure``` verifies, whether the particular element is present on the page.

The depicted simple scenario can be created using the shot-notation of ```ensure``` action:

1. Open a web page.
2. Verify the presence of a header with a certain class.

Using the additional criteria not only the presence of the element can be ensured but also elements content and its appearance within a defined a time constraint.

#### Ensure Step Schema

| Property | Description | Type |
|---|---|---|
| ensure |A CSS selector as value or a hash of conditionals. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [ensure-criteria-schema](#ensure-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Ensure Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which text represenation contains the given value. |[expression-schema](#expression-schema) |
| value |_(Optional)_ Verify value attribute against this value. |_One of:_<br/>number,<br/> boolean,<br/> [expression-schema](#expression-schema) |
| absent |_(Optional)_ If set to true, the element matching remaining criteria is expected to be absent. __Default:__ false |boolean |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |


### Move

```yaml
# Short notation
name: Move demonstation scenario
steps:
  - open: www.example.com
  - move: a.help
  - ensure:
      selector: .help-tooltip
      text: 'Click here to get help.'
```

```yaml
# Full notation
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

For hidden elements which appear only after the user has hovered a certain element the (mouse) ```move``` action can be used.  

The examples depicts the usage of the ```move``` action. 

#### Move Step Schema

| Property | Description | Type |
|---|---|---|
| move |A CSS selector as value or a complex move criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [move-criteria-schema](#move-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Move Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which text represenation contains the given value. |[expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |


### Click

```yaml
name: Click demonstration scenario
steps:
  - open: www.example.com
  - click: a.sign-up
```
```yaml
name: Click demonstration scenario 2
steps:
  - open: www.example.com
  - when: ${isDesktop}
    click:
      selector: a.sign-up
      text: 'Join now for free!'

  - when: ${isMobile}
    click:
      selector: a.sign-up
      text: 'Join now!'
```

Every kind of clicks can be simulated with the ```click``` action.

In the short notation example a click happens on an anchor element selected by CSS. 
Also the ```text``` criteria may be used to verify the wording of the target.

#### Click Step Schema

| Property | Description | Type |
|---|---|---|
| click |A CSS selector as value or a mapping of criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [click-criteria-schema](#click-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Click Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which text represenation contains the given value. |[expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |



### Select

```yaml
# Short notation
name: Select demonstration scenario
steps:
  - open: www.example.com
  - select: '.actions option:first-child'
```
```yaml
# Full notation of 'select'
name: 'Select demonstration scenario 2'
steps:
  - open: www.example.com
  - select:
      selector: .title
      text: 'PROF DR'
  - select:
      selector: .country
      value: 'CH'
```

Short notation example of ```select``` and a complex example.

#### Select Step Schema

| Property | Description | Type |
|---|---|---|
| select |CSS selector of element to select or an object of select criteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [select-criteria-schema](#select-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Select Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which text represenation contains the given value. |[expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| value |_(Optional)_ Value attribute will be checked against this value. |[expression-schema](#expression-schema) |



### Enter

```yaml
# Full notation of 'enter'
name: Enter demonstration scenario
steps:
  - open: www.example.com
  - enter:
      selector: input.email
      input: 'me@example.com'
  - enter:
      selector: input.password
      input: 'secret'
  - enter:
      selector: input.easy-captcha
      value: 1234
      input: 3421
  - click: button[type=submit]
```

#### Enter Step Schema

| Property | Description | Type |
|---|---|---|
| enter |Send a sequence of key strokes to an element. |_One of:_<br/>[enter-criteria-schema](#enter-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Enter Criteria Schema

| Property | Description | Type |
|---|---|---|
| selector |CSS selector of element to select. |[expression-schema](#expression-schema) |
| text |_(Optional)_ Select element which text represenation contains the given value. |[expression-schema](#expression-schema) |
| parent |_(Optional)_ Presence of the parent element according given creteria. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [parent-criteria-schema](#parent-criteria-schema) |
| value |_(Optional)_ Value of element to select. |_One of:_<br/>[expression-schema](#expression-schema),<br/> number,<br/> boolean |
| input |Value to set. |_One of:_<br/>[expression-schema](#expression-schema),<br/> number,<br/> boolean |


### Wait

```yaml
# Short notation of 'wait'
name: Wait 2.5 seconds demonstration scenario
steps:
  - open: www.example.com
  - wait: 2.5
```
```yaml
# Full notation of 'wait'
name: 'Wait 5 seconds demonstration scenario 2'
steps:
  - open: www.example.com
  - when: ${slowConnection}
    wait:
      time: 5
```

Short notation examples of ```wait```.

#### Wait Step Schema

| Property | Description | Type |
|---|---|---|
| wait |Time to wait in [s] or an object of wait criteria. |_One of:_<br/>[wait-criteria-schema](#wait-criteria-schema),<br/> [expression-schema](#expression-schema),<br/> number |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Wait Criteria Schema

| Property | Description | Type |
|---|---|---|
| time |Time to wait in [s]. |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |



### Include

```yaml
name: Include demonstation scenario
steps:
  - include: 'Click demonstration scenario'
```
```yaml
name: Include demonstation scenario
steps:
  - when: ${isDesktop}
    include:
      scenario: 'Click demonstration scenario'
```

Short notation example of ```include``` and a complex example.

#### Include Step Schema

| Property | Description | Type |
|---|---|---|
| include |Scenario name to include or include criteria. |_One of:_<br/>[include-criteria-schema](#include-criteria-schema),<br/> [expression-schema](#expression-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Include Criteria Schema

| Property | Description | Type |
|---|---|---|
| scenario |The name of the scenario to include. |[expression-schema](#expression-schema) |



### Execute

```yaml
# Short notation of 'execute'
name: Enter demonstration scenario
steps:
  - open: www.example.com
  - execute: >
      document.body.backgroundColor = 'red';
```
```yaml
# Full notation of 'execute'
name: Enter demonstration scenario
steps:
  - open: www.example.com
  - when: ${ true }
    execute:
      script: |
        var context = arguments[0];
        var callback = arguments[1];
        fetch('https://example.com/weather.json?city=' + context.city)
          .then(function (response) {
            return response.json()
          })
          .then(function (data) {
            callback(data.rainProbability);
          })
          .catch(function (ex) {
            callback()
          });
      async: true
```

The `execute` action is used for client-side (browser) execution of a JavaScript code. This is useful for cases where you
need deeper intervention into your page which cannot be performed by other WAML commands. 

The injected code is
executed synchronously which is sufficient for most cases. However, in particular situations you may want to 
perform an asynchronous call to fetch additional data using XHR or to make some injections. In this case you can
trigger the execution of the injected script in asynchonous mode by setting `async` criterion to `true`. 

In the asynchronous mode it is expected that the JavaScript snippet provided in the `script` criterion is a 
function which accepts three parameters: `resolve`, `reject`, and `context`. During the execution the

of the time 

Please consider that your _must_ execute 
either `resolve()` for success cases or `reject()` for error cases if the snippet execution is done, otherwise the 


Please consider that asynchronous calls are wrapped in a function.
The first argument of the function is the _context_ containing all variables/objects containing in the current WAML
scenario execution context. The second parameter is the _callback_ function which must be called after the execution 
is perf

#### Execute Step Schema

| Property | Description | Type |
|---|---|---|
| execute |JavaScript code to execute in the browser context. |_One of:_<br/>[expression-schema](#expression-schema),<br/> [execute-criteria-schema](#execute-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| timeout |_(Optional)_ Maximal time [s] to wait for the element which meets the given criteria. __Default:__ 5 |_One of:_<br/>[expression-schema](#expression-schema),<br/> number |


#### Execute Criteria Schema

| Property | Description | Type |
|---|---|---|
| script |JavaScript code to execute in the browser context. |[expression-schema](#expression-schema) |
| async |_(Optional)_ Define whether the script should be executed in async mode __Default:__ false |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |



### Store

```yaml
name: Store demonstration scenario
steps:
  - store:
      language: 'en'
```
```yaml
name: Store demonstration scenario 2
steps:
  - when: ${isOldComputer}
    store:
      display_resolution: '1024x768'
      isDesktop: true
      1080p: false
      width: 1024
```

An example of simple usage of ```store``` as well as a more complex example.

#### Store Step Schema

| Property | Description | Type |
|---|---|---|
| store | |[store-criteria-schema](#store-criteria-schema) |
| when |_(Optional)_ If set, the step is only executed if the value evaluates to true. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |
| unless |_(Optional)_ If set, the step is only executed if the value evaluates to false. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean |


#### Store Criteria Schema

| Property | Description | Type |
|---|---|---|
| ^([a-zA-Z0-9_.])+$ |_(Optional)_ Random key matching the given pattern with a value. |_One of:_<br/>[expression-schema](#expression-schema),<br/> boolean,<br/> number |



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
| text |_(Optional)_ Select element which text represenation contains the given value. |[expression-schema](#expression-schema) |



## Management of Multiple Scenarios

A single WAML file may contain multiple scenarios. Therefore, the capability of YAML to store multiple documents by splitting them with ```---``` is used.

## Conclusion


# Feedback

You are always welcome to ask questions, provide [feedback](https://github.com/automate-wevsite/waml/issues), or 
contribute to WAML.

# License

MIT


[YAML 1.2]: http://yaml.org/spec/1.2/spec.html

[JSON Schema]: http://json-schema.org/
[changelog]: CHANGELOG.md
[waml-json]: dist/waml.json
[waml-yaml]: dist/waml.yaml
[waml-schema.org]: http://waml-schema.org
