---
sidebar_position: 70
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🏭 Extending DevX

You can extend DevX by defining Traits and Transformers.

**When to add Traits?**
define new traits when you want to create a new abstraction for developers, or when you want to support a use-case not covered by the standard library.

**When to add Transformers?**
define new transformers when you want to customize how existing traits (or combination of traits) are transformed, or when you want to support new platforms.


## Create a new abstraction
### Defining a trait

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

### Defining a transformer

Transformers enrich and add information to components until all required resources are defined.

:::tip
When writing a transformer in CUE it helps to think of how the component would look after the transformation. Then write just that!
:::

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

### Putting it all together

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

## Support a new platform

[TODO: Meanwhile refer to the Kubernetes transformers [implmentation](https://github.com/devopzilla/guku-devx/blob/main/pkg/guku.io/devx/v1/transformers/kubernetes/transformers.cue) as an example]


## Writing tests for transformers

You can write unit tests for transformers to make sure no breaking changes are introduced as your platform evolves.

```cue
package main

import (
	"guku.io/devx/v1"
	"guku.io/devx/v1/transformers/compose"
)

_exposable: v1.#TestCase & {
	$metadata: test: "exposable"

	transformer: compose.#ExposeComposeService
	input: {
		$metadata: id: "obi"
		endpoints: default: ports: [
			{
				port:   8080
				target: 80
			},
		]
	}
	output: _

    // use to sure the values added by the transformer are as expected
    // it's not possible to test for concreteness here
	expect: {
		endpoints: default: host: "obi"
		$resources: compose: services: obi: ports: ["8080:80"]
	}

    // testing that some fields are concrete 
    // since this cannot be done with "expect"
	assert: {
		"host is concrete": (output.endpoints.default.host & "123") == _|_
	}
}
```

Running tests

```bash
cue eval
```
