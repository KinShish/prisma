<template lang="pug">
	.mainBlock
		.logoBlock
			img(src="./assets/logo.svg")
		b-form-file#fileUpload.d-none(@input="$_uploadFile(files)" multiple v-model="files"
			accept=".xlsm,.xlsb,.xls,.ods,.fods,.csv,.txt,.sylk,.html,.dif,.dbf,.rtf,.prn,.eth,.pdf")
		transition(mode="out-in" name="opacity")
			div(v-if="step" key="1")
				h1.title {{load?'Идет загрузка':'Загрузите файлы для анализа и классификации'}}
				transition(name="opacity" mode="out-in")
					.blockLoad(v-if="!load")
						label.uploadFileLabel(for="fileUpload") Загрузить файл
						.settings(@click="$refs.settings.show()") Настройки
					.blockSpiner(v-else)
						b-spinner
			div(v-else key="2")
				h1.title Результат работы
					b PriSma
				.resultBlock
					span
						.innerBlock Всего загружено
							b {{countLoaded}}
						.innerBlock Распознано
							b {{countUploaded}}
						.innerBlock Не распознано
							b {{noneCompany.length}}
							.btnInfo(@click="$refs.modalErr.show()" v-if="noneCompany.length") Подробнее
						.innerBlock(v-if="resultFiles['error']!==undefined") Ошибки
							b {{resultFiles['error'].countSucess}}
							.btnInfo(@click="$refs.modalErrTo.show()" v-if="noneCompany.length") Подробнее
					.blockCompany
						.company(v-for="(company,index) in resultFiles")
							span(v-if="index!=='none'&&index!=='error'")
								.headerBlock
									.name Имя компании: {{company.name}}
									.name(v-if="company.nameAll") Полное имя компании: {{company.nameAll}}
									div ИНН: {{index}}
									.blockVerif Проверено по базам ФНС
								.innerBlock Классифицировано
									b {{company.countSucess}}
									.btnInfo(@click="$_selectCompany(index)") Подробнее
					span(v-if="!load")
						.uploadAfter(@click="$_clearAll") Начать заново
						.settings(@click="$refs.settings.show()") Настройки
					.blockSpiner(v-else)
						b-spinner
		b-modal(hide-footer hide-header centered ref="modalErrTo" size="lg")
			.modalContent(v-if="resultFiles['error']!==undefined")
				h3 {{resultFiles['error'].name}}
				span(v-for="(item,index) in resultFiles['error'].files")
					.fileBlockInfo(v-for="file in resultFiles['error'].files[index]") {{decodeURI(file.name)}}
				.btnModal(@click="$refs.modalErrTo.hide()") Закрыть
		b-modal(hide-footer hide-header centered ref="modalErr" size="lg")
			.modalContent
				h3 Не распознаные файлы
				.fileBlockInfo(v-for="(item,index) in noneCompany.files") {{index+1}}. {{item[0].name}}
					small Прежнее название: {{decodeURI(item[0].oldName)}}
				.btnModal(@click="$refs.modalErr.hide()") Закрыть
		b-modal(hide-footer hide-header centered ref="modalSex"  size="lg" no-close-on-backdrop no-close-on-esc)
			.modalContent
				h3 Классифицированные файлы {{selectCompany.name}}
				span(v-for="(item,index) in selectCompany.files")
					.fileBlockInfo(v-for="file in selectCompany.files[index]") {{file.name}}
						small Прежнее название: {{decodeURI(file.oldName)}}
				.btnModal(@click="$_selectCompany(0)") Закрыть
		b-modal(hide-footer hide-header centered ref="settings"  size="lg" no-close-on-backdrop no-close-on-esc)
			.modalContent(v-if="settings")
				h3 Настройки классификатора
				.blockSettings(v-for="(item,index) in settings")
					.titleSetting {{item.fileName}}
					.titleSetting Внутрений ключ файла:
					input(v-model="item.key")
					.titleSetting Уровни папок:
					.itemSettings(v-for="(papka,index) in item.level")
						span {{papka}}
						.delSetting(@click="item.level.splice(index,1)") ✕
					.titleSetting Добавить новые уровни папок
					input(v-model="level")
					.addSetting(@click="$_addLevelPapka(index)") Добавить
					.titleSetting Ключевые слова в документе
					.itemSettings(v-for="(word,index) in item.classifier")
						span {{word}}
						.delSetting(@click="item.classifier.splice(index,1)") ✕
					.titleSetting Добавить новые ключевые слова
					input(v-model="word")
					.addSetting(@click="$_addKeyWord(index)") Добавить
				.btnModal(@click="$_settingsSave") Готово
				.btnModal(@click="$_settingsHide") Закрыть
			.modalContent(v-else)
				h3 Загрузка настроек классификатора
				.blockSpiner
					b-spinner
				.btnModal(@click="$refs.settings.hide()") Закрыть
</template>

<script>
export default {
	name: 'App',
	data(){
		return{
			extensions:['xlsm','xlsb','xls','ods','fods','csv','txt','sylk','html','dif','dbf','rtf','prn','eth','pdf'],
			files:[],
			load:false,
			step:true,
			countLoaded:0,
			countUploaded:0,
			noneCompany:{length: 0,files:[]},
			selectCompany:{name:'',files:[]},
			resultFiles:[],
			settings:null,
			word:'',
			level:''
		}
	},
	methods:{
		$_settingsSave(){
			this.axios.put(this.$server+'upload',{json:JSON.stringify(this.settings)})
				.then(() => {
					this.$refs.settings.hide()
				})
				.catch(()=>{
					this.$refs.settings.hide()
				})
		},
		$_settingsHide(){
			this.$refs.settings.hide()
			this.axios.get(this.$server+'upload')
				.then((res) => {
					this.settings=res.data;
				})
		},
		$_addKeyWord(index){
			if(this.word){
				this.settings[index].classifier.push(this.word)
				this.word=''
			}
		},
		$_addLevelPapka(index){
			if(this.level){
				this.settings[index].level.push(this.level)
				this.level=''
			}
		},
		$_selectCompany(index){
			if(index){
				this.selectCompany.name=this.resultFiles[index].name
				Object.keys(this.resultFiles[index].files).forEach(subKey=>{
					this.selectCompany.files.push(this.resultFiles[index].files[subKey])
				})
				this.$refs.modalSex.show()
			}else{
				this.$refs.modalSex.hide()
				this.selectCompany={name:'',files:[]}
			}
		},
		$_uploadFile(file){
			if(file.length){
				this.load=true;
				let files = new FormData()
				file.forEach(item=>{
					files.append('files',item)
				})
				this.axios.post(this.$server+'upload',files,{headers: {'Content-Type': 'multipart/form-data'}})
					.then((res) => {
						this.resultFiles=res.data
						this.step=false;
						this.load=false;
						this.countLoaded=this.files.length
						this.files=[];


						Object.keys(this.resultFiles).forEach(key=>{
							Object.keys(this.resultFiles[key].files).forEach(subKey=>{
								if(!this.resultFiles[key].countSucess){
									this.resultFiles[key].countSucess=0
								}
								if(key!=='none'){
									this.countUploaded+=this.resultFiles[key].files[subKey].map(item=>item.name).length
									this.resultFiles[key].countSucess+=this.resultFiles[key].files[subKey].map(item=>item.name).length
								}
							})
						})
						if(this.resultFiles['none']!==undefined){
							let countNone=0;
							const noneFiles=[];
							Object.keys(this.resultFiles['none'].files).forEach(key=>{
								countNone+=this.resultFiles['none'].files[key].map(item=>item.name).length
								noneFiles.push(this.resultFiles['none'].files[key])
							})
							this.noneCompany={
								length:countNone,
								files:noneFiles
							}
						}
					})
					.catch(err=>{
						this.$_clearAll()
						console.log(err)
						alert('Произошла ошибка')
					})
			}
		},
		$_clearAll(){
			this.step=true;
			this.resultFiles=[];
			this.countLoaded=0;
			this.countUploaded=0;
			this.load=false;
			this.files=[];
		},
	},
	created() {
		this.axios.get(this.$server+'upload')
			.then((res) => {
				this.settings=res.data;
			})
	}
}
</script>
<style>
	html, body, #app, .mainBlock{
		background: #E5E5E5;
	}
	.mainBlock{
		display: grid;
		place-content: center;
		padding-top: 190px;
	}
	.logoBlock{
		width: 100%;
		text-align: right;
		border-bottom: 4px solid #003462;
		padding-top: 15px;
		position: absolute;
		padding-right: 30px;
		top: 0;
	}
	.title{
		margin-top: 15px;
		text-align: center;
	}
	.title b{
		margin-left: 10px;
		color: #003462;
	}
	.blockLoad{
		display: grid;
		place-content: center;
		margin-top: 25px;
	}
	.blockLoad .uploadFileLabel{
		background: #003462;
		color: white;
		padding: 21px 0;
		border-radius: 13px;
		font-size: 30px;
		font-weight: bolder;
		cursor: pointer;
		width: 500px;
		text-align: center;
	}
	.checkBox label{
		margin-left: 10px;
		margin-top: 10px;
		color: #003462;
		cursor: pointer;
	}
	.myProgress{
		width: 500px;
		margin: 0 auto;
		height: 87px;
		margin-top: 25px;
	}
	.myProgress .progress-bar{
		background-color: #003462;
	}
	/*шаг 2 начало*/
	.resultBlock .settings{
		width: fit-content;
		margin: 20px auto 0 auto;
	}
	.resultBlock{
		border: 4px solid #003462;
		box-sizing: border-box;
		border-radius: 30px;
		flex: 1;
		color: #003462;
		padding: 50px;
		margin: 50px auto;
		width: 900px;
	}
	.resultBlock .myProgress{
		width: 100%;
		margin-bottom: 30px;
	}
	.innerBlock{
		background: #FFFFFF;
		border-radius: 60px;
		width: 100%;
		padding: 10px 20px;
		margin-bottom: 15px;
		line-height: 31px;
		font-size: 24px;
	}
	.innerBlock b{
		font-weight: bolder;
		margin-left: 15px;
		font-size: 26px;
	}
	.btnInfo{
		background: #003462;
		padding: 0 20px;
		display: inline-block;
		border-radius: 13px;
		color: white;
		float: right;
		cursor: pointer;
		font-size: 18px;
	}
	.uploadAfter{
		background: #003462;
		padding: 10px 30px;
		border-radius: 10px;
		font-size: 24px;
		color: white;
		text-align: center;
		margin: 15px auto 0 auto;
		display: block;
		width: 420px;
		cursor: pointer;
	}
	.headerBlock{
		margin-bottom: 15px;
	}
	.headerBlock .name{
		font-weight: bolder;
		font-size: 20px;
	}
	.fileBlockInfo{
		font-size: 16px;
		line-height: 22px;
		border-bottom: 2px solid #003462;
		color: #003462;
		padding: 15px 0;
	}
	.fileBlockInfo small{
		display: block;
		color: grey;
	}
	.btnModal{
		width: fit-content;
		float: right;
		margin-top: 30px;
		padding: 10px 20px;
		background: #003462;
		cursor: pointer;
		color: white;
		border-radius: 13px;
		font-size: 20px;
		margin-left: 15px;
	}
	.blockVerif{
		color: #F26126;
		text-decoration: underline;
		font-weight: bolder;
	}
	.blockSpiner{
		margin: 0 auto;
		display: grid;
		place-content: center;
		color: #003462;
	}
	.blockSpiner .spinner-border{
		height: 87px;
		width: 87px;
		border-width: 5px;
	}
	.blockCompany{
		border-top: 4px solid #003462;
		margin-top: 15px;
		padding-top: 10px;
	}
	.blockCompany .company{
		border-bottom: 1px dashed #003462;
	}
	/*шаг 2 конец*/
	.modalContent h3{
		text-align: center;
	}
	.modal-content{
		border-radius: 30px;
	}
	.subBlock{
		display: flex;
	}
	.subBlock label{
		flex: 1;
	}
	.settings{
		color: #003462;
		text-decoration: underline;
		text-align: center;
		flex: auto;
		margin-top: 10px;
		cursor: pointer;
	}
	.blockSettings{
		margin-bottom: 15px;
		border-bottom: 4px dashed #003462;
		padding-bottom: 15px;
	}
	.blockSettings input{
		width: 100%;
	}
	.blockSettings .titleSetting{
		font-weight: bolder;
		margin-top: 15px;
	}
	.blockSettings .delSetting{
		padding: 5px;
		height: 25px;
		width: 25px;
		display: inline-grid;
		place-content: center;
		color: white;
		background: #F26126;
		border-radius: 5px;
		margin-left: 15px;
		cursor: pointer;
	}
	.itemSettings{
		margin: 5px 0;
		color: grey;
	}
	.addSetting {
		color: #003462;
		text-decoration: underline;
		width: -moz-fit-content;
		cursor: pointer;
		font-weight: bolder;
		width: fit-content;
		margin-left: auto;
	}
	/*Анимация перехода начало*/
	.opacity-enter-active {
		opacity: 1;
		transition: all .25s ease;
	}
	.opacity-enter, .opacity-leave-to {
		opacity: 0;
		transition: all .25s ease;
	}
	/*Анимация перехода конец*/
</style>