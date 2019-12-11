# ferret

> A tool for open source feeding.

| Component | Function                                       |
| --------- | ---------------------------------------------- |
| Client    | The frontend react app                         |
| Server    | The backend/API                                |
| Worker    | Watcher process which processes the work queue |
| Common    | Shared code, mostly model types                |

## Developing

All the components of `ferret` are written in typescript which hopefully makes this easier. I prefer to use `yarn` because it has emojis. If you want to use the shipped lock files I suggest you use `yarn` too.

### Common

I recommmend you pop into `common` and run `yarn link`, then visit each of the other components and run `yarn link @guardian/ferret-common` - this will make developing common code easier.
