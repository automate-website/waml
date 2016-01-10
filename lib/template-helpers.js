'use strict';

var _ = require('lodash-node'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    path = require('path');

module.exports = function(templateSettings) {

    templateSettings.imports = templateSettings.imports || {};

    templateSettings.imports['include'] = include;
    templateSettings.imports['schema2md'] = schema2md;

};

function include(filename) {
    var content = readFile(filename);
    return _.trim(content);
}

function schema2md(filename) {

    var content;

    // Load content of JSON or YAML file
    var extname = path.extname(filename);
    if (extname === '.json') {
        content = require(filename);
    } else {
        content = requireYaml(filename);
    }

    var output = '| Property | Description | Type |\n' +
                 '|---|---|---|\n';

    var properties = [];

    // Property preprocessing
    if (content.properties) {
        _.forEach(content.properties, function (property, name) {
            if (name === '$schema') {
                return;
            }

            properties.push({
                name: name,
                description: property.description || '',
                type: property.type,
                default: property.default,
                oneOf: property.oneOf,
                anyOf: property.anyOf,
                allOf: property.allOf,
                items: property.items,
                enum: property.enum,
                $ref: property.$ref,
                optional: !_.includes(content.required, name)      // property is not required in JSON Schema
            });
        });
    } else {
        properties.push({
            name: ' &ndash; ',
            description: content.description || '',
            type: content.type,
            oneOf: content.oneOf,
            anyOf: content.anyOf,
            allOf: content.allOf
        });
    }

    // TODO: Sort properties

    // Generation of Markdown output
    properties.forEach(function(property) {
        output += '| ' + property.name + ' |' +
            (property.optional ? '_(Optional)_ ' : '') +
            property.description +
            (property.default ? ' __Default:__ ' + property.default : '' ) +
            ' |' +
            processType(property) + ' |' +
            '\n';
    });

    return output;
}

function processType(property) {
    if (property.items) {
        return '_Sequence of:_<br/>' + processType(property.items);
    } else if (property.enum) {
        return processTypes(property.enum, 'Enum:');
    } else if (property.oneOf) {
        return processTypes(property.oneOf, 'One of:');
    } else if (property.anyOf) {
        return processTypes(property.anyOf, 'Any of:');
    } else if (property.allOf) {
        return processTypes(property.allOf, 'All of:');
    } else if (property.type) {
        return property.type;
    } else if (property.$ref) {
        var schemaUrl = property.$ref;
        var schemaName = path.basename(schemaUrl, path.extname(schemaUrl));
        schemaName = schemaName.replace(/^(.*)#$/g, "$1");
        return '[' + schemaName + '](' + schemaUrl +  ')';
    } else if (typeof property === 'string') {
        return property;
    }

    return '?';
}

function processTypes(types, prefix, glue) {
    var glue = glue || ',<br/> ';

    var output = (prefix ? '_' + prefix + '_<br/>' : '');

    types.forEach(function(type, index) {
        output += processType(type);
        if (index < types.length - 1) {
            output += glue;
        }
    });

    return output;
}

function requireYaml(filePath) {
    return yaml.safeLoad(readFile(filePath));
}

function readFile(filePath){
    return fs.readFileSync(filePath, 'utf8');
}
