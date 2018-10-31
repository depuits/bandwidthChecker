# BandwidthChecker
A tool for checking your used and remaining bandwidth provided by your internet service provider. The data is displayed in gigabytes and accessible through a rest or mqtt interface as configured in your config.

## Providers

### Scarlet
**Country:** Belgium
**Config:**

```javascript
{
	name: 'scarlet',
	username: 'username',
	password: 'password'
}
```

### Proximus
**Country:** Belgium
**Config:**
```javascript
{
	name: 'proximus',
	username: 'username',
	password: 'password'
}
```

### Creating new providers
Providers can be added in `lib\providers`. This must implement a function getting the provider config and must return an object with a `poll` function. The `poll` function must return a promise returning the bandwidth info.

```javascript
let bandwidthInfo = {
	used: 0, // Used bandwidth in gigabytes
	total: 0, // Total bandwidth available
	refreshDate: new Date() // Date when the used bandwidth resets
};
```

The data return by the `Checker` is the info retrieved by the provider. The `Checker` only fills in the lastUpdate field.

