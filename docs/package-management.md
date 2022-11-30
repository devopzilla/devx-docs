---
sidebar_position: 6
---

# Package management

You can publish and share CUE packages directly through git repositories. Define your platform once and share it a-cross all your services
## Create a new package
Create a new repository to store your packages (you can host multiple packages in a repository).

```bash
pkg
└── domain.com
    └── package1
        ├── cue.mod
        |   └── module.cue # module: "domain.com/package1"
        └── file.cue
```

```cue title="pkg/domain.com/package1/cue.mod/module.cue"
module: "domain.com/package1"
```

## Add the package to `module.cue`
```cue
module: ""

packages: [
  "github.com/<org name>/<repo name>@<revision>/pkg/domain.com",
]		
```

## Private repositories (optional)

Add Git secrets to the environment
```bash
export GIT_USERNAME="username"
export GIT_PASSWORD="password"
```
or
```bash
export GIT_PRIVATE_KEY_FILE="path/to/key"
export GIT_PRIVATE_KEY_FILE_PASSWORD="password"
```

## Update packages
```bash
➜ devx project update
```
