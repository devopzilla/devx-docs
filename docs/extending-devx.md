---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🏭 Extending DevX

You can extend DevX by defining Traits and Transformers.

**When to add Traits?**
define new traits when you want to create a new abstraction for developers, or when you want to support a use-case not covered by the standard library.

**When to add Transformers?**
define new transformers when you want to customize how existing traits (or combination of traits) are transformed, or when you want to support new platforms.

## Defining a trait

Traits expose platform capabilities to developers by allowing them to describe their workload components.

Let's implement the `DjangoApp` trait with the following features:
+ standardize the ports exposed
+ standardize the entrypoint script
+ ability to add allowed hosts for django specifc configurations
```cue title="traits.cue"
package main

import (
	"guku.io/devx/v1"
	"guku.io/devx/v1/traits"
)

#DjangoApp: v1.#Trait & {
	traits.#Workload
	traits.#Exposable
	containers: default: {
		image: string
		command: ["/app/entrypoint.sh"]
	}
	endpoints: default: ports: [
		{
			port:   8080
			target: 80
		},
	]
	allowedHosts: [...string]
}
```

## Adding a transformer

Transformers enrich and add information to components until all required resources are defined.

We will create a `DjangoAppTransformer` that expects a component with the `DjangoApp` trait. Our transformer will add an `ALLOWED_HOSTS` environmental variable to django applications with:
+ `localhost`
+ the default endpoint hostname that will be different depending on the platform
+ developer defined hostnames
```cue title="transformers.cue"
package main

import (
	"strings"
	"guku.io/devx/v1"
)

#DjangoAppTransformer: v1.#Transformer & {
	#DjangoApp
	allowedHosts: _
	endpoints:    _
	containers:
		default:
			env:
				ALLOWED_HOSTS: strings.Join([
						"localhost",
						endpoints.default.host,
						for _, host in allowedHosts {host},
				], ",")
}
```

## Putting it all together

Developers will use the `DjangoAPP` trait to defined their django workloads.

Platform engineers will append the `DjangoAppTransformer` to the builder pipeline.

<Tabs>
<TabItem value="stack.cue" label="stack.cue" default>

```cue title="stack.cue"
package main

import (
	"guku.io/devx/v1"
)

stack: v1.#Stack & {
	components: {
		cowsay: {
			#DjangoApp
			containers: default: image: "myapp"
			allowedHosts: ["myapp.devopzilla.com"]
		}
	}
}
```

</TabItem>

<TabItem value="builder.cue" label="builder.cue" default>

```cue title="builder.cue"
package main

import (
	"guku.io/devx/v1"
	"guku.io/devx/v1/transformers/compose"
)

builders: v1.#StackBuilder & {
	dev: {
		drivers: compose: output: "docker-compose.yml"
		mainflows: [
			v1.#Flow & {
				pipeline: [
					#DjangoAppTransformer,
					compose.#AddComposeService,
					compose.#ExposeComposeService,
				]
			},
		]
	}
}
```

</TabItem>
</Tabs>

Then we build the stack

```bash
devx build dev
```

```yaml title="docker-compose.yml"
version: "3"
volumes: {}
services:
  cowsay:
    image: myapp
    environment:
      ALLOWED_HOSTS: localhost,cowsay,myapp.devopzilla.com
    depends_on: []
    ports:
      - "8080:80"
    command:
      - /app/entrypoint.sh
    restart: always
    volumes: []
```