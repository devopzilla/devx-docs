---
sidebar_position: 65
---

# 🦾 Workflows (Taskfile)

You can create, share, and run [Taskfiles](https://taskfile.dev/) with DevX.

## Defining & running tasks

Tasks are defined in builders, so every environment has its own set of tasks. DevX validates your taskfile according to the schema defined [here](https://taskfile.dev/api/#schema).

```cue
package main

import "guku.io/devx/v2alpha1"


builders: v2alpha1.#Environments & {
    prod: taskfile: tasks: {
        build: {
			env: {
				CGO_ENABLED: "0"
				AWS_REGION:  "us-west-1"
				AWS_ACCOUNT: "111111111111"
                APP_NAME:    "myapp"
			}
			cmds: [
				"go generate ./ui",
				"go build -o ./bin/ ./cmd/$APP_NAME",
				"docker build . -t $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME",
			]
		}
		push: {
			env: build.env
			deps: ["build"]
			cmds: [
				"aws ecr get-login-password --region $AWS_REGION  | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com",
				"docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME",
			]
		}
		apply: {
			dir: "deploy"
			cmds: ["terraform apply -auto-approve"]
		}
	}
}
```

Tell devx which tasks to run, `devx run` accepts all [go-task flags and arguments](https://taskfile.dev/api/).

```bash
devx run prod push
```

## Watching for changes

```cue
package main

import (
    "guku.io/devx/v2alpha1"
    "guku.io/devx/v2alpha1/environments"
)


builders: v2alpha1.#Environments & {
    dev: environments.#Compose & {
        taskfile: tasks: {
            test:         "go test ./... --race --cover"
            down:         "docker-compose down"
            buildCompose: "devx -S build dev"
            up: {
                deps: ["buildCompose"]
                cmds: ["docker-compose up -d"]
            }
            mongo: {
                deps: ["buildCompose"]
                cmds: ["docker-compose up -d mongo"]
            }
            server: {
                env: {
                    MONGODB_URI:      "localhost"
                    MONGODB_USERNAME: "root"
                    MONGODB_PASSWORD: "dummy-dev-password"
                }
                deps: ["mongo"]
                sources: ["cmd/**/*.go", "internal/**/*.go"]
                generates: ["bin/myapp"]
                cmds: [
                    "go build -o ./bin/ ./cmd/myapp",
                    "./bin/myapp serve",
                ]
            }
            ui: {
                dir: "ui"
                cmds: ["npm run dev"]
            }
        }
	}
}
```

Same as what you would do with go-task. You can use `--force` to ignore watch cache.

```bash
devx run dev server --watch --interval 200ms --force
```