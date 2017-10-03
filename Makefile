BIN = node_modules/.bin

all: build-css
	@echo "Build complete."

build-css:
	@cat \
		assets/css/poole.css \
		assets/css/lanyon.css \
		assets/css/syntax.css \
	| $(BIN)/postcss -o assets/css/lanyon.min.css
