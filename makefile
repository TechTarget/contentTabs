SCRIPT_NAME = contentTabs

default:

	@echo "* compiling jade templates..."
	@jade -P ./example/index.jade

	@echo "* compiling sass..."
	@sass --scss --compass --style expanded ./example/sass/style.scss ./example/css/style.css

	@echo "* linting coffeescript..."
	@coffeelint ${SCRIPT_NAME}.coffee

	@echo "* compiling coffeescript..."
	@coffee -p -l ${SCRIPT_NAME}.coffee > ${SCRIPT_NAME}.js

	# @echo "* linting javascript..."
	# @jshint ${SCRIPT_NAME}.js --show-non-errors

	@echo "* minifying..."
	@uglifyjs ${SCRIPT_NAME}.js \
						--output ${SCRIPT_NAME}.min.js \
						--source-map ${SCRIPT_NAME}.min.js.map  \
						--compress \
						--mangle \
						--comments '/^!\s/'