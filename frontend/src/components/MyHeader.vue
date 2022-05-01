<template>
    <header :class="{'scrolled-nav': scrolledNav }">
        <nav>
            <ul v-show="!mobile" class="navigation">
                <li><router-link class="link" :to="{name: 'Home'}">Home</router-link></li>   
                <li v-show="!login"><a class="link" v-on:click="kakaoLogin()">Login</a></li>
                <li v-show="login"><a class="link" v-on:click="kakaoLogout()">Logout</a></li>
            </ul>
            <div class="icon">
                <i @click="toggleMobileNav" v-show="mobile" class="far fa-bars" :class="{ 'icon-active': mobileNav }"></i>
            </div>
            <transition name="mobile-nav">
                <ul v-show="mobileNav" class="dropdown-nav">
                    <li><router-link class="link" :to="{name: 'Home'}">Home</router-link></li>
                    <li v-show="!login"><a class="link" v-on:click="kakaoLogin()">Login</a></li>
                    <li v-show="login"><a class="link" v-on:click="kakaoLogout()">Logout</a></li>           
                </ul>
            </transition>
        </nav>
    </header>
</template>

<script>
import axios from 'axios';

    export default {

        data() {
            return{
                scrolledNav: null,
                mobile: null,
                mobileNav: null,
                windowWidth: null,
                login: null,
                email: null,
            };
        },
        
        created() {
            window.addEventListener('resize', this.checkScreen);
            this.checkScreen();
        },

        mounted(){
            window.addEventListener('scroll', this.updateScroll);
        },

        methods: {
            toggleMobileNav(){
                this.mobileNav = !this.mobileNav; // 메뉴 나오고 들어가기
            },

            updateScroll(){ // 스크롤 시 투명도 진해짐
                const scrollPosition = window.scrollY;
                if(scrollPosition > 50){
                    this.scrolledNav = true;
                    return;
                }
                this.scrolledNav = false;
            },

            checkScreen(){ // 모바일 모드, 홈페이지 모드로 변경
                this.windowWidth = window.innerWidth;
                if(this.windowWidth <= 750){
                    this.mobile = true;
                    return;
                }
                this.mobile = false;
                this.mobileNav = false;
                return;
            },

            // 카카오 로그인 API
            kakaoLogin(){
                window.Kakao.Auth.login({
                    scope:'profile_nickname, account_email, gender',
                    success: function(){
                        window.Kakao.API.request({
                            url:'/v2/user/me',
                            success: res => {
                                const kakao_account = res.kakao_account;
                                axios.post("/api/login", { kakao_account }).then((res2)=>{
                                    if(res2.data == "성공") {   
                                        alert('로그인 되었습니다.');
                                    }
                                });
                            }
                        });
                    }          
                });
                this.login = true;                 
                this.emitter.emit('flag',this.login);
            },

            // 카카오 로그아웃 API
            kakaoLogout(){
                window.Kakao.Auth.logout(function () {
                    axios.get("/api/logout").then((res)=>{
                        if(res.data == "성공"){
                        alert('로그아웃 되었습니다.', window.Kakao.Auth.getAccessToken());
                        }
                    });
                });
                this.login = false;
                this.emitter.emit('flag',this.login);
            },
        },
    };
</script>

<style lang="scss" scoped>
header{
    background-color: rgba(104, 0, 95, 0.8);
    z-index: 99;
    width: 100%;
    height: 77px;
    position: relative;
    transition: .5s ease all;
    color: #fff;

    nav{
        position:relative;
        display: flex;
        flex-direction: row;
        padding: 12px 0;
        transition: .5s ease all;
        width: 90%;
        margin: 0 auto;
        @media(min-width: 1140px){
            max-width: 1140px;
        }

        ul,
        .link {
            font-weight: 500;
            color: #fff;
            list-style: none;
            text-decoration: none;
        }

        li {
            text-transform: uppercase;
            padding: 16px;
            margin-left: 16px;
        }

        .link {
            font-size: 14px;
            transition: .5s ease all;
            padding-bottom: 4px;
            border-bottom: 1px solid transparent;

            &:hover{
                color: #000000;
                border-color: #000000;
            }
        }

        .navigation{
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;
        }
        .icon{
            display: flex;
            align-items: center;
            position: absolute;
            top: 25px;
            right: 24px;
            height: 100%;

            i {
                cursor: pointer;
                font-size: 24px;
                transition: .8s ease all;
            }
        }

        .icon-active{
            transform: rotate(180deg);
        }

        .dropdown-nav{
            display: flex;
            flex-direction: column;
            position: fixed;
            width: 100%;
            max-width: 250px;
            height: 100%;
            background-color: #fff;
            top: 0;
            left: 0;
            margin: 0;

            li{
                margin-left: 0;
                .link{
                    color: #000;
                }
            }
        }

        // 모바일모드 메뉴 애니메이션 처리
        .mobile-nav-enter-active,
        .mobile-nav-leave-active {
            transition: 1s ease all;
        }

        .mobile-nav-enter-from,
        .mobile-nav-leave-to {
            transform: translateX(-250px);
        }

        .mobile-nav-enter-to {
            transform: translateX(0);
        }
    }
}

.scrolled-nav{
    background-color: rga(89, 18, 92);
    box-shadow: 0 4px 6px -1px rgba(89, 18, 92,0.1), 0 2px 4px -1px rgba(89, 18, 92,0.06);

    nav{
        padding: 8px 0;
    }
}
</style>