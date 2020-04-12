<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加区域 -->
                    <el-input clearable @clear="getUserList" v-model="queryInfo.query" placeholder="请输入内容">
                        <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="addDialogVisible = true" type="primary">添加用戶</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- {{scope.row.mg_state}} -->
                        <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="">
                        <!-- 修改 -->
                        <el-button @click="showEditDialog" size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <!-- 删除 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                        <!-- 分配角色 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- dialog 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息的对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="50%">
            <!-- 表单验证 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="addForm.username" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        // 该验证方法，在rules中加入 如：{validator:checkEmail,trigger:'blur} 即可 
        // 验证邮箱的规则
        // var checkEmail = (rules,value,callback)=>{
        //     const regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        //     if(regEmail.test(value)){
        //         // 合法邮箱，调用回调函数
        //         return callback();
        //     }
        //     // 如果不合法
        //     callback(new Error('请输入正确的邮箱'))
        // }
        // 验证邮箱的规则
        // var checkMobile = (rules,value,callback)=>{
        //     const regMobile = /^1[345678]\d{9}$/;
        //     if(regMobile.test(value)){
        //         return callback();
        //     }
        //     callback(new Error('请输入正确的手机号'));
        // }

        return{
            // 获取用户列表的参数对象
            queryInfo:{
                query:'',   //搜索数据
                // 当前的页码
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 2
            },
            userList:[],
            total:0,
            addDialogVisible:false,      //添加用户是否显示对话框，默认隐藏
            addForm:{ 
                username:'',
                password:'',
                email:'',
                mobile:'',
                },                  //添加用户的表单数据
            addFormRules: {              //添加用户表单的验证规则对象
                username:[
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger:'blur'
                    },
                    {
                        min: 3,max: 10, message: '用户名的长度在3~10个字符之间',
                        trigger: 'blur'
                    }
                ],
                password:[
                    {
                        required: true,
                        message: '请输入密码',
                        trigger:'blur'
                    },
                    {
                        min: 6,max: 15, message: '密码的长度在6~15个字符之间',
                        trigger: 'blur'
                    }
                ],
                email:[
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger:'blur'
                    },
                    // 正则校验 邮箱
                    {
                        pattern: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/,
                        // validator: checkEmail,
                        message:'请输入正确的邮箱'
                    }
                ],
                mobile:[
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger:'blur'
                    },
                    // 正则校验 手机号
                    {
                        pattern: /^1[345678]\d{9}$/,
                        // validator: checkMobile,
                        message:'请输入正确的手机号'
                    }
                ],
            },
            editDialogVisible: false,       //添加用户是否显示对话框，默认隐藏
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        getUserList(){
            this.$axios.get('users',{
                params: this.queryInfo
            }).then((res)=>{
                // console.log(res.data);
                if(res.data.meta.status !== 200) return this.$message.error('获取用户列表失败！');
                this.userList = res.data.data.users;
                this.total = res.data.data.total;
                console.log(this.addForm)
            })
        },
        // 监听Pagesize 改变事件
        handleSizeChange(newSize){
            // console.log(newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList()
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newPage){
            // console.log(newPage);
            this.queryInfo.pagenum = newPage;
            this.getUserList()
        },
        // 监听 switch 状态的改变
        userStateChange(userInfo){
            // console.log(userInfo)
            this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then((res)=>{
                // console.log(res.data)
                if(res.data.meta.status !== 200){
                    userInfo.mg_state = !userInfo.mg_state;
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功')
            })
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed(){
            // 重置对话框
            this.$refs.addFormRef.resetFields();
        },
        // 点击按钮，添加新用户
        addUser(){
            this.$refs.addFormRef.validate(valid =>{
                // console.log(valid);
                if(!valid) return;
                this.$axios.post('users',this.addForm).then((res)=>{
                    // console.log(res.data);
                    if(res.data.meta.status != 201){
                        this.$message.error('添加用户失败！');
                    }
                    this.$message.success('添加用户成功！')
                    // 隐藏添加用户的对话框
                    this.addDialogVisible = false;
                    // 重新获取用户列表数据
                    this.getUserList()
                })
            })
        },
        // 展示编辑用户信息的对话框
        showEditDialog(){
            this.editDialogVisible = true;
        }
    }
}
</script>

<style lant="less" scoped>
.el-card{
    box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;
}
</style>