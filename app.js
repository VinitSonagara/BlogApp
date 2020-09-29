const express = require("express");   
    app       = express();
    mongoose  = require("mongoose");
    methodOverride = require("method-override");

// App Config
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));    
app.use(methodOverride("_method"));

// MongoDb Connection
mongoose.connect("mongodb://localhost:27017/blog_data",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("CONNECTED TO DB!!");
})
.catch((error)=>{
    console.log(error.message);
});

// SCHEMA SETUP
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date,default:Date.now} 
});

const Blog = mongoose.model("Blog",blogSchema);


// Blog.create({
//     title:"Solar System",
//     image:"https://1.bp.blogspot.com/-cQJY3XSpjUQ/XpDB3gOHQoI/AAAAAAAAADg/SGW68g1y3a4PxqTVBW5uJTUQ6uiV8heIQCLcBGAsYHQ/s1600/Venus.jpg",
//     body:"Venus- The hotspot Venus is the second closest planet from the sun. Venus is the planet that we can see and observe by our nacked eyes. It is one of the brightest objects in the sky during the evening sky. It was named after the Roman goddess Venus, the goddess of love and beauty."    
// });


// RESTful Routes

// HOME PAGE
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",(req,res)=>{

    Blog.find({},(err,data)=>{
        if(err){
            console.log(err);
        }        
        else{
            res.render("index",{data:data});
        }
    });
});

// CREATE ROUTE
app.post("/blogs",(req,res)=>{
    // console.log(req.body.blog);
    Blog.create({
        title:req.body.blog.title,
        image:req.body.blog.image,
        body:req.body.blog.body    
    },(err,newBlog)=>{
        if(err){
            res.redirect("/new");
        }
        else{
            // console.log(newBlog);
            res.redirect("/blogs");
        }
    });
   
});

// NEW ROUTE
app.get("/blogs/new",(req,res)=>{
    res.render("form");
});

// SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id",(req,res)=>{
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

// DELTE ROUTE
app.get("/blogs/:id/delete",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,req.body,(err,deletedBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,()=>{
    console.log("SERVER STARTED!!");
});

