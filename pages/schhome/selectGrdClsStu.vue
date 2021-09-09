<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<template v-if="dataFlag===1">
			<scroll-view class="select-scroll" scroll-y="true">
				<uni-list class="uni-list" :border="false">
					<checkbox-group >
						<label  class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in grdList" :key="index" @click="grdClick(item)">
							<view>
								<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" />
							</view>
							<view>{{item.name}}</view>
						</label>
					</checkbox-group>
				</uni-list>
			</scroll-view>
		</template>
		<template v-else-if="dataFlag===2">
			<scroll-view class="select-scroll" scroll-y="true">
				<uni-collapse class="warp" @change="collapseChange">
					<uni-collapse-item v-for="(grd, key) in grdList" :key="key" :disabled="grd.disabled" :title="grd.name">
						<uni-list class="uni-list" :border="false">
							<checkbox-group >
								<label  class="uni-list-cell uni-list-cell-pd collapse" v-for="(item,index) in grd.clsList" :key="index" @click="clsClick(key,item)">
									<view>
										<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" />
									</view>
									<view>{{item.name}}</view>
								</label>
							</checkbox-group>
						</uni-list>
					</uni-collapse-item>
				</uni-collapse>
			</scroll-view>
		</template>
		<template v-else-if="dataFlag===3">
			<uni-row>
				<uni-col :span="9" style="border-right: 1px solid rgba(238,238,238,.5);">
					<scroll-view class="select-scroll" scroll-y="true" style="background:#FFFFFF ;">
						<uni-collapse class="warp" @change="collapseChange">
							<uni-collapse-item v-for="(grd, key) in grdList" :key="key" :disabled="grd.disabled" :title="grd.name">
								<uni-list class="uni-list" :border="false"  style="background:#F0F00 ;">
									<label  class="uni-list-cell uni-list-cell-pd collapse" :style="{background:item.current?'#E4E4E4':''}" v-for="(item,index) in grd.clsList" :key="index" @click="clsClick(key,item)">
										<view>{{item.name}}</view>
									</label>
								</uni-list>
							</uni-collapse-item>
						</uni-collapse>
					</scroll-view>
				</uni-col>
				<uni-col :span="15">
					<scroll-view class="select-scroll" scroll-y="true" style="background:#FFFFFF ;">
						<template v-if="hasStuList">
							<uni-list class="uni-list" :border="false" style="background:#FFFFFF ;">
								<checkbox-group >
									<label  class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in stuList" :key="index" @click="userClick(item)">
										<view>
											<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.stu_code"  :checked="item.checked" />
										</view>
										<view>{{item.stu_name}}</view>
									</label>
								</checkbox-group>
							</uni-list>
						</template>
						<template v-else><view style="margin: 10px 10px;"><text style="font-size: 13px;">暂无学生</text></view></template>
					</scroll-view>
				</uni-col>
			</uni-row>
		</template>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				tabBarItem: {},
				dataFlag:1,//1选择年级 2选择班级 3 选择学生
				index_code:'',
				selectDatas:[],
				collapse:[],//展开的窗口
				currentGrd:-1,//展开的窗口索引
				grdList:[],
				stuList:[],
				hasStuList:false,
			}
		},
		components: {
			mynavBar
		},
		methods: {
			grdClick(grdItem){
				grdItem.checked=!grdItem.checked
				this.$forceUpdate();
			},
			clsClick(currentGrd,clsItem){
				this.currentGrd=currentGrd
				if(this.dataFlag===2){
					clsItem.checked=!clsItem.checked
					this.$forceUpdate();
				}else{
					let grdList=this.grdList.filter(clsItem=>clsItem.clsList)
					grdList.map(grdItem=>{
						grdItem.clsList.map(clsItem=>{
							clsItem.current=false
						})
					})
					clsItem.current=true;
					this.$forceUpdate();
					if(clsItem.stuList){
						this.stuList=clsItem.stuList
						if(clsItem.stuList.length===0){
							this.showToast("暂无学生")
						}
					}else{
						this.showLoading()
						if(this.serviced=='99' || this.serviced==undefined){
							this.getStuArray(this.grdList[this.currentGrd],clsItem)	
						}else if(this.serviced=='0'){
							this.getStuUnDGArray()
						}else if(this.serviced=='1'){
							this.getStuDGArray();
						}
					}
				}
				
			},
			userClick(user){
				user.checked=!user.checked
				this.$forceUpdate();
			},
			textClick(){
				const eventChannel = this.getOpenerEventChannel()
				if(this.dataFlag===1){
					eventChannel.emit('refreshSetPeople', {data: this.grdList.filter(item=>item.checked)});
					uni.navigateBack();
				}else if(this.dataFlag===2){
					let grdList=this.grdList.filter(clsItem=>clsItem.clsList)
					let newList=this.deepClone(grdList)
					let list=newList.filter(grdItem=>(grdItem.clsList=grdItem.clsList.filter(clsItem=>clsItem.checked)).length>0)
					eventChannel.emit('refreshSetPeople', {data: list});
					uni.navigateBack();
				}else if(this.dataFlag===3){
					let grdList=this.grdList.filter(clsItem=>clsItem.clsList)
					let newList=this.deepClone(grdList)
					let list=newList.filter(grdItem=>(grdItem.clsList=grdItem.clsList.filter(clsItem=>{
						clsItem.stuList=clsItem.stuList&&clsItem.stuList.filter(stuItem=>stuItem.checked)
						if(clsItem.stuList && clsItem.stuList.length>0){
							return clsItem.stuList 
						}
					})).length>0)
					eventChannel.emit('refreshSetPeople', {data: list});
					uni.navigateBack();
				}
			},
			collapseChange(e){
				let current='';
				if(e.length>this.collapse.length){
					current=e.filter(el => !this.collapse.includes(el))[0]
				}else{
					current=this.collapse.filter(el => !e.includes(el))[0]
				}
				if(!this.grdList[current].clsList){
					this.showLoading()
					this.getClsDataArray(this.grdList[current].value)
				}
				this.currentGrd=current
				this.collapse=e
			},
			deepClone(obj, newObj) {//对象深copy
				var newObj = newObj || [];
				for (let key in obj) {
					if (typeof obj[key] == 'object') {
						let isArray = Array.isArray(obj[key]) ;//判断是否数组
						newObj[key] = (isArray == true ? [] : {})
						this.deepClone(obj [key], newObj[key]);
					} else {
						newObj[key] = obj[key]
					}
				}
				return newObj ;
			},
			getGrdDataArray(){//获取年级
				let comData={
					get_grd: true,
					all_grd: false,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading();
					let grdList=response.grd_list
					if(grdList.length===0){
						this.showToast("暂无年级")
					}else{
						grdList.map(item=>{
							item.checked=false
							item.disabled=false
							if(this.dataFlag===1){
								this.selectDatas.map(item2=>{
									if(item.value==item2.value){
										item.checked=true
									}
								})
							}
						})
						this.grdList=grdList
					}
				})
			},
			getClsDataArray(grd_code){//根据年级获取班级
				let comData={
					grd_code: grd_code,
					get_cls: true,
					all_cls: false,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading();
					let clsList=response.cls_list
					if(clsList.length===0){
						this.grdList[this.currentGrd].disabled=true;
						this.showToast("暂无班级")
					}else{
						clsList.map(item=>{
							item.checked=false
							if(this.dataFlag===2){
								this.selectDatas.map(grdItem=>{
									if(grdItem.value==grd_code){
										grdItem.clsList.map(clsItem=>{
											if(item.value==clsItem.value){
												item.checked=true
											}
										})
									} 
								})
							}
						})
						this.grdList[this.currentGrd].clsList=clsList
					}
					this.$forceUpdate()
				})
			},
			getStuArray(grd,cls){//根据年级班级获取学生
				let grdCode=grd.value
				let clsCode=cls.value
				let grdName=grd.name
				let clsName=cls.name
				let comData={
					grd_codes:grdCode,
					cls_codes:clsCode,
					page_size: 100000,
					page_number: -1,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'stu',comData,response=>{
				    console.log("responseaaab: " + JSON.stringify(response));
					this.hideLoading();
					let stuList=response.list
					if(stuList.length===0){
						this.showToast("暂无学生")
						this.hasStuList=false
						cls.stuList=[]
						this.stuList=[]
					}else{
						this.hasStuList=true
						stuList.map(item=>{
							item.checked=false
							if(this.dataFlag===3){
								this.selectDatas.map(grdItem=>{
									if(grdItem.value==grd.value){
										grdItem.clsList.map(clsItem=>{
											if(clsItem.value==cls.value){
												clsItem.stuList.map(stuItem=>{
													if(stuItem.stu_code==item.stu_code){
														item.checked=true
													}
												})
												
											}
										})
									} 
								})
							}
						})
						cls.stuList=stuList
						this.stuList=stuList
						this.$forceUpdate()
					}
				})
			},
			getStuDGArray(){//根据年级班级获取已订购的学生
				
			},
			getStuUnDGArray(){//根据年级学生和已订购学生的差额，得到未订购的学生
				
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			console.log("itemData: " + JSON.stringify(itemData));
			this.dataFlag=itemData.dataFlag
			if(itemData.dataFlag===1){
				itemData.text='选择年级'
			}else if(itemData.dataFlag===2){
				itemData.text='选择班级'
			}else if(itemData.dataFlag===3){
				itemData.text='选择学生'
			}
			this.index_code=itemData.index_code
			this.selectDatas=itemData.selectDatas
			this.serviced=itemData.serviced
			setTimeout(()=>{
				this.showLoading()
				this.getGrdDataArray()
			}, 100);
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	 
	.select-scroll{
		/* #ifdef APP-PLUS */
		height: calc(100vh - 80px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 45px);
		/* #endif */
		background: #FBFBFB;
	}
	.warp .uni-list{
		background: #FFFFFF;
	}
	.uni-list-cell {
		justify-content: flex-start
	}
	.uni-list-cell.uni-list-cell-pd.collapse{
		padding-left: 20px;
	}
</style>
