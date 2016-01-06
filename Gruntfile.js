var _ = require('lodash-node'), 
	Ajv = require('ajv'), 
	yaml = require('js-yaml'), 
	fs = require('fs'), 
	glob = require('glob'), 
	sources = './sources', 
	schemaSourcesPattern = sources
		+ '/schema/**/*.yaml', 
	exampleSourcesPattern = sources
		+ '/examples/**/*.yaml', 
	schemasOrder = [ 'base', 'scenario', 'step',
		'commands', 'criteria' ],
	distPattern = './dist/**/*';

var ajv = new Ajv(), pkg = require('./package.json');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.initConfig({
		pkg : pkg,
		
		clean : [ distPattern ]
	});

	grunt.registerTask('validate-schema', 'Validates waml json based schema.',
			function() {
				var done = this.async();

				return glob(schemaSourcesPattern, function(er, filePaths) {
					_.each(filePaths, function(filePath) {
						subSchema = requireYaml(filePath);
						grunt.log.write('Validating', filePath, '... ');
						try {
							ajv.addSchema(subSchema);
							grunt.log.ok();
						} catch (e) {
							grunt.log.error();
							throw e;
						}
					});
					done();
				});
			});

	grunt.registerTask('validate-examples', 'Validates waml schema examples.',
			function() {
				var done = this.async();

				return glob(exampleSourcesPattern, function(er, filePaths) {
					var hasErrors = false;

					_.each(filePaths, function(filePath) {
						example = requireYaml(filePath);
						grunt.log.write('Validating', filePath, '... ');
						try {
							var valid = ajv.validate(example['$schema'],
									example);
							if (!valid) {
								hasErrors = true;
								grunt.log.error();
								grunt.log.writeln('Validation failed due to: ',
										ajv.errors);
							} else {
								grunt.log.ok();
							}
						} catch (e) {
							grunt.log.error();
							throw e;
						}
					});
					done(!hasErrors);
				});
			});

	grunt.registerTask('merge-json', 'Merges schemas.', function() {
		return merge('json', saveJson, this.async());
	});
	
	grunt.registerTask('merge-yaml', 'Merges schemas.', function() {
		return merge('yaml', saveYaml, this.async());
	});

	grunt.registerTask('default', [ 'clean', 'validate-schema', 'validate-examples',
			'merge-yaml', 'merge-json' ]);

	function merge(format, save, done){
		var schemaDistFile = './dist/waml.' + format;
		return glob(schemaSourcesPattern, function(er, filePaths) {
			var schemas = [];
	
			_.each(filePaths, function(filePath) {
				schemas.push(requireYaml(filePath));
			});
	
			save(schemaDistFile, schemas, done);
		});
	}
	
	function saveYaml(filePath, objects, done) {
		var yamlStr = yaml.safeDump(objects);
		writeFile(filePath, yamlStr, done);
	}
	
	function saveJson(filePath, objects, done){
		var jsonStr = JSON.stringify(objects, null, 4);
		writeFile(filePath, jsonStr, done);
	}
	
	function writeFile(filePath, str, done){
		grunt.log.write('Writing', filePath, '... ');
		fs.writeFile(filePath, str, function(err) {
			if (err) {
				grunt.log.error();
				throw err;
			}
			grunt.log.ok();
			done();
		});
	}

	function requireYaml(filePath) {
		return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
	}
};