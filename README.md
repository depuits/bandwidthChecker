# BandwidthChecker
A tool for checking your used and remaining bandwith provided by your provider.

## Creating new providers
Providers can be added in `lib\providers`. This must implement a function getting the provider config and must return an object with a `poll` function. The `poll` function must return a promise returning the bandwith info.

The data return by the `Checker` is the info retrieved by the provider. The `Checker` only fills in the lastUpdate field.

