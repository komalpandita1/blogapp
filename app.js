var express = require("express"),
bodyparser =require("body-parser"),
app = express(),
mongoose = require("mongoose"),
expresssanitizer = require("express-sanitizer"),
methodoverride= require("method-override");

//app configuration
mongoose.connect("mongodb://localhost/restful_blogapp");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({useNewUrlParser: true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));

//Schema
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var blog =mongoose.model("blog", blogSchema);



//RESTful Routes
app.get("/",function(req,res){
    res.redirect("/blogs")
})


app.get("/blogs", function(req,res){
    blog.find({},function(err, blogs){
        if(err){
            console.log("error");
        } else {
            res.render("index", {blogs:blogs})
        }
    });
})
//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
})

app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    //create blogs
    blog.create(req.body.blog, function(err, newblog){
     if(err){
         res.render("new");
     } else {
         res.redirect("/blogs");
     }
    })
    
})

//Show route
app.get("/blogs/:id",function(req,res){
   blog.findById(req.params.id,function(err, foundblog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show",{blog: foundblog});
       }
   })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    blog.findById(req.params.id,function(err, foundblog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit" , {blog: foundblog});
        }
    })
})

//UPDATE ROUTES
app.put("/blogs/:id", function (req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedblog){
    if(err){
        res.redirect("/blogs");
    } else {
        res.redirect("/blogs/" + req.params.id);
    }
    })
})

//DESTROY ROUTE
app.delete("/blogs/:id", function(req,res){
    //destry blog
    blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT ||8080,process.env.IP,function(){
    console.log("the blogapp has started");
    });