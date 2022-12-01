---
sidebar_position: 2
---

# Concepts

The goal is to be able to define developer-centric configurations using a single technology to run workloads in any envrionment (e.g. local, dev, staging, production) and using any vendor's offerings.

![illustration](./assets/illustration.png)

## Guiding principals

### Shift-left validation
[TODO]

### Immutability
[TODO]

### Parity a-cross environments
[TODO]

### Infrastructure as Data
[TODO]


### Freedom to define abstractions
[TODO]

## Definitions

**Stack:** a set of components and is how you define your workloads and its dependencies. A stack is a contract between developers and platform designers.

**Component:** represents a workload or a resource. A component has an id, a set of traits, labels, and fields. A component can be low level (e.g. an RDS instance, a helm chart, or a kubernetes resource) or as high level as you want (e.g. a Django app, or a postgres database).

**Trait:** [TODO].

**Transformer:** a data transformation function. A transformer is used to enrich components with more data until it's ready to deploy using various drivers. Transformers are used to encode your platform's best-practices and turn the abstract data defined by the stack into a form existing tools can operate on.

**Driver:** used to create configuration files or interact directly with existing tools to porvision infrastructure.