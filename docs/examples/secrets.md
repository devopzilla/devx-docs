---
slug: secrets
sidebar_position: 7
---

# Secrets

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
		commonSecrets: {
			traits.#Secret
			secrets: apiKey: {
				name:    "apikey-a"
				version: "4"
			}
		}
		cowsay: {
			traits.#Workload
			traits.#Volume
			containers: default: {
				image: "docker/whalesay"
				command: ["cowsay"]
				args: ["Hello DevX!"]
				env: {
					// you can use secrets directly in an env var
					API_KEY:   commonSecrets.secrets.apiKey
					SOMETHING: "bla"
				}
				mounts: [
					{
						// or you can mount secrets as files via volumes
						volume: volumes.default
						path:   "secrets/file"
					},
				]
			}
			volumes: default: secret: commonSecrets.secrets.apiKey
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
        tfaws "guku.io/devx/v1/transformers/terraform/aws"
    k8s "guku.io/devx/v1/transformers/kubernetes"
)

builders: v2alpha1.#Environments & {
	dev:  environments.#Compose
	prod:  flows: {
            "kubernetes/add-deployment":pipeline: [k8s.#AddDeployment]
            "kubernetes/add-service":pipeline: [k8s.#AddService]
            "kubernetes/add-volumes":pipeline: [k8s.#AddWorkloadVolumes]
            "terraform/add-secret":pipeline: [tfaws.#AddSSMSecretParameter]
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
  apikey-a: null
services:
  cowsay:
    image: docker/whalesay
    environment:
      API_KEY: apikey-a-very-long-secure-secret
      SOMETHING: bla
    depends_on: []
    command:
      - cowsay
      - Hello DevX!
    restart: always
    volumes:
      - apikey-a:secrets/file:ro
```

  </TabItem>
  <TabItem value="Prod Terraform" label="Prod Terraform">

```json title="/build/prod/terraform/generated.tf.json"
{
  "resource": {
    "aws_ssm_parameter": {
      "secret_apikey-a": {
        "name": "apikey-a",
        "type": "SecureString",
        "value": "${random_password.secret_apikey-a.result}",
        "tags": {
          "terraform": "true"
        }
      }
    },
    "random_password": {
      "secret_apikey-a": {
        "length": 32,
        "special": false
      }
    }
  }
}
```

  </TabItem>
  <TabItem value="Prod K8s ServiceAccount" label="Prod K8s ServiceAccount">

```yaml title="/build/prod/kubernetes/cowsay-serviceaccount.yml"
kind: ServiceAccount
apiVersion: v1
metadata:
  name: cowsay
  labels:
    app: cowsay
```

  </TabItem>
  <TabItem value="Prod K8s Deployment" label="Prod K8s Deployment">

```yaml title="/build/prod/kubernetes/cowsay-deployment.yml"
kind: Deployment
apiVersion: apps/v1
metadata:
  name: cowsay
  labels:
    app: cowsay
spec:
  selector:
    matchLabels:
      app: cowsay
  template:
    metadata:
      annotations: {}
      labels:
        app: cowsay
    spec:
      volumes:
        - name: apikey-a
          secret:
            secretName: apikey-a
            optional: false
      securityContext:
        runAsUser: 10000
        runAsGroup: 10000
        fsGroup: 10000
      serviceAccountName: cowsay
      restartPolicy: Always
      containers:
        - name: default
          image: docker/whalesay
          command:
            - cowsay
          args:
            - Hello DevX!
          env:
            - name: API_KEY
              valueFrom:
                secretKeyRef:
                  name: apikey-a
                  key: API_KEY
                  optional: false
            - name: SOMETHING
              value: bla
          volumeMounts:
            - name: apikey-a
              mountPath: secrets/file
              readOnly: true
```

  </TabItem>


</Tabs>