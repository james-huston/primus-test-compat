
describe('A Primus socket connection', function () {
  this.timeout(4000);
  var spark;

  beforeEach(function (done) {
    spark = Primus.connect(window.testing.endpoint, {
      transformer: window.testing.transformer
      // , websockets: false
    });

    spark.on('open', function () {
      console.log('connected', spark.version);
      setTimeout(function () {
        done();
      }, 1000);
    });
  });

  afterEach(function (done) {
    spark.on('end', function () {
      done();
    });

    spark.end();
  });

  it('should have connected', function (done) {
    if (spark && spark.readyState === 3) {
      return done();
    }

    done(new Error('invalid readystate'));
  });

  it('should handle multiple messages', function (done) {
    var responses = 0;
    var messages = 10;
    var interval;

    spark.on('data', function (data) {
      responses++;
      console.log('socket received', responses);

      if (data.direction !== 'out') {
        return done(new Error('invalid direction'));
      }

      if (responses === messages) {
        clearInterval(interval);
        done();
      }
    });

    var requests = 0;
    interval = setInterval(function () {
      requests++;

      if (requests <= messages) {
        console.log('socket send', requests);
        spark.write({
          direction: 'in',
          message: 'request ' + requests
        });
      } else {
        clearInterval(interval);
      }
    }, 100);
  });

  it('should get a message back', function (done) {
    spark.on('data', function (data) {
      if (data.direction !== 'out') {
        return done(new Error('invalid direction'));
      }

      done();
    });

    spark.write({
      direction: 'in',
      message: 'default send message'
    });
  });

  it('should get a message back a second time', function (done) {
    spark.on('data', function (data) {
      if (data.direction !== 'out') {
        return done(new Error('invalid direction'));
      }

      done();
    });

    spark.write({
      direction: 'in',
      message: 'default send message'
    });
  });

});
