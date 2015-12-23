# Web Automation Markup Language Schema

## Main Schema
```
	$schema: http://json-schema.org/draft-04/schema#
	title: Web Automation Markup Language
	description: A simple markup language for web automation.
	type: array
	items:
		$ref: http://automate.website/scenario-schema
```
## Scenario Schema
```
	id: http://automate.website/scenario-schema#
	$schema: http://json-schema.org/draft-04/schema#
	title: Scenario
	description: A scenario combines a collection of tasks that must be executed together in a certain order.
	type: object
	properties:
		title:
			type: string
			description: Unique scenario name that is used to reference a certain scenario.
		description;
			type: string
			description: Short summary of the overall scenario purpose.
		type:
			type: string
			description: Defines if a scenario may be executed stand-alone or only as a part of another scenario.
			enum:
				- fragment
				- doable
			default: doable
		precendence:
			type: integer
			description: Defines the particular priority of the scenario during execution of independent scenarios.
			default: -1
		steps:
			type: array
			items:
				$ref: http://automate.website/step-schema#
		required:
			- title
			- steps
```
## Step Schema
```
	id: http://automate.website/step-schema#
	$schema: http://json-schema.org/draft-04/schema#
	title: Step
	type: object
	description: A step represents the smallest identifiable user action.
	oneOf:
		- $ref: http://automate.website/url-command-schema#
```
## Command Schemas
### Url Schema
```
	id: http://automate.website/url-command-schema#
	$schema: http://json-schema.org/draft-04/schema#
	title: Url
	description: Navigates to a certain url in the user agent
	properties:
		url:
			type: string
			description: The url to which the navigation takes place.
	required:
		- url
```
