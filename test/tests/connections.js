
describe.skip('Dealing with fast connect/disconnect', function () {

  it('should deal with 10 on a 1 second delay using polling',
  function (done) {
    this.timeout(35000);

    var connectionCount = 0;
    var maxConnections = 10;
    var responses = 0;

    function connect() {
      var spark;
      spark = Primus.connect(window.testing.endpoint, {
        transformer: 'engine.io',
        websockets: false
      });

      spark.on('data', function (data) {
        if (data.direction === 'out') {
          console.log('response');
          responses++;
        }
      });

      spark.on('open', function () {
        connectionCount++;
        console.log(
          'connected(' + connectionCount + ')',
          spark.version
        );

        spark.write({
          direction: 'in',
          message: 'connection test #1'
        });

        setTimeout(function () {
          spark.end();
        }, 1000);
      });

      spark.on('end', function () {
        if (connectionCount <= maxConnections) {
          connect();
        } else {
          if (responses !== connectionCount) {
            return done(new Error('responses dont match connections'));
          }
          done();
        }
      });
    }

    connect();
  });

  it('should deal with 10 on a 1 second delay using websockets',
  function (done) {
    this.timeout(15000);

    var connectionCount = 0;
    var maxConnections = 10;
    var responses = 0;

    function connect() {
      var spark;
      spark = Primus.connect(window.testing.endpoint, {
        transformer: 'engine.io'
      });

      spark.on('data', function (data) {
        if (data.direction === 'out') {
          console.log('response');
          responses++;
        }
      });

      spark.on('open', function () {
        connectionCount++;
        console.log(
          'connected(' + connectionCount + ')',
          spark.version
        );

        spark.write({
          direction: 'in',
          message: 'connection test #1'
        });

        setTimeout(function () {
          spark.end();
        }, 1000);
      });

      spark.on('end', function () {
        if (connectionCount <= maxConnections) {
          connect();
        } else {
          if (responses !== connectionCount) {
            return done(new Error('responses dont match connections'));
          }
          done();
        }
      });
    }

    connect();
  });

});
