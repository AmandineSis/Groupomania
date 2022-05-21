<template>
	<img class="form__comments__profile" :src="comItem.profilePicUrl" alt="">
	<div class="form__comments__content">
		<p class="form__comments__content__user">{{ comItem.firstName }} {{ comItem.lastName }}</p>
		<div 
			class="form__comments__input form__comments__input__sent"
			v-if="comItem.commentContent != ' '"
			v-text="comItem.commentContent"
			></div>
			<!-- <p class="form__comments__input form__comments__input__sent" v-if="comItem.commentContent" :contenteditable="isEditable" @blur="onChange"
			@keydown.enter="updateComment(comItem.comId, comItem.postId)">{{ comItem.commentContent }}</p> -->
		<img class="form__comments__image" v-if="comItem.imageUrl != ' '" :src="comItem.imageUrl" :alt="comItem.imageUrl">
	</div>
	<div class="form__comments__settings">    
		<span class="form__comments__settings__nav" @click="openComSettings" @blur="closeSettings">
            <font-awesome-icon class="form__comments__settings__navIcon" icon="ellipsis" v-if="user.moderator == 1||user.userId== comItem.userId" />
        </span>
	</div>   
	
	<div class="form__comments__popup">   
		
        <ComSettings :comItem="comItem" v-if="showComSettings" />
			
    </div>
	



</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ComSettings from '@/components/Home/Comments/ComSettings.vue'
export default ({
	name: 'AddedComments',
	components: {
		ComSettings
	},
	props: {
		comItem: Object
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
			postComments: 'postComments',
			userInfos: 'userInfos'
		}),
		...mapGetters({
			fullname: 'fullname',
		})
	},
	methods: {
		openComSettings(){
            this.showComSettings = !this.showComSettings
        }
	}  
})
</script>

<style scoped lang="scss">

.posts__review__comments {
	background-color: white;
	padding: 10px 0;
	border-radius: 0 0 20px 20px;
}
.form__comments {
	display: flex;
	flex-direction: row;
	&__settings__navIcon{
		transform: scale(1);
        transition: transform 200ms;
        &:hover {
            transform: scale(1.5);
            cursor: pointer;
        }
	}
	&__popup{
		position: absolute;
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
		width:70%;
		height: 30px;
		background-color: white;
		border: 2px solid #999999;
		resize: none;
		border-radius:20px;
		padding: 5px 15px;
		background-color: white;
		display: inline-block;
		white-space: normal;
		color: grey;
		&__sent{
			width: 95%;
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
.recentComments{
display: flex;
margin: 5px;
}
#uploadCommentImage {
	opacity: 0;
    position: absolute;
    z-index: -1;
	}


</style>