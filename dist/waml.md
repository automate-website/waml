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
  description:
    type: string
    description: Short summary of the overall scenario purpose.
  fragment:
    type: boolean
    description: Defines if a scenario is a fragment or may be executed stand-alone.
    default: false
  precedence:
    type: integer
    description: Defines the particular priority of the scenario during execution of independent scenarios.
    default: -1
  timeout:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: integer
    description: 'Maximal time [s] to wait for conditions to be true.'
    default: 5
  steps:
    description: Sequence of actions.
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
  - $ref: 'http://waml-schema.org/draft-02/open-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/include-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/store-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/ensure-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/click-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/select-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/enter-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/move-step-schema#'
  - $ref: 'http://waml-schema.org/draft-02/wait-step-schema#'

```
## schema: step: select: 
```
id: 'http://waml-schema.org/draft-02/select-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Select from dropdown
description: Selects from dropdown by the given criteria.
properties:
  select:
    description: CSS selector of element to select or an object of select criteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/select-criteria-schema#'
required:
  - select
additionalProperties: false

```
## schema: step: open: 
```
id: 'http://waml-schema.org/draft-02/open-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Open
description: Navigates to a certain URL in the user agent.
properties:
  open:
    description: The URL to which the navigation takes place as value or a complex open criteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/open-criteria-schema#'
required:
  - open
additionalProperties: false

```
## schema: step: move: 
```
id: 'http://waml-schema.org/draft-02/move-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Moves to the given element
description: Moves to the given visible element.
properties:
  move:
    description: A CSS selector as value or a complex move criteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/move-criteria-schema#'
required:
  - move
additionalProperties: false

```
## schema: step: include: 
```
id: 'http://waml-schema.org/draft-02/include-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Include Scenario
description: Includes a scenario with a certain title
properties:
  include:
    description: Scenario name to include or include criteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/include-criteria-schema#'
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
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
  enter:
    description: Send a sequence of key strokes to an element.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/enter-criteria-schema#'
required:
  - enter
additionalProperties: false

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
  ensure:
    description: A CSS selector as value or a hash of conditionals.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/ensure-criteria-schema#'
required:
  - ensure
additionalProperties: false

```
## schema: step: click: 
```
id: 'http://waml-schema.org/draft-02/click-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Click on the given element
description: Clicks on the given visible element.
properties:
  click:
    description: A CSS selector as value or a mapping of criteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/click-criteria-schema#'
required:
  - click
additionalProperties: false

```
## schema: step: wait: 
```
id: 'http://waml-schema.org/draft-02/wait-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Wait
description: Does nothing (waits) a certain amount of time.
properties:
  wait:
    description: 'Time to wait in [s] or an object of wait criteria.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/wait-criteria-schema#'
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: number
required:
  - wait
additionalProperties: false

```
## schema: step: store: 
```
id: 'http://waml-schema.org/draft-02/store-step-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Store variable
description: Stores a certain value to a context varable.
properties:
  store:
    type: object
    description: A mapping of variables to be defined in the execution context.
    minProperties: 1
    $ref: 'http://waml-schema.org/draft-02/store-criteria-schema#'
required:
  - store
additionalProperties: false

```
## schema: criteria: parent: 
```
id: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Parent criteria
description: Qualifier for parent element selection.
type: object
properties:
  selector:
    description: CSS selector of element to select.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  text:
    description: Select element which text represenation contains the given value.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
additionalProperties: false
required:
  - selector

```
## schema: criteria: ensure: 
```
id: 'http://waml-schema.org/draft-02/ensure-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Ensure criteria
description: Qualifier for an element state validation.
type: object
properties:
  selector:
    description: CSS selector of element to select.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  text:
    description: Select element which text represenation contains the given value.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  timeout:
    description: 'Maximal time [s] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  value:
    description: Verify value attribute against this value.
    oneOf:
      - type: number
      - type: boolean
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  absent:
    description: 'If set to true, the element matching remaining criteria is expected to be absent.'
    type: boolean
    default: false
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  if:
    description: 'If set, the step is only executed if the value evaluates to true.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
  unless:
    description: 'If set, the step is only executed if the value evaluates to false.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
additionalProperties: false
required:
  - selector

```
## schema: criteria: wait: 
```
id: 'http://waml-schema.org/draft-02/wait-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Wait criteria
description: Qualifier for wait.
type: object
properties:
  time:
    description: 'Time to wait in [s].'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: number
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true.'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false.'
required:
  - time
additionalProperties: false

```
## schema: criteria: store: 
```
id: 'http://waml-schema.org/draft-02/store-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Store criteria
description: Qualifier for values to store and a key-value store.
type: object
properties:
  if:
    description: 'If set, the step is only executed if the value evaluates to true.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
  unless:
    description: 'If set, the step is only executed if the value evaluates to false.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
patternProperties:
  '^([a-zA-Z0-9_.])+$':
    description: Random key matching the given pattern with a value.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
      - type: number
additionalProperties: false

```
## schema: criteria: select: 
```
id: 'http://waml-schema.org/draft-02/select-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Select criteria
description: Qualifier for an element option selection.
type: object
properties:
  selector:
    description: CSS selector of element to select.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  text:
    description: Select element which text represenation contains the given value.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  timeout:
    description: 'Maximal time [s] to wait for the element which meets the given criteria.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: number
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  value:
    description: Value attribute will be checked against this value.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: number
      - type: boolean
  if:
    description: 'If set, the step is only executed if the value evaluates to true.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
  unless:
    description: 'If set, the step is only executed if the value evaluates to false.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
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
type: object
properties:
  selector:
    description: CSS selector of element to select.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  text:
    description: Select element which text represenation contains the given value.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  timeout:
    description: 'Maximal time [s] to wait for the element which meets the given criteria.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: number
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  value:
    description: Value of element to select.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: number
      - type: boolean
  input:
    description: Value to set.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: number
      - type: boolean
  if:
    description: 'If set, the step is only executed if the value evaluates to true.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
  unless:
    description: 'If set, the step is only executed if the value evaluates to false.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
additionalProperties: false
required:
  - input
  - selector

```
## schema: criteria: open: 
```
id: 'http://waml-schema.org/draft-02/open-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Open criteria
description: Qualifier for an element value change.
type: object
properties:
  url:
    description: The URL to which the navigation takes place.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true.'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false.'
required:
  - url
additionalProperties: false

```
## schema: criteria: move: 
```
id: 'http://waml-schema.org/draft-02/move-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Move criteria
description: Qualifier for moving to an element.
type: object
properties:
  selector:
    description: CSS selector of element to select.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  text:
    description: Select element which text represenation contains the given value.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  timeout:
    description: 'Maximal time [s] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  if:
    description: 'If set, the step is only executed if the value evaluates to true.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
  unless:
    description: 'If set, the step is only executed if the value evaluates to false.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
additionalProperties: false
required:
  - selector

```
## schema: criteria: include: 
```
id: 'http://waml-schema.org/draft-02/include-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Include criteria
description: Qualifier for an element value change.
type: object
properties:
  scenario:
    description: The name of the scenario to include.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  if:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to true.'
  unless:
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
    description: 'If set, the step is only executed if the value evaluates to false.'
additionalProperties: false
required:
  - scenario

```
## schema: criteria: click: 
```
id: 'http://waml-schema.org/draft-02/click-criteria-schema#'
$schema: 'http://json-schema.org/draft-04/schema#'
title: Click criteria
description: Qualifier for an element click.
type: object
properties:
  selector:
    description: CSS selector of element to select.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  text:
    description: Select element which text represenation contains the given value.
    $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  timeout:
    description: 'Maximal time [s] to wait for the element which meets the given criteria.'
    oneOf:
      - type: number
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
  parent:
    description: Presence of the parent element according given creteria.
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - $ref: 'http://waml-schema.org/draft-02/parent-criteria-schema#'
  if:
    description: 'If set, the step is only executed if the value evaluates to true.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
  unless:
    description: 'If set, the step is only executed if the value evaluates to false.'
    oneOf:
      - $ref: 'http://waml-schema.org/draft-02/expression-schema#'
      - type: boolean
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
