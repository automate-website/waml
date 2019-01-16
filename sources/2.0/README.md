<!--#
title: 'Web Automation Markup Language 2.0'
description: 'Human-readable way to define action sequences to perform on a web resources.'
#-->

# WAML 2.0

[![Build Status](https://travis-ci.org/automate-website/waml.svg?branch=master)](https://travis-ci.org/automate-website/waml) [![Gitter](https://badges.gitter.im/automate-website/waml.svg)](https://gitter.im/automate-website/waml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![RFC 2119](https://img.shields.io/badge/RFC-2119-blue.svg)](https://www.ietf.org/rfc/rfc2119.txt) ![WAML 2.0](https://img.shields.io/badge/WAML-2.0-ee2a7b.svg)

**Notice**: WAML 2.0 is currently under development. Feel free to create a pull request in case of useful suggestions.

Documentation for the versions: 
  - [2.0](https://waml-schema.org/2.0/)
  - [draft-02](https://waml-schema.org/draft-02/)

Refer to the [changelog] for recent notable changes and modifications.

## Abstract
{{ includeScenario('./sources/2.0/examples/order-pizza.yaml') }}

Web Automation Markup Language (WAML) is definition of action sequences which can be performed on web resources (e.g. regular web pages) within a context of a web browser to simulate user behavior. The WAML specification defines an application of [YAML 1.2] which allows an expirienced user to create a human and machine readable sequence at one go, reuse sequences in any order, and perform context dependent actions.

## Overview
### Syntax

The underlying format for WAML is YAML so that it inherits all its benefits such as hosting of multiple document within 
one stream. 

The structure of WAML is limited to 3-tier hierarchy:
- Step
  - _Decorator_
  - _Action_
    - _Criterion_

A set of steps is called _Scenario_.

#### Scenario

{{ includeScenario('./sources/2.0/examples/scenario-1.yaml') }}

A scenario is a (reusable) set of actions performed by a user, executed in the predefined order, and resulting in a 
particular state.

A WAML stream may contain multiple scenarios (separated by `---`, as specified in [YAML 1.2]). Every scenario must be 
represented by a set of metadata as well as sequence of steps to execute.


#### Step

{{ includeScenario('./sources/2.0/examples/step-1.yaml') }}

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
  - [Uri](#Uri)
- Support actions
  - [Wait](#wait)
  - [Debug](#debug)
  - [Include](#include)
  - [Alert](#alert)
  - [Execute](#execute)
  - [Export](#export)


#### Criterion

{{ includeScenario('./sources/2.0/examples/criterion-1.yaml') }}

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

{{ includeScenario('./sources/2.0/examples/decorator-1.yaml') }}

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

{{ includeScenario('./sources/2.0/examples/expression-1.yaml') }}

Expressions apply to metadata, criterion, and decorator values. Their aim is to promote reusability and allow to 
utilize the result of arbitrary operations on context values.

Expression parser must support variable substitution. It also may support other features (e.g. filters). 


## Schema

WAML is based on [JSON Schema] that lives at [waml-schema.org]. WAML schema is available in [YAML][waml-yaml] and [JSON][waml-json] formats. A scenario within a WAML stream may define the preferred schema version by defining ```$schema``` property, otherwise a default parser schema is used.


## Scenario Schema

{{ includeScenario('./sources/2.0/examples/full-featured-scenario.yaml') }}

This minimal example demonstrates the simplicity of WAML. The full list of supported metadata is depicted below.

{{ schema2md('./docs/2.0/scenario-schema') }}

Using this properties, the following more comprehensive example can be created:


## Step Schema

The steps property must be represented as a sequence of actions. Every step represents the smallest identifiable user action.

{{ schema2md('./sources/2.0/schema/step-schema.yaml') }}


## Fragment Scenarios (TBD)

{{ includeScenario('./sources/2.0/examples/~fragment-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/~fragment-scenario-2.yaml') }}

Fragment scenarios can not be executed independently and thus can be only be used in `include` actions of other 
scenarios or fragments. Fragments promote reusability and enable complex project structure.


## Actions and Criteria
### Open

{{ includeScenario('./sources/2.0/examples/open-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/open-scenario-2.yaml') }}

Like for a real user, `open` is often the very first action of a scenarios. It triggers the navigation to a particular URL inside the web browser.
The `http://` scheme should be automatically added to the `url` if no scheme is specified.

#### Open Step Schema

{{ schema2md('./docs/2.0/open-step-schema') }}

#### Open Criteria Schema

{{ schema2md('./docs/2.0/open-criteria-schema') }}

### Ensure

{{ includeScenario('./sources/2.0/examples/ensure-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/ensure-scenario-2.yaml') }}

To verify the integrity of the page it may be reasonable to ensure the presence of a certain element. The action ```ensure``` verifies, whether the particular element is present on the page.

The depicted simple scenario can be created using the shot-notation of ```ensure``` action:

1. Open a web page.
2. Verify the presence of a header with a certain class.

Using the additional criteria not only the presence of the element can be ensured but also elements content and its appearance within a defined a time constraint.

#### Ensure Step Schema

{{ schema2md('./docs/2.0/ensure-step-schema') }}

#### Ensure Criteria Schema

{{ schema2md('./docs/2.0/ensure-criteria-schema') }}

### Move

{{ includeScenario('./sources/2.0/examples/move-scenario-1.yaml') }}

{{ includeScenario('./sources/2.0/examples/move-scenario-2.yaml') }}

For hidden elements which appear only after the user has hovered a certain element the (mouse) ```move``` action can be used.  

The examples depicts the usage of the ```move``` action. 

#### Move Step Schema

{{ schema2md('./docs/2.0/move-step-schema') }}

#### Move Criteria Schema

{{ schema2md('./docs/2.0/move-criteria-schema') }}

### Click

{{ includeScenario('./sources/2.0/examples/click-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/click-scenario-2.yaml') }}

Every kind of clicks can be simulated with the ```click``` action.

In the short notation example a click happens on an anchor element selected by CSS. 
Also the ```text``` criteria may be used to verify the wording of the target.

#### Click Step Schema

{{ schema2md('./docs/2.0/click-step-schema') }}

#### Click Criteria Schema

{{ schema2md('./docs/2.0/click-criteria-schema') }}


### Select

{{ includeScenario('./sources/2.0/examples/select-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/select-scenario-2.yaml') }}

Short notation example of ```select``` and a complex example.

#### Select Step Schema

{{ schema2md('./docs/2.0/select-step-schema') }}

#### Select Criteria Schema

{{ schema2md('./docs/2.0/select-criteria-schema') }}


### Enter

{{ includeScenario('./sources/2.0/examples/enter-scenario-1.yaml') }}

#### Enter Step Schema

{{ schema2md('./docs/2.0/enter-step-schema') }}

#### Enter Criteria Schema

{{ schema2md('./docs/2.0/enter-criteria-schema') }}

### Wait

{{ includeScenario('./sources/2.0/examples/wait-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/wait-scenario-2.yaml') }}

Short notation examples of ```wait```.

#### Wait Step Schema

{{ schema2md('./docs/2.0/wait-step-schema') }}

#### Wait Criteria Schema

{{ schema2md('./docs/2.0/wait-criteria-schema') }}


### Include

{{ includeScenario('./sources/2.0/examples/include-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/include-scenario-2.yaml') }}

Short notation example of ```include``` and a complex example.

#### Include Step Schema

{{ schema2md('./docs/2.0/include-step-schema') }}

#### Include Criteria Schema

{{ schema2md('./docs/2.0/include-criteria-schema') }}


### Execute

{{ includeScenario('./sources/2.0/examples/execute-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/execute-scenario-2.yaml') }}

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

{{ schema2md('./docs/2.0/execute-step-schema') }}

#### Execute Criteria Schema

{{ schema2md('./docs/2.0/execute-criteria-schema') }}


### Define

{{ includeScenario('./sources/2.0/examples/define-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/define-scenario-2.yaml') }}

An example of simple usage of ```define``` as well as a more complex example.

#### Define Step Schema

{{ schema2md('./docs/2.0/define-step-schema') }}

#### Define Criteria Schema

{{ schema2md('./docs/2.0/define-criteria-schema') }}


### Debug

{{ includeScenario('./sources/2.0/examples/debug-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/debug-scenario-2.yaml') }}

An example of simple usage of ```debug``` as well as a more complex example.

#### Debug Step Schema

{{ schema2md('./docs/2.0/debug-step-schema') }}

#### Debug Criteria Schema

{{ schema2md('./docs/2.0/debug-criteria-schema') }}


### Uri

{{ includeScenario('./sources/2.0/examples/uri-scenario-1.yaml') }}
{{ includeScenario('./sources/2.0/examples/uri-scenario-2.yaml') }}

An example of simple usage of ```uri``` as well as a more complex example.

#### Uri Step Schema

{{ schema2md('./docs/2.0/uri-step-schema') }}

#### Uri Criteria Schema

{{ schema2md('./docs/2.0/uri-criteria-schema') }}

## Expressions
### Expression Schema

{{ schema2md('./sources/2.0/schema/expression-schema.yaml') }}

## Shared Criteria
### Parent Criteria Schema

{{ schema2md('./docs/2.0/parent-criteria-schema') }}


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
