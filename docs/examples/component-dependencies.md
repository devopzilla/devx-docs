---
slug: component-dependencies
sidebar_position: 3
---

# Component dependencies

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
                    DB_URL: db.host
                }
			}
		}
		db: {
			traits.#Postgres
			version:    "9.6"
			database:   "postgres"
			persistent: true
		}
	}
}
```

  </TabItem>
  <TabItem value="builder.cue" label="builder.cue">

```cue
package main

import (
	"guku.io/devx/v1"
	"guku.io/devx/v1/transformers/compose"
)

builders: v1.#StackBuilder & {
	dev: {
		mainflows: [
			v1.#Flow & {
				pipeline: [compose.#AddComposeService]
			},
			v1.#Flow & {
				pipeline: [compose.#AddComposeVolume]
			},
			v1.#Flow & {
				pipeline: [compose.#AddComposePostgres]
			},
		]
	}
}
```

  </TabItem>
</Tabs>


## Result

```yaml title="build/dev/compose/docker-compose.yml"
version: "3"
volumes:
  pg-data: null
services:
  db:
    image: postgres:9.6-alpine
    ports:
      - "5432"
    environment:
      POSTGRES_USER: dummy
      POSTGRES_PASSWORD: dummy
      POSTGRES_DB: postgres
    depends_on: []
    volumes:
      - pg-data:/var/lib/postgresql/data
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