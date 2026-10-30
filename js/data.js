/*
 * 岛屿数据（第一版，编辑整理，未经酒店官方核验）
 *
 * 数据置信度约定：
 *   atoll / transfer.mode   高：环礁位置、上岛方式长期稳定
 *   transfer.minutes        中：近似值，受天气、航班拼机影响
 *   reef / beach            中：编辑综合公开评价的主观评分（1–5）
 *   tier                    低：价格随季节、房型、促销波动极大，仅表示档位
 *   kids 年龄限制           中：政策会调整，预订前需向酒店确认
 *   verify                  列出本条目中最需要复核的字段
 */
window.DATA_UPDATED = "2026-10";

window.TIERS = {
  1: { label: "经济", range: "约 ¥2,000–4,000 / 晚" },
  2: { label: "中档", range: "约 ¥4,000–7,000 / 晚" },
  3: { label: "高端", range: "约 ¥7,000–12,000 / 晚" },
  4: { label: "奢华", range: "约 ¥12,000 以上 / 晚" }
};

window.TRANSFER = {
  speedboat: "快艇",
  seaplane: "水上飞机",
  domestic: "内飞 + 快艇"
};

window.KIDS = {
  club: "有儿童俱乐部",
  ok: "可带孩子",
  limit: "限龄入住",
  adults: "仅限成人"
};

window.ISLANDS = [
  { id: "soneva-fushi", zh: "索尼娃芙西", en: "Soneva Fushi", atoll: "芭环礁 Baa",
    transfer: { mode: "seaplane", minutes: 30, note: "也可内飞达拉万度后转快艇" },
    tier: 4, reef: 2, beach: 5, size: "L", waterVilla: false, ai: false, kids: "club",
    tags: ["赤脚理念", "露天影院", "天文台", "丛林大别墅"],
    pros: ["岛大林密，别墅私密感极强", "儿童设施是全马代顶级之一"],
    cons: ["屋礁离岸较远，浮潜要坐船出海", "价格处于金字塔尖"],
    verify: ["tier", "waterVilla"] },

  { id: "soneva-jani", zh: "索尼娃贾尼", en: "Soneva Jani", atoll: "努努环礁 Noonu",
    transfer: { mode: "seaplane", minutes: 60, note: "" },
    tier: 4, reef: 2, beach: 4, size: "L", waterVilla: true, ai: false, kids: "club",
    tags: ["水屋滑梯", "可开顶卧室", "超大泻湖"],
    pros: ["水屋带滑梯直入泻湖，拍照辨识度高", "泻湖平静，适合不会游泳的人下水"],
    cons: ["泻湖浅，珊瑚少，浮潜一般", "水飞时间较长"],
    verify: ["tier", "transfer.minutes"] },

  { id: "cheval-blanc", zh: "白马庄园", en: "Cheval Blanc Randheli", atoll: "努努环礁 Noonu",
    transfer: { mode: "seaplane", minutes: 45, note: "" },
    tier: 4, reef: 3, beach: 5, size: "M", waterVilla: true, ai: false, kids: "club",
    tags: ["LVMH 旗下", "设计感", "私人岛别墅"],
    pros: ["设计与服务细节极致", "沙滩细白，海水颜色漂亮"],
    cons: ["浮潜中等，不是潜水首选", "餐饮与消费价格高"],
    verify: ["tier"] },

  { id: "fs-landaa", zh: "四季兰达吉拉瓦鲁", en: "Four Seasons Landaa Giraavaru", atoll: "芭环礁 Baa",
    transfer: { mode: "seaplane", minutes: 35, note: "" },
    tier: 4, reef: 3, beach: 4, size: "L", waterVilla: true, ai: false, kids: "club",
    tags: ["汉尼法鲁湾蝠鲼", "海洋保育中心", "阿育吠陀 SPA"],
    pros: ["靠近汉尼法鲁湾，季节对时可看蝠鲼群", "亲子活动与海洋科普丰富"],
    cons: ["蝠鲼有季节性（约 6–11 月）", "屋礁一般，好浮潜要出海"],
    verify: ["tier"] },

  { id: "fs-kudahuraa", zh: "四季库达呼拉", en: "Four Seasons Kuda Huraa", atoll: "北马累环礁 North Malé",
    transfer: { mode: "speedboat", minutes: 25, note: "" },
    tier: 4, reef: 2, beach: 4, size: "M", waterVilla: true, ai: false, kids: "club",
    tags: ["快艇直达", "冲浪", "四季服务"],
    pros: ["快艇上岛，晚到也能当天入住", "四季品牌服务稳定"],
    cons: ["屋礁较弱", "价格偏高"],
    verify: ["tier"] },

  { id: "oo-reethirah", zh: "OO 丽世岛", en: "One&Only Reethi Rah", atoll: "北马累环礁 North Malé",
    transfer: { mode: "speedboat", minutes: 50, note: "" },
    tier: 4, reef: 2, beach: 5, size: "L", waterVilla: true, ai: false, kids: "club",
    tags: ["12 片沙滩", "大岛", "顶级 SPA"],
    pros: ["岛大、沙滩多，度假感完整", "快艇可达，不受水飞时间限制"],
    cons: ["快艇约 50 分钟，晕船者要注意", "浮潜一般"],
    verify: ["tier", "transfer.minutes"] },

  { id: "waldorf", zh: "华尔道夫伊塔法鲁", en: "Waldorf Astoria Ithaafushi", atoll: "南马累环礁 South Malé",
    transfer: { mode: "speedboat", minutes: 40, note: "游艇接驳" },
    tier: 4, reef: 3, beach: 4, size: "L", waterVilla: true, ai: false, kids: "club",
    tags: ["游艇接驳", "多家餐厅", "私人岛"],
    pros: ["餐厅选择多，适合吃货", "游艇上岛体验好"],
    cons: ["岛屿为人工整形，自然感略弱", "价格高"],
    verify: ["tier"] },

  { id: "stregis", zh: "瑞吉沃姆利", en: "The St. Regis Vommuli", atoll: "达鲁环礁 Dhaalu",
    transfer: { mode: "seaplane", minutes: 45, note: "" },
    tier: 4, reef: 3, beach: 4, size: "L", waterVilla: true, ai: false, kids: "club",
    tags: ["建筑设计", "管家服务", "鲸鱼酒吧"],
    pros: ["建筑造型独特，适合拍照", "管家服务完善"],
    cons: ["水飞较远", "屋礁中等"],
    verify: ["tier"] },

  { id: "conrad", zh: "港丽伦格里", en: "Conrad Maldives Rangali Island", atoll: "南阿里环礁 South Ari",
    transfer: { mode: "seaplane", minutes: 30, note: "" },
    tier: 3, reef: 4, beach: 4, size: "L", waterVilla: true, ai: false, kids: "club",
    tags: ["Ithaa 海底餐厅", "双岛", "海底别墅"],
    pros: ["海底餐厅全马代知名", "双岛设计：一岛偏亲子，一岛偏情侣"],
    cons: ["岛大，步行或骑车距离远", "海底餐厅需提前预订且价格高"],
    verify: ["tier"] },

  { id: "baros", zh: "巴洛斯", en: "Baros Maldives", atoll: "北马累环礁 North Malé",
    transfer: { mode: "speedboat", minutes: 25, note: "" },
    tier: 3, reef: 5, beach: 4, size: "S", waterVilla: true, ai: false, kids: "limit",
    kidsNote: "多数来源称 8 岁以上可入住",
    tags: ["蜜月经典", "顶级屋礁", "小而精"],
    pros: ["屋礁离岸近，下水就能看到鱼和海龟", "快艇上岛方便"],
    cons: ["岛小，活动以安静放松为主", "不适合带小童"],
    verify: ["tier", "kidsNote"] },

  { id: "gili", zh: "吉利兰卡富士", en: "Gili Lankanfushi", atoll: "北马累环礁 North Malé",
    transfer: { mode: "speedboat", minutes: 20, note: "" },
    tier: 4, reef: 3, beach: 3, size: "M", waterVilla: true, ai: false, kids: "ok",
    tags: ["全水屋", "No News No Shoes", "鲁滨逊别墅"],
    pros: ["全水屋设计，私密安静", "快艇很近"],
    cons: ["沙滩不是强项", "价格高"],
    verify: ["tier"] },

  { id: "kurumba", zh: "库鲁巴", en: "Kurumba Maldives", atoll: "北马累环礁 North Malé",
    transfer: { mode: "speedboat", minutes: 10, note: "" },
    tier: 2, reef: 2, beach: 4, size: "M", waterVilla: false, ai: false, kids: "club",
    tags: ["离机场最近之一", "多餐厅", "亲子"],
    pros: ["10 分钟快艇，适合短假或带老人", "餐厅多，选择丰富"],
    cons: ["没有水屋", "离机场近，能看到飞机起降"],
    verify: ["tier"] },

  { id: "vilamendhoo", zh: "薇拉曼德", en: "Vilamendhoo Island Resort", atoll: "南阿里环礁 South Ari",
    transfer: { mode: "seaplane", minutes: 25, note: "" },
    tier: 2, reef: 5, beach: 4, size: "L", waterVilla: true, ai: true, kids: "ok",
    tags: ["性价比全包", "顶级屋礁", "海龟"],
    pros: ["屋礁一流，性价比高", "全包选项成熟"],
    cons: ["岛大且客人多，私密感一般", "硬件不如新开度假村"],
    verify: ["tier"] },

  { id: "kuramathi", zh: "库拉玛提", en: "Kuramathi Maldives", atoll: "拉斯杜环礁 Rasdhoo",
    transfer: { mode: "seaplane", minutes: 20, note: "也可快艇约 90 分钟" },
    tier: 2, reef: 4, beach: 5, size: "L", waterVilla: true, ai: true, kids: "club",
    tags: ["长沙洲", "大岛", "全包"],
    pros: ["沙洲很美，岛上设施齐全", "晚到可选快艇，不必在马累过夜"],
    cons: ["岛很大，需要步行或坐电瓶车", "快艇 90 分钟，晕船者慎选"],
    verify: ["tier"] },

  { id: "centara-grand", zh: "圣塔拉", en: "Centara Grand Island Resort", atoll: "南阿里环礁 South Ari",
    transfer: { mode: "seaplane", minutes: 30, note: "" },
    tier: 2, reef: 3, beach: 4, size: "M", waterVilla: true, ai: true, kids: "club",
    tags: ["全包", "亲子", "长泻湖"],
    pros: ["全包内容实在，带娃省心", "儿童俱乐部完善"],
    cons: ["屋礁中等", "旺季客人多"],
    verify: ["tier"] },

  { id: "bandos", zh: "班多斯", en: "Bandos Maldives", atoll: "北马累环礁 North Malé",
    transfer: { mode: "speedboat", minutes: 15, note: "" },
    tier: 1, reef: 3, beach: 3, size: "M", waterVilla: true, ai: true, kids: "club",
    tags: ["入门首选", "离机场近", "潜水中心"],
    pros: ["预算友好，交通便宜", "设施齐全"],
    cons: ["硬件偏老", "沙滩与海水颜色一般"],
    verify: ["tier"] },

  { id: "filitheyo", zh: "菲利亚岛", en: "Filitheyo Island Resort", atoll: "法鲁环礁 Faafu",
    transfer: { mode: "seaplane", minutes: 45, note: "也可内飞" },
    tier: 1, reef: 5, beach: 3, size: "M", waterVilla: true, ai: true, kids: "ok",
    tags: ["浮潜天堂", "性价比", "原生态"],
    pros: ["屋礁一圈都是好浮潜点", "价格亲民"],
    cons: ["交通费占比高", "设施朴素"],
    verify: ["tier", "transfer.minutes"] },

  { id: "embudu", zh: "恩布杜", en: "Embudu Village", atoll: "南马累环礁 South Malé",
    transfer: { mode: "speedboat", minutes: 20, note: "" },
    tier: 1, reef: 5, beach: 3, size: "S", waterVilla: true, ai: true, kids: "ok",
    tags: ["潜水客常去", "屋礁陡坡", "小岛"],
    pros: ["屋礁陡坡多鱼，潜水浮潜都适合", "快艇近，价格低"],
    cons: ["硬件简单", "适合玩水的人，不适合追求奢华的人"],
    verify: ["tier"] },

  { id: "velassaru", zh: "薇拉沙", en: "Velassaru Maldives", atoll: "南马累环礁 South Malé",
    transfer: { mode: "speedboat", minutes: 20, note: "" },
    tier: 3, reef: 2, beach: 5, size: "M", waterVilla: true, ai: false, kids: "ok",
    tags: ["白沙", "现代设计", "蜜月"],
    pros: ["沙滩与泻湖颜色出片", "快艇近"],
    cons: ["屋礁弱，浮潜需出海"],
    verify: ["tier"] },

  { id: "anantara-veli", zh: "安纳塔拉维利", en: "Anantara Veli", atoll: "南马累环礁 South Malé",
    transfer: { mode: "speedboat", minutes: 35, note: "" },
    tier: 3, reef: 2, beach: 4, size: "M", waterVilla: true, ai: false, kids: "adults",
    tags: ["成人岛", "可跨岛用餐", "冲浪"],
    pros: ["成人岛，环境安静", "可去姐妹岛 Dhigu 用餐"],
    cons: ["浮潜一般"],
    verify: ["tier", "kids"] },

  { id: "anantara-dhigu", zh: "安纳塔拉笛古", en: "Anantara Dhigu", atoll: "南马累环礁 South Malé",
    transfer: { mode: "speedboat", minutes: 35, note: "" },
    tier: 3, reef: 2, beach: 4, size: "M", waterVilla: true, ai: false, kids: "club",
    tags: ["亲子", "冲浪", "跨岛餐饮"],
    pros: ["亲子友好，活动丰富", "姐妹岛资源共享"],
    cons: ["浮潜一般"],
    verify: ["tier"] },

  { id: "constance-halaveli", zh: "康斯坦斯哈拉维利", en: "Constance Halaveli", atoll: "北阿里环礁 North Ari",
    transfer: { mode: "seaplane", minutes: 25, note: "" },
    tier: 3, reef: 3, beach: 4, size: "M", waterVilla: true, ai: true, kids: "club",
    tags: ["全包", "酒窖", "水屋泳池"],
    pros: ["水屋带私人泳池", "全包档次较高"],
    cons: ["屋礁中等"],
    verify: ["tier"] },

  { id: "constance-moofushi", zh: "康斯坦斯慕芙希", en: "Constance Moofushi", atoll: "南阿里环礁 South Ari",
    transfer: { mode: "seaplane", minutes: 35, note: "" },
    tier: 2, reef: 5, beach: 4, size: "S", waterVilla: true, ai: true, kids: "ok",
    tags: ["标配全包", "顶级屋礁", "潜水"],
    pros: ["标配全包，预算可控", "屋礁与周边潜点出色"],
    cons: ["岛小，娱乐设施有限", "无儿童俱乐部"],
    verify: ["tier"] },

  { id: "lux-south-ari", zh: "丽世南阿里", en: "LUX* South Ari Atoll", atoll: "南阿里环礁 South Ari",
    transfer: { mode: "seaplane", minutes: 25, note: "" },
    tier: 3, reef: 3, beach: 5, size: "L", waterVilla: true, ai: false, kids: "club",
    tags: ["鲸鲨海域", "长沙滩", "活力氛围"],
    pros: ["靠近鲸鲨常出没海域", "沙滩长，氛围活泼"],
    cons: ["鲸鲨属野生动物，不保证遇见", "岛长，别墅间距离远"],
    verify: ["tier"] },

  { id: "lily-beach", zh: "百合沙滩", en: "Lily Beach Resort", atoll: "南阿里环礁 South Ari",
    transfer: { mode: "seaplane", minutes: 30, note: "" },
    tier: 3, reef: 4, beach: 4, size: "M", waterVilla: true, ai: true, kids: "club",
    tags: ["铂金全包", "屋礁好", "亲子"],
    pros: ["全包包含内容多", "屋礁表现好"],
    cons: ["旺季价格涨幅大"],
    verify: ["tier"] },

  { id: "hurawalhi", zh: "呼拉瓦黎", en: "Hurawalhi Island Resort", atoll: "拉维亚尼环礁 Lhaviyani",
    transfer: { mode: "seaplane", minutes: 40, note: "" },
    tier: 3, reef: 3, beach: 4, size: "M", waterVilla: true, ai: true, kids: "adults",
    kidsNote: "最低入住年龄各来源说法不一（15–18 岁）",
    tags: ["5.8 海底餐厅", "成人岛", "蜜月"],
    pros: ["海底餐厅体验独特", "成人岛，安静浪漫"],
    cons: ["水飞较远", "海底餐厅另收费且需预订"],
    verify: ["tier", "kidsNote"] },

  { id: "sun-siyam-irufushi", zh: "伊露富士", en: "Sun Siyam Iru Fushi", atoll: "努努环礁 Noonu",
    transfer: { mode: "seaplane", minutes: 45, note: "" },
    tier: 3, reef: 3, beach: 4, size: "L", waterVilla: true, ai: true, kids: "club",
    tags: ["大岛", "亲子", "多餐厅"],
    pros: ["岛大设施多，适合多代同游", "全包可选"],
    cons: ["水飞较远"],
    verify: ["tier"] },

  { id: "joali", zh: "JOALI", en: "JOALI Maldives", atoll: "拉环礁 Raa",
    transfer: { mode: "seaplane", minutes: 45, note: "" },
    tier: 4, reef: 3, beach: 4, size: "M", waterVilla: true, ai: false, kids: "club",
    tags: ["艺术主题", "设计酒店", "亲子"],
    pros: ["岛上遍布艺术装置", "设计感强"],
    cons: ["价格高", "水飞较远"],
    verify: ["tier"] },

  { id: "milaidhoo", zh: "米莱德胡", en: "Milaidhoo Maldives", atoll: "芭环礁 Baa",
    transfer: { mode: "seaplane", minutes: 35, note: "" },
    tier: 4, reef: 5, beach: 4, size: "S", waterVilla: true, ai: false, kids: "limit",
    kidsNote: "官网称仅接待 9 岁以上儿童",
    tags: ["小岛", "顶级屋礁", "私密"],
    pros: ["小岛私密，屋礁出色", "靠近汉尼法鲁湾"],
    cons: ["不适合带小童", "价格高"],
    verify: ["tier", "kidsNote"] },

  { id: "ozen-bolifushi", zh: "OZEN 宝丽芙士", en: "OZEN Reserve Bolifushi", atoll: "南马累环礁 South Malé",
    transfer: { mode: "speedboat", minutes: 20, note: "" },
    tier: 4, reef: 3, beach: 4, size: "M", waterVilla: true, ai: true, kids: "club",
    tags: ["奢华全包", "快艇近", "水屋泳池"],
    pros: ["奢华全包，岛上消费不用算", "快艇近"],
    cons: ["总价高", "岛屿面积有限"],
    verify: ["tier"] },

  { id: "hard-rock", zh: "硬石", en: "Hard Rock Hotel Maldives", atoll: "南马累环礁 South Malé",
    transfer: { mode: "speedboat", minutes: 15, note: "" },
    tier: 2, reef: 2, beach: 4, size: "M", waterVilla: true, ai: false, kids: "club",
    tags: ["热闹", "可步行到周边岛", "亲子"],
    pros: ["氛围活跃，适合年轻人和亲子", "快艇近"],
    cons: ["不安静", "浮潜一般"],
    verify: ["tier"] },

  { id: "siyam-world", zh: "喜悦世界", en: "Siyam World", atoll: "努努环礁 Noonu",
    transfer: { mode: "seaplane", minutes: 45, note: "也可内飞" },
    tier: 2, reef: 2, beach: 4, size: "L", waterVilla: true, ai: true, kids: "club",
    tags: ["24 小时全包", "水上乐园", "大岛"],
    pros: ["全包时间长，带娃很省心", "娱乐项目多"],
    cons: ["浮潜一般", "岛大客人多"],
    verify: ["tier"] },

  { id: "kandima", zh: "坎蒂玛", en: "Kandima Maldives", atoll: "达鲁环礁 Dhaalu",
    transfer: { mode: "domestic", minutes: 60, note: "内飞约 35 分钟 + 快艇约 15 分钟" },
    tier: 1, reef: 2, beach: 4, size: "L", waterVilla: true, ai: true, kids: "club",
    tags: ["年轻活力", "性价比", "长岛"],
    pros: ["价格友好，活动多", "内飞有夜间航班可选"],
    cons: ["屋礁弱", "岛很长，走路距离远"],
    verify: ["tier", "transfer.minutes"] },

  { id: "amilla", zh: "阿米拉", en: "Amilla Maldives", atoll: "芭环礁 Baa",
    transfer: { mode: "seaplane", minutes: 30, note: "也可内飞" },
    tier: 3, reef: 3, beach: 4, size: "M", waterVilla: true, ai: false, kids: "club",
    tags: ["大别墅", "亲子", "汉尼法鲁湾"],
    pros: ["多卧室别墅，适合家庭", "可安排蝠鲼行程"],
    cons: ["屋礁中等"],
    verify: ["tier"] },

  { id: "angsana-velavaru", zh: "悦椿薇拉瓦鲁", en: "Angsana Velavaru", atoll: "达鲁环礁 Dhaalu",
    transfer: { mode: "seaplane", minutes: 40, note: "" },
    tier: 2, reef: 2, beach: 4, size: "M", waterVilla: true, ai: true, kids: "ok",
    tags: ["离岛水屋", "全包", "海龟"],
    pros: ["离岛水屋区私密度高", "全包可选"],
    cons: ["泻湖浅，屋礁弱", "离岛水屋往返要坐船"],
    verify: ["tier"] },

  { id: "mirihi", zh: "米瑞喜", en: "Mirihi Island Resort", atoll: "南阿里环礁 South Ari",
    transfer: { mode: "seaplane", minutes: 30, note: "" },
    tier: 2, reef: 5, beach: 4, size: "S", waterVilla: true, ai: false, kids: "ok",
    tags: ["小岛", "顶级屋礁", "安静"],
    pros: ["小而安静，屋礁出色", "鲸鲨海域附近"],
    cons: ["设施较少", "无儿童俱乐部"],
    verify: ["tier"] },

  { id: "adaaran-meedhupparu", zh: "阿达兰美度", en: "Adaaran Select Meedhupparu", atoll: "拉环礁 Raa",
    transfer: { mode: "seaplane", minutes: 45, note: "也可内飞" },
    tier: 1, reef: 3, beach: 3, size: "L", waterVilla: true, ai: true, kids: "ok",
    tags: ["经济全包", "大岛"],
    pros: ["全包价格低", "岛大设施全"],
    cons: ["硬件偏老", "交通时间长"],
    verify: ["tier"] },
  { id: "kandolhu", zh: "坎多卢", en: "Kandolhu Maldives", atoll: "北阿里环礁 North Ari",
    transfer: { mode: "seaplane", minutes: 25, note: "" },
    tier: 3, reef: 5, beach: 4, size: "S", waterVilla: true, ai: true, kids: "ok",
    tags: ["小岛", "顶级屋礁", "靠近海沟"],
    pros: ["岛屿一圈珊瑚环绕，鱼类丰富", "小岛私密，适合蜜月"],
    cons: ["房间少，旺季需提前很久预订", "设施有限"],
    verify: ["tier", "kids"] },

  { id: "w-maldives", zh: "W 宁静岛", en: "W Maldives", atoll: "北阿里环礁 North Ari",
    transfer: { mode: "seaplane", minutes: 25, note: "" },
    tier: 4, reef: 5, beach: 4, size: "M", waterVilla: true, ai: false, kids: "ok",
    tags: ["顶级屋礁", "潮流设计", "派对氛围"],
    pros: ["屋礁顶级，下水即见珊瑚", "设计时尚，适合年轻情侣"],
    cons: ["氛围偏热闹，不算安静", "价格高"],
    verify: ["tier"] },

  { id: "vakkaru", zh: "瓦卡鲁", en: "Vakkaru Maldives", atoll: "芭环礁 Baa",
    transfer: { mode: "seaplane", minutes: 25, note: "也可内飞约 20 分钟 + 快艇约 30 分钟" },
    tier: 4, reef: 4, beach: 5, size: "M", waterVilla: true, ai: false, kids: "club",
    tags: ["汉尼法鲁湾", "白沙", "亲子"],
    pros: ["沙滩评级高", "屋礁中等偏上，可安排蝠鲼行程"],
    cons: ["价格高"],
    verify: ["tier"] }
];

/* 酒店等级与集团（置信度：中）。星级为行业通行叫法，马代并无官方统一评级 */
window.META = {
  "soneva-fushi": [6, "Soneva"], "soneva-jani": [6, "Soneva"], "cheval-blanc": [6, "LVMH"],
  "fs-landaa": [6, "四季"], "fs-kudahuraa": [6, "四季"], "oo-reethirah": [6, "One&Only"],
  "waldorf": [6, "希尔顿"], "stregis": [6, "万豪"], "conrad": [5, "希尔顿"],
  "baros": [5, "其他"], "gili": [6, "其他"], "kurumba": [5, "其他"],
  "vilamendhoo": [4, "其他"], "kuramathi": [4, "其他"], "centara-grand": [5, "盛泰乐"],
  "bandos": [4, "其他"], "filitheyo": [4, "其他"], "embudu": [3, "其他"],
  "velassaru": [5, "其他"], "anantara-veli": [5, "安纳塔拉"], "anantara-dhigu": [5, "安纳塔拉"],
  "constance-halaveli": [5, "康斯坦斯"], "constance-moofushi": [4, "康斯坦斯"], "lux-south-ari": [5, "LUX*"],
  "lily-beach": [5, "其他"], "hurawalhi": [5, "其他"], "sun-siyam-irufushi": [5, "Sun Siyam"],
  "joali": [6, "其他"], "milaidhoo": [6, "其他"], "ozen-bolifushi": [6, "Atmosphere"],
  "hard-rock": [5, "Hard Rock"], "siyam-world": [5, "Sun Siyam"], "kandima": [4, "其他"],
  "amilla": [5, "其他"], "angsana-velavaru": [5, "悦榕"], "mirihi": [4, "其他"],
  "adaaran-meedhupparu": [4, "Adaaran"], "kandolhu": [5, "其他"], "w-maldives": [6, "万豪"],
  "vakkaru": [6, "其他"]
};

/* 标配一价全包（不可选半包）的岛，置信度：中 */
window.AI_ONLY = ["constance-moofushi", "ozen-bolifushi", "siyam-world"];

/* 往返上岛交通费参考（人民币 / 人，置信度：低，随运营商与季节变化） */
window.TRANSFER_COST = {
  speedboat: [700, 2000],
  seaplane: [4000, 7000],
  domestic: [3000, 5000]
};

window.REEF_LABEL = { 5: "顶级", 4: "中等偏上", 3: "中等", 2: "中等偏下", 1: "较差" };
window.BEACH_LABEL = { 5: "A", 4: "B", 3: "C", 2: "D", 1: "D" };
window.TIER_NIGHT = { 1: [2000, 4000], 2: [4000, 7000], 3: [7000, 12000], 4: [12000, 25000] };

