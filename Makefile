# Local development shortcuts — run `make` (or `make help`) to list them.
# Works inside the devcontainer (MySQL is already running there) and on any
# machine with Java 25, Node 24 and Docker (start the database with `make db`).

FRONTS := game dashboard
MYSQL_CONTAINER := hangman-mysql

.DEFAULT_GOAL := help
.PHONY: help install db db-stop api game dashboard dev test lint build clean

help: ## Show this help
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Install the dependencies of the three apps
	cd api && ./mvnw -q dependency:go-offline
	for app in $(FRONTS); do (cd $$app && npm ci) || exit 1; done

db: ## Start a MySQL 8.4 database on localhost:3306 (not needed in the devcontainer)
	docker run -d --name $(MYSQL_CONTAINER) -p 3306:3306 \
		-e MYSQL_DATABASE=hangman -e MYSQL_USER=hangman -e MYSQL_PASSWORD=hangman \
		-e MYSQL_ROOT_PASSWORD=root -v hangman-mysql-data:/var/lib/mysql mysql:8.4

db-stop: ## Stop and remove the MySQL container (the data volume is kept)
	docker rm -f $(MYSQL_CONTAINER)

api: ## Run the API on http://localhost:8080
	cd api && ./mvnw spring-boot:run

game: ## Run the game on http://localhost:5173
	cd game && npm run dev

dashboard: ## Run the dashboard on http://localhost:5174
	cd dashboard && npm run dev

dev: ## Run the API, the game and the dashboard together (Ctrl+C stops all)
	$(MAKE) -j3 api game dashboard

test: ## Run all the tests
	cd api && ./mvnw verify
	for app in $(FRONTS); do (cd $$app && npm test) || exit 1; done

lint: ## Lint the front-end apps
	for app in $(FRONTS); do (cd $$app && npm run lint) || exit 1; done

build: ## Build the API jar and the static front-end apps
	cd api && ./mvnw package -DskipTests
	for app in $(FRONTS); do (cd $$app && npm run build) || exit 1; done

clean: ## Remove build outputs
	rm -rf api/target game/dist dashboard/dist
