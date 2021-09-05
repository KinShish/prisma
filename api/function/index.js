const fs = require('fs');
const loadFile= async (req,files)=>{
	let path='';
	const array_name=[];
	let dir = "./upload";
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	try {
		for(let file of files){
			const name=encodeURI(file.hapi.filename)
			array_name.push(name)
			const writer = fs.createWriteStream(dir+'/'+name)
			file.pipe(writer)
			await new Promise((resolve, reject) => {
				writer.on('finish', resolve)
				writer.on('error', reject)
			})
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
module.exports={loadFile}