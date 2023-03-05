# base64-lite

Smallest/simplest possible means of using atob with both Node and browserify.

``` javascript
var base64 = require('base64-lite');
var encoded = base64.btoa('hello world') -> 'aGVsbG8gd29ybGQ='
var decoded = base64.atob('aGVsbG8gd29ybGQ=') -> 'hello world'
```

## License

MIT. See [LICENSE.md](http://github.com/hughsk/atob-lite/blob/master/LICENSE.md) for details.
