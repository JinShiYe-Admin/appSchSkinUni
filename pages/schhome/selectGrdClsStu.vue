<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<template v-if="dataFlag===1">
			<scroll-view class="select-scroll" scroll-y="true">
				<uni-list class="uni-list" :border="false">
					<checkbox-group >
						<label  class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in grdList" :key="index" @click="grdClick(item)">
							<view>
								<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" :disabled="item.disabled?item.disabled:false"/>
							</view>
							<view>{{item.name}}<text v-if="item.disabled" style="font-size: 12px;color: #5d5d5d;margin-left: 10px;">暂无学生</text></view>
						</label>
					</checkbox-group>
				</uni-list>
			</scroll-view>
		</template>
		<template v-else-if="dataFlag===2">
			<scroll-view class="select-scroll" scroll-y="true">
				<uni-collapse class="warp" @change="grdChange">
					<uni-collapse-item v-for="(grd, key) in grdList" :key="key" :disabled="grd.disabled" :title="grd.name">
						<uni-list class="uni-list" :border="false">
							<checkbox-group >
								<label  class="uni-list-cell uni-list-cell-pd collapse" v-for="(item,index) in grd.clsList" :key="index" @click="clsClick(key,item)">
									<view>
										<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" :disabled="item.disabled?item.disabled:false"/>
									</view>
									<view>{{item.name}}<text v-if="item.disabled" style="font-size: 12px;color: #5d5d5d;margin-left: 10px;">暂无学生</text></view>
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
						<uni-collapse class="warp" @change="grdChange">
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
						<template v-else><view style="margin: 10px 10px;"><text style="font-size: 13px;">{{noStuStr}}</text></view></template>
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
				currentGrdIndex:-1,//展开的窗口索引
				grdList:[],
				stuList:[],
				hasStuList:false,
				noStuStr:''
			}
		},
		components: {
			mynavBar
		},
		methods: {
			grdClick(grdItem){
				this.getStuArray(grdItem,0,stuList=>{
					if(stuList.length>0){
						grdItem.checked=!grdItem.checked
					}else{
						grdItem.checked=false
						grdItem.disabled=true
					}
					this.$forceUpdate();
				})
			},
			clsClick(currentGrdIndex,clsItem){
				this.currentGrdIndex=currentGrdIndex
				this.selectDatas.map(grditem=>{
					if(grditem.value==this.grdList[this.currentGrdIndex].value){
						grditem.clsList.map(clsitem=>{
							if(clsitem.value==clsItem.value){
								clsitem.clicked=true
							}
						})
					}
				})
				if(this.dataFlag===2){
					this.getStuArray(currentGrdIndex,clsItem,stuList=>{
						if(stuList.length>0){
							clsItem.checked=!clsItem.checked
						}else{
							clsItem.checked=false
							clsItem.disabled=true
						}
						this.$forceUpdate();
					})
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
							this.getStuArray(this.grdList[this.currentGrdIndex],clsItem)	
						}else if(this.serviced=='0'){
							this.getStuUnDGArray(this.grdList[this.currentGrdIndex],clsItem)
						}else if(this.serviced=='1'){
							this.getStuDGArray(this.grdList[this.currentGrdIndex],clsItem);
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
					this.selectDatas.map(grditem=>{
						if(!grditem.clicked){
							list.push(grditem)
						}
					})
					let newLists=list.sort(this.compare("value",1));
					eventChannel.emit('refreshSetPeople', {data: newLists});
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
					if(list.length===0){
						this.selectDatas.map(grditem=>{
							list.push(grditem)
						})
					}else{
						list.map(listItem=>{
							this.selectDatas.map(grditem=>{
								if(!grditem.clicked){
									list.push(grditem)
								}else{
									if(listItem.value==grditem.value){
										grditem.clsList.map(clsItem=>{
											if(!clsItem.clicked){
												listItem.clsList.push(clsItem)
											}
										})
									}
								}
							})
						})
					}
					let newLists=list.sort(this.compare("value",1));
					console.log("newLists: " + JSON.stringify(newLists));
					eventChannel.emit('refreshSetPeople', {data: newLists});
					uni.navigateBack();
				}
			},
			grdChange(e){
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
				this.selectDatas.map(grditem=>{
					if(grditem.value==this.grdList[current].value){
						grditem.clicked=true
					}
				})
				this.currentGrdIndex=current
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
			compare(propertyName, order) {//对象数组排序
				return function(object1, object2) {
					var value1 = parseInt(object1[propertyName]);
					var value2 = parseInt(object2[propertyName]);
					if (order == 0) {
						debugger
						if (value2 < value1) {
							return -1;
						} else if (value2 > value1) {
							return 1;
						} else {
							return 0;
						}
					}
					if (order == 1) {
						if (value2 > value1) {
							return -1;
						} else if (value2 < value1) {
							return 1;
						} else {
							return 0;
						}
					}
			
				}
			},
			getGrdDataArray(){//获取年级
				let comData={
					get_grd: true,
					all_grd: false,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    // console.log("responseaaa: " + JSON.stringify(response));
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
				    // console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading();
					let clsList=response.cls_list
					if(clsList.length===0){
						this.grdList[this.currentGrdIndex].disabled=true;
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
						this.grdList[this.currentGrdIndex].clsList=clsList
					}
					this.$forceUpdate()
				})
			},
			getStuArray(grd,cls,callback){//根据年级班级获取学生
				let comData={
					grd_codes:grd.value,
					cls_codes:cls?cls.value:'',
					page_size: 100000,
					page_number: -1,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'stu',comData,response=>{
				    // console.log("responseaaab: " + JSON.stringify(response));
					this.hideLoading();
					let stuList=response.list
					if(callback){
						callback(stuList)
						return 0
					}
					if(stuList.length===0){
						// this.showToast("暂无学生")
						this.noStuStr="暂无学生"
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
			getStuDGArray(grd,cls,callback){//根据年级班级获取已订购的学生
				let comData={
					grd_code:grd.value,//接口只能传单个
					cls_code:cls.value,//接口只能传单个
					op_code:"index",
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'stu/servStuList',comData,response=>{
				    // console.log("responseaaab: " + JSON.stringify(response));
					this.hideLoading();
					let stuList=response.list
					if(callback){
						callback(stuList)
						return 0
					}
					if(stuList.length===0){
						// this.showToast("暂无已订购学生")
						this.noStuStr="暂无订购学生"
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
			getStuUnDGArray(grd,cls){//根据年级学生和已订购学生的差额，得到未订购的学生
				let that =this
				this.getStuArray(grd,cls,allStuList=>{
					this.getStuDGArray(grd,cls,dgStuList=>{
						if(allStuList.length===0){
							that.noStuStr="暂无学生"
							that.hasStuList=false
							cls.stuList=[]
							that.stuList=[]
							that.$forceUpdate()
						}else{
							if(dgStuList.length===0){
								that.hasStuList=true
								allStuList.map(item=>{
									item.checked=false
									if(that.dataFlag===3){
										that.selectDatas.map(grdItem=>{
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
								cls.stuList=allStuList
								that.stuList=allStuList
								that.$forceUpdate()
							}else{
								that.hasStuList=true
								let unDGStu=[];
								allStuList.map(aitem=>{
									let push=true
									dgStuList.map(dgitem=>{
										if(aitem.stu_code==dgitem.stu_code){
											push=false
										}
									})
									if(push){
										unDGStu.push(aitem)
									}
								})
								if(unDGStu.length>0){
									that.hasStuList=true
									unDGStu.map(item=>{
										item.checked=false
										if(that.dataFlag===3){
											that.selectDatas.map(grdItem=>{
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
									cls.stuList=unDGStu
									that.stuList=unDGStu
									that.$forceUpdate()
								}else{
									that.noStuStr="暂无学生"
									that.hasStuList=false
									cls.stuList=[]
									that.stuList=[]
									that.$forceUpdate()
								}
							}
						}
					})
				})
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
