<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navRightBtn"
			@textClickRight="textClickRight"></mynavBar>
		<!-- <scroll-view class="select-scroll" scroll-y="true">
			<uni-list class="uni-list" :border="false">
				<checkbox-group>
					<label class="uni-list-cell uni-list-cell-pd" v-for="(peopleModel,index) in peopleArray"
						:key="index" @click="selectPeople(peopleModel)">
						<view>
							<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="peopleModel.value"
								:checked="peopleModel.checked" />
						</view>
						<view>{{peopleModel.user_name}}({{peopleModel.dpt_name}})</view>
					</label>
				</checkbox-group>
			</uni-list>
		</scroll-view> -->
		<ly-tree v-if="needOrder != 1" :tree-data="peopleArray" ref="tree" 
			:props="defaultProps" 
			node-key="id" 
			:default-checked-keys="checkedKeys"
			show-checkbox 
			@check="handleCheck"
			@check-change="handleCheckChange" 
		/>
		<ly-tree v-if="needOrder == 1" :tree-data="peopleArray" ref="tree" 
			:props="defaultProps" 
			node-key="id" 
			:default-checked-keys="checkedKeys"
			show-checkbox  
			check-only-leaf 
			@check="handleCheck"
			@check-change="handleCheckChange" />
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				navRightBtn: [],
				navRightCallback: [],
				needOrder: 9, //
				orderArray: [], //当needOrder==1时，需要按选择的人顺序，塞入的人员数组
				// defaltSelect: [], //从上个界面传过来的已选接收人
				peopleArray: [], //接口得到的接收人列表
				allPeople:[],//获取到的所有人员
				checkedKeys: [],
				permissionValue:[],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				dptList:[],//所在部门列表
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			// #ifndef MP
			this.navItem.text = '选择接收人';
			// #endif
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			// this.defaltSelect = this.navItem.selectPeople;
			this.needOrder = this.navItem.needOrder;
			// if (this.needOrder == 0) {
			// 	this.navRightBtn = ['全选', '反选', '确定'];
			// 	this.navRightCallback = [this.selectAll, this.returnSelectAll, this.sure];
			// } else {
				this.navRightBtn = ['确定'];
				this.navRightCallback = [this.sure];
			// }
			// this.checkedKeys = [].concat(this.navItem.idsArray);
			uni.setNavigationBarTitle({
				title: '选择接收人'
			});
			//#ifdef H5
			document.title = "";
			//#endif
			// 获取权限
			this.showLoading();
			//获取接收人列表
			this.getPermissionByPosition('alluser,upuser,grduser', this.navItem.access.split('#')[1], result => {
				// console.log('result:' + JSON.stringify(result));
				this.hideLoading();
				this.permissionValue = result;
				// if (result[2]) {
					// 获取任教年级教师
					this.getTeachList();
				// }
				// this.getPeopleList();
			})
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			textClickRight(data) {
				_this.sure();
			},
			sure() {
				// console.log('sure');
				// console.log('this.orderArray:'+JSON.stringify(_this.orderArray));
			
				if (_this.needOrder == 1) {
					var tempArr1 = [];
					var idsArray = [];
					for (var i = 0; i < _this.orderArray.length; i++) {
						idsArray.push(_this.orderArray[i].id);
						if (_this.orderArray[i].id.length>5) {
							tempArr1.push(_this.orderArray[i]);
						}
					}
					if (tempArr1.length == 0) {
						_this.showToast('请选择接收人');
					} else {
						const eventChannel = _this.getOpenerEventChannel()
						eventChannel.emit('refreshSetPeople', {
							data: tempArr1,
							idsArray:idsArray
						});
						uni.navigateBack();
					}
				} else {
					var tempArr0 = _this.$refs.tree.getCheckedKeys(true);
					// console.log('tempArr0:'+JSON.stringify(tempArr0));
					var tempArr1 = [];
					// var idsArray = tempArr0;
					for (var i = 0; i < tempArr0.length; i++) {
						if (tempArr0[i].length>5) {
							for (var a = 0; a < _this.allPeople.length; a++) {
								var tempP = _this.allPeople[a];
								if (tempArr0[i].slice(0,19)==tempP.user_code) {
									tempArr1.push(tempP);
								}
							}
						}
					}
					tempArr1 = _this.ArrayUnique(tempArr1, 'user_code');
					// console.log('tempArr1:'+JSON.stringify(tempArr1));
					if (tempArr1.length == 0) {
						_this.showToast('请选择接收人');
					} else {
						const eventChannel = _this.getOpenerEventChannel()
						eventChannel.emit('refreshSetPeople', {
							data: tempArr1,
							idsArray:tempArr0
						});
						uni.navigateBack();
					}
				}
			},
			// 获取任教年级教师
			getTeachList() {
				var comData = {
					index_code: this.navItem.access.split('#')[1] //
				}
				this.showLoading();
				//获取接收人列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'user/userInfo', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempGrd = [];
						if (data.data.master_cls_list) {
							data.data.master_cls_list.forEach((item) => {
								tempGrd.push(item.grd_code);
							});
						}
						if (data.data.tec_cls_list) {
							data.data.tec_cls_list.forEach((item) => {
								tempGrd.push(item.grd_code);
							});
						}
						if (data.data.grd_boss_list) {
							data.data.grd_boss_list.forEach((item) => {
								tempGrd.push(item.grd_code);
							});
						}
						if (data.data.dpt_list) {
							this.dptList = data.data.dpt_list;
						}
						// 
						this.getPeopleList();
						if (this.permissionValue[2]) {
							if (tempGrd.length > 0) {
								var comData = {
									grd_codes: tempGrd.join(','),
									is_finish: 0,
									index_code: this.navItem.access.split('#')[1] //
								}
								this.showLoading();
								//1.11.班级列表
								this.post(this.globaData.INTERFACE_HR_SUB + 'cls', comData, (data0, data) => {
									this.hideLoading();
									if (data.code == 0) {
										var tempCls = [];
										if (data.data.list) {
											data.data.list.forEach((item) => {
												tempCls.push(item.cls_code);
											});
										}
										var comData = {
											cls_codes: tempCls.join(','),
											serv_stat: -1, //有无订购
											uid_stat: this.navItem.uid_stat, //有无账号
											user_stat: 1, //账号状态
											index_code: this.navItem.access.split('#')[1] //
										}
										this.showLoading();
										//1.14.班级任教列表
										this.post(this.globaData.INTERFACE_HR_SUB + 'clsTec', comData, (data0,
											data) => {
											this.hideLoading();
											if (data.code == 0) {
												data.data.list = _this.ArrayUnique(data.data.list, 'user_code');
												this.allPeople = this.allPeople.concat(data.data.list);
												for (var i = 0; i < data.data.list.length; i++) {
													var tempM = data.data.list[i];
													tempM.name = tempM.user_name;
													tempM.label = tempM.user_name;
													tempM.id = tempM.user_code + tempM.grd_code + tempM.cls_code + tempM.sub_code;
												}
												var tempM = {
													name:'任教年级教师',
													label:'任教年级教师',
													id:'9999',
													children:data.data.list
												}
												// console.log('tempM:'+JSON.stringify(tempM));
												this.peopleArray.unshift(tempM);
												setTimeout(()=>{
													this.checkedKeys = [].concat(this.navItem.idsArray);
												},500);
											} else {
												this.showToast(data.msg);
											}
										});
									} else {
										this.showToast(data.msg);
									}
								});
							} else {
							
							}
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 获取接收人列表
			getPeopleList() {
				var comData = {
					index_code: this.navItem.access.split('#')[1] //
				}
				this.showLoading();
				//获取接收人列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'dpt', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var dptList = data.data.list
						var tempDpt = [];
						if (this.permissionValue[0]) {
							tempDpt = [].concat(dptList);
						} else {
							for (var i = 0; i < dptList.length; i++) {
								var tempD = dptList[i];
								for (var a = 0; a < this.dptList.length; a++) {
									var tempA = this.dptList[a];
									if (tempD.dpt_code == tempA.dpt_code) {
										tempDpt.push(tempD);
									}
									if (tempD.pcode == tempA.dpt_code) {
										tempDpt.push(tempD);
									}
								}
								
							}
							if (this.permissionValue[1]) {
								for (var a = 0; a < this.dptList.length; a++) {
									var tempA = this.dptList[a];
									var tempF = 0;
									for (var b = 0; b < dptList.length; b++) {
										var tempB = dptList[b];
										if (tempB.dpt_code == tempA.dpt_code) {
											tempF = tempA.pcode;
											for (var c = 0; c < dptList.length; c++) {
												var tempC = dptList[c];
												if (tempC.dpt_code == tempF) {
													tempDpt.push(tempC);
												}
											}
										}
										
									}
								}
							}
						}
						tempDpt = _this.ArrayUnique(tempDpt, 'dpt_code');
						console.log('tempDpt:'+JSON.stringify(tempDpt))
						tempDpt.map(item => {
							item.name = item.dpt_name
							item.label = item.dpt_name
							item.id = item.dpt_code
						})
						var tempServ = 0;
						if (this.navItem.serviced == 0 || this.navItem.serviced == 1) {
							tempServ = this.navItem.serviced;
						} else {
							tempServ = -1;
						}
						var comData1 = {
							serv_stat: tempServ, //
							uid_stat: this.navItem.uid_stat,
							user_stat: 1,
							unit_code: this.personInfo.unit_code, //
							index_code: this.navItem.access.split('#')[1] //
						}
						this.showLoading();
						//获取接收人列表
						this.post(this.globaData.INTERFACE_HR_SUB + 'dptUserOfApp', comData1, (data0, data1) => {
							this.hideLoading();
							if (data1.code == 0) {
								if (data1.data.list) {
									this.allPeople = this.allPeople.concat(data1.data.list);
									for (var a = 0; a < tempDpt.length; a++) {
										var tempM1 = tempDpt[a];
										tempM1.children = [];
										for (var i = 0; i < data1.data.list.length; i++) {
											var tempM = data1.data.list[i];
											tempM.name = tempM.user_name
											tempM.label = tempM.user_name
											tempM.id = tempM.user_code + tempM.dpt_code;
											if (tempM.dpt_code == tempM1.dpt_code) {
												tempM1.children.push(tempM);
											}
										}
										if (tempM1.children.length>0) {
											tempM1.children = _this.ArrayUnique(tempM1.children, 'user_code');
										}
									}
								}
								this.peopleArray = this.peopleArray.concat(this.getDptTree(tempDpt));
								setTimeout(()=>{
									this.checkedKeys = [].concat(this.navItem.idsArray);
								},500);
							} else {
								this.showToast(data1.msg);
							}
						});
					} else {
						this.showToast(data.msg);
					}
				});
			},
			handleCheck(obj) {
				// obj: {
				// 	checkedKeys: [9, 5], // 当前选中节点的id数组
				// 	checkedNodes: [{...}, {...}], // 当前选中节点数组
				// 	data: {...}, // 当前节点的数据
				// 	halfCheckedKeys: [1, 4, 2], // 半选中节点的id数组
				// 	halfCheckedNodes: [{...}, {...}, {...}], // 半选中节点的数组
				// 	node: Node {...} // 当前节点实例
				// }

				// console.log('handleCheck:'+JSON.stringify(obj.data));
				if (_this.needOrder == 1) {
					var tempFlag = 0;
					var tempIndex = 0;
					for (var i = 0; i < this.orderArray.length; i++) {
						var tempM = this.orderArray[i];
						if (tempM.id == obj.data.id) {
							tempIndex = i;
							tempFlag++;
						}
					}
					if (tempFlag == 0) {
						this.orderArray.push(obj.data);
					} else{
						this.orderArray.splice(tempIndex, 1);
					}
				}
			},

			// 只要节点的选中或半选中状态改变就触发（包括设置默认选中，点击选中/取消选中），其相关的所有父子节点都会触发（也就是说选中一个节点时，触发多次，父子节点的选中状态只要被修改就会触发）
			handleCheckChange(obj) {
				// obj: {
				// 	checked: true, // 节点是否选中
				// 	checkedall: false, // 当前树的所有节点是否全选中
				// 	data: {...}, // 节点数据
				// 	indeterminate: false, // 是否半选中
				// 	node: Node {...} // 节点实例
				// }

				// console.log('handleCheckChange', obj);
			},
			getDptTree(dptList) {
				const map = {};
				const val = [];
				dptList.forEach((item) => {
					map[item.dpt_code] = item;
				});
				dptList.forEach((item) => {
					const parent = map[item.pcode];
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
						// (parent.children || (parent.children = [])).unshift(item);
					} else {
						val.push(item);
					}
				});
				return val
			},
			noRepeat1(arr){
			    // 第一层for用来控制循环的次数
			    for(var i=0; i<arr.length; i++){
			        //第二层for 用于控制与第一层比较的元素
			        for(var j=i+1; j<arr.length; j++){
			            //如果相等
			            if(arr[i] == arr[j]){
			                //删除后面的 即第 j个位置上的元素  删除个数 1 个
			                arr.splice(j,1);
			                // j--很关键的一步  如果删除 程序就会出错 
			                //j--的原因是 每次使用splice删除元素时 返回的是一个新的数组 
			                // 这意味这数组下次遍历是 比较市跳过了一个元素
			                /*
			                    例如&#xff1a; 第一次删除后 返回的是 1 1 3 2 1 2 4
			                 *  但是第二次遍历是 j的值为2  arr[2] = 3
			                 *  相当于跳过一个元素 因此要 j--
			                 * */
			                j--;
			            }
			        }
			    }
			    return arr;
			},
			//给数组去重
			ArrayUnique(array, key) {
				var arr = array;
				var n = [arr[0]];
				for (var i = 1; i < arr.length; i++) {
					if (key === undefined) {
						if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
					} else {
						inner: {
							var has = false;
							for (var j = 0; j < n.length; j++) {
								if (arr[i][key] == n[j][key]) {
									has = true;
									break inner;
								}
							}
						}
						if (!has) {
							n.push(arr[i]);
						}
					}
				}
				return n;
			}
		}
	}
</script>

<style>
	.form-right {
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}

	.select-scroll {
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
