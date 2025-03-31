# Define default target
.DEFAULT_GOAL := help
.PHONEY: help install-dependencies run build preview test test-sync

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install-dependencies: ## Install dependencies
	npm install

test: ## Run tests
	./nx run-many --target=test --projects=esg-website --projects=sync-db

test-sync: ## Tests the data sync package
	./nx run sync-db:test

run: ## Run the Astro project
	./nx run esg-website:dev

build: ## Build the Astro project
	./nx run esg-website:build

preview: ## Preview the Astro project
	./nx run esg-website:preview
