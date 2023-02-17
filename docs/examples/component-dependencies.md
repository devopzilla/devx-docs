---
slug: component-dependencies
sidebar_position: 3
---

# Dependencies

## Config

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="stack.cue" label="stack.cue" default>

```cue
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
				env: {
					DB_URL: db.database.host
				}
			}
		}
		db: {
			traits.#Database
			traits.#Secret
			database: {
				version:    "9.6"
				engine:     "postgres"
				persistent: true
				username:   "root"
				password:   secrets.dbPassword
			}
			secrets: dbPassword: name: "pg-password"
		}
	}
}
```

  </TabItem>
  <TabItem value="builder.cue" label="builder.cue">

```cue
package main

import (
	"guku.io/devx/v2alpha1"
	"guku.io/devx/v2alpha1/environments"
)

builders: v2alpha1.#Environments & {
	dev: environments.#Compose
}
```

  </TabItem>
</Tabs>

## Build

```bash
devx build dev
```


## Result

```yaml title="docker-compose.yml"
version: "3"
volumes:
  db-data: null
services:
  db:
    image: postgres:9.6-alpine
    ports:
      - "5432"
    depends_on: []
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: pg-password
      POSTGRES_DB: main
    volumes:
      - db-data:/var/lib/postgresql/data
    restart: "no"
  cowsay:
    image: docker/whalesay
    environment:
      DB_URL: db
    depends_on:
      - db
    command:
      - cowsay
      - Hello DevX!
    restart: always
    volumes: []
```