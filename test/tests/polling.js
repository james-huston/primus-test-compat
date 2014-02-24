
describe('A Primus polling connection', function () {
  var spark;

  beforeEach(function (done) {
    spark = Primus.connect({
      url: 'http://echobox.articulate.io:3000',
      transformer: 'engine.io',
      websockets: false
    });

    spark.on('open', function () {
      console.log('connected');
      setTimeout(function () {
        done();
      }, 100);
    });
  });

  afterEach(function (done) {
    spark.on('end', function () {
      console.log('disconnected');
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

  it('should handle multiple messages', function (done) {
    var responses = 0;
    var interval;

    spark.on('data', function (data) {
      responses++;
      if (data.direction !== 'out') {
        return done(new Error('invalid direction'));
      }

      if (responses === 10) {
        clearInterval(interval);
        done();
      }
    });

    var requests = 0;
    interval = setInterval(function () {
      requests++;

      if (requests <= 10) {
        spark.write({
          direction: 'in',
          message: 'request ' + requests
        });
      } else {
        clearInterval(interval);
      }
    }, 50);
  });
});
