<template lang="pug">
	div
		.mainBlockIndex
			.man
				.message какой то текст
				img(src="../assets/man.svg")
				//.light
					img(src="./assets/light.svg")
			.uploadFile
				.lineMan
					img(src="../assets/smallMan.svg" v-for="item in countMan" :key="item")
				.resultBlock
					span(v-if="!loadFile")
						.innerBlock Всего загружено
							b 100
						.innerBlock Распознано
							b 100
						.innerBlock Классифицировано
							b 100
						.innerBlock Не распознано
							b 100
							.btnInfo(@click="$refs.modalErr.show()") Подробнее
					.uploadAfter(@click="$_result_countSmallMan" v-if="!loadFile") Загрузить недостающие файлы
					.progressBlock(v-else)
						b-progress(:value="progress" :max="100" show-progress animated)
		b-modal(hide-footer hide-header id="modalErr" centered ref="modalErr")
			div
				.fileBlockInfo(v-for="item in 5") {{item}}. файл 1
				.btnModal(@click="$refs.modalErr.hide()") Закрыть
		//transition-group(name="listTransaction")
			p(v-for="item in files" :key="item") {{item}}
</template>

<script>
export default {
	data(){
		return{
			countMan:0,
			loadFile:false,
			progress:0,
		}
	},
	methods:{
		$_result_countSmallMan(){
			this.loadFile=true;
			this.interval=setInterval(()=>{
				//
				if(this.progress!==100){
					this.progress++
				}
				//
				if(this.countMan!==6){
					this.countMan++
				}else{
					this.countMan=1;
				}
			},700)
		},
	}
}
</script>

<style scoped>
.resultBlock{
	border: 4px solid #30149F;
	box-sizing: border-box;
	border-radius: 30px;
	width: 460px;
	height: 390px;
	flex: 1;
	color: #30149F;
	padding: 10px 15px;
}
.progressBlock{
	height: 390px;
	display: grid;
	place-content: center;
}
.progressBlock .progress{
	width: 440px;
	height: 50px;
}
.innerBlock{
	background: #FFFFFF;
	border-radius: 60px;
	width: 100%;
	padding: 10px 20px;
	margin-bottom: 15px;
	line-height: 31px;
	font-size: 14px;
}
.innerBlock b{
	font-weight: bolder;
	margin-left: 15px;
	font-size: 18px;
}
.btnInfo{
	background: #30149F;
	padding: 0 20px;
	display: inline-block;
	border-radius: 13px;
	color: white;
	float: right;
	cursor: pointer;
}
.uploadAfter{
	background: #30149F;
	padding: 10px 30px;
	border-radius: 10px;
	margin: 50px 50px 0 50px;
	font-size: 17px;
	color: white;
	text-align: center;
}
.fileBlockInfo{
	font-size: 16px;
	line-height: 22px;
	border-bottom: 2px solid #30149F;
	color: #30149F;
	padding: 3px 0;
}
.btnModal{
	width: fit-content;
	float: right;
	margin-top: 30px;
	padding: 10px 20px;
	background: #30149F;
	cursor: pointer;
	color: white;
	border-radius: 5px;
	font-size: 20px;
}
/*Анимация списка начало*/
.listTransaction-enter-active {
	opacity: 1;
	position: relative;
	left: 0;
	transition: all .5s ease;
}
.listTransaction-enter, .listTransaction-leave-to {
	opacity: 0;
	position: relative;
	left: -200px;
	transition: all .5s ease;
}
/*Анимация списка конец*/
</style>