<template>
    <div class="login">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单 -->
            <!-- ref :存放的是form组件的实例对象 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRoles" class="loginForm">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button @click="login" type="primary">登陆</el-button>
                    <el-button @click="resetForm" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 登陆表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            // 表单的验证规则对象
            loginRoles:{
                // 验证用户名是否合法
                username:[
                    // 规则1：用户名为必填项
                    {
                        required: true,     //必填
                        message: '请输入用户名',       //提示语句
                        tirgger:'blur'      //何时触发
                    },
                    // 规则2：规定用户名长度
                    {   
                        min: 3,max: 10,
                        message:'长度在 3 到 10 个字符',
                        tigger:'blur'
                    }
                ],
                // 验证密码是否合法
                password:[
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 3,max: 15,
                        message: '长度在 3 到 15 个字符',
                        trigger: 'blur'
                    }
                ],
            }
        }
    },
    methods:{
        // 重置登陆表单
        resetForm(){
            // 重置表单
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            // 表单的预验证
            this.$refs.loginFormRef.validate((valid)=>{
                // 如果验证未通过，终止函数。
                if(!valid) return;

                // 如果通过，发送ajax请求,传送的数据为loginForm对象
                this.$axios.post('login',this.loginForm).then((res)=>{
                    // console.log(res.data);
                    if(res.data.meta.status !== 200){
                        return this.$message.error('用户名或密码错误，登陆失败！');
                    }
                    this.$message.success('登陆成功！');
                    console.log(res.data)
                    // 将登陆成功之后的token，保存到客户端的sessionStorage中
                    window.sessionStorage.setItem('token',res.data.data.token);
                    // 通过编程式导航 跳转到主页，路由地址 /home
                    this.$router.push('/home');
                })

            });
        }
    }
}
</script>

<style lang="less" scoped>
.login{
    background: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.login_box .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    img{
        width: 100%;
        height: 100%;
        background: #eee;
        border-radius: 50%;
    }
}

// 表单
.loginForm{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

// 按钮
.btns{
    display: flex;
    justify-content: flex-end;
}

</style>