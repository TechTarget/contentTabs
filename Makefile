# LINT & MINIFY
# jshint (>=0.7.0) & uglifyjs (>=1.2.6) are required

SCRIPT_DEV = contentTabs.js
SCRIPT_MIN = contentTabs.min.js

FILESIZE_MAX = 1000
FILESIZE_GZIP = `gzip -c ${SCRIPT_MIN} | wc -c`
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

	@echo "* linting..."
	@jshint ${SCRIPT_DEV} --show-non-errors

	@echo "* minifying..."
	@uglifyjs ${SCRIPT_DEV} > ${SCRIPT_MIN}

	@echo "* gzip test..."
	@$(FILESIZE_CHECK)