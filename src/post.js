
/** Post.js **/ 


var Post = function(data){
	this.data = data;
}


Post.prototype.data {}

Post.prototype.changeTitle = function(title){
	this.data.title = title;
}


Post.findbyId = function(id,callback){
	db.get('posts',{id:id}.run(function(err,data))){
		if(err) return callback(err);
		callback(null, new Post(data));
	});
}



module.export = Post;