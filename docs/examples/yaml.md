---
slug: yaml
sidebar_position: 6
---

# YAML

You can use YAML to define stacks, or mix CUE and YAML, or multiple YAML files.

## Config

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="stack.devx.yaml" label="stack.devx.yaml" default>

```yaml
import:
  v1: "guku.io/devx/v1"
  traits: "guku.io/devx/v1/traits"

stack:
  $schema:
    - v1.#Stack
  components:
    cowsay:
      $traits:
        - traits.#Workload
        - traits.#Exposable
      endpoints:
        default:
          ports:
            - port: 8000
            - port: 9000
      containers:
        default:
          image: "docker/whalesay"
          command: ["cowsay"]
          env:
            DB_HOST: ${ db.host }
            ENV_GEN: ${ string  @guku(generate) }
    db:
      $traits:
        - traits.#Postgres
      version: "9.8"

builders:
  prod:
    additionalComponents:
      cowsay:
        containers:
          default:
            args: ["Hello prod", "again"]
  dev:
    additionalComponents:
      cowsay:
        containers:
          default:
            args: ["Hello dev"]
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
			{
				pipeline: [compose.#AddComposeService]
			},
			{
				pipeline: [compose.#ExposeComposeService]
			},
			{
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
    image: postgres:9.8-alpine
    ports:
      - "5432"
    environment:
      POSTGRES_USER: dummy
      POSTGRES_PASSWORD: dummy
      POSTGRES_DB: default
    depends_on: []
    volumes:
      - pg-data:/var/lib/postgresql/data
    restart: "no"
  cowsay:
    image: docker/whalesay
    environment:
      DB_HOST: db
      ENV_GEN: dummy
    depends_on:
      - db
    ports:
      - "8000:8000"
      - "9000:9000"
    command:
      - cowsay
      - Hello dev
    restart: always
    volumes: []
```