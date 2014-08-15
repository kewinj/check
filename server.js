var connect = require('connect');
var parse = require('csv-parse');
var fs = require('fs');
var transform = require('stream-transform');
var cache = {};

function transformRecord(req, res, next) {
  	console.log(req.body);
  	console.log(req.files);

  	if(req.files.csv) {
	  	var parser = parse();
	  	var input = fs.createReadStream(req.files.csv.path);
	  	var transformer = transform(function(record, callback){
	  			callback(null, record.join('-') + '\n\n\n\n');
	  	}, {parallel: 10});
	  	input.pipe(parser).pipe(transformer).pipe(process.stdout);

	  	parser.on('error', function(err) {
	  		console.log(err.message);
	  	});

	  	parser.on('finish', function() {
	  		console.log('File read and transformed');
	  	});
	}
  	res.end('thanks!');
}

var app = connect()
  .use(connect.bodyParser())
  .use(transformRecord)
  .listen(3002);


