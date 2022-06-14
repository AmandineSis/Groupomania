<!------------------------------------------------------------------------------------>
<!--                            COMPOSANT COMMENTAIRES                              -->
<!------------------------------------------------------------------------------------>

<template>

<div class="CommentItem">
	<!----Affichage de la photo de profil visible sur tablette et desktop ----->
	<router-link :to="`/profile/${comItem.userId}`" v-if="mq.current != 'phone'">
		<img class="form__comments__profile" :src="comItem.profilePicUrl" alt="" v-if="mq.current != 'phone'">
	</router-link>
	<!----Affichage du nom de l'utilisateur ----->
	<div class="form__comments__content">
		<router-link :to="`/profile/${comItem.userId}`" v-if="mq.current == 'phone'">
			<p class="form__comments__content__user" >{{ comItem.firstName }} {{ comItem.lastName }}</p>
		</router-link>
		<!----Contenu du commentaire----->
		<div class="form__comments__container">	
			<div class="form__comments__popup" v-if="showComSettings && comItem">
				<ComSettings 
					:comItem="comItem"
					@hideComSettings="closeComSettings"
					:mode="selectedMode"/>
			</div>
			<div v-if="!showComSettings">
				<div 
					class="form__comments__input form__comments__input__sent"
					v-if="comItem.commentContent != ' '"
					v-text="comItem.commentContent"
					>
				</div>
				<img 
					class="form__comments__image" 
					:src="comItem.imageUrl" 
					alt="comment photo"
					v-if="comItem.imageUrl != null ">
			</div>
		</div>	
	</div>
	<!----Settings visibles uniquement par le propriétaire du commentaire ou le modérateur ----->
	<div class="form__comments__settings">    
		<span class="form__comments__settings__nav" @click="openComSettings" >
            <font-awesome-icon 
				class="form__comments__settings__navIcon" 
				icon="ellipsis" 
				v-if="user.moderator == 1||user.userId== comItem.userId" />
        </span>
	</div>   
</div>	

</template>

<script>
//Composant
import ComSettings from '@/components//Comments/ComSettings.vue'

//store et mixins
import { mapGetters, mapState } from 'vuex';

export default ({
	//ajout de mediaqueries
    inject: ["mq"],
	name: 'CommentItem',
	components: {
		ComSettings
	},
	props: {
		comItem: Object,
		selectedMode: String
	},
	data(){
		return {
			//mode: '',
			comment: "",
			commentImageUrl: "",
			updatedComContent:'',
			updatedComImage:'',
			showComSettings: false
		}
	},
	computed: {
		...mapState({
			user: 'user',
			userInfos: 'userInfos'
		}),
		...mapState('comments',{
            postComments: 'postComments'
        }),
		...mapGetters({
			fullname: 'fullname',
		})
	},
	methods: {
		openComSettings(){
            this.showComSettings = !this.showComSettings
        },
		closeComSettings(){
			this.showComSettings = false;
		}
	}  
})
</script>

<style scoped lang="scss">

.CommentItem {
	display: flex;
	flex-direction: row;
	align-content:center ;
	width: 90%;
	background-color: white;
	padding: 10px 0;
}
.form__comments {
	display: flex;
	flex-direction: row;
	&__container{
		width: 95%;
		height: auto;
		position: relative;
	}
	&__settings{
		text-align: center;
		padding-top: 7px;
		&__navIcon{
			transform: scale(1);
			transition: transform 200ms;
			&:hover {
				transform: scale(1.5);
				cursor: pointer;
			}
		}
	}
	&__popup{
		position: relative;
	}
	&__content {
		display: flex;
		flex-direction: column;
		
		width:100%;
		&__user{
			font-size: 0.9;
			margin: 2px 10px;
			text-align: left;
		}
	}
	&__input {
		width:100%;
		height: 100%;
		background-color: white;
		border: 2px solid #999999;
		resize: none;
		border-radius:10px;
		padding: 5px 15px;
		background-color: white;
		display: inline-block;
		white-space: normal;
		color: grey;
		&__sent{
			width: 100%;
			height: auto;
			text-align: left;
			overflow-wrap: break-word;
			
		}
	}
	&__profile {
		width: 40px;
		height: 40px;
		border-radius: 50px;
		border: 0.5px solid #999999;
		object-fit: cover;
	}
	&__image {
		width:70%;
	}
	&__btn {
		padding: 0px;
		
		border-radius: 100px;
		height: 30px;
		background-color: #FFFFFF;
		border: solid 1.5px #ee7575;
		color: #ee7575;
		
		&__upload {
			width: 30px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&__submit{
			width: 70px;
		}
		&:hover {
			background-color: #ee7575;
			color: #ffffff;
		}
		&:active {
			color: #ee7575;
			background-color: #ffffff;
		}
	}
}
#uploadCommentImage {
	opacity: 0;
    position: absolute;
    z-index: -1;
}
</style>