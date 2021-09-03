<template lang="pug">
	div
		h1 upload
		file-upload(
			:directory="true"
			:multiple="true"
			:thread="3"
			:drop="false"
			:drop-directory="true"
			@input-filter="$_image_inputFilter"
			v-model="files"
			ref="upload") Загрузить
</template>

<script>
export default {
	data(){
		return{
			files:[]
		}
	},
	methods:{
		$_image_inputFilter(e){
			console.log(e)
		}
	},
	components:{
		'FileUpload':()=>import('vue-upload-component'),
	}
}
</script>

<style scoped>

</style>