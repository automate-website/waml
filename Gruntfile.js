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
	distPattern = './dist/**/*',
	templateSubschemaMdPath = sources + '/templates/md/subschema.md',
	templateHeaderMdPath = sources + '/templates/md/header.md',
	templateSubschemaHtmlPath = sources + '/templates/html/subschema.html',
    templateHeaderHtmlPath = sources + '/templates/html/header.html',
	templateSettings = { interpolate: /{{([\s\S]+?)}}/g },
	shortTitle = 'WAML',
	schemaOrder = ['/schema', 
	               'scenario-schema',
	               '/step-schema',
	               'step-schema', 
	               'criteria-schema',
	               'expression-schema'];

var ajv = new Ajv(), pkg = require('./package.json');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.initConfig({
		pkg : pkg,
		
		clean : [ distPattern ],
		
		copy: {
			main: {
				files: [
				        {
				        	expand: true, 
				        	flatten: true, 
				        	src: ['sources/schema/**'], 
				        	dest: 'draft-02', 
				        	filter: 'isFile',
				        	rename: function(dest, src) {
						        return dest + '/' + src.replace('.yaml', '');
						    }
				        }
				]
				
			}
		}
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

	grunt.registerTask('merge-json', 'Merges schemas to json file.', function() {
		return merge('json', saveJson, this.async());
	});
	
	grunt.registerTask('merge-yaml', 'Merges schemas to yaml file.', function() {
		return merge('yaml', saveYaml, this.async());
	});
	
	grunt.registerTask('merge-md', 'Merges schemas to md file.', function() {
        return merge('md', saveMd, this.async());
    });
	
	grunt.registerTask('merge-html', 'Merges schemas to a html file.', function() {
        return mergeToPath('./index.html', saveHtml, this.async());
    });

	grunt.registerTask('merge', [ 'clean', 'validate',
			'merge-yaml', 'merge-json', 'merge-md', 'merge-html' ]);
	
	grunt.registerTask('default', [ 'merge', 'copy' ]);
	
	grunt.registerTask('validate', [ 'validate-schema', 'validate-examples'] );

	function merge(format, save, done){
		var schemaDistFile = './dist/waml.' + format;
		mergeToPath(schemaDistFile, save, done);
	}
	
	function mergeToPath(filePath, save, done){
		var schemaDistFile = filePath;
		return glob(schemaSourcesPattern, function(er, filePaths) {
			var schemas = [];
	
			_.each(filePaths, function(filePath) {
				schemas.push(requireYaml(filePath));
			});
	
			sortSchemasByOrder(schemas);
			
			save(schemaDistFile, schemas, done);
		});
	}
	
	function saveMd(filePath, objects, done){
	    var content = renderContent(objects, templateHeaderMdPath, templateSubschemaMdPath);
	    writeFile(filePath, content, done)
	}
	
	function saveHtml(filePath, objects, done){
	    var content = renderContent(objects, templateHeaderHtmlPath, templateSubschemaHtmlPath);
	    content = '<html><body><div class="content">' + content + '</div><body></html>';
        writeFile(filePath, content, done)
    }
	
	function sortSchemasByOrder(schemas){
	    schemas.sort(function(left, right){
	        var leftIndex = indexOfSchemaKey(schemaOrder, left.id),
	            rightIndex = indexOfSchemaKey(schemaOrder, right.id);
	        
	        return leftIndex > rightIndex ? 1 : (leftIndex < rightIndex ? -1 : 0);
	    });
	}
	
	function indexOfSchemaKey(schemaOrder, schemaKey){
	    var index = -1;
	    
	    _.each(schemaOrder, function(entry, _index){
	        if(schemaKey.indexOf(entry) > -1){
	            index = _index;
	            return false;
	        }
	    });
	    
	    return index;
	}
	
	function renderContent(objects, templateHeaderPath, templateSubschemaPath){
	    var headerTemplate = _.template(readFile(templateHeaderPath), templateSettings)
            subschemaTemplate = _.template(readFile(templateSubschemaPath), templateSettings),
            content = '';
    
        content = content + headerTemplate({
            model: {
                pkg: pkg,
                shortTitle: shortTitle
            }
        });
        
        _.each(objects, function(object){
            var yamlStr = yaml.safeDump(object);
            
            content = content + subschemaTemplate({ model : {
                schemaStr: yamlStr,
                schema: object 
            }});
        });
        
        return content;
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
		return yaml.safeLoad(readFile(filePath));
	}
	
	function readFile(filePath){
	    return fs.readFileSync(filePath, 'utf8');
	}
};