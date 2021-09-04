const fs = require('fs');
const XLSX = require('xlsx')
const dir='../upload/'
const files = fs.readdirSync(dir);
const pdf2pic = require("pdf2pic");
const natural = require('natural');
const tokenizer = new natural.AggressiveTokenizerRu();
const tesseract =require('node-tesseract-ocr');
const pdf2image = require('pdf2image');
const rp = require('request-promise-native');

require('events').EventEmitter.defaultMaxListeners = 25
const companys= {
	array: require('./company.json'),
	async addCompany(inn) {
		if (Object.keys(this.array).includes(inn.toString())) {
			//пока ни чего не делаем
			return inn
		} else {
			const text = await rp({
				method: 'GET',
				url: 'https://api-fns.ru/api/egr?req=' + inn + '&key=37e6ecfa03ece78f0d7ac02d460ede642dda4906'
			}).then((body) => {
				return JSON.parse(body);
			})
			if (text.items[0]){
				this.array[inn] = {
					name: text.items[0]["ЮЛ"]["НаимСокрЮЛ"],
					nameAll: text.items[0]["ЮЛ"]["НаимПолнЮЛ"],
					files: {}
				}
				return inn
			}
			return '0'
		}
	},
	addFile(inn, name, type) {
		const format=name.split('.')[name.split('.').length-1]
		switch (type){
			case 'charter':
				if(this.array[inn].files['33a37ce4-c6a9-4dad-8424-707abd47c125']===undefined)this.array[inn].files['33a37ce4-c6a9-4dad-8424-707abd47c125']=[]
				this.array[inn].files['33a37ce4-c6a9-4dad-8424-707abd47c125'].push({name:'Устав_действующий.'+format, type,oldName:name})
				break
			case 'position':
				if(this.array[inn].files['555ced1c-c169-4d61-9a82-348801494581']===undefined)this.array[inn].files['555ced1c-c169-4d61-9a82-348801494581']=[]
				this.array[inn].files['555ced1c-c169-4d61-9a82-348801494581'].push({name:'Положение о СД.'+format, type,oldName:name})
				break
			case 'buhReportingOne':
				if(this.array[inn].files['4f501f4a-c665-4cc8-9715-6ed26e7819f2']===undefined)this.array[inn].files['4f501f4a-c665-4cc8-9715-6ed26e7819f2']=[]
				this.array[inn].files['4f501f4a-c665-4cc8-9715-6ed26e7819f2'].push({name:'Бухгалтерская отчетность_форма 1.'+format, type,oldName:name})
				// для промежуточной 2e321818-4571-43ae-9e08-2ade54b83e14 Бухгалтерская отчетность_форма 1 _промежуточная
				break
			case 'buhReportingTwo':
				if(this.array[inn].files['cabd193c-f9a9-4a9c-a4ae-80f0347adf40']===undefined)this.array[inn].files['cabd193c-f9a9-4a9c-a4ae-80f0347adf40']=[]
				this.array[inn].files['cabd193c-f9a9-4a9c-a4ae-80f0347adf40'].push({name:'Бухгалтерская отчетность_форма 2.'+format, type,oldName:name})
				break
			// для промежуточной 3b4f4647-f755-4100-bd63-059627107919 Бухгалтерская отчетность_форма 2 _промежуточная
			case 'auditReport':
				if(this.array[inn].files['16f35ccc-b90f-4731-8178-11f3e0e3ca20']===undefined)this.array[inn].files['16f35ccc-b90f-4731-8178-11f3e0e3ca20']=[]
				this.array[inn].files['16f35ccc-b90f-4731-8178-11f3e0e3ca20'].push({name:'Аудиторское заключение.'+format, type,oldName:name})
				break
			case 'descriptionActivision':
				if(this.array[inn].files['a397c2cf-c5ad-4560-bc65-db4f79840f82']===undefined)this.array[inn].files['a397c2cf-c5ad-4560-bc65-db4f79840f82']=[]
				this.array[inn].files['a397c2cf-c5ad-4560-bc65-db4f79840f82'].push({name:'Описание_деятельности_ГК.'+format, type,oldName:name})
				break
			case 'solution':
				if(this.array[inn].files['3af37c7f-d8b1-46de-98cc-683b0ffb3513']===undefined)this.array[inn].files['3af37c7f-d8b1-46de-98cc-683b0ffb3513']=[]
				this.array[inn].files['3af37c7f-d8b1-46de-98cc-683b0ffb3513'].push({name:'Решение_назначение ЕИО.'+format, type,oldName:name})
				break
		}

	},
	save() {
		fs.writeFileSync('./company.json', JSON.stringify(this.array))
	},
	createDir(){
		Object.keys(this.array).forEach(inn=>{
			const dir="../end/"+this.array[inn].name.replace(/\"/g,'')+" "+inn;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			Object.keys(this.array[inn].files).forEach(f=>{
				this.array[inn].files[f].forEach(file=>{
					switch (file.type){
						case 'charter':
							if (!fs.existsSync(dir+'/Досье по ЮЛ')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Юридическое досье')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Юридическое досье');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Юридическое досье/Учредительные и иные внутренние документы (положения)')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Юридическое досье/Учредительные и иные внутренние документы (положения)');
							}
							fs.writeFileSync(dir+'/Досье по ЮЛ/Юридическое досье/Учредительные и иные внутренние документы (положения)/'+f.name,fs.readFileSync(f.oldName))
							break
						case 'position':
							if (!fs.existsSync(dir+'/Досье по ЮЛ')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Юридическое досье')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Юридическое досье');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Юридическое досье/Учредительные и иные внутренние документы (положения)')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Юридическое досье/Учредительные и иные внутренние документы (положения)');
							}
							fs.writeFileSync(dir+'/Досье по ЮЛ/Юридическое досье/Учредительные и иные внутренние документы (положения)/'+f.name,fs.readFileSync(f.oldName))
							break
						case 'buhReportingOne':
							if (!fs.existsSync(dir+'/Досье по ЮЛ')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность');
							}
							fs.writeFileSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность/'+f.name,fs.readFileSync(f.oldName))
							break
						case 'buhReportingTwo':
							if (!fs.existsSync(dir+'/Досье по ЮЛ')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность');
							}
							fs.writeFileSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность/'+f.name,fs.readFileSync(f.oldName))
							break
						case 'auditReport':
							if (!fs.existsSync(dir+'/Досье по ЮЛ')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность');
							}
							fs.writeFileSync(dir+'/Досье по ЮЛ/Финансовое досье/ГОД/Х Квартал/Бухгалтерская отчетность/'+f.name,fs.readFileSync(f.oldName))
							break
						case 'descriptionActivision':
							if (!fs.existsSync(dir+'/Досье по ГК')) {
								fs.mkdirSync(dir+'/Досье по ГК');
							}
							if (!fs.existsSync(dir+'/Досье по ГК/Описание бизнеса')) {
								fs.mkdirSync(dir+'/Досье по ГК/Описание бизнеса');
							}
							fs.writeFileSync(dir+'/Досье по ГК/Описание бизнеса/'+f.name,fs.readFileSync(f.oldName))
							break
						case 'solution':
							if (!fs.existsSync(dir+'/Досье по ЮЛ')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Юридическое досье')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Юридическое досье');
							}
							if (!fs.existsSync(dir+'/Досье по ЮЛ/Юридическое досье/Документы, подтверждающие полномочия на совершение сделки')) {
								fs.mkdirSync(dir+'/Досье по ЮЛ/Юридическое досье/Документы, подтверждающие полномочия на совершение сделки');
							}
							fs.writeFileSync(dir+'/Досье по ЮЛ/Юридическое досье/Документы, подтверждающие полномочия на совершение сделки/'+f.name,fs.readFileSync(f.oldName))
							break
					}
				})
			})

		})
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
/*const getTextPDF=async (dir,name)=>{
	await new Promise((res)=>{
		let pdfParser = new PDFParser(this,1);

		pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
		pdfParser.on("pdfParser_dataReady", pdfData => {
			fs.writeFileSync(name+".txt", pdfParser.getRawTextContent());
			res('load')
		});
		console.log(name)
		pdfParser.loadPDF(dir+name);
	})
}*/
const getPicPDF=async (dir,name,outDir)=>{
	const converter = pdf2image.compileConverter({
		density : 200,
		quality : 100,
		outputFormat : './'+outDir+'/name.%d',
		outputType : 'png',
		pages : '1'
	});
	await converter.convertPDF(dir+name);
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
const searchNameCompany=(regex,text)=>{
	const innSearch = text.match(regex);
	if(innSearch){
		innSearch.filter((i, p)=>innSearch.indexOf(i)===p).map(i=>i.replace(/\"/g,'')*1).forEach(m=>{
			companys.addCompany(m)
		})
	}
}
const getTextIMG=async (dir,name)=>{
	const images = fs.readdirSync(dir);
	for(let i in images){
		const text=await recognize(dir+'/name.'+(i*1+1)+'.png','rus')
		const inn=await searchInn(/\d\d\d\d\d\d\d\d\d\d/g,text)
		const classifier=classifierText(text)
		if(inn!=='0'){
			companys.addFile(inn,name,classifier,'loh')
		}
	}
}
const classifierText=(text)=>{
	const arrayClassifier={
		//Устав_действующий
		charter:['устав','уставн капита','орга управлен','резервн фонд','бюллетен'],
		//Положение о СД
		position:['положен совет директор','председател совет директор','письмен мнен','опросн лист','уведомлен проведен совет директор'],
		//форма 1-(Условие если месяц =12 размещение папка = год ==>4кв)
		//промежутночная форма 1-Дата (число,месяц,год) если месяц = 3 размещение папка = год ==>1кв и тп)
		buhReportingOne:['бухгалтерск баланс','форм окуд','пасс'],
		//форма 2-Дата (число,месяц,год) (Условие если месяц =12 размещение папка = год ==>4кв)
		//промежуточная форма 2- Дата (число,месяц,год) если месяц = 3 размещение папка = год ==>1кв и тп)
		buhReportingTwo:['отчет финансов результат','форм окуд','чист прибыл','налог прибыл'],
		//Аудиторское заключение
		auditReport:['аудиторск заключен','сведен аудируем','сведен аудитор','основан выражен мнен','ответствен аудитор'],
		//Описание_деятельности_ГК
		descriptionActivision:['презентац компан','истор компан','обзор рынк','обзор компан'],
		//Решение_назначение ЕИО
		solution:['протокол совет директор','составлен протокол','избран генеральн директор','назначен генеральн директор','итог голосован','принят решен']
	}
	const textTokenizer=tokenizer.tokenize(text.toLowerCase());
	const words=textTokenizer.reduce((a,b)=>{
		if(/^[а-яё\-]+$/.test(b)){
			const stem=natural.PorterStemmerRu.stem(b)
			if(stem&&stem.length>3&&!a.includes(stem))a.push(stem)
		}
		return a
	},[])
	for(let ka of Object.keys(arrayClassifier)){
		for(let key of arrayClassifier[ka]){
			if(words.join(' ').indexOf(key)>-1) return ka
		}
	}
	return "none"
}
const start=async (files)=>{
	for(let name of files){
		i++
		file.setFile(name)
		let data="";
		switch (file.type){
			case 'exel':
				data = XLSX.readFile(dir+name);
				data=JSON.stringify(data)
				const inn=await searchInn(/\"\d\d\d\d\d\d\d\d\d\d\"/g,data)
				const classifier=classifierText(data)
				if(inn!=='0'){
					companys.addFile(inn,name,classifier,'loh')
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
				console.log('none')
				break;
		}
	}
	companys.createDir()
	companys.save();
	//await worker.terminate();
}
start(files)

