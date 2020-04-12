<template>
  <el-container class="home">
    <!-- 页面头部区 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠 -->
        <div @click="toggleCollapse" class="toggle-button">|||</div>

        <!-- 侧边栏菜单区 -->
        <el-menu :default-active="activePath" :router="true" :collapse="isCollapse" :collapse-transition="false" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened>
          <!-- 一级菜单 -->
          <el-submenu :index="`${item.id}`" v-for="item of menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" v-for="subItem of item.children" :key="subItem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default({
        data(){
            return{
              // 左侧菜单数据
              menuList:[],
              iconObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',
              },
              isCollapse: false,    //是否折叠菜单栏
              activePath: '',     //被激活的链接地址
            }
        },
        created(){
          this.getMenuList();
          this.activePath = window.sessionStorage.getItem('activePath');
        },
        methods:{
            logout(){
                // 清空sessionStorage,主要是清楚token
                window.sessionStorage.clear();
                // 跳转到login页面
                this.$router.push('/login');
            },
            // 获取所有的菜单
            getMenuList(){
              this.$axios.get('menus').then((res)=>{
                // console.log(res.data);
                if(res.data.meta.status !== 200){
                  return this.$message.error(res.data.meta.msg);
                }
                this.menuList = res.data.data;
              })
            },
            // 折叠菜单栏
            toggleCollapse(){
              this.isCollapse = !this.isCollapse;
            },
            // 保存链接的激活路径
            saveNavState(activePath){
              window.sessionStorage.setItem('activePath',activePath);
              this.activePath = activePath;
            }
        }
    })
</script>

<style lang='less' scoped>
.home{
    height: 100%;
}
.el-header{
    background: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items:center;
    color: #fff;
    > div{
        height: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        > img{
            height: 80%;
        }
        > span {
            margin-left: 15px;
        }
    }
}

.el-aside{
    background: #333744;
    > .el-menu{
      border: none;
    }
}
.el-main{
    background: #eaedf1;
}

.iconfont{
  margin-right: 10px;
}

.toggle-button{
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
}
</style>