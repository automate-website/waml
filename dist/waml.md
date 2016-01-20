# WAML: draft-02

## schema: 
```
id: 'http://waml-schema.org/draft-02/schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Web Automation Markup Language
description: A simple markup language for web automation.
type: array
items:
  $ref: 'http://waml-schema.org/draft-02/scenario-schema#'
additionalProperties: false

```
## schema: scenario: 
```
id: 'http://waml-schema.org/draft-02/scenario-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Scenario
description: A scenario combines a collection of tasks that must be executed together in a certain order.
type: object
properties:
  $schema:
    type: string
    description: Defines the scenario schema in a specific version.
  name:
    type: string
    description: Unique name that is used to reference a certain scenario.
  title:
    type: string
    description: Human readable scenario name.
  description:
    type: string
    description: Short summary of the overall scenario purpose.
  type:
    type: string
    description: Defines if a scenario may be executed stand-alone or only as a part of another scenario.
    enum:
      - fragment
      - doable
    default: doable
  precedence:
    type: integer
    description: Defines the particular priority of the scenario during execution of independent scenarios.
    default: -1
  timeout:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: integer
    description: 'Maximal time [ms] to wait for conditions to be true.'
    default: 1000
  steps:
    type: array
    items:
      $ref: 'http://waml-schema.org/draft-02/step-schema#'
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the scenario is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the scenario is only executed if the value evaluates to false'
additionalProperties: false
required:
  - name
  - steps

```
## schema: step: 
```
id: 'http://waml-schema.org/draft-02/step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Step
type: object
description: A step represents the smallest identifiable user action.
oneOf:
  - $ref: 'http://waml-schema.org/draft-02/url-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/include-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/store-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/ensure-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/click-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/select-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/enter-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/move-step-schema#'

```
## schema: step: select: 
```
id: 'http://waml-schema.org/draft-02/select-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Select from dropdown
description: Selects from dropdown by the given criteria.
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  select:
    description: Criteria of the element to select.
    $ref: 'http://waml-schema.org/draft-02/select-criteria-schema#'
additionalProperties: false

```
## schema: step: move: 
```
id: 'http://waml-schema.org/draft-02/move-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Moves to the given element
description: Moves to the given visible element.
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  move:
    description: A CSS selector as value or a hash of conditionals.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/click-criteria-schema#'
additionalProperties: false

```
## schema: step: include: 
```
id: 'http://waml-schema.org/draft-02/include-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Include Scenario
description: Includes a scenario with a certain title
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  include:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: The title of the scenario to include
required:
  - include
additionalProperties: false

```
## schema: step: enter: 
```
id: 'http://waml-schema.org/draft-02/enter-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Enter key sequence
description: Send a sequence of key strokes to an element.
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  enter:
    description: Send a sequence of key strokes to an element.
    $ref: 'http://waml-schema.org/draft-02/enter-criteria-schema#'
additionalProperties: false

```
## schema: step: url: 
```
id: 'http://waml-schema.org/draft-02/url-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Url
description: Navigates to a certain URL in the user agent
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  url:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: The url to which the navigation takes place.
required:
  - url
additionalProperties: false

```
## schema: step: store: 
```
id: 'http://waml-schema.org/draft-02/store-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Store variable
description: Includes a scenario with a certain title
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  store:
    type: object
    description: A hash of variables to be defined in the execution context.
    minProperties: 1
    $ref: null
additionalProperties: false
definitions:
  entry:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'

```
## schema: step: ensure: 
```
id: 'http://waml-schema.org/draft-02/ensure-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Ensure the presence of an element
description: Ensures the presence of an element using different criteria
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  ensure:
    description: A CSS selector as value or a hash of conditionals.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/ensure-criteria-schema#'
additionalProperties: false

```
## schema: step: click: 
```
id: 'http://waml-schema.org/draft-02/click-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Click on the given element
description: Clicks on the given visible element.
properties:
  $schema:
    type: string
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false'
  click:
    description: A CSS selector as value or a hash of conditionals.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/click-criteria-schema#'
additionalProperties: false

```
## schema: criteria: ensure: 
```
id: 'http://waml-schema.org/draft-02/ensure-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Ensure criteria
description: Qualifier for an element state validation.
properties:
  selector:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: CSS selector of element to select.
  text:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Select element which contains the given text.
  timeout:
    description: 'Maximal time [ms] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  source:
    description: "The element's value source"
    enum:
      - value
      - text
      - title
    default: text
  value:
    oneOf:
      - type:
          - number
          - boolean
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Value that should be checked against
  mode:
    description: Value comparison mode.
    enum:
      - equals
      - contains
      - regex
    default: equals
additionalProperties: false

```
## schema: criteria: select: 
```
id: 'http://waml-schema.org/draft-02/select-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Select criteria
description: Qualifier for an element option selection.
properties:
  selector:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: CSS selector of element to select.
  text:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Select element which contains the given text.
  timeout:
    description: 'Maximal time [ms] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  source:
    description: "The element's value source"
    enum:
      - value
      - text
      - title
    default: text
  value:
    oneOf:
      - type:
          - number
          - boolean
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Value that should be checked against
  mode:
    description: Value comparison mode.
    enum:
      - equals
      - contains
      - regex
    default: equals
additionalProperties: false
required:
  - selector
  - value

```
## schema: criteria: parent: 
```
id: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Parent criteria
description: Qualifier for parent element selection.
properties:
  selector:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: CSS selector of element to select.
  text:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Select element which contains the given text.
additionalProperties: false
required:
  - selector

```
## schema: criteria: move: 
```
id: 'http://waml-schema.org/draft-02/move-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Move criteria
description: Qualifier for moving to an element.
properties:
  selector:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: CSS selector of element to select.
  text:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Select element which contains the given text.
  timeout:
    description: 'Maximal time [ms] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
additionalProperties: false
required:
  - selector

```
## schema: criteria: enter: 
```
id: 'http://waml-schema.org/draft-02/enter-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Enter criteria
description: Qualifier for an element value change.
properties:
  selector:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: CSS selector of element to select.
  text:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Select element which contains the given text.
  timeout:
    description: 'Maximal time [ms] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  value:
    description: Value to set.
additionalProperties: false
required:
  - selector
  - value

```
## schema: criteria: click: 
```
id: 'http://waml-schema.org/draft-02/click-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Click criteria
description: Qualifier for an element click.
properties:
  selector:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: CSS selector of element to select.
  text:
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
    description: Select element which contains the given text.
  timeout:
    description: 'Maximal time [ms] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
additionalProperties: false
required:
  - selector

```
## schema: expression: 
```
id: 'http://waml-schema.org/draft-02/expression-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Expression
description: An expression is a evaluable statement that can be utilized on certain properties.
type:
  - string

```
