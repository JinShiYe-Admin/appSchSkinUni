<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<uni-row>
			<uni-col :span="11" style="border-right: 1px solid rgba(238,238,238,.5);">
				<scroll-view class="select-scroll" scroll-y="true" >
					<mix-tree :list="leftList" @treeItemClick="treeItemClick" :nodeClick="true"></mix-tree>
				</scroll-view>
			</uni-col>
			<uni-col :span="13">
				<template v-if="rightList.length>0">
					<scroll-view class="select-scroll" scroll-y="true" >
						<uni-list class="uni-list" :border="false">
							<checkbox-group >
								<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in rightList" :key="index" @click="userClick(item)">
									<view>
										<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.user_code"  :checked="item.checked" />
									</view>
									<view>{{item.user_name}}</view>
								</label>
							</checkbox-group>
						</uni-list>
					</scroll-view>
				</template>
				<template v-else>
					<view v-if="dptClick" style="font-size: 13px;margin-top: 10px;">部门暂无人员</view>
					<view v-else style="font-size: 13px;margin-top: 10px;">请选择部门</view>
				</template>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import mixTree from '@/components/mix-tree/mix-tree';
	
	
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				oneDptSelectPeoples:[],//单个部门内选择的人员，用于切换部门时，将选择的人员合并到总的选择人员中
				selectPeoples:new Map(),
				leftList:[],
				rightList:[],
				dptClick:false,
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='选择抄送人'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			let selectPeoples=itemData.selectPeoples;
			let copy_map=new Map();
			selectPeoples.map(item=>{ 
				copy_map.set(item.value,item)
			})
			this.selectPeoples=copy_map
			setTimeout(()=>{
				this.showLoading()
				this.getDpt()
			},10)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			treeItemClick(item) {
				let {id,name,parentId} = item;
				this.getDptUser(id)
				setTimeout(()=>{
					this.dptClick=true
				},1000)
			},
			userClick(user){
				user.checked=!user.checked
				if(user.checked){
					user.text=user.user_name
					user.value=user.user_code
					this.selectPeoples.set(user.user_code,user)
				}else{
					this.selectPeoples.delete(user.user_code)
				}
			},
			textClick(){
				let checkTec=[]
				this.selectPeoples.forEach((value,key)=>{
					checkTec.push({text:value.text,value:value.value})
				})
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('setPeople', {data: checkTec});
				uni.navigateBack();
			},
			getDpt(){
				let comData={
					sch_code:this.personInfo.unit_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'dpt',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					let list=response.list
					list.map(item=>{
						item.name=item.dpt_name
						item.id=item.dpt_code
					})
					let treeList=this.getDptTree(list);
					this.leftList=treeList
					this.hideLoading()
				})
			},
			getDptTree(dptList){
			    const map = {};
			    const val = [];
			    dptList.forEach((item) => {
			      map[item.dpt_code] = item;
			    });
			    dptList.forEach((item) => {
			      const parent = map[item.pcode];
			      if (parent) {
			        (parent.children || (parent.children = [])).push(item);
			      } else {
			        val.push(item);
			      }
			    });
			    return val
			},
			getDptUser(dpt_code){
				let comData = {
					sch_code:this.personInfo.unit_code,
					dpt_codes:dpt_code,
					uid_stat:1,
					page_size:1,
					page_number:-1,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'dptUser',comData,response=>{
					let list =[]
					response.list.map(item=>{
						item.checked=false
						this.selectPeoples.forEach((value,key)=>{
							if(key==item.user_code){
								item.checked=true
							}
						})
						list.push(item)
					 })
					 this.rightList=list
					 
				});
			},
		}
	}
</script>

<style>
	.form-left{
		font-size: 14px;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}
	.select-scroll{
		/* #ifdef APP-PLUS */
		height: calc(100vh - 80px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 45px);
		/* #endif */
	}
	.uni-list-cell {
		justify-content: flex-start
	}
</style>
