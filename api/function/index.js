const fs = require('fs');
const loadImg= async (req,files)=>{
	let name='',path='';
	const array_name=[];
	let dir = "./upload/company/";
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	try {
		for(let file of files){
			console.log(file)
			name=new Date().getTime()+array_name.length+".jpg";
			array_name.push(name)
			await Promise.all([file.pipe(fs.createWriteStream(dir + "/"+name))])
		}
		return {err:false, text:"Файлы загружены",array_name}
	}catch (err) {
		console.log(err);
		if(path){
			if(fs.existsSync(path)) {
				fs.unlinkSync(path);
			}
		}
		return {err:true,text:"Произошла ошибка при подключении к базе данных, повторите попытку позже"}
	}
}
module.exports={loadImg}