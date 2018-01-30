default: build

.PHONY: build

clean:
	@rm -rf build

build:
	@ninja

rerun: build
	build/target
