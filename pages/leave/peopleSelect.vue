<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<uni-row>
			<uni-col :span="11" style="border-right: 1px solid rgba(238,238,238,.5);">
				<scroll-view class="select-scroll" scroll-y="true" >
					<mix-tree :list="list" @treeItemClick="treeItemClick" :nodeClick="true"></mix-tree>
				</scroll-view>
			</uni-col>
			<uni-col :span="13">
				<scroll-view class="select-scroll" scroll-y="true" >
					<uni-list class="uni-list" :border="false">
						<checkbox-group @change="checkboxChange">
							<label class="uni-list-cell uni-list-cell-pd" v-for="item in rightList" :key="item">
								<view>
									<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item" :checked="false" />
								</view>
								<view>{{item}}</view>
							</label>
						</checkbox-group>
					</uni-list>
				</scroll-view>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import mixTree from '@/components/mix-tree/mix-tree';
	
	let testList = [{
			id: 1,
			name: '北京市',
			children: [{
				id: 11,
				name: '市辖区',
				children: [{
						id: 111,
						name: '西城区',
						children: [{
							id: 1111,
							name: '南河沿大街',
							children: [{
								id: 11111,
								name: '紫金宫饭店',
							}, ]
						}, ]
					},
					{
						id: 112,
						name: '东城区',
					},
					{
						id: 113,
						name: '朝阳区',
					},
					{
						id: 113,
						name: '丰台区',
					}
				]
			}, ]
		},
		{
			id: 2,
			name: '河北省',
			children: [{
					id: 21,
					name: '石家庄市',
				},
				{
					id: 22,
					name: '唐山市',
				},
				{
					id: 23,
					name: '秦皇岛市',
				},
			]
		},
		{
			id: 3,
			name: '山东省',
			children: [{
					id: 31,
					name: '济南市',
					children: [{
							id: 311,
							name: '历下区',
							children: [{
								id: 3131,
								name: '解放路街道办事处',
							}, ]
						},
						{
							id: 312,
							name: '槐荫区',
						},
						{
							id: 313,
							name: '天桥区',
						},
						{
							id: 314,
							name: '历城区',
						},
						{
							id: 315,
							name: '长清区',
						}
					]
				},
				{
					id: 32,
					name: '青岛市',
				},
				{
					id: 33,
					name: '临沂市',
					children: [{
							id: 331,
							name: '兰山区',
							children: [{
								id: 3331,
								name: '金雀山街道',
							}, ]
						},
						{
							id: 332,
							name: '河东区',
						},
						{
							id: 333,
							name: '罗庄区',
							children: [{
								id: 3331,
								name: '盛庄街道',
							}, ]
						}
					]
				},
				{
					id: 34,
					name: '日照市',
				},
				{
					id: 35,
					name: '淄博市',
				},
				{
					id: 36,
					name: '枣庄市',
				},
				{
					id: 37,
					name: '东营市',
				},
				{
					id: 38,
					name: '潍坊市',
				},
				{
					id: 39,
					name: '烟台市',
				},
				{
					id: 40,
					name: '济宁市',
				},
				{
					id: 41,
					name: '泰安市',
				},
				{
					id: 42,
					name: '威海市',
				},
				{
					id: 43,
					name: '滨州市',
				},
				{
					id: 44,
					name: '菏泽市',
				},
			]
		},
		{
			id: 4,
			name: '河南省',
		},
		{
			id: 5,
			name: '湖北省',
		},
		{
			id: 6,
			name: '湖南省',
		}
	]
	
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				list:[],
				rightList:[]
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
			setTimeout(()=>{
				 this.list = testList;
				 for (var i = 0; i < 100; i++) {
				 	this.rightList.push(String(i))
				 }
			},10)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			treeItemClick(item) {
				let {id,name,parentId} = item;
				console.log(item)
			},
			checkboxChange: function (e) {
				// var items = this.items,
				let	values = e.detail.value;
				// for (var i = 0, lenI = items.length; i < lenI; ++i) {
				// 	const item = items[i]
				// 	if(values.indexOf(item.value) >= 0){
				// 		this.$set(item,'checked',true)
				// 	}else{
				// 		this.$set(item,'checked',false)
				// 	}
				// }
			}
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
