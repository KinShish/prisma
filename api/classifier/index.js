const fs = require('fs');
const XLSX = require('xlsx')
const dir='../upload/'
const files = fs.readdirSync(dir);
const pdf2pic = require("pdf2pic");
const natural = require('natural');
const tokenizer = new natural.AggressiveTokenizerRu();
const tesseract =require('tesseract.js');
const worker = tesseract.createWorker();


let i=0;
const file={
	name:"",
	format:"",
	type:"",
	getType(){
		if(['xlsx','xlsm','xlsb','xls','ods','fods','csv','txt','sylk','html','dif','dbf','rtf','prn','eth'].includes(this.format)) return 'exel'
		return 'non'
	},
	setFile(fileName){
		this.name=fileName;
		this.format=fileName.split('.')[fileName.split('.').length-1];
		this.type=this.getType();
	}
}
const getTextPDF=async (dir,name)=>{
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
}
const getPicPDF=async (dir,name)=>{
	const options = {
		density: 100,
		saveFilename: "name",
		savePath: "./"+name,
		format: "png",
		width: 610,
		height: 891
	};
	const storeAsImage = pdf2pic.fromPath(dir+name, options);
	const pageToConvertAsImage = -1;
	await storeAsImage.bulk(pageToConvertAsImage)
}
const getTextIMG=async (dir)=>{
	const images = fs.readdirSync(dir);
	for(let i in images){
		await worker.load();
		await worker.loadLanguage('rus');
		await worker.initialize('rus');
		const { data: { text } } = await worker.recognize(dir+'/name.'+(i*1+1)+'.png');
		const regex = /\d\d\d\d\d\d\d\d\d\d/g;
		const matches = text.match(regex);
		if(matches)console.log(matches.filter((i, p)=>matches.indexOf(i)===p).map(i=>i.replace(/\"/g,'')*1));
		return classifierText(text)
	}
}
const classifierText=(text)=>{
	const arrayClassifier={
		//Устав_действующий
		charter:["Устав","Уставный капитал","Органы управления","Резервный фонд","Бюллетени"],

		//Положение о СД
		position:["Положение о совете директоров","Председатель совета директоров","Письменное мнение","Опросный лист","Уведомление о проведении Совета директоров"],

		buhReportingOne:["Бухгалтерский баланс","Форма по ОКУД 0710001","Актив","Пассив"],
		//форма 1-(Условие если месяц =12 размещение папка = год ==>4кв)
		//промежутночная форма 1-Дата (число,месяц,год) если месяц = 3 размещение папка = год ==>1кв и тп)

		buhReportingTwo:["Отчет о финансовых результатах","Форма по ОКУД 0710002","Чистая прибыль","Налог на прибыль"],
		//форма 2-Дата (число,месяц,год) (Условие если месяц =12 размещение папка = год ==>4кв)
		//промежуточная форма 2- Дата (число,месяц,год) если месяц = 3 размещение папка = год ==>1кв и тп)

		//Аудиторское заключение
		auditReport:["Аудиторское заключение","Сведения об аудируемом лице","Сведения об аудиторе","Основание для выражения мнения","Ответственность аудитора"],

		//Описание_деятельности_ГК
		descriptionActivision:["Презентация компании","История компании","Обзор рынка","Обзор компании"],

		//Решение_назначение ЕИО
		solution:["Протокол совета директоров","Дата составления протокола","Избрание генерального директора","назначение генерального директора", "Итоги голосования","Принятое решение"]
	}
	const textTokenizer=tokenizer.tokenize(text.toLowerCase()).join(" ");
	for(let key of arrayClassifier.position){
		if(textTokenizer.indexOf(tokenizer.tokenize(key.toLowerCase()).join(" "))>-1) return "position"
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
				const regex = /\"\d\d\d\d\d\d\d\d\d\d\"/g;
				const matches = data.match(regex);
				if(matches)console.log(matches.filter((i, p)=>matches.indexOf(i)===p).map(i=>i.replace(/\"/g,'')*1));
				break
			default:
				if (!fs.existsSync("./"+name)) {
					fs.mkdirSync("./"+name);
				}
				await getPicPDF(dir,name)
				console.log(name,await getTextIMG("./"+name))
				break;
		}
	}
	await worker.terminate();
}
start(files)

