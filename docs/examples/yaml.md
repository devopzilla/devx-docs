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
  v1: "stakpak.dev/devx/v1"
  traits: "stakpak.dev/devx/v1/traits"

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
            DB_HOST: ${ db.database.host }
            ENV_GEN: ${ string  @guku(generate) }
    db:
      $traits:
        - traits.#Database
        - traits.#Secret
      database:
        version: "9.6"
        engine: "postgres"
        persistent: true
        username: "root"
        password: secrets.dbPassword
      secrets:
        dbPassword:
          name: "pg-password"

builders:
  prod:
    components:
      cowsay:
        containers:
          default:
            args: ["Hello prod"]
  dev:
    components:
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
	"stakpak.dev/devx/v2alpha1"
	"stakpak.dev/devx/v2alpha1/environments"
)

builders: v2alpha1.#Environments & {
	dev:  environments.#Compose
	prod: environments.#Compose & {
		drivers: compose: output: file: "docker-compose-prod.yml"
	}
}
```

  </TabItem>
</Tabs>

## Build

```bash
devx build dev
devx build prod
```

## Result

<Tabs>
  <TabItem value="Dev" label="Dev" default>

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
      POSTGRES_PASSWORD: secrets.dbPassword
      POSTGRES_DB: main
    volumes:
      - db-data:/var/lib/postgresql/data
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

  </TabItem>
  <TabItem value="Prod" label="Prod">

```yaml title="docker-compose-prod.yml"
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
      POSTGRES_PASSWORD: secrets.dbPassword
      POSTGRES_DB: main
    volumes:
      - db-data:/var/lib/postgresql/data
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
      - Hello prod
    restart: always
    volumes: []
```

  </TabItem>
</Tabs>
