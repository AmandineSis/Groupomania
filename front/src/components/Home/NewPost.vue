<template>
    <div class="form" >
        <form >
            <textarea 
                class="form__input"
                rows ="5" 
                v-model="event.post"
                name ="newPost"
                placeholder = "Que souhaitez vous partager ?">
                
            </textarea>
            <div class="form__valid">
                <label for="uploadImage" class="form__btn form__btn__upload"><font-awesome-icon icon="image" /></label>
                <input id="uploadImage" type="file" @click="onFileSelected" ref="fileupload">
                <button
                    class="form__btn form__btn__submit"
                    type="submit"
                    @click="createPost"
                ><font-awesome-icon icon="paper-plane" /></button> 
            </div>
            
        </form>
    </div>
</template>


<script>
import BaseInput from '@/components/Base/BaseInput.vue'
export default ({
    name: 'NewPost',
    component: {
        BaseInput
    },
    data(){
        return {
            event: {
                post: "",
                imageUrl:""
            },
            
        }
    },
    methods: {
        onFileSelected(e){
            this.event.imageUrl = e.target.files[0];
        },
        createPost(e) {
            e.preventDefault();
            const fd = new FormData();
            if (this.event.post != "") {
                 fd.append('content', this.event.post);
            }
            if (this.event.imageUrl) {
                fd.append('image', this.event.imageUrl, 'image');
            }
            if (this.event.post || this.event.imageUrl) {
                this.$store
                    .dispatch('createPost', fd)
                    .then((res => {
                        console.log(res)
                        
                        location.reload();
                    }), (err => {
                        console.log(err)
                    }))
            }
        }      
    }
})
</script>

<style scoped lang="scss">

    .form {

        margin: 30px auto;
        width: 500px;
        height: 100px;
        align-items: center;
        border-radius: 20px;
        &__input {
            width:100%;
            height:  100%;
            background-color: white;
            border: 2px solid #999999;
            resize: none;
            border-radius: 20px;
            padding: 5px 15px;
            background-color: white;
            display: inline-block;
            white-space: normal;
            color: grey;
        }
        &__valid{
            
            display: flex;
            flex-direction: row;
            justify-content: space-between;;
            margin: 30px auto;
            width: 30%;
            position: relative;
            top: -50px;
            right: -150px;
        }
        &__btn {
        padding: 0px;
        width: 70px;
        border-radius: 100px;
        height: 40px;
        background-color: #FFFFFF;
        border: solid 1.5px #a71e05;
        color: #a71e05;
        &__upload {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        &:hover {
            background-color: #a71e05;
            color: #ffffff;
        }
        &:active {
            color: #a71e05;
            background-color: #ffffff;
        }
    }
    }
  

    #uploadImage {
       opacity: 0;
       position: absolute;
       z-index: -1;
    }

    

    
</style>