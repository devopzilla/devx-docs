---
sidebar_position: 2
---

# Concepts

The goal is to be able to define developer-centric configurations using a single technology to run workloads in any envrionment (e.g. local, dev, staging, production) and using any vendor's offerings.

![illustration](./assets/illustration.png)

## Guiding principals

### Shift-left validation

Treat configurations as **strongly typed** and **immutable** data. Detect misconfigurations and unexpected behaviour as early as possible before the developer pushes code. Allow you to enforce security guardrails and internal best practices by encoding them as declarative [Traits](#definitions) and [Transformers](#definitions).

### Parity a-cross environments

Encourage workload definitions to be as similar as possible a-cross environments and push implementation details to the platform layer.

### Configuration as Data

Simplify infrastructure as code (IaC) by reverting to treating configurations written by developers as pure data. Configuration data defined by developers is then transformed by using [Transformers](#definitions) as simple data manipulation operations. We believe this speeds up developer on-boarding and makes debugging and detecting misconfigurations much easier at scale.

You can read more about configuration as data at the GoogleContainerTools KPT project spec [here](https://github.com/GoogleContainerTools/kpt/blob/main/docs/design-docs/06-config-as-data.md).


### Freedom to define abstractions

Allow developers and platform teams to define their own abstraction layers. There is no one-size fits all abstraction to meet every organization's needs, so we must allow internal developer platform standards to evolve like software.

## Definitions

**Stack:** a set of components and is how you define your workloads and its dependencies. A stack is a contract between developers and platform designers.

**Component:** represents a workload or a resource. A component has an id, a set of traits, labels, and fields. A component can be low level (e.g. an RDS instance, a helm chart, or a kubernetes resource) or as high level as you want (e.g. a Django app, or a postgres database).

**Trait:** represents a capability of a component and associated fields. You add a trait to a component to make use of the platform's capabilities, or define your own. Traits add fields to the component to allow it to be configure either by the developer, the platform team, or automatically by DevX (e.g. pull data from the environment or auto-generate secrets).

**Transformer:** a data transformation function. A transformer is used to enrich components with more data until it's ready to deploy using various drivers. Transformers are used to encode your platform's best-practices and turn the abstract data defined by the stack into a form existing tools can operate on.

**Driver:** used to create configuration files or interact directly with existing tools to porvision infrastructure.