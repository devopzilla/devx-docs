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
