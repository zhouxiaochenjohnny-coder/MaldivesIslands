(function () {
  "use strict";

  var ISLANDS = window.ISLANDS;
  var TIERS = window.TIERS;
  var TRANSFER = window.TRANSFER;
  var KIDS = window.KIDS;
  var $ = function (s) { return document.querySelector(s); };

  /* ---------- 问卷定义 ---------- */
  var STEPS = [
    { key: "group", title: "这次和谁一起去？", hint: "同行人决定了岛的基本盘。", type: "single",
      options: [
        { v: "couple", t: "情侣 / 蜜月", d: "看重浪漫与私密" },
        { v: "kidsYoung", t: "带 8 岁以下孩子", d: "需要儿童设施" },
        { v: "kidsOlder", t: "带 8 岁以上孩子", d: "孩子能一起玩水" },
        { v: "friends", t: "朋友结伴", d: "看重热闹与活动" },
        { v: "diver", t: "潜水 / 浮潜爱好者", d: "海底比房间重要" }
      ] },
    { key: "budget", title: "每晚房费预算上限？", hint: "按基础房型估算，含税前价格。价格置信度低，仅作档位参考。", type: "single",
      options: [
        { v: 1, t: "经济", d: TIERS[1].range },
        { v: 2, t: "中档", d: TIERS[2].range },
        { v: 3, t: "高端", d: TIERS[3].range },
        { v: 4, t: "不设上限", d: "只要合适就行" }
      ] },
    { key: "prefs", title: "你最看重什么？", hint: "最多选 3 项，越靠前权重越高。", type: "multi", max: 3,
      options: [
        { v: "reef", t: "浮潜屋礁", d: "下水就能看鱼" },
        { v: "beach", t: "沙滩颜值", d: "白沙蓝水好出片" },
        { v: "transfer", t: "上岛方便", d: "路上少折腾" },
        { v: "ai", t: "全包省心", d: "吃喝不用算钱" },
        { v: "waterVilla", t: "住水屋", d: "推门就是海" },
        { v: "quiet", t: "安静私密", d: "人少岛小" },
        { v: "variety", t: "餐厅活动多", d: "住久了不无聊" },
        { v: "unique", t: "特色体验", d: "海底餐厅、蝠鲼、鲸鲨等" }
      ] },
    { key: "arrival", title: "航班几点落地马累？", hint: "水上飞机只在白天飞，这一项影响很大。", type: "single",
      options: [
        { v: "day", t: "15:00 前", d: "水飞、快艇都能当天上岛" },
        { v: "night", t: "15:00 后", d: "水飞岛通常要在马累住一晚" },
        { v: "unknown", t: "还没订机票", d: "暂不考虑" }
      ] },
    { key: "seasick", title: "坐船容易晕吗？", hint: "长时间快艇在风浪天会颠簸。", type: "single",
      options: [
        { v: "no", t: "不晕", d: "" },
        { v: "mild", t: "有点晕", d: "" },
        { v: "yes", t: "很容易晕", d: "" }
      ] }
  ];

  var answers = { group: null, budget: null, prefs: [], arrival: null, seasick: null };
  var step = 0;

  function renderStep() {
    var s = STEPS[step];
    var html = '<p class="q-step">第 ' + (step + 1) + " / " + STEPS.length + ' 步</p>' +
      '<h3 class="q-title">' + s.title + '</h3><p class="q-hint">' + s.hint + '</p><div class="options">';
    s.options.forEach(function (o) {
      var pressed = s.type === "multi" ? answers.prefs.indexOf(o.v) > -1 : answers[s.key] === o.v;
      var order = s.type === "multi" && pressed ? "（第 " + (answers.prefs.indexOf(o.v) + 1) + " 位）" : "";
      html += '<button type="button" class="option" data-v="' + o.v + '" aria-pressed="' + pressed + '"><strong>' +
        o.t + order + "</strong>" + (o.d ? "<small>" + o.d + "</small>" : "") + "</button>";
    });
    $("#quizBody").innerHTML = html + "</div>";
    $("#progressBar").style.width = ((step + 1) / STEPS.length * 100) + "%";
    $("#prevBtn").disabled = step === 0;
    $("#nextBtn").textContent = step === STEPS.length - 1 ? "查看推荐" : "下一步";
    updateNext();
  }

  function updateNext() {
    var s = STEPS[step];
    $("#nextBtn").disabled = s.type === "multi" ? answers.prefs.length === 0 : answers[s.key] === null;
  }

  $("#quizBody").addEventListener("click", function (e) {
    var btn = e.target.closest(".option");
    if (!btn) return;
    var s = STEPS[step];
    var raw = btn.dataset.v;
    var v = s.key === "budget" ? Number(raw) : raw;
    if (s.type === "multi") {
      var i = answers.prefs.indexOf(v);
      if (i > -1) answers.prefs.splice(i, 1);
      else if (answers.prefs.length < s.max) answers.prefs.push(v);
    } else {
      answers[s.key] = v;
    }
    renderStep();
  });
  $("#prevBtn").addEventListener("click", function () { if (step > 0) { step--; renderStep(); } });
  $("#nextBtn").addEventListener("click", function () {
    if (step < STEPS.length - 1) { step++; renderStep(); }
    else showResults();
  });

  /* ---------- 打分 ---------- */
  var UNIQUE_RE = /海底|蝠鲼|鲸鲨|滑梯|艺术|影院|天文台|离岛水屋/;
  var PREF_WEIGHT = [1.5, 1.2, 1];

  function score(isl, a) {
    var pts = 50, good = [], warn = [];

    if (a.budget < 4 && isl.tier > a.budget) return null;
    if (a.group === "kidsYoung" && (isl.kids === "adults" || isl.kids === "limit")) return null;
    if (a.group === "kidsOlder" && isl.kids === "adults") return null;

    a.prefs.forEach(function (p, idx) {
      var w = PREF_WEIGHT[idx], d = 0;
      if (p === "reef") { d = (isl.reef - 3) * 8; if (isl.reef >= 4) good.push("屋礁评分 " + isl.reef + "/5，浮潜方便"); }
      if (p === "beach") { d = (isl.beach - 3) * 7; if (isl.beach >= 5) good.push("沙滩评分 5/5"); }
      if (p === "transfer") { d = (45 - isl.transfer.minutes) / 3; if (isl.transfer.minutes <= 25) good.push(TRANSFER[isl.transfer.mode] + "约 " + isl.transfer.minutes + " 分钟上岛"); }
      if (p === "ai") { d = isl.ai ? 12 : -8; if (isl.ai) good.push("提供全包方案"); }
      if (p === "waterVilla") { d = isl.waterVilla ? 8 : -14; if (!isl.waterVilla) warn.push("以沙屋为主，没有或很少水屋"); }
      if (p === "quiet") { d = { S: 10, M: 3, L: -5 }[isl.size] + (isl.kids === "adults" ? 6 : 0); if (isl.size === "S") good.push("小岛，人少安静"); }
      if (p === "variety") { d = { S: -8, M: 2, L: 10 }[isl.size]; if (isl.size === "L") good.push("大岛，餐厅与活动选择多"); }
      if (p === "unique") { var hit = isl.tags.filter(function (t) { return UNIQUE_RE.test(t); }); d = hit.length ? 12 : -2; if (hit.length) good.push("特色：" + hit.join("、")); }
      pts += d * w;
    });

    if (a.group === "couple") {
      if (isl.kids === "adults" || isl.kids === "limit") { pts += 8; good.push(isl.kids === "adults" ? "成人岛，没有孩子打扰" : "限龄入住，环境更安静"); }
      if (isl.waterVilla) pts += 3;
    }
    if (a.group === "kidsYoung") {
      if (isl.kids === "club") { pts += 12; good.push("有儿童俱乐部"); } else warn.push("没有儿童俱乐部，需要全程自己带");
      if (isl.ai) pts += 4;
    }
    if (a.group === "kidsOlder") {
      if (isl.kids === "club") pts += 6;
      if (isl.reef >= 4) pts += 4;
      if (isl.kids === "limit") warn.push("有入住年龄限制，请确认孩子年龄符合");
    }
    if (a.group === "friends") {
      if (isl.size === "L") pts += 5;
      if (isl.tags.some(function (t) { return /热闹|活力/.test(t); })) { pts += 6; good.push("氛围热闹"); }
    }
    if (a.group === "diver") {
      pts += (isl.reef - 3) * 6;
      if (isl.reef <= 2) warn.push("屋礁弱，浮潜潜水要坐船出海");
    }

    if (a.arrival === "night") {
      if (isl.transfer.mode === "seaplane") {
        if (/快艇/.test(isl.transfer.note)) { pts -= 3; warn.push("夜间可改坐快艇上岛：" + isl.transfer.note); }
        else { pts -= 12; warn.push("水上飞机夜间停飞，通常要在马累住一晚"); }
      } else if (isl.transfer.mode === "speedboat") { pts += 5; good.push("快艇夜间也能上岛"); }
      else warn.push("内飞有晚班，但需确认衔接时间");
    }

    var boatLong = isl.transfer.mode !== "seaplane" && isl.transfer.minutes > 30;
    if (a.seasick === "yes" && boatLong) { pts -= 12; warn.push("船程约 " + isl.transfer.minutes + " 分钟，晕船者需备药"); }
    if (a.seasick === "mild" && boatLong) pts -= 5;

    return { isl: isl, score: Math.max(1, Math.min(99, Math.round(pts))), good: good, warn: warn };
  }

  function showResults() {
    var list = ISLANDS.map(function (i) { return score(i, answers); })
      .filter(Boolean)
      .sort(function (x, y) { return y.score - x.score || x.isl.tier - y.isl.tier; });
    var box = $("#results");
    box.hidden = false;
    var prefNames = answers.prefs.map(function (p) {
      return STEPS[2].options.filter(function (o) { return o.v === p; })[0].t;
    });
    var groupName = STEPS[0].options.filter(function (o) { return o.v === answers.group; })[0].t;
    var head = '<div class="results-head"><h3>为你推荐</h3><span class="summary">' + groupName + " · " +
      (answers.budget === 4 ? "不设上限" : TIERS[answers.budget].label + "及以下") + " · " + prefNames.join(" > ") +
      ' · <a href="#quiz" id="redo">重新选择</a></span></div>';
    if (!list.length) {
      box.innerHTML = head + '<div class="card empty">没有完全符合条件的岛。试试放宽预算，或换一个同行人选项。</div>';
    } else {
      box.innerHTML = head + '<div class="grid">' + list.slice(0, 6).map(function (r, i) { return card(r.isl, r, i + 1); }).join("") +
        "</div>" + (list.length > 6 ? '<p class="count" style="margin-top:16px">另有 ' + (list.length - 6) + " 座岛符合条件，可在下方「全部岛屿」中查看。</p>" : "") +
        '<p class="muted" style="margin-top:12px">匹配分 = 你的偏好与岛屿特点的吻合程度，不代表岛屿本身的好坏。</p>';
    }
    $("#redo").addEventListener("click", function () { step = 0; renderStep(); });
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- 卡片 ---------- */
  function dots(n) {
    var s = "";
    for (var i = 1; i <= 5; i++) s += i <= n ? "●" : '<span class="off">●</span>';
    return '<span class="dots" aria-label="' + n + ' 分">' + s + "</span>";
  }
  function conf(level) {
    var m = { high: "高", mid: "中", low: "低" };
    return '<span class="conf conf-' + level + '" title="数据置信度">' + m[level] + "</span>";
  }
  function transferText(t) { return TRANSFER[t.mode] + " 约 " + t.minutes + " 分钟"; }

  function card(isl, r, rank) {
    var reasons = r ? r.good.slice(0, 3).map(function (g) { return "<li>" + g + "</li>"; }).join("") +
      r.warn.slice(0, 2).map(function (w) { return '<li class="warn">' + w + "</li>"; }).join("") : "";
    var inCompare = compare.indexOf(isl.id) > -1;
    return '<article class="card island">' +
      '<div class="island-top"><div>' + (rank ? '<span class="rank">No.' + rank + "</span>" : "") +
      "<h4>" + isl.zh + '</h4><div class="en">' + isl.en + "</div></div>" +
      (r ? '<div class="score"><b>' + r.score + "</b><small>匹配分</small></div>" : "") + "</div>" +
      '<dl class="facts">' +
      "<div><dt>环礁</dt><dd>" + isl.atoll.split(" ")[0] + "</dd></div>" +
      "<div><dt>上岛</dt><dd>" + transferText(isl.transfer) + "</dd></div>" +
      "<div><dt>浮潜屋礁" + conf("mid") + "</dt><dd>" + dots(isl.reef) + "</dd></div>" +
      "<div><dt>沙滩" + conf("mid") + "</dt><dd>" + dots(isl.beach) + "</dd></div>" +
      "<div><dt>价格档位" + conf("low") + "</dt><dd>" + TIERS[isl.tier].label + "</dd></div>" +
      "<div><dt>亲子</dt><dd>" + KIDS[isl.kids] + "</dd></div>" +
      "</dl>" +
      '<div class="tags">' + isl.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" +
      (reasons ? '<ul class="reasons">' + reasons + "</ul>" : "") +
      '<div class="island-actions"><button type="button" class="btn btn-secondary btn-sm" data-detail="' + isl.id + '">查看详情</button>' +
      '<button type="button" class="btn btn-plain btn-sm" data-compare="' + isl.id + '">' + (inCompare ? "已加入对比" : "+ 对比") + "</button></div>" +
      "</article>";
  }

  /* ---------- 浏览与筛选 ---------- */
  var FILTERS = [
    { id: "speedboat", t: "快艇可达", fn: function (i) { return i.transfer.mode === "speedboat" || /快艇/.test(i.transfer.note); } },
    { id: "reef", t: "屋礁 4 分以上", fn: function (i) { return i.reef >= 4; } },
    { id: "ai", t: "有全包", fn: function (i) { return i.ai; } },
    { id: "club", t: "儿童俱乐部", fn: function (i) { return i.kids === "club"; } },
    { id: "adults", t: "成人 / 限龄", fn: function (i) { return i.kids === "adults" || i.kids === "limit"; } },
    { id: "t1", t: "经济", fn: function (i) { return i.tier === 1; }, group: "tier" },
    { id: "t2", t: "中档", fn: function (i) { return i.tier === 2; }, group: "tier" },
    { id: "t3", t: "高端", fn: function (i) { return i.tier === 3; }, group: "tier" },
    { id: "t4", t: "奢华", fn: function (i) { return i.tier === 4; }, group: "tier" }
  ];
  var active = {};

  $("#filters").innerHTML = FILTERS.map(function (f) {
    return '<button type="button" class="chip" data-f="' + f.id + '" aria-pressed="false">' + f.t + "</button>";
  }).join("");
  $("#filters").addEventListener("click", function (e) {
    var c = e.target.closest(".chip");
    if (!c) return;
    active[c.dataset.f] = !active[c.dataset.f];
    c.setAttribute("aria-pressed", active[c.dataset.f]);
    renderGrid();
  });
  $("#search").addEventListener("input", renderGrid);
  $("#sort").addEventListener("change", renderGrid);

  function renderGrid() {
    var q = $("#search").value.trim().toLowerCase();
    var on = FILTERS.filter(function (f) { return active[f.id]; });
    var tierF = on.filter(function (f) { return f.group === "tier"; });
    var otherF = on.filter(function (f) { return f.group !== "tier"; });
    var list = ISLANDS.filter(function (i) {
      if (q && (i.zh + i.en + i.atoll + i.tags.join("")).toLowerCase().indexOf(q) === -1) return false;
      if (tierF.length && !tierF.some(function (f) { return f.fn(i); })) return false;
      return otherF.every(function (f) { return f.fn(i); });
    });
    var sorters = {
      reef: function (a, b) { return b.reef - a.reef; },
      beach: function (a, b) { return b.beach - a.beach; },
      transfer: function (a, b) { return a.transfer.minutes - b.transfer.minutes; },
      priceAsc: function (a, b) { return a.tier - b.tier; },
      priceDesc: function (a, b) { return b.tier - a.tier; }
    };
    var s = sorters[$("#sort").value];
    if (s) list = list.slice().sort(s);
    $("#count").textContent = "共 " + list.length + " 座岛";
    $("#grid").innerHTML = list.length ? list.map(function (i) { return card(i); }).join("")
      : '<div class="card empty">没有符合条件的岛，试试减少筛选条件。</div>';
  }

  /* ---------- 对比 ---------- */
  var compare = [];
  function toggleCompare(id) {
    var i = compare.indexOf(id);
    if (i > -1) compare.splice(i, 1);
    else if (compare.length < 3) compare.push(id);
    else { alert("最多对比 3 座岛。"); return; }
    $("#compareBar").hidden = compare.length === 0;
    $("#compareText").textContent = "已选 " + compare.length + " / 3：" + compare.map(byId).map(function (x) { return x.zh; }).join("、");
    $("#compareOpen").disabled = compare.length < 2;
    document.querySelectorAll('[data-compare="' + id + '"]').forEach(function (b) {
      b.textContent = compare.indexOf(id) > -1 ? "已加入对比" : "+ 对比";
    });
  }
  function byId(id) { return ISLANDS.filter(function (i) { return i.id === id; })[0]; }

  function openCompare() {
    var items = compare.map(byId);
    var rows = [
      ["环礁", function (i) { return i.atoll; }],
      ["上岛方式", function (i) { return transferText(i.transfer) + (i.transfer.note ? "<br><small>" + i.transfer.note + "</small>" : ""); }],
      ["浮潜屋礁" + conf("mid"), function (i) { return dots(i.reef); }],
      ["沙滩" + conf("mid"), function (i) { return dots(i.beach); }],
      ["价格档位" + conf("low"), function (i) { return TIERS[i.tier].label + "<br><small>" + TIERS[i.tier].range + "</small>"; }],
      ["岛屿大小", function (i) { return { S: "小岛", M: "中等", L: "大岛" }[i.size]; }],
      ["水屋", function (i) { return i.waterVilla ? "有" : "以沙屋为主"; }],
      ["全包", function (i) { return i.ai ? "有" : "无 / 以半包为主"; }],
      ["亲子", function (i) { return KIDS[i.kids] + (i.kidsNote ? "<br><small>" + i.kidsNote + "</small>" : ""); }],
      ["优点", function (i) { return i.pros.join("<br>"); }],
      ["注意", function (i) { return i.cons.join("<br>"); }]
    ];
    var html = "<h3>岛屿对比</h3>" + '<div class="table-wrap"><table><thead><tr><th></th>' +
      items.map(function (i) { return "<td><b>" + i.zh + "</b><br><small>" + i.en + "</small></td>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr><th>" + r[0] + "</th>" + items.map(function (i) { return "<td>" + r[1](i) + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table></div><p class="muted" style="margin-top:16px">评分为编辑综合公开评价的主观判断。价格请以酒店实时报价为准。</p>';
    openSheet(html);
  }

  function openDetail(id) {
    var i = byId(id);
    var verifyMap = { tier: "价格档位", "transfer.minutes": "交通时长", kids: "儿童政策", kidsNote: "入住年龄限制", waterVilla: "水屋情况" };
    var html = "<h3>" + i.zh + '</h3><p class="muted">' + i.en + " · " + i.atoll + "</p>" +
      '<dl class="facts" style="margin-top:16px">' +
      "<div><dt>上岛" + conf("high") + "</dt><dd>" + TRANSFER[i.transfer.mode] + "</dd></div>" +
      "<div><dt>时长" + conf("mid") + "</dt><dd>约 " + i.transfer.minutes + " 分钟" + (i.transfer.note ? "（" + i.transfer.note + "）" : "") + "</dd></div>" +
      "<div><dt>浮潜屋礁" + conf("mid") + "</dt><dd>" + dots(i.reef) + "</dd></div>" +
      "<div><dt>沙滩" + conf("mid") + "</dt><dd>" + dots(i.beach) + "</dd></div>" +
      "<div><dt>价格档位" + conf("low") + "</dt><dd>" + TIERS[i.tier].label + "（" + TIERS[i.tier].range + "）</dd></div>" +
      "<div><dt>亲子" + conf("mid") + "</dt><dd>" + KIDS[i.kids] + (i.kidsNote ? "，" + i.kidsNote : "") + "</dd></div>" +
      "</dl>" +
      "<h5>适合的理由</h5><ul>" + i.pros.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul>" +
      "<h5>需要权衡</h5><ul>" + i.cons.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul>" +
      "<h5>特色</h5><div class=\"tags\">" + i.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" +
      "<h5>预订前请核实</h5><p class=\"muted\">" + i.verify.map(function (v) { return verifyMap[v] || v; }).join("、") + "。本条数据未经酒店官方核验。</p>" +
      '<div class="island-actions" style="margin-top:20px"><button type="button" class="btn btn-secondary btn-sm" data-compare="' + i.id + '">' +
      (compare.indexOf(i.id) > -1 ? "已加入对比" : "+ 对比") + "</button></div>";
    openSheet(html);
  }

  var sheet = $("#sheet");
  function openSheet(html) {
    $("#sheetBody").innerHTML = html;
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
  }
  function closeSheet() { if (sheet.close) sheet.close(); else sheet.removeAttribute("open"); }
  $("#sheetClose").addEventListener("click", closeSheet);
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });

  document.addEventListener("click", function (e) {
    var d = e.target.closest("[data-detail]");
    if (d) return openDetail(d.dataset.detail);
    var c = e.target.closest("[data-compare]");
    if (c) toggleCompare(c.dataset.compare);
  });
  $("#compareOpen").addEventListener("click", openCompare);
  $("#compareClear").addEventListener("click", function () {
    compare.slice().forEach(toggleCompare);
  });

  /* ---------- 选岛知识：大白话 + 案例 + 反过来看 ---------- */
  var GUIDE = [
    { h: "上岛交通：快艇、水飞、内飞",
      plain: "大白话：岛离机场越远，海往往越干净，但路上越折腾。",
      body: "快艇适合离马累近的岛，日夜都能开。水上飞机只在白天飞，能到远处环礁。内飞是先坐国内航班，再转快艇。",
      c: "<b>案例：</b>航班 21:00 落地，订了只能水飞的岛。当晚只能住马累，第二天早上才上岛，白白少一晚岛上时间。",
      flip: "反过来看：近岛不等于差。北马累的巴洛斯离机场约 25 分钟，屋礁却是第一梯队。" },
    { h: "屋礁：决定你能不能「下水就看鱼」",
      plain: "大白话：屋礁就是紧挨着岛的珊瑚礁，从沙滩走下去就能浮潜。",
      body: "屋礁好的岛，每天想下水就下水。屋礁弱的岛，想看珊瑚要报出海项目，通常另外收费。",
      c: "<b>案例：</b>同样住 5 晚，屋礁好的岛可以天天浮潜；屋礁弱的岛，可能只出海一两次。",
      flip: "反过来看：屋礁好的岛岸边常有珊瑚碎石，沙子不够细软。不会游泳、只想泡泻湖的人，反而更适合泻湖大的岛。" },
    { h: "全包到底划不划算",
      plain: "大白话：全包就是把吃喝提前打包付钱，岛上不用再看账单。",
      body: "岛上餐饮价格普遍远高于国内，酒水尤其贵。全包也分档，有的含酒水和水上项目，有的不含。",
      c: "<b>案例：</b>两个人每天喝几杯鸡尾酒、吃三餐，全包通常更省心；只吃早餐和一顿正餐、不喝酒，半包可能更省钱。",
      flip: "反过来看：全包会让人觉得「不吃就亏了」。先算清自己的饮食习惯，再看报价是否含税和服务费。" },
    { h: "水屋还是沙屋",
      plain: "大白话：水屋是推门下海，沙屋是推门踩沙。",
      body: "水屋视野开阔，适合蜜月拍照。沙屋有树荫，更私密，带小孩更安全。",
      c: "<b>案例：</b>带 3 岁孩子住水屋，阳台下面就是深水，大人得时刻盯着。很多家庭会选沙屋，再安排一晚水屋体验。",
      flip: "反过来看：水屋多建在泻湖上，水下可能是沙地，不一定能直接看到珊瑚。" },
    { h: "什么季节去",
      plain: "大白话：干季天气稳但贵，雨季便宜但要看运气。",
      body: "一般认为 12 月到次年 4 月是干季，海况平稳，价格最高。5 月到 11 月多阵雨，价格更低。（时间段为常见说法，置信度中）",
      c: "<b>案例：</b>想看蝠鲼群，可以关注芭环礁汉尼法鲁湾，聚集高峰多在 6–11 月，正好落在雨季。",
      flip: "反过来看：雨季不等于天天下雨，多为阵雨。但野生动物从不保证出现，别把它当成唯一目的。" }
  ];
  $("#guideList").innerHTML = GUIDE.map(function (g) {
    return '<article class="card"><h3>' + g.h + '</h3><p class="plain">' + g.plain + "</p><p>" + g.body +
      '</p><div class="case">' + g.c + '</div><p class="flip">' + g.flip + "</p></article>";
  }).join("");

  /* ---------- 初始化 ---------- */
  $("#updated").textContent = window.DATA_UPDATED;
  $("#heroMeta").textContent = "已收录 " + ISLANDS.length + " 座度假岛 · 数据更新于 " + window.DATA_UPDATED;
  renderStep();
  renderGrid();
})();
