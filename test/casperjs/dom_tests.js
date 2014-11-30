/*jshint strict:false*/
/*global CasperError, casper, console, phantom, require*/
casper.test.begin('Shuttle Tests', 2, function(test) {
    casper.start('http://localhost:9000', function() {

        test.assertTitle('Shuttle', 'Page has the correct title');

        test.assertEval(function(){
        	return __utils__.findAll('tr').length > 0;
        }, 'app is displaying at least one row of data');
        
    });

    casper.run(function() {
        test.done();
    });
});