<template lang="pug">
	.mainBlock
		.logoBlock
			img(src="./assets/logo.svg")
		file-upload(
			:post-action="$server+''"
			v-model="files"
			:directory="true"
			:multiple="true"
			:thread="3"
			:drop="false"
			@input="$_selectFile"
			@input-file="$_selectFile_progress"
			@inpu-filter="$_selectFile_filter"
		)
		transition(mode="out-in" name="opacity")
			div(v-if="step" key="1")
				h1.title Загрузите файлы для анализа и классификации
				transition(name="opacity" mode="out-in")
					.blockLoad(v-if="!load")
						label(for="file") Загрузить файл
					b-progress.myProgress(v-else :max="100" show-progress animated)
						b-progress-bar(:value="progressLoad" :label="`${((progressLoad / 100) * 100).toFixed(2)}%`")
			div(v-else key="2")
				h1.title Результат работы
					b PriSma
				.resultBlock
					.headerBlock
						.name Имя компании: ООО "АЛНА"
						div ИНН: 1234567890
						.blockVerif Проверено по базам ФНС
					span
						.innerBlock Всего загружено
							b 100
						.innerBlock Распознано
							b 100
						.innerBlock Классифицировано
							b 100
							.btnInfo(@click="$refs.modalSex.show()") Подробнее
						.innerBlock Не распознано
							b 100
							.btnInfo(@click="$refs.modalErr.show()") Подробнее
					span(v-if="!load")
						label.uploadAfter(for="file") Загрузить недостающие файлы
						.uploadAfter(@click="$_clearAll") Начать заново
					b-progress.myProgress(v-else :max="100" show-progress animated)
						b-progress-bar(:value="progressLoad" :label="`${((progressLoad / 100) * 100).toFixed(2)}%`")
		b-modal(hide-footer hide-header centered ref="modalErr" size="lg")
			.modalContent
				h3 Не распознаные файлы
				.fileBlockInfo(v-for="item in 5") {{item}}. файл 1
				.btnModal(@click="$refs.modalErr.hide()") Закрыть
		b-modal(hide-footer hide-header centered ref="modalSex"  size="lg")
			.modalContent
				h3 Классифицированные файлы
				.fileBlockInfo(v-for="item in 5") {{item}}. файл 1
				.btnModal(@click="$refs.modalSex.hide()") Закрыть
</template>

<script>
export default {
	name: 'App',
	data(){
		return{
			extensions:['xlsx','xlsm','xlsb','xls','ods','fods','csv','txt','sylk','html','dif','dbf','rtf','prn','eth','pdf'],
			files:[],
			load:false,
			progressLoad:10,
			step:true
		}
	},
	components:{
		'FileUpload':()=>import('vue-upload-component'),
	},
	methods:{
		$_selectFile_filter(newFile, oldFile) {
			if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
				let flag=true;
				if(this.old_files) {
					this.old_files.forEach((f) => {
						if (newFile.thumb === f.thumb) {
							flag = false
						}
					});
				}
				if(flag) {
					let URL = window.URL || window.webkitURL;
					if (URL && URL.createObjectURL) {
						newFile.blob = URL.createObjectURL(newFile.file)
					}
					newFile.thumb = '';
					if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
						newFile.thumb = newFile.blob
					}
				}
			}
		},
		$_selectFile_progress(newFile){
			console.log(newFile.progress)
			//this.files=[];
		},
		$_selectFile(){
			if(this.step){
				console.log('новые')
			}else{
				console.log('дополнение')
			}
			this.step=!this.step
			console.log(this.files)
			/*setTimeout(()=>{
				this.spinner=false;
				this.$router.push('/result')
			},5000)
			this.axios.post(this.$server+'',{files})
			.then((res) => {
				console.log(res)
			})*/
		},
		$_clearAll(){
			this.step=true;
		}
	},
}
</script>
<style>
	html, body, #app, .mainBlock{
		height: 100%;
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
	.blockLoad label{
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
	.resultBlock{
		border: 4px solid #003462;
		box-sizing: border-box;
		border-radius: 30px;
		flex: 1;
		color: #003462;
		padding: 50px;
		margin: 50px auto 0 auto;
		min-width: 900px;
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
	}
	.blockVerif{
		color: #F26126;
		text-decoration: underline;
		font-weight: bolder;
	}
	/*шаг 2 конец*/
	.modalContent h3{
		text-align: center;
	}
	.modal-content{
		border-radius: 30px;
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