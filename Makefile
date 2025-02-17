.SILENT:
.DEFAULT_GOAL := help

# Variables
SHELL := /bin/bash
APP_NAME := capability-lens
NODE_ENV ?= development
DOCKER_REGISTRY ?= ghcr.io
DOCKER_IMAGE := $(DOCKER_REGISTRY)/krzko/$(APP_NAME)
VERSION ?= $(shell git describe --tags --always --dirty)

.PHONY: help install dev build test lint format clean docker-build docker-push db-up db-down db-migrate db-generate db-seed db-reset db-studio

# Help
help: ## Display this help message
	echo "Usage: make [target]"
	echo ""
	echo "Targets:"
	awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "  %-20s %s\n", $$1, $$NF }' $(MAKEFILE_LIST)

# Development
install: ## Install dependencies
	echo "Installing dependencies..."
	pnpm install

dev: ## Run development server
	echo "Starting development server..."
	pnpm dev

build: ## Build the application
	echo "Building application..."
	pnpm build

test: ## Run tests
	echo "Running tests..."
	pnpm test

lint: ## Run linting
	echo "Running linter..."
	pnpm lint

format: ## Format code
	echo "Formatting code..."
	pnpm format

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/capability_lens

db-up: ## Start the database container
	echo "Starting database..."
	docker compose up db -d

db-down: ## Stop the database container
	echo "Stopping database..."
	docker compose down

db-migrate-dev: db-up ## Create a new migration from schema changes
	echo "Creating database migration..."
	DATABASE_URL=$(DATABASE_URL) pnpm prisma migrate dev

db-migrate: db-up ## Run database migrations
	echo "Running database migrations..."
	DATABASE_URL=$(DATABASE_URL) pnpm prisma migrate deploy

db-generate: ## Generate Prisma client
	echo "Generating Prisma client..."
	DATABASE_URL=$(DATABASE_URL) pnpm prisma generate

db-seed: db-migrate ## Seed the database
	echo "Seeding database..."
	DATABASE_URL=$(DATABASE_URL) pnpm prisma db seed

db-reset: db-up ## Reset the database (drop all tables and re-run migrations)
	echo "Resetting database..."
	DATABASE_URL=$(DATABASE_URL) pnpm prisma migrate reset --force

db-studio: ## Open Prisma Studio
	echo "Opening Prisma Studio..."
	DATABASE_URL=$(DATABASE_URL) pnpm prisma studio

# Docker
docker-build: ## Build Docker image
	echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE):$(VERSION) .
	docker tag $(DOCKER_IMAGE):$(VERSION) $(DOCKER_IMAGE):latest

docker-push: ## Push Docker image
	echo "Pushing Docker image..."
	docker push $(DOCKER_IMAGE):$(VERSION)
	docker push $(DOCKER_IMAGE):latest

# Cleanup
clean: ## Clean build artifacts
	@echo "$(CYAN)Cleaning build artifacts...$(NC)"
	rm -rf .next
	rm -rf node_modules
	rm -rf coverage

# Run production
start: ## Start production server
	@echo "$(CYAN)Starting production server...$(NC)"
	pnpm start

# Development setup
setup: install db-generate ## Setup development environment
	@echo "$(GREEN)Development environment setup complete!$(NC)"
	@echo "$(YELLOW)Remember to:$(NC)"
	@echo "1. Configure your .env file"
	@echo "2. Run database migrations with 'make db-migrate'"
	@echo "3. Start the development server with 'make dev'"
