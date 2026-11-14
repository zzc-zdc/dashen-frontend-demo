(() => {
  'use strict';

  const products = [
    {
      id: 'moon', name: '月汐', english: 'LUNA', price: 399, categories: ['self'], tag: '人气之选',
      summary: '珍珠白空气脉冲仪', color: '珍珠白', alt: '珍珠白月汐空气脉冲仪',
      description: '圆润的珍珠白机身与柔和的空气脉冲，从低档开始，按自己的节奏慢慢探索。',
      specs: [['体验', '空气脉冲'], ['力度', '6 档'], ['配件', '磁吸充电线、收纳袋']],
      care: '关机后以温水和温和清洁剂清洁接触面，晾干后收纳。充电前保持接口干燥。',
    },
    {
      id: 'tide', name: '潮间', english: 'TIDE', price: 459, categories: ['self', 'together'],
      summary: '暖炭色曲面震动棒', color: '暖炭灰', alt: '暖炭色潮间曲面震动棒', keywords: '振动棒 曲线震动仪',
      description: '一条顺手的弧线，包覆柔滑触感。可以从绵长的低频切换到更明快的节奏。',
      specs: [['体验', '低频震动'], ['模式', '8 种节奏'], ['配件', '磁吸充电线、收纳袋']],
      care: '用温水和温和清洁剂清洁接触面，充电前擦干机身。',
    },
    {
      id: 'echo', name: '回声', english: 'ECHO', price: 529, categories: ['together'], tag: '双人精选',
      summary: '岩灰色佩戴式震动仪', color: '岩灰', alt: '岩灰色回声佩戴式椭圆震动仪',
      description: '紧凑的椭圆轮廓贴合身体曲线。随附遥控器，想换节奏时可以把选择交给另一半。',
      specs: [['体验', '佩戴式震动'], ['操控', '机身按键 / 遥控器'], ['配件', '遥控器、磁吸充电线、收纳袋']],
      care: '使用后清洁机身接触面，以干布擦拭遥控器。请将设备完全干燥后收纳。',
    },
    {
      id: 'silk', name: '柔雾', english: 'VEIL', price: 129, categories: ['care', 'together'],
      summary: '水基私密润滑凝露', color: '雾灰', alt: '柔雾水基润滑凝露的雾灰磨砂泵瓶',
      description: '轻盈水基凝露，按压式瓶口便于控制用量。以细腻润滑感为日常亲密时刻留一点余裕。',
      specs: [['配方类型', '水基'], ['净含量', '80 mL'], ['包装', '按压泵瓶']],
      care: '使用后关闭泵头，置于阴凉干燥处。使用前请阅读瓶身说明。',
    },
    {
      id: 'drift', name: '夜游', english: 'DRIFT', price: 259, categories: ['self'],
      summary: '香槟色便携震动仪', color: '香槟米金', alt: '香槟米金色夜游便携震动仪',
      description: '指间大小的机身，握持轻巧。简单的单键切换，适合想从少量功能开始的人。',
      specs: [['体验', '便携震动'], ['模式', '5 种节奏'], ['配件', '充电线、收纳袋']],
      care: '温和清洁接触面并彻底擦干。外出时可用随附的收纳袋单独保存。',
    },
    {
      id: 'ritual', name: '夜仪', english: 'RITUAL', price: 329, categories: ['care', 'together'],
      summary: '琥珀木质香氛礼盒', color: '琥珀棕', alt: '夜仪琥珀色香薰蜡烛与深色礼盒',
      description: '琥珀色玻璃杯里是一缕雪松与琥珀香。为睡前阅读、慢节奏的谈话或一份礼物而准备。',
      specs: [['香调', '雪松 / 琥珀'], ['净含量', '180 g'], ['包装', '玻璃杯、礼盒']],
      care: '使用时请保持室内通风，并将蜡烛放在平稳耐热的台面上。离开房间前熄灭。',
    },
    {
      id: 'shade', name: '沉影', english: 'SHADE', price: 389, categories: ['self'],
      summary: '哑黑色飞机杯', color: '哑黑', alt: '沉影飞机杯的哑黑外壳与闭合杯盖', keywords: '男用自慰杯 男用自慰器 男士自用',
      description: '哑光硬壳包裹柔软内胆，杯盖与机身齐平。内胆可以取出清洁，拆洗后便于单独晾干。',
      specs: [['类型', '闭合式飞机杯'], ['结构', '硬壳、可拆内胆'], ['操控', '手动']],
      care: '使用后拆出内胆，以温水和温和清洁剂清洁。内胆彻底晾干后装回杯壳。',
    },
    {
      id: 'form', name: '素形', english: 'FORM', price: 299, categories: ['self', 'together'],
      summary: '硅胶仿真阴茎', color: '象牙白礼盒', alt: '素形硅胶仿真用品的密闭象牙白礼盒', keywords: '硅胶阴茎 仿真阴茎 硅胶仿真用品',
      description: '以柔韧硅胶制成的仿真用品，搭配一体式宽底座。概念照片呈现的是象牙白礼盒。',
      specs: [['类型', '硅胶仿真用品'], ['材质', '硅胶'], ['包装', '礼盒、收纳袋']],
      care: '使用前后用温水和温和清洁剂清洁，彻底晾干后单独收纳。',
    },
  ];

  const byId = new Map(products.map((product) => [product.id, product]));
  const grid = document.querySelector('#product-grid');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const showAll = document.querySelector('#show-all-products');
  const productCount = document.querySelector('#product-count');
  const currency = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 });
  const money = (amount) => `¥${currency.format(amount)}`;
  const image = (product) => `assets/${product.id}.webp`;
  const preview = (product, width) => `assets/display/${product.id}-${width}.webp`;
  const maxQuantity = 99;

  const otherwiseEmpty = (value) => Array.isArray(value) ? value : [];
  function readStorage(key) {
    try {
      return otherwiseEmpty(JSON.parse(localStorage.getItem(`dashen.${key}`)));
    } catch {
      return [];
    }
  }

  const cart = new Map(readStorage('cart').filter((entry) => Array.isArray(entry) &&
    byId.has(entry[0]) && Number.isInteger(entry[1]) && entry[1] > 0)
    .map(([id, quantity]) => [id, Math.min(quantity, maxQuantity)]));
  const favorites = new Set(readStorage('favorites').filter((id) => byId.has(id)));

  function saveStorage(key, entries) {
    try {
      localStorage.setItem(`dashen.${key}`, JSON.stringify([...entries]));
    } catch {
      // The current visit remains usable when storage is disabled.
    }
  }

  const icons = {
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
    bag: '<path d="M4.5 8h15l1 13h-17l1-13Z"/><path d="M8 9V6a4 4 0 1 1 8 0v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    back: '<path d="m15 6-6 6 6 6"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4 4"/>',
    expand: '<path d="M14 5h5v5M5 14v5h5m9-14-6 6M5 19l6-6"/>',
    shrink: '<path d="M19 5l-6 6m0-4v4h4M5 19l6-6m0 4v-4H7"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
  };

  function icon(name) {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  }

  function favoriteButton(product, className) {
    const selected = favorites.has(product.id);
    return `<button type="button" class="${className}" data-favorite="${product.id}" aria-pressed="${selected}" aria-label="${selected ? '取消收藏' : '收藏'}${product.name}">${icon('heart')}</button>`;
  }

  function card(product) {
    return `<article class="product-card" data-card="${product.id}">
      <div class="product-media">
        <button class="product-image-link" type="button" data-product="${product.id}" aria-label="查看${product.name}详情"><img src="${preview(product, 480)}" srcset="${preview(product, 480)} 480w, ${preview(product, 768)} 768w, ${preview(product, 1080)} 1080w" sizes="(max-width: 700px) 47vw, (max-width: 1600px) 30vw, 460px" alt="${product.alt}" loading="lazy" decoding="async" width="2048" height="2048"></button>
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
        ${favoriteButton(product, 'product-favorite')}
        <button type="button" class="product-add" data-add="${product.id}" aria-label="把${product.name}加入购物袋">${icon('plus')}</button>
      </div>
      <div class="product-info">
        <div class="product-title-group">
          <button type="button" class="product-name" data-product="${product.id}">${product.name}</button>
          <span class="product-english" lang="en">${product.english}</span>
        </div>
        <span class="product-price">${money(product.price)}</span>
        <p class="product-summary">${product.summary}</p>
      </div>
    </article>`;
  }

  let category = 'all';
  let expanded = false;

  if (showAll && grid) showAll.setAttribute('aria-controls', grid.id);
  for (const button of document.querySelectorAll('[data-open], [data-product]')) {
    button.setAttribute('aria-haspopup', 'dialog');
  }

  function renderProducts() {
    const filtered = category === 'all' ? products : products.filter((product) => product.categories.includes(category));
    const visible = category === 'all' && !expanded ? filtered.slice(0, 3) : filtered;
    if (grid) grid.innerHTML = visible.map(card).join('');
    for (const filter of filters) filter.setAttribute('aria-pressed', String(filter.dataset.filter === category));
    if (productCount) productCount.textContent = `${visible.length} 件商品`;
    if (showAll) {
      showAll.hidden = category !== 'all';
      showAll.setAttribute('aria-expanded', String(expanded));
      const label = showAll.querySelector('[data-show-all-label]');
      if (label) label.textContent = expanded ? '收起商品' : '查看全部商品';
      else showAll.textContent = expanded ? '收起商品' : '查看全部商品';
    }
  }

  const cartQuantity = () => [...cart.values()].reduce((total, quantity) => total + quantity, 0);
  const subtotal = () => [...cart].reduce((total, [id, quantity]) => total + byId.get(id).price * quantity, 0);

  function updateIndicators() {
    const quantity = cartQuantity();
    for (const node of document.querySelectorAll('[data-cart-count]')) {
      node.textContent = quantity;
      node.closest('button[data-open="cart"]')?.setAttribute('aria-label', `打开购物袋，${quantity} 件商品`);
    }
    for (const node of document.querySelectorAll('[data-favorite-count]')) {
      node.textContent = favorites.size;
      node.hidden = favorites.size === 0;
      node.closest('button[data-open="favorites"]')?.setAttribute('aria-label', `打开收藏，${favorites.size} 件商品`);
    }
    for (const button of document.querySelectorAll('[data-favorite]')) {
      const product = byId.get(button.dataset.favorite);
      if (!product) continue;
      const selected = favorites.has(product.id);
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', `${selected ? '取消收藏' : '收藏'}${product.name}`);
    }
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'shop-dialog';
  dialog.setAttribute('aria-labelledby', 'shop-dialog-title');
  dialog.innerHTML = `<div class="shop-panel">
    <header class="shop-panel-head">
      <button class="shop-icon-button shop-back" type="button" data-shop-action="back" aria-label="返回上一步" hidden>${icon('back')}</button>
      <h2 id="shop-dialog-title" tabindex="-1"></h2>
      <button class="shop-icon-button shop-close" type="button" data-shop-action="close" aria-label="关闭">${icon('close')}</button>
    </header>
    <div class="shop-panel-content"></div>
    <div class="shop-panel-tools"><footer class="shop-panel-foot" hidden></footer></div>
  </div>`;
  document.body.append(dialog);
  const panelTitle = dialog.querySelector('#shop-dialog-title');
  const panelContent = dialog.querySelector('.shop-panel-content');
  const panelFooter = dialog.querySelector('.shop-panel-foot');
  const backButton = dialog.querySelector('.shop-back');

  const toast = document.createElement('p');
  toast.className = 'shop-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-atomic', 'true');
  document.body.append(toast);

  const panelNotice = document.createElement('p');
  panelNotice.className = 'shop-toast';
  panelNotice.setAttribute('role', 'status');
  panelNotice.setAttribute('aria-atomic', 'true');
  dialog.querySelector('.shop-panel-tools').append(panelNotice);

  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    const visibleToast = dialog.open ? panelNotice : toast;
    const otherToast = dialog.open ? toast : panelNotice;
    otherToast.classList.remove('is-visible');
    visibleToast.textContent = message;
    visibleToast.classList.add('is-visible');
    toastTimer = setTimeout(() => visibleToast.classList.remove('is-visible'), 2500);
  }

  const questions = [
    { label: '你在为哪种时刻挑选？', options: ['给自己的独处时光', '与伴侣共享的时刻', '日常护理或送礼'] },
    { label: '你更想从哪里开始？', options: ['柔和、简单的体验', '想试试不同的节奏', '为当下添一点氛围'] },
  ];

  const titles = { search: '搜索商品', favorites: '我的收藏', cart: '购物袋', quiz: '找到适合你的产品', checkout: '模拟结算', order: '演示订单' };
  let current;
  let history = [];
  let launcher;
  const visualViewport = window.visualViewport;

  function syncViewport() {
    if (!visualViewport || visualViewport.scale > 1.05) return;
    // On mobile the keyboard can reduce the visual area without resizing the page.
    const offset = Math.max(0, visualViewport.offsetTop);
    const hiddenHeight = Math.max(0, window.innerHeight - visualViewport.height - offset);
    dialog.style.setProperty('--shop-viewport-top', `${Math.round(offset)}px`);
    dialog.style.setProperty('--shop-viewport-bottom', `${Math.round(hiddenHeight)}px`);
    dialog.style.setProperty('--shop-viewport-height', `${Math.round(visualViewport.height)}px`);
  }

  function openPanel(type, id, trigger) {
    if (!dialog.open) {
      launcher = trigger;
      history = [];
    } else {
      history.push(current);
    }
    current = { type, id, query: '', answers: [], zoomed: false };
    renderPanel();
    if (!dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('shop-dialog-open');
      syncViewport();
      visualViewport?.addEventListener('resize', syncViewport);
      visualViewport?.addEventListener('scroll', syncViewport);
    }
    focusPanel();
  }

  function closePanel({ returnFocus = true } = {}) {
    dialog.close();
    document.documentElement.classList.remove('shop-dialog-open');
    panelNotice.classList.remove('is-visible');
    visualViewport?.removeEventListener('resize', syncViewport);
    visualViewport?.removeEventListener('scroll', syncViewport);
    dialog.style.removeProperty('--shop-viewport-top');
    dialog.style.removeProperty('--shop-viewport-bottom');
    dialog.style.removeProperty('--shop-viewport-height');
    if (returnFocus) {
      const destination = launcher?.closest('#mobile-menu[hidden]')
        ? document.querySelector('#mobile-menu-toggle') : launcher;
      if (destination?.isConnected) destination.focus({ preventScroll: true });
    }
    launcher = null;
  }

  function focusPanel() {
    const destination = current.type === 'search' ? dialog.querySelector('#shop-search-input') : panelTitle;
    destination.focus({ preventScroll: true });
  }

  function goBack() {
    const previous = history.pop();
    if (!previous) return;
    current = previous;
    renderPanel();
    focusPanel();
  }

  function tile(product, end = '') {
    return `<li class="shop-item">
      <button type="button" class="shop-item-link" data-product="${product.id}" aria-label="查看${product.name}详情">
        <span class="shop-item-image"><img src="${preview(product, 240)}" alt="" width="80" height="88" loading="lazy" decoding="async"></span>
        <span class="shop-item-main"><span class="shop-item-title">${product.name} <span lang="en">${product.english}</span></span><span>${product.summary}</span><span class="shop-item-price">${money(product.price)}</span></span>
      </button>
      ${end}
    </li>`;
  }

  function emptyState(iconName, title, message) {
    return `<div class="shop-empty">${icon(iconName)}<h3>${title}</h3><p>${message}</p><button type="button" class="shop-primary" data-shop-action="browse">浏览商品 ${icon('arrow')}</button></div>`;
  }

  function detail(product) {
    return `<div class="shop-detail">
      <figure class="shop-detail-figure">
        <div class="shop-detail-media${current.zoomed ? ' is-zoomed' : ''}">
          <img src="${current.zoomed ? image(product) : preview(product, 768)}" width="2048" height="2048" alt="${product.alt}" decoding="async">
          <button class="shop-icon-button shop-zoom" type="button" data-shop-action="zoom" aria-pressed="${current.zoomed}" aria-label="${current.zoomed ? '还原商品图片' : '放大商品图片'}">${icon(current.zoomed ? 'shrink' : 'expand')}</button>
        </div>
        <figcaption>商品概念图 · AI 生成</figcaption>
      </figure>
      <div class="shop-detail-main">
        <p class="shop-detail-kicker" lang="en">${product.english}</p>
        <p class="shop-detail-summary">${product.summary}</p>
        <p class="shop-detail-price">${money(product.price)}</p>
        <p class="shop-detail-description">${product.description}</p>
        <dl class="shop-specs"><div><dt>颜色</dt><dd>${product.color}</dd></div>${product.specs.map(([title, value]) => `<div><dt>${title}</dt><dd>${value}</dd></div>`).join('')}</dl>
        <details class="shop-disclosure"><summary>护理与收纳</summary><p>${product.care}</p></details>
      </div>
    </div>`;
  }

  function detailActions(product) {
    return `<div class="shop-detail-actions">
      <button type="button" class="shop-primary" data-add="${product.id}">加入购物袋 <span class="shop-detail-button-price">${money(product.price)}</span></button>
      ${favoriteButton(product, 'shop-icon-button shop-detail-favorite')}
      <button type="button" class="shop-icon-button shop-detail-bag" data-open="cart" aria-label="查看购物袋">${icon('bag')}</button>
    </div>`;
  }

  function renderSearchResults() {
    const result = dialog.querySelector('#shop-search-results');
    if (!result) return;
    const terms = current.query.trim().toLowerCase().split(/\s+/u).filter(Boolean);
    const matching = products.filter((product) => {
      const categories = product.categories.map((entry) => ({ self: '独处 单人 自用', together: '伴侣 双人 情侣', care: '护理 香氛 送礼' })[entry]);
      const haystack = [product.name, product.english, product.summary, product.color, product.keywords, ...categories].join(' ').toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
    result.innerHTML = matching.length
      ? `<p class="shop-results-count" role="status">${terms.length ? `找到 ${matching.length} 件商品` : '全部商品'}</p><ul class="shop-items">${matching.map((product) => tile(product, `<button type="button" class="shop-icon-button" data-add="${product.id}" aria-label="把${product.name}加入购物袋">${icon('plus')}</button>`)).join('')}</ul>`
      : '<p class="shop-search-empty" role="status">没有匹配的商品。试试「震动棒」、「飞机杯」或「香氛」。</p>';
  }

  function renderFavorites() {
    if (!favorites.size) return emptyState('heart', '收藏夹是空的', '点亮商品上的爱心，就能在这里找到它。');
    return `<ul class="shop-items">${[...favorites].map((id) => {
      const product = byId.get(id);
      return tile(product, `<div class="shop-item-actions">${favoriteButton(product, 'shop-icon-button')}<button type="button" class="shop-icon-button" data-add="${id}" aria-label="把${product.name}加入购物袋">${icon('plus')}</button></div>`);
    }).join('')}</ul>`;
  }

  function renderCart() {
    if (!cart.size) return emptyState('bag', '购物袋是空的', '挑选喜欢的商品，随时回来调整。');
    return `<ul class="shop-items">${[...cart].map(([id, quantity]) => {
      const product = byId.get(id);
      const controls = `<div class="shop-line-actions"><div class="shop-quantity" aria-label="${product.name}数量">
        <button type="button" data-adjust="${id}" data-delta="-1" aria-label="减少${product.name}数量" ${quantity === 1 ? 'disabled' : ''}>${icon('minus')}</button>
        <span aria-live="polite">${quantity}</span>
        <button type="button" data-adjust="${id}" data-delta="1" aria-label="增加${product.name}数量" ${quantity === maxQuantity ? 'disabled' : ''}>${icon('plus')}</button>
      </div><button type="button" class="shop-remove" data-remove="${id}" aria-label="移除${product.name}">移除</button></div>`;
      return tile(product, controls);
    }).join('')}</ul>`;
  }

  function checkoutActions(label, total, button) {
    return `<div class="shop-checkout-actions"><div class="shop-total"><span>${label}</span><strong>${money(total)}</strong></div>${button}</div>`;
  }

  function summary(lines) {
    return `<ul class="shop-order-lines">${Array.from(lines, ([id, quantity]) => {
      const product = byId.get(id);
      return `<li><span>${product.name} <small>× ${quantity}</small></span><strong>${money(product.price * quantity)}</strong></li>`;
    }).join('')}</ul>`;
  }

  function recommendation(first, second) {
    if (second === 2) return byId.get('ritual');
    if (first === 2) return byId.get('silk');
    if (first === 1) return byId.get(second === 1 ? 'echo' : 'tide');
    return byId.get(second === 1 ? 'moon' : 'drift');
  }

  function renderQuiz() {
    const { answers } = current;
    if (answers.length === questions.length) {
      const product = recommendation(...answers);
      return `<div class="shop-quiz-result"><p class="shop-detail-kicker">为这份偏好推荐</p><h3 tabindex="-1">${product.name} <span lang="en">${product.english}</span></h3><p>${product.description}</p>
        <ul class="shop-items">${tile(product)}</ul><div class="shop-quiz-actions"><button type="button" class="shop-primary" data-product="${product.id}">查看推荐 ${icon('arrow')}</button><button type="button" class="shop-text-action" data-shop-action="restart">重新选择</button></div></div>`;
    }
    const question = questions[answers.length];
    return `<div class="shop-quiz-step"><p class="shop-quiz-progress">第 ${answers.length + 1} 步，共 ${questions.length} 步</p><progress aria-label="问答进度" max="${questions.length}" value="${answers.length + 1}"></progress>
      <h3 tabindex="-1">${question.label}</h3><div class="shop-quiz-options">${question.options.map((option, index) => `<button type="button" data-quiz-option="${index}">${option}${icon('arrow')}</button>`).join('')}</div>
      ${answers.length ? `<button type="button" class="shop-text-action" data-shop-action="quiz-back">${icon('back')} 上一题</button>` : ''}</div>`;
  }

  function renderPanel() {
    const { type, id } = current;
    const product = byId.get(id);
    let footer = '';
    dialog.dataset.shopView = type;
    dialog.classList.toggle('shop-dialog-detail', type === 'detail');
    dialog.classList.toggle('shop-dialog-quiz', type === 'quiz');
    panelTitle.textContent = type === 'detail' ? product.name : titles[type];
    backButton.hidden = history.length === 0;
    switch (type) {
      case 'search':
        panelContent.innerHTML = `<label class="shop-search-label" for="shop-search-input">${icon('search')}<input id="shop-search-input" type="search" placeholder="按名称、类别或颜色搜索" autocomplete="off" aria-label="搜索商品"></label><div id="shop-search-results"></div>`;
        dialog.querySelector('#shop-search-input').value = current.query;
        renderSearchResults();
        break;
      case 'favorites': panelContent.innerHTML = renderFavorites(); break;
      case 'cart':
        panelContent.innerHTML = renderCart();
        if (cart.size) footer = checkoutActions(`小计 · ${cartQuantity()} 件`, subtotal(), '<button type="button" class="shop-primary shop-fill" data-open="checkout">前往模拟结算</button>');
        break;
      case 'detail':
        panelContent.innerHTML = detail(product);
        footer = detailActions(product);
        break;
      case 'quiz': panelContent.innerHTML = renderQuiz(); break;
      case 'checkout':
        panelContent.innerHTML = `<p class="shop-helper">确认商品和数量，即可体验下单流程。演示无需地址或付款信息。</p>${summary(cart)}`;
        footer = checkoutActions('演示合计', subtotal(), '<button type="button" class="shop-primary shop-fill" data-shop-action="order">提交演示订单</button>');
        break;
      case 'order':
        panelContent.innerHTML = `<div class="shop-order-success"><span>${icon('check')}</span><h3>演示订单已生成</h3><p>订单号 ${current.order.number}</p></div>${summary(current.order.lines)}`;
        footer = checkoutActions('订单合计', current.order.total, '<button type="button" class="shop-primary shop-fill" data-shop-action="browse">继续逛逛</button>');
        break;
    }
    panelFooter.innerHTML = footer;
    panelFooter.hidden = !footer;
    panelContent.scrollTop = 0;
  }

  function preservePanelFocus(button, selector, fallback, fallbackSelector) {
    const position = panelContent.scrollTop;
    renderPanel();
    panelContent.scrollTop = position;
    if (!button) return;
    const enabled = (candidate) => candidate && !candidate.disabled;
    const same = panelContent.querySelector(selector);
    const alternative = fallbackSelector ? panelContent.querySelector(fallbackSelector) : null;
    (enabled(same) ? same : enabled(alternative) ? alternative : panelContent.querySelector(fallback) || panelTitle).focus();
  }

  function updateCart(id, nextQuantity, button) {
    if (!byId.has(id)) return;
    if (nextQuantity) cart.set(id, Math.min(nextQuantity, maxQuantity));
    else cart.delete(id);
    saveStorage('cart', cart);
    if (dialog.open && current.type === 'cart') {
      const selector = button.dataset.adjust ? `[data-adjust="${id}"][data-delta="${button.dataset.delta}"]` : `[data-remove="${id}"]`;
      preservePanelFocus(button, selector, '[data-adjust]:not(:disabled), [data-shop-action="browse"]', `[data-adjust="${id}"]:not(:disabled)`);
    }
    updateIndicators();
  }

  function toggleFavorite(id, button) {
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    saveStorage('favorites', favorites);
    if (dialog.open && current.type === 'favorites') {
      preservePanelFocus(button, `[data-favorite="${id}"]`, '[data-favorite], [data-shop-action="browse"]');
    }
    updateIndicators();
    notify(`${byId.get(id).name}${favorites.has(id) ? '已加入收藏' : '已取消收藏'}`);
  }

  const actions = {
    close: () => closePanel(),
    back: goBack,
    browse: () => {
      closePanel({ returnFocus: false });
      grid?.scrollIntoView({ block: 'center' });
      grid?.querySelector('button')?.focus({ preventScroll: true });
    },
    zoom: () => {
      current.zoomed = !current.zoomed;
      const media = dialog.querySelector('.shop-detail-media');
      media.classList.toggle('is-zoomed', current.zoomed);
      if (current.zoomed) media.querySelector('img').src = image(byId.get(current.id));
      const control = dialog.querySelector('.shop-zoom');
      control.setAttribute('aria-pressed', String(current.zoomed));
      control.setAttribute('aria-label', current.zoomed ? '还原商品图片' : '放大商品图片');
      control.innerHTML = icon(current.zoomed ? 'shrink' : 'expand');
    },
    order: () => {
      if (!cart.size) return;
      const order = { number: `DS-${Date.now().toString(36).toUpperCase()}`, lines: [...cart], total: subtotal() };
      cart.clear();
      saveStorage('cart', cart);
      updateIndicators();
      history = [];
      current = { type: 'order', order };
      renderPanel();
      focusPanel();
    },
    restart: () => {
      current.answers = [];
      advanceQuiz();
    },
    'quiz-back': () => {
      current.answers.pop();
      advanceQuiz();
    },
  };

  function advanceQuiz() {
    renderPanel();
    panelContent.querySelector('h3').focus();
  }

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closePanel();
  });

  let pointerStartedOnBackdrop = false;
  dialog.addEventListener('pointerdown', (event) => {
    pointerStartedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pointerStartedOnBackdrop) closePanel();
    pointerStartedOnBackdrop = false;
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'shop-search-input' && current?.type === 'search') {
      current.query = event.target.value;
      renderSearchResults();
    }
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-filter], #show-all-products, [data-open], [data-product], [data-favorite], [data-add], [data-remove], [data-adjust], [data-quiz-option], [data-shop-action]');
    if (!trigger) return;
    const { filter, open, product, favorite, add, remove, adjust, delta, quizOption, shopAction } = trigger.dataset;

    if (filter && ['all', 'self', 'together', 'care'].includes(filter)) {
      category = filter;
      expanded = false;
      renderProducts();
    } else if (trigger === showAll) {
      expanded = !expanded;
      renderProducts();
      if (expanded) grid?.querySelectorAll('.product-image-link')[3]?.focus();
    } else if (open && ['search', 'favorites', 'cart', 'quiz', 'checkout'].includes(open)) {
      event.preventDefault();
      openPanel(open === 'checkout' && !cart.size ? 'cart' : open, undefined, trigger);
    } else if (byId.has(product)) {
      event.preventDefault();
      openPanel('detail', product, trigger);
    } else if (byId.has(favorite)) {
      toggleFavorite(favorite, trigger);
    } else if (byId.has(add)) {
      const quantity = (cart.get(add) ?? 0) + 1;
      if (quantity > maxQuantity) notify(`${byId.get(add).name}已达到购物袋数量上限`);
      else {
        updateCart(add, quantity, trigger);
        notify(`${byId.get(add).name}已加入购物袋`);
      }
    } else if (cart.has(remove)) {
      updateCart(remove, 0, trigger);
      notify(`${byId.get(remove).name}已移除`);
    } else if (cart.has(adjust) && !trigger.disabled) {
      updateCart(adjust, Math.max(1, cart.get(adjust) + Number(delta)), trigger);
    } else if (quizOption !== undefined && current?.type === 'quiz') {
      current.answers.push(Number(quizOption));
      advanceQuiz();
    } else if (Object.hasOwn(actions, shopAction)) {
      actions[shopAction]();
    }
  });

  renderProducts();
  updateIndicators();
})();
