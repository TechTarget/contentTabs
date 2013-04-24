# Required npm modules: uglifyjs (2.2.x) & coffeelint (0.5.x)

SCRIPT_NAME = contentTabs
FILESIZE_MAX = 1000
FILESIZE_GZIP = `gzip -c ${SCRIPT_NAME}.min.js | wc -c`
FILESIZE_PASS = "${FILESIZE_GZIP} bytes  \(^_^)/"
FILESIZE_FAIL = "${FILESIZE_GZIP} bytes  ^(>_<)^"

define FILESIZE_CHECK
	if [ ${FILESIZE_GZIP} -gt ${FILESIZE_MAX} ]; then \
		tput setaf 1; \
		echo ${FILESIZE_FAIL}; \
		tput sgr0; \
    else \
		tput setaf 2; \
		echo ${FILESIZE_PASS}; \
		tput sgr0; \
	fi
endef

default:

	@echo "* compiling jade templates..."
	@jade -P ./example/index.jade

	@echo "* compiling sass..."
	@sass --scss --compass --style expanded ./example/sass/style.scss ./example/css/style.css

	@echo "* linting coffeescript..."
	@coffeelint ${SCRIPT_NAME}.coffee

	@echo "* compiling coffeescript..."
	@coffee -p -l ${SCRIPT_NAME}.coffee > ${SCRIPT_NAME}.js

	@echo "* minifying..."
	@uglifyjs ${SCRIPT_NAME}.js \
						--output ${SCRIPT_NAME}.min.js \
						--source-map ${SCRIPT_NAME}.min.js.map  \
						--compress \
						--mangle \
						--comments '/^!\s/'

	@echo "* gzip test..."
	@$(FILESIZE_CHECK)