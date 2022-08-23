<template>
	<view>
		<mynavBar :navItem='navItem' :personInfo='personInfo' :text="navRight" :textClick="textClick"></mynavBar>
		<view>
			<view>
				<view class="title">学段</view>
				<view>
					<label v-for="(item, index) in items.per.list" :key='index' class="perList"
						@click="changePer(item.percode)"
						:style="{background:(item.percode==items.per.selected?'#00CFBD':'#ECECEC'),color:(item.percode==items.per.selected?'white':'')}">{{item.pername}}</label>
				</view>
				<br>
				<view class="title">科目</view>
				<view>
					<label v-for="(item, index) in items.sub.list" :key='index' class="perList"
						@click="changeSub(item.subcode)"
						:style="{background:(item.subcode==items.sub.selected?'#00CFBD':'#ECECEC'),color:(item.subcode==items.sub.selected?'white':'')}">{{item.subname}}</label>
				</view>
				<br>
				<view class="title">教版</view>
				<view>
					<label v-for="(item, index) in items.mater.list" :key='index' class="perList"
						@click="changeMater(item.matercode)"
						:style="{background:(item.matercode==items.mater.selected?'#00CFBD':'#ECECEC'),color:(item.matercode==items.mater.selected?'white':'')}">{{item.matername}}</label>
				</view>
				<br>
				<view class="title">分册</view>
				<view>
					<label v-for="(item, index) in items.fasc.list" :key='index' class="perList"
						@click="changeFasc(item.fasccode)" style="margin-bottom: 10px;"
						:style="{background:(item.fasccode==items.fasc.selected?'#00CFBD':'#ECECEC'),color:(item.fasccode==items.fasc.selected?'white':'')}">{{item.fascname}}</label>
				</view>
			</view>
		</view>
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
				navRight: '',
				catalog: [],
				items: {
					per: {
						list: []
					},
					sub: {
						list: []
					},
					mater: {
						list: []
					},
					fasc: {
						list: []
					}
				},
				isChange: false
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
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.navItem.index = 100;
			this.navItem.text = '切换教材'
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//当前教材
			var s_items = util.getStore('kycp_book_items');
			console.log('s_items:' + JSON.stringify(s_items));
			this.items.mater = s_items.mater || {
				list: []
			};
			this.items.sub = s_items.sub || {
				list: []
			};
			this.items.fasc = s_items.fasc || {
				list: []
			};
			this.items.per = s_items.per || {
				list: []
			};
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			textClick() {
				if (_this.isChange) {
					util.setStore("kycp_book_items", _this.items);
					util.setStore("orals_catalog", _this.catalog);
					util.setStore("orals_catalog_id", _this.catalog[0] ? _this.catalog[0].id : 0);
					const eventChannel = _this.getOpenerEventChannel()
					eventChannel.emit('refreshBook');
				}
				uni.navigateBack();
			},
			changePer: function(code) {
				if (code) {
					this.items.per.selected = code;
				}
				// 获取科目
				this.post(this.globaData.INTERFACE_KYCP + '/pub/resSub', {
					percode: this.items.per.selected,
					index_code: this.navItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					if (res.state == "ok") {
						this.items.sub.list = res.data
						this.items.mater.list = []
						this.items.fasc.list = []
						if (res.data[0] && res.data[0].subcode) {
							this.changeSub(res.data[0].subcode);
						} else {
							this.showToast('暂无科目');
							this.navRight = '';
						}
					} else {
						this.showToast(res.msg);
					}
				});
			},
			changeSub: function(code) {
				if (code) {
					this.items.sub.selected = code;
				}
				// 获取教版
				this.post(this.globaData.INTERFACE_KYCP + '/pub/resMater', {
					percode: this.items.per.selected,
					subcode: this.items.sub.selected,
					index_code: this.navItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					if (res.state == "ok") {
						this.items.mater.list = res.data;
						this.items.fasc.list = [];
						if (res.data[0] && res.data[0].matercode) {
							this.changeMater(res.data[0].matercode);
						} else {
							this.showToast('暂无教版');
							this.navRight = '';
						}
					} else {
						this.showToast(res.msg);
					}
				})
			},
			changeMater: function(code) {
				if (code) {
					this.items.mater.selected = code;
				}
				// 获取分册
				this.post(this.globaData.INTERFACE_KYCP + '/pub/resFasc', {
					percode: this.items.per.selected,
					subcode: this.items.sub.selected,
					matercode: this.items.mater.selected,
					index_code: this.navItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					if (res.state == "ok") {
						res.data.sort(util.compare('fasccode', 1));
						this.items.fasc.list = res.data
						if (res.data[0] && res.data[0].fasccode) {
							this.changeFasc(res.data[0].fasccode);
						} else {
							this.showToast('暂无分册');
							this.navRight = '';
						}
					} else {
						this.showToast(res.msg);
					}
				});
			},
			changeFasc: function(code) {
				console.log('changeFasc');
				if (code) {
					this.items.fasc.selected = code;
				}
				// 获取目录
				var data = this.getBookCodes(this.items);
				this.post(this.globaData.INTERFACE_KYCP + '/pub/catalog', {
					...data,
					index_code: this.navItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					if (res.state == "ok") {
						if (res.data && res.data.catalog) {
							this.navRight = '完成';
						} else {
							this.showToast('暂无分册');
							this.navRight = '';
						}
						this.isChange = true;
						//保存目录
						util.setStore("orals_menu", res.data.catalog);
						//保存分册目录
						this.catalog = this.getFinalCatalog(res.data.catalog.children);
					} else {
						this.showToast(res.msg);
					}
				});
			},
			// 获取教材code
			getBookCodes(book) {
				var codes = {};
				for (var key in book) {
					if (key == "per" || key == "sub" || key == "mater" || key == "fasc") {
						if (book[key].selected) codes[key + "code"] = book[key].selected;
					}
				}
				return codes;
			},
			//获取最末端目录
			getFinalCatalog(list) {
				var catalog = [];
				this.readTree(list, function(node) {
					if (!node.children) {
						catalog.push(node);
					}
				});
				catalog.forEach(function(v, i) {
					_this.readTree(list, function(node) {
						if (node.id == v.pid) {
							catalog[i]["pname"] = node.name;
						}
					});
				});
				return catalog;
			},
			// 遍历树形菜单，并回调
			readTree(tree, callback) {
				for (var i = 0; i < tree.length; i++) {
					callback(tree[i]);
					if (tree[i].children) {
						_this.readTree(tree[i].children, callback);
					}
				}
			}
		}
	}
</script>

<style>
	.title {
		color: #666;
		margin: 15px 0 10px 20px;
		font-size: 14px;
	}

	.perList {
		margin-left: 20px;
		border: 1px solid white;
		padding: 5px 20px;
		border-radius: 5px;
		font-size: 13px;
		float: left;
	}
</style>
