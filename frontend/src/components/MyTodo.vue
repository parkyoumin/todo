<template>
    <div class="todo">
        <div class="un_login" v-show="!login">로그인 하세요</div>
        <div class="login" v-show="login">
            <div class="menu">
                <div class="icon">
                    <i @click="toggleMobileNav" v-show="mobile" class="far fa-bars" :class="{ 'icon-active': mobileNav }"></i>
                </div>
                <transition name="mobile-nav">
                    <ul v-show="mobileNav" class="dropdown-nav">
                        <h1>Todo</h1>
                        <button @click="add()">추가</button>
                        <li v-for="(name, idx) in pname" :key="idx" v-bind:id="name.p_name" @click="show($event)">{{name.p_name}}</li>
                    </ul>
                </transition>
            </div>
            <div class="main">
                <div class="project">
                    <h1 id="p_name"></h1>
                    <hr/>
                    <form>
                    <div v-for="(de, i) in detail" :key="i">{{de.title}}{{de.date}}</div>
                    </form>
                </div>

                <button>작업추가</button><hr/>
            
                <div class="insert">
                    <form>
                        <input id="text" type="texterea">
                        <input id="date" type="date">
                        <button type="button" @click="submitForm()">추가</button>
                        <button>취소</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
            return{
                pname: [],
                detail: [],
                login: null,
                mobile: true,
                mobileNav: true,
            };
        },

    mounted(){
        this.emitter.on('flag', re => {
            this.login = re;
        });

        axios.get("/api/listProject").then((res)=>{
            this.pname = res.data;
        });
    },

    methods:{
        add(){
            const content = prompt("제목을 입력해주세요.");

            // 프로젝트 생성
            axios.post("/api/createProject", { content }).then((res)=>{
                if(res.data == "성공") {   
                    alert('프로젝트 생성 완료.');
                }
                else{
                    alert('프로젝트 이름 중복.');
                }
            });

            // 프로젝트 리스트 초기화
            axios.get("/api/listProject").then((res)=>{
            this.pname = res.data;
            });
        },

        show(event){
            document.getElementById('p_name').innerText = event.target.id;
            const p_name = document.getElementById('p_name').innerText;

            // 디테일 리스트 가져오기
            axios.post("/api/listDetail", {p_name}).then((res)=>{
                this.detail = res.data;
            });
        },

        submitForm(){
            if(document.getElementById('text').value == ''){
                alert("할일을 입력하세요");

                if(document.getElementById('date').value == ''){
                alert('날짜를 입력하세요');
                return;
                }
                return;
            }
            var data = [];
            data[0] = document.getElementById('p_name').innerText;
            data[1] = document.getElementById('text').value;
            data[2] = document.getElementById('date').value;

            // 디테일 추가
            axios.post('/api/insertDetail', {data}).then((res)=>{
                if(res.data == "성공"){
                    alert('할일 추가 완료.');
                }
            });

            const p_name = document.getElementById('p_name').innerText;

            // 디테일 리스트 초기화
            axios.post("/api/listDetail", {p_name}).then((res)=>{
                this.detail = res.data;
            });
        },
    },
    
};
</script>

<style lang="scss" scoped>

.icon{
    margin-left : 10px;
}
.menu{
    max-width:250px;
    background-color : rgb(145, 145, 145);
}

</style>