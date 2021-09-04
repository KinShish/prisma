<template lang="pug">
	div
		h1 upload
</template>

<script>
export default {
	data(){
		return{
			files:[]
		}
	},
	methods:{
		$_image_inputFilter(files){
			console.log(files)
		}
	},
	components:{
		'FileUpload':()=>import('vue-upload-component'),
	}
}
</script>

<style scoped>

</style>