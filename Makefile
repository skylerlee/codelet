BIN = node_modules/.bin

all: build-css build-js
	@$(BIN)/chalk bold green "✔ Build complete."

build-css:
	@cat \
		assets/css/poole.css \
		assets/css/lanyon.css \
		assets/css/syntax.css \
	| $(BIN)/postcss -o assets/css/lanyon.min.css

build-js:
	@$(BIN)/rollup assets/js/lanyon.js \
		--output.format iife \
	| $(BIN)/uglifyjs \
		--compress --mangle \
		-o assets/js/lanyon.min.js
