let express     = require('express'),
    app         = express(),
    path        = require('path'),
    session     = require('express-session'),
    body_parser = require('body-parser'),
    mongoose    = require('mongoose');

app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(session({
    secret: '^P%mUWCwF4hWAhtgUb8BrRqWPuR$%4w^@FSB3j*VfumMEJB8SPpr57%aqRmsEyHGhJKcvgu9#W&5ZvUrCZ*q4c%8^A9RJ49@Mf3X',
    proxy: true,
    resave: false,
    saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/quotes', function() {
    console.log(mongoose.connection.readyState + ' ' + "1 = connected");
});
mongoose.Promise = global.Promise;
var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quote: {type: String, required: true}
}, {timestamps: true});
mongoose.model('Quotes', QuoteSchema);
var Quotes = mongoose.model('Quotes');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/quotes', (req, res) => {
    Quotes.find({}, function(err, quotes){
        if (err) {
            console.log('There are errors');
        } else {
            res.render('quotes', {quotes: quotes});
            }
        });
    });
app.post('/quotes', (req, res) => {
    var quote = new Quotes(req.body)
    quote.save(function(error, quote){
        if(error){
            console.log('error')
            res.render('index', error)
        }
        else{
            res.redirect('quotes');
        }
    });
});

// Other routes

let server = app.listen(6789, () => {
    console.log("listening on port 6789");
});
// io.sockets.on('connection', function (socket) {
//     console.log("Client/socket is connected!");
//     console.log("Client/socket id is: ", socket.id);
// });