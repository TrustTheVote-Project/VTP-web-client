# Ancient Makefile implicit rule disabler
(%): %
%:: %,v
%:: RCS/%,v
%:: s.%
%:: SCCS/s.%
%.out: %
%.c: %.w %.ch
%.tex: %.w %.ch
%.mk:

# Variables
DOC_DIR     := docs
SRC_DIR     := .
TEST_DIR    := tests

# Use colors for errors and warnings when in an interactive terminal
INTERACTIVE := $(shell test -t 0 && echo 1)
ifdef INTERACTIVE
    RED	:= \033[0;31m
    END	:= \033[0m
else
    RED	:=
    END	:=
endif

# Let there be no default target
.PHONY: default
default:
	@echo "${RED}There is no default make target.${END}  Specify one of:"
	@echo "etags                   - constructs an emacs tags table"
	@echo ""
	@echo "See ${BUILD_DIR}/README.md for more details and info"

# emacs tags (for javascript need GNU's universal-ctags package)
.PHONY: etags
etags:
	/opt/homebrew/bin/ctags -e -R --language-force=javascript
