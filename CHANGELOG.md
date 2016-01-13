# Web Automation Markup Language
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Added action _wait_.
- More examples.

### Changed
- Created basic specification of the language.
- Changed action _url_ to _open_.
- Removed _title_ property from scenario schema.
- Removed the requirement of _selector_ criteria from _click_, _enter_, _move_, _parent_, and _select_ actions.
- Switched from _type_ to more explicit _fragment_ flag property in scenario schema.
- Moved conditionals (_if_, _unless_) from step schemas to criteria.


[Unreleased]: https://github.com/automate-website/waml/compare/0.0.0...HEAD
