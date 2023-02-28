---
title: Getting Started
description: getting started with devx.
slug: getting-started
authors:
  - name: George Fahmy
    title: Co-founder of Devopzilla
tags: ["Docker Compose", CUE, IaC]
keywords:  ["Docker Compose", CUE, IaC]
hide_table_of_contents: false
---

# Getting Started

## Install devx
### Option 1: Homebrew

```bash
brew tap devopzilla/guku-devx
brew install guku-devx       
```

### Option 2: [Binary](https://github.com/devopzilla/guku-devx/releases)


## Init the project
```bash
mkdir myapp
cd myapp
devx project init
```

## Update project dependencies
```bash
devx project update
```

## Generate example
```bash
devx project gen
```

This will generate a sample DevX stack and builder. You create a stack to define your workload and what it needs to run.
```cue title="stack.cue"
package main

import (
	"guku.io/devx/v1"
	"guku.io/devx/v1/traits"
)

stack: v1.#Stack & {
	components: {
		cowsay: {
			traits.#Workload
			containers: default: {
				image: "docker/whalesay"
				command: ["cowsay"]
				args: ["Hello DevX!"]
			}
		}
	}
}
```

You create a builder for the `dev` environment to tell DevX how to generate configurations. This step will usually be performed by platform teams or developers wishing to extend the platform.
```cue title="builder.cue"
package main

import (
	"guku.io/devx/v2alpha1"
	"guku.io/devx/v2alpha1/environments"
)

builders: v2alpha1.#Environments & {
	dev: environments.#Compose
}
```


## Build configurations for the dev environment
```bash
devx build dev
🏗️  Loading stack...
👀 Validating stack...
🏭 Transforming stack 100% |████████████████████████| (1/1, 711 it/s)        
[compose] applied resources to "docker-compose.yml"
```
```yaml title="docker-compose.yml"
version: "3"
volumes: {}
services:
  cowsay:
    image: docker/whalesay
    environment: {}
    depends_on: []
    command:
      - cowsay
      - Hello DevX!
    restart: always
    volumes: []
```

No we run the compose file
```bash
docker-compose up
[+] Running 1/0
 ⠿ Container compose-cowsay-1  Created                                                                                                  0.0s
Attaching to compose-cowsay-1
compose-cowsay-1  |  _____________ 
compose-cowsay-1  | < Hello DevX! >
compose-cowsay-1  |  ------------- 
compose-cowsay-1  |     \
compose-cowsay-1  |      \
compose-cowsay-1  |       \     
compose-cowsay-1  |                     ##        .            
compose-cowsay-1  |               ## ## ##       ==            
compose-cowsay-1  |            ## ## ## ##      ===            
compose-cowsay-1  |        /""""""""""""""""___/ ===        
compose-cowsay-1  |   ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~   
compose-cowsay-1  |        \______ o          __/            
compose-cowsay-1  |         \    \        __/             
compose-cowsay-1  |           \____\______/   
compose-cowsay-1 exited with code 0
```