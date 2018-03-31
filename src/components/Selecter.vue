<template>
	<div class="selecteur">
		<form>
			<div class="form-row justify-content-center">
				<div class="col-sm-8 col-md-5 ">
					<select ref="selecter" class="custom-select  rounded" id="inlineFormCustomSelect" @change="changePage($event.target.value)">
						<option value="/">Votre choix...</option>
						<option value="TonalNoise">Tonal noise</option>
						<option value="Jello">Jello</option>
						<option value="Glitch">Glitch</option>
						<option value="Distort">Distort</option>
					</select>
				</div>
			</div>
		</form>
	</div>

</template>

<script>
export default {

	name: 'Selecteur',

	props: {
		vueCourante: String
	},

	mounted() {

		// définir l'option du select
		// qui sera 'selected'
		let path = (window.location.pathname).split('/').pop()
		const options = this.$refs.selecter.options

		Array.from(options).map( (option, index) => {  
			if (option.value === path ){
				return this.$refs.selecter.selectedIndex = index
			}
			return true
		})
	},
		
	methods: {

		changePage(ref) {

			console.log(ref)
			console.log(this.vueCourante)

			//if(ref === this.vueCourante) return

			if(ref === '/'){
				this.$router.push({ path: `/` })
			}else{
				//this.$router.push({ path: `/filters/${ref}` })
				this.$router.push({ name: ref, params: { filter: ref }})
			}
		}
	}
}
</script>


<style >


	.selecteur{
		margin: 0;
		position: absolute;
		width: 100vw;
		height: 60px;
		z-index: 50;
		overflow: hidden;
		padding-top: 12px;
	}

</style>
