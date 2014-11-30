/*jshint strict:false*/
/*global CasperError, casper, console, phantom, require*/
casper.test.begin('Shuttle Tests', 1, function(test) {
    casper.start('http://localhost:9000', function() {
        test.assertTitle('Shuttle');
    });

    casper.run(function() {
        test.done();
    });
});