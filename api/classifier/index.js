const fs = require('fs');
const XLSX = require('xlsx')
const dir='./upload/'
//const files = fs.readdirSync(dir);
const natural = require('natural');
const tokenizer = new natural.AggressiveTokenizerRu();
const tesseract =require('node-tesseract-ocr');
const pdf2image = require('pdf2image');
const rp = require('request-promise-native');
const redis=require('redis')
const clientR = redis.createClient();
let configClassifier=require('./classifierConfig.json')

const loadRedis=async (key)=>{
	return new Promise((res)=>{
		clientR.get(key, async function (err,data){
			if(data) res(data)
			else{
				const obj=await rp({method: 'GET',url: key}).then((body) => {
					return JSON.parse(body);
				})
				clientR.set(key, JSON.stringify(obj));
				res(obj)
			}
		});
	})

}
const normalize=(text)=>{
	const textTokenizer=tokenizer.tokenize(text.toLowerCase());
	const words=textTokenizer.reduce((a,b)=>{
		if(/^[а-яё\-]+$/.test(b)){
			const stem=natural.PorterStemmerRu.stem(b)
			if(stem&&!a.includes(stem))a.push(stem)
		}
		return a
	},[])
	return words.join(" ")
}

require('events').EventEmitter.defaultMaxListeners = 25
const companys= {
	array: require('./company.json'),
	async addCompany(inn) {
		if (Object.keys(this.array).includes(inn.toString())) {
			//пока ни чего не делаем
			return inn
		} else {
			if(inn===1650032058){
				this.array[inn] = {
					name: "ПАО \"КАМАЗ\"",
					nameAll: "ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО \"КАМАЗ\"",
					files: {}
				}
				return 1650032058
			}
			if(inn===2315014748){
				this.array[inn] = {
					name: "ПАО \"НКХП\"",
					nameAll: "ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО \"НОВОРОССИЙСКИЙ КОМБИНАТ ХЛЕБОПРОДУКТОВ\"",
					files: {}
				}
				return 2315014748
			}
			if(inn==='error'){

				this.array[inn] = {
					name: "Указаны данные из разных компаний",
					nameAll: "",
					files: {}
				}
				return 'error'
			}
			if(inn==='none'){
				this.array[inn] = {
					name: "Неопределенная компания",
					nameAll: "",
					files: {}
				}
				return 'none'
			}
			/*const text = await loadRedis('https://api-fns.ru/api/egr?req=' + inn + '&key=33d53d3eaf0330b5376ce4e9bd5630397304237a')
			if (text&&text.items[0]){
				this.array[inn] = {
					name: text.items[0]["ЮЛ"]["НаимСокрЮЛ"],
					nameAll: text.items[0]["ЮЛ"]["НаимПолнЮЛ"],
					files: {}
				}
				return inn
			}*/
			return '0'
		}
	},
	addFile(inn, name, type,date) {
		if(inn==='error'){
			for(let inn of Object.keys(this.array)){
				let delKey=''
				for(let key of Object.keys(this.array[inn].files)){
					if(this.array[inn].files[key].oldName===name){
						delKey=key
						break
					}
				}
				if(delKey!=='')this.array[inn].files.splice(delKey,1)
			}
			if(this.array[inn].files['000']===undefined)this.array[inn].files['000']=[]
			this.array[inn].files['000'].push({name:name, type,oldName:name,date:date})
		}else{
			const format=name.split('.')[name.split('.').length-1];
			const classifier=configClassifier.filter(c=>c.name===type)[0]
			if(this.array[inn].files[classifier.key]===undefined)this.array[inn].files[classifier.key]=[]
			if(this.array[inn].files[classifier.key].filter(f=>f.oldName!==name).length===0){
				this.array[inn].files[classifier.key].push({name:classifier.fileName+'.'+format, type,oldName:name,date:date})
			}
		}
	},
	save() {
		fs.writeFileSync('./company.json', JSON.stringify(this.array))
	},
	createDir(){
		Object.keys(this.array).forEach(inn=>{
			const dir="./end/"+this.array[inn].name.replace(/\"/g,'')+" "+inn;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			Object.keys(this.array[inn].files).forEach(f=>{
				this.array[inn].files[f].forEach(file=>{
					const classifier=configClassifier.filter(c=>c.name===file.type)[0]
					let level=dir;
					if(classifier.length===0)level+='/Не верифицированные документы'
					classifier.level.forEach(l=>{
						switch (l){
							case "ГОД":
								if(file.date.year)level+='/'+Math.max(...file.date.year);
								else level+='/ГОД';
								break
							case "Х Квартал":
								level+='/'+Math.floor(Math.max(...file.date.month)/4)+" Квартал";
								break
							default:
								level+='/'+l;
								break
						}
						if (!fs.existsSync(level)) {
							fs.mkdirSync(level);
						}
					})
					this.array[inn].files[f].path=level+'/'+file.name;
					fs.writeFileSync(level+'/'+file.name,
						fs.readFileSync("./upload/"+file.oldName))
				})
			})
		})
	},
	async sendAPI(path,documentNomenclatureId,inn,unrecognised){
		try{
			const req=await rp({
				method: 'POST',
				url: "http://elib-hackathon.psb.netintel.ru/elib/api/service/documents",
				json: true,
				formData:{
					attachments:fs.createReadStream(path),
					createRequest:unrecognised?"{\"unrecognised\":"+unrecognised+"}":"{\"documentNomenclatureId\":\""+documentNomenclatureId+"\",\"inn\":\""+inn+"\",\"unrecognised\":"+unrecognised+"}",
				},
				headers:{
					'Authorization': 'Basic V3VhbGJlcml0Old1YWxiZXJpdDkxaQ==',
					//'Content-type': 'multipart/form-data'
				}
			}).then((body) => {
				return body;
			}).catch(e=>{
				console.log(e)
			})
			console.log(req)
		}catch (e){
			console.log(e)
		}

	}
}

let i=0;
const file={
	name:"",
	format:"",
	type:"",
	getType(){
		if(['xlsx','xlsm','xlsb','xls','ods','fods','csv','txt','sylk','html','dif','dbf','rtf','prn','eth'].includes(this.format)) return 'exel'
		if(['pdf'].includes(this.format)) return 'pdf'
		return 'non'
	},
	setFile(fileName){
		this.name=fileName;
		this.format=fileName.split('.')[fileName.split('.').length-1];
		this.type=this.getType();
	}
}
const getPicPDF=async (dir,name,outDir)=>{
	const converter = pdf2image.compileConverter({
		density : 200,
		quality : 100,
		outputFormat : './'+outDir+'/name.%d',
		outputType : 'png',
		pages : '1'
	});
	await converter.convertPDF("./upload/"+name);
}
const recognize=(file,lang)=>{
	return tesseract.recognize(file,{lang:lang,oem: 1,psm: 3,}).then((text)=>{
		return text;
	})
}
const searchInn=async (regex,text)=>{
	let i ='0'
	let innSearch = text.match(regex);
	if(innSearch){
		innSearch=innSearch.filter((i, p)=>innSearch.indexOf(i)===p).map(i=>i.replace(/\"/g,'')*1)
		for(let inn of innSearch){
			i=await companys.addCompany(inn)
			if(i!=='0')return i
		}
	}
	return i
}
const searchNameCompany=(text,i)=>{
	for(let inn of Object.keys(companys.array)){
		if(inn!=='none'&&inn!=='error') {
			const important=companys.array[inn].name.split('\"')[1]
			const importantAll=companys.array[inn].nameAll.split('\"')[1]
			if(normalize(text).indexOf(normalize(companys.array[inn].name))>-1||
				normalize(text).indexOf(normalize(companys.array[inn].nameAll))>-1||
				normalize(text).indexOf(normalize(important))>-1||
				normalize(text).indexOf(normalize(importantAll))>-1) return inn
		}
	}
	return '0'

}
const getTextIMG=async (dir,name)=>{
	const images = fs.readdirSync(dir);
	for(let i in images){
		const text=await recognize(dir+'/name.'+(i*1+1)+'.png','rus')
		const inn=await searchInn(/\d{10}/g,text)
		const classifier=classifierText(text)
		const date=await searchMonthYear(text,classifier)
		const innName=await searchNameCompany(text.toLowerCase())
		await searchBug(inn.toString(),innName.toString(),classifier,name,date)
	}
}
const classifierText=(text)=>{
	for(let i in configClassifier){
		for(let key of configClassifier[i].classifier){
			if(normalize(text).indexOf(" "+normalize(key)+" ")>-1
				||(normalize(text).indexOf(normalize(key))>-1&&key.split(" ").length>1)) return configClassifier[i].name
		}
	}
	return "none"
}
const searchInnAll=async (files)=>{
	for(let name of files){
		file.setFile(name)
		let data="";
		switch (file.type){
			case 'exel':
				data = XLSX.readFile(dir+name);
				data=JSON.stringify(data)
				await searchInn(/\"\d{10}"/g,data)
				break
			case 'pdf':
				if (!fs.existsSync("./"+i)) {
					fs.mkdirSync("./"+i);
				}
				await getPicPDF(dir,name,i)
				const images = fs.readdirSync("./"+i);
				for(let i in images){
					const text=await recognize("./"+i+'/name.'+(i*1+1)+'.png','rus')
					await searchInn(/\d{10}/g,text)
				}
				break;
		}
	}
}
const searchBug=async (inn,innName,classifier,name,date)=>{
	if(inn!=='0'){
		if(inn!==innName&&innName!=='0'){
			await companys.addCompany('error')
			companys.addFile('error',name,classifier,date)
		}else{
			companys.addFile(inn,name,classifier,date)
		}
	}else{
		if(innName!=='0'){
			companys.addFile(innName,name,classifier,date)
		}else{
			await companys.addCompany('none')
			companys.addFile('none', name, classifier,date)
		}
	}
}
const searchMonthYear=async (text,classifier)=>{
	if(configClassifier.filter(c=>c.name===classifier)[0].type===1){
		const array=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
		const month=[]
		let year=text.match(/\s\d{4}\s/g);
		if(year)year=year.filter(y=>y*1<=new Date().getFullYear())
		array.forEach((m,i)=>{
			if(normalize(text).indexOf(" "+normalize(m))>-1) month.push(i+1)
		})
		return {month:month,year:year}
	}
	return undefined;
}
const start=async (files)=>{
	configClassifier=JSON.parse(fs.readFileSync('./classifier/classifierConfig.json'))
	companys.array={}
	await searchInnAll(files)
	for(let name of files){
		i++
		file.setFile(name)
		let data="";
		switch (file.type){
			case 'exel':
				data = XLSX.readFile(dir+name);
				for(let sheet of Object.keys(data.Sheets)){
					const text=JSON.stringify(data.Sheets[sheet])
					const inn=await searchInn(/\"\d{10}\"/g,text)
					const classifier=classifierText(text)
					const date=await searchMonthYear(text,classifier)
					const innName=await searchNameCompany(text.toLowerCase(),1)
					await searchBug(inn.toString(),innName.toString(),classifier,name,date)
				}
				break
			case 'pdf':
				if (!fs.existsSync("./"+i)) {
					fs.mkdirSync("./"+i);
				}
				await getPicPDF(dir,name,i)
				await getTextIMG("./"+i,name)
				break;
			default:
				await companys.addCompany('none')
				companys.addFile('none', name, 'none')
				break;
		}
	}
	companys.createDir()
	//console.log(companys)
	companys.save();
	for(let inn of Object.keys(companys.array)){
		for(let key of Object.keys(companys.array[inn].files)){
			await companys.sendAPI(companys.array[inn].files[key].path,key,inn,inn==='none'||inn==='error'?true:false)
		}
	}
	return companys.array;
	//process.exit(1);
	//await worker.terminate();
}
//start(files)q
//companys.sendAPI()
module.exports.start = start;

