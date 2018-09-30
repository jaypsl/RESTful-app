var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

app = new express();

//app configuration
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });
// mongoose.set('useCreateIndex', true);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//model configuration
var blogSchema = new mongoose.Schema({
title : String,
image : String,
body : String,
created : {type : Date, default:Date.now}
})

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
// title : 'test blog',
// image : 'https://unsplash.com/photos/AUYYJQZXArM',
// body : 'this is what developer needs'
// })

//restful routes
app.get('/', function(req,res){
    res.redirect('/blogs');
})

//index route
app.get('/blogs', function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){console.log('error happens')}
        else{res.render('index', {blogs:blogs});}
    })
});

//new route
app.get('/blogs/new', (req,res)=> {
res.render('new');
})
//create route
app.post('/blogs', (req,res)=> {
    //create blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log('===============');
    console.log(req.body);
    Blog.create(req.body.blog, (err,newBlog)=>{
        if(err){res.render('new')}
        else{res.redirect('/blogs')}
    })
    //then redirect
})

//show route
app.get('/blogs/:id', (req,res)=> {
    // res.send('show page');

    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('show', {blog : foundBlog})
        }
    })
});

//edit route

app.get('/blogs/:id/edit', (req,res) => {
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('edit', {blog : foundBlog})
        }
    })
})


//update route

app.put('/blogs/:id', (req,res)=> {
    // res.send('update route');
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,updateBlog)=> {
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs/' + req.params.id);
        }
    });
})


//delete route

app.delete('/blogs/:id', (req,res)=> {
    // res.send('u have reached delete route');
    //destroy blog and redirect somewhere
    Blog.findByIdAndRemove(req.params.id, (err)=> {
        if(err){res.redirect('/blogs')}
        else{res.redirect('/blogs')}
    });
})

app.listen(3000, function(){
    console.log('server is running')
})


