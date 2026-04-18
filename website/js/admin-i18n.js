/**
 * Admin UI — English / 中文 toggle (localStorage: apg_admin_lang).
 */
(function (global) {
    var STORAGE_KEY = 'apg_admin_lang';

    var PAGE_TITLES = {
        dashboard: {
            en: 'Admin Dashboard | AutoParts Global',
            zh: '管理后台 | AutoParts Global'
        },
        products: {
            en: 'Products | Admin Dashboard',
            zh: '商品管理 | 后台'
        },
        orders: {
            en: 'Orders | Admin Dashboard',
            zh: '订单管理 | 后台'
        },
        customers: {
            en: 'Customers | Admin Dashboard',
            zh: '客户管理 | 后台'
        },
        reports: {
            en: 'Reports | Admin Dashboard',
            zh: '数据报表 | 后台'
        },
        settings: {
            en: 'Settings | Admin Dashboard',
            zh: '系统设置 | 后台'
        },
        login: {
            en: 'Admin Login | AutoParts Global',
            zh: '管理员登录 | AutoParts Global'
        }
    };

    var DICT = {
        en: {
            'lang.switch': 'Language',
            'lang.zh': '中文',
            'lang.en': 'English',
            'nav.dashboard': 'Dashboard',
            'nav.products': 'Products',
            'nav.orders': 'Orders',
            'nav.customers': 'Customers',
            'nav.reports': 'Reports',
            'nav.settings': 'Settings',
            'nav.logout': 'Logout',
            'user.admin': 'Admin User',
            'header.dashboard': 'Dashboard',
            'header.products': 'Products',
            'header.orders': 'Orders',
            'header.customers': 'Customers',
            'header.reports': 'Reports',
            'header.settings': 'Settings',
            'stats.total_sales': 'Total Sales',
            'stats.total_orders': 'Total Orders',
            'stats.total_products': 'Total Products',
            'stats.total_customers': 'Total Customers',
            'stats.from_last_month': 'from last month',
            'mgmt.title': 'Management',
            'mgmt.catalog': 'Catalog',
            'mgmt.fulfillment': 'Fulfillment',
            'mgmt.crm': 'CRM',
            'mgmt.analytics': 'Analytics',
            'mgmt.config': 'Configuration',
            'mgmt.products_title': 'Products',
            'mgmt.products_desc': 'SKUs, pricing, stock levels, and categories.',
            'mgmt.orders_title': 'Orders',
            'mgmt.orders_desc': 'Payment status, packing, shipping, and returns.',
            'mgmt.customers_title': 'Customers',
            'mgmt.customers_desc': 'Profiles, order history, and lifetime value.',
            'mgmt.reports_title': 'Reports',
            'mgmt.reports_desc': 'Sales trends, channels, and export snapshots.',
            'mgmt.settings_title': 'Settings',
            'mgmt.settings_desc': 'Store profile, shipping, notifications, and security.',
            'chart.sales_overview': 'Sales Overview',
            'chart.top_products': 'Top Products',
            'table.recent_orders': 'Recent Orders',
            'table.order_id': 'Order ID',
            'table.customer': 'Customer',
            'table.date': 'Date',
            'table.total': 'Total',
            'table.status': 'Status',
            'table.action': 'Action',
            'common.view': 'View',
            'common.cancel': 'Cancel',
            'common.save': 'Save',
            'common.previous': 'Previous',
            'common.next': 'Next',
            'table.email': 'Email',
            'status.shipped': 'Shipped',
            'status.processing': 'Processing',
            'status.delivered': 'Delivered',
            'status.cancelled': 'Cancelled',
            'status.draft': 'Draft',
            'products.modal_add': 'Add Product',
            'products.modal_edit': 'Edit Product',
            'products.label_name': 'Product Name',
            'products.label_category': 'Category',
            'products.label_desc': 'Description',
            'products.label_image': 'Product Image',
            'products.confirm_delete': 'Are you sure you want to delete this product?',
            'products.alert_saved': 'Product saved successfully!',
            'products.alert_deleted': 'Product deleted successfully!',
            'products.kpi_active': 'Active SKUs',
            'products.kpi_active_sub': 'Published & in stock',
            'products.kpi_low': 'Low stock (<10)',
            'products.kpi_low_sub': 'Needs restock soon',
            'products.kpi_draft': 'Draft / hidden',
            'products.kpi_draft_sub': 'Not visible in store',
            'products.kpi_cat': 'Categories',
            'products.kpi_cat_sub': 'Body, engine, electrical…',
            'common.filter': 'Filter',
            'common.export': 'Export',
            'products.add': 'Add Product',
            'table.product': 'Product',
            'table.category': 'Category',
            'table.price': 'Price',
            'table.stock': 'Stock',
            'table.published': 'Published',
            'common.edit': 'Edit',
            'common.delete': 'Delete',
            'orders.kpi_payment': 'Awaiting payment',
            'orders.kpi_payment_sub': 'Unpaid checkouts',
            'orders.kpi_processing': 'Processing',
            'orders.kpi_processing_sub': 'Picking & packing',
            'orders.kpi_shipped': 'Shipped (7 days)',
            'orders.kpi_shipped_sub': 'Handed to carriers',
            'orders.kpi_returns': 'Returns open',
            'orders.kpi_returns_sub': 'RMA in progress',
            'table.order_id_short': 'Order ID',
            'orders.modal_prefix': 'Order #',
            'orders.shipping_info': 'Shipping Information',
            'orders.order_info': 'Order Information',
            'orders.order_items': 'Order Items',
            'orders.total': 'Total',
            'orders.update_status': 'Update Status',
            'orders.label_name': 'Name:',
            'orders.label_address': 'Address:',
            'orders.label_email': 'Email:',
            'orders.label_phone': 'Phone:',
            'orders.label_order_date': 'Order Date:',
            'orders.label_payment': 'Payment Method:',
            'orders.label_order_status': 'Order Status:',
            'customers.kpi_total': 'Total customers',
            'customers.kpi_total_sub': 'Registered accounts',
            'customers.kpi_new': 'New (30 days)',
            'customers.kpi_new_sub': 'First purchase or signup',
            'customers.kpi_repeat': 'Repeat buyers',
            'customers.kpi_repeat_sub': '2+ orders lifetime',
            'customers.kpi_aov': 'Avg. order value',
            'customers.kpi_aov_sub': 'Last 90 days',
            'customers.contact_info': 'Contact Information',
            'customers.address_title': 'Address',
            'customers.order_history': 'Order History',
            'customers.modal_title': 'Customer Details:',
            'customers.label_member_since': 'Member Since:',
            'table.phone': 'Phone',
            'table.total_orders': 'Total Orders',
            'table.total_spend': 'Total Spend',
            'reports.intro': 'Sales and operations analytics (demo data).',
            'reports.kpi_revenue': 'Net revenue (30d)',
            'reports.kpi_revenue_sub': '11% vs prior month',
            'reports.kpi_orders': 'Orders (30d)',
            'reports.kpi_orders_sub': '6% vs prior month',
            'reports.kpi_aov': 'Avg. order value',
            'reports.kpi_aov_sub': 'Blended B2C',
            'reports.kpi_refund': 'Refund rate',
            'reports.kpi_refund_sub': '0.3% vs prior month',
            'reports.chart_channel': 'Revenue by channel',
            'reports.chart_status': 'Orders by status',
            'reports.exports': 'Exports',
            'reports.exports_desc': 'Generate CSV snapshots for accounting (prototype — no file download).',
            'reports.btn_sales': 'Sales summary',
            'reports.btn_inventory': 'Inventory valuation',
            'reports.btn_customers': 'Customer list',
            'reports.highlights': 'Highlights',
            'reports.hl1': 'Body parts category up 18% week over week.',
            'reports.hl2': 'Repeat customer rate stable at 34%.',
            'reports.hl3': '12 SKUs below reorder point — see Products.',
            'settings.intro': 'Store configuration (prototype — changes are not persisted).',
            'settings.store_title': 'Store profile',
            'settings.store_desc': 'Public name and contact shown on invoices and emails.',
            'settings.store_name': 'Store display name',
            'settings.support_email': 'Support email',
            'settings.timezone': 'Default timezone',
            'settings.ship_title': 'Shipping defaults',
            'settings.ship_desc': 'Free shipping threshold and handling time.',
            'settings.free_ship': 'Free shipping over ($)',
            'settings.proc_days': 'Processing time (business days)',
            'settings.intl': 'Enable international shipping quotes',
            'settings.notif_title': 'Notifications',
            'settings.notif_desc': 'Email alerts for your team.',
            'settings.notif_new': 'New order placed',
            'settings.notif_low': 'Low stock threshold',
            'settings.notif_digest': 'Daily sales digest',
            'settings.sec_title': 'Security',
            'settings.sec_desc': 'Access policy for admin users.',
            'settings.sec_rel': 'Require re-login after 8 hours',
            'settings.sec_2fa': 'Two-factor authentication (coming soon)',
            'settings.save': 'Save settings',
            'login.brand_title': 'Admin Dashboard',
            'login.brand_desc': 'Manage your products, orders, and customers with our powerful admin panel.',
            'login.copyright': '© 2023 AutoParts Global. All rights reserved.',
            'login.form_title': 'Sign in to your account',
            'login.email': 'Email Address',
            'login.password': 'Password',
            'login.remember': 'Remember me',
            'login.forgot': 'Forgot password?',
            'login.submit': 'Sign In',
            'login.demo_hint': 'Demo admin:',
            'login.fill_demo': 'Fill admin credentials'
        },
        zh: {
            'lang.switch': '语言',
            'lang.zh': '中文',
            'lang.en': 'English',
            'nav.dashboard': '控制台',
            'nav.products': '商品',
            'nav.orders': '订单',
            'nav.customers': '客户',
            'nav.reports': '报表',
            'nav.settings': '设置',
            'nav.logout': '退出登录',
            'user.admin': '管理员',
            'header.dashboard': '控制台',
            'header.products': '商品管理',
            'header.orders': '订单管理',
            'header.customers': '客户管理',
            'header.reports': '数据报表',
            'header.settings': '系统设置',
            'stats.total_sales': '销售总额',
            'stats.total_orders': '订单总数',
            'stats.total_products': '商品 SKU 数',
            'stats.total_customers': '客户总数',
            'stats.from_last_month': '较上月',
            'mgmt.title': '功能入口',
            'mgmt.catalog': '商品目录',
            'mgmt.fulfillment': '履约',
            'mgmt.crm': '客户关系',
            'mgmt.analytics': '分析',
            'mgmt.config': '配置',
            'mgmt.products_title': '商品',
            'mgmt.products_desc': 'SKU、价格、库存与分类。',
            'mgmt.orders_title': '订单',
            'mgmt.orders_desc': '付款、拣货、发货与售后。',
            'mgmt.customers_title': '客户',
            'mgmt.customers_desc': '资料、订单历史与终身价值。',
            'mgmt.reports_title': '报表',
            'mgmt.reports_desc': '销售趋势、渠道与导出。',
            'mgmt.settings_title': '设置',
            'mgmt.settings_desc': '店铺信息、物流、通知与安全。',
            'chart.sales_overview': '销售概览',
            'chart.top_products': '热销商品',
            'table.recent_orders': '最近订单',
            'table.order_id': '订单号',
            'table.customer': '客户',
            'table.date': '日期',
            'table.total': '金额',
            'table.status': '状态',
            'table.action': '操作',
            'common.view': '查看',
            'common.cancel': '取消',
            'common.save': '保存',
            'common.previous': '上一页',
            'common.next': '下一页',
            'table.email': '邮箱',
            'status.shipped': '已发货',
            'status.processing': '处理中',
            'status.delivered': '已送达',
            'status.cancelled': '已取消',
            'status.draft': '草稿',
            'products.modal_add': '添加商品',
            'products.modal_edit': '编辑商品',
            'products.label_name': '商品名称',
            'products.label_category': '分类',
            'products.label_desc': '描述',
            'products.label_image': '商品图片',
            'products.confirm_delete': '确定要删除该商品吗？',
            'products.alert_saved': '商品已保存！',
            'products.alert_deleted': '商品已删除！',
            'products.kpi_active': '在售 SKU',
            'products.kpi_active_sub': '已上架且有库存',
            'products.kpi_low': '低库存（<10）',
            'products.kpi_low_sub': '需尽快补货',
            'products.kpi_draft': '草稿 / 隐藏',
            'products.kpi_draft_sub': '前台不可见',
            'products.kpi_cat': '分类数',
            'products.kpi_cat_sub': '车身、发动机、电气等',
            'common.filter': '筛选',
            'common.export': '导出',
            'products.add': '添加商品',
            'table.product': '商品',
            'table.category': '分类',
            'table.price': '价格',
            'table.stock': '库存',
            'table.published': '已发布',
            'common.edit': '编辑',
            'common.delete': '删除',
            'orders.kpi_payment': '待付款',
            'orders.kpi_payment_sub': '未完成支付',
            'orders.kpi_processing': '处理中',
            'orders.kpi_processing_sub': '拣货与打包',
            'orders.kpi_shipped': '近 7 日已发货',
            'orders.kpi_shipped_sub': '已交承运商',
            'orders.kpi_returns': '待处理退货',
            'orders.kpi_returns_sub': 'RMA 进行中',
            'table.order_id_short': '订单号',
            'orders.modal_prefix': '订单 #',
            'orders.shipping_info': '收货信息',
            'orders.order_info': '订单信息',
            'orders.order_items': '订单商品',
            'orders.total': '合计',
            'orders.update_status': '更新状态',
            'orders.label_name': '姓名：',
            'orders.label_address': '地址：',
            'orders.label_email': '邮箱：',
            'orders.label_phone': '电话：',
            'orders.label_order_date': '下单日期：',
            'orders.label_payment': '支付方式：',
            'orders.label_order_status': '订单状态：',
            'customers.kpi_total': '客户总数',
            'customers.kpi_total_sub': '注册账户',
            'customers.kpi_new': '近 30 日新增',
            'customers.kpi_new_sub': '首单或新注册',
            'customers.kpi_repeat': '复购客户',
            'customers.kpi_repeat_sub': '累计 2 单及以上',
            'customers.kpi_aov': '客单价',
            'customers.kpi_aov_sub': '近 90 天',
            'customers.contact_info': '联系信息',
            'customers.address_title': '地址',
            'customers.order_history': '订单历史',
            'customers.modal_title': '客户详情：',
            'customers.label_member_since': '注册时间：',
            'table.phone': '电话',
            'table.total_orders': '累计订单',
            'table.total_spend': '累计消费',
            'reports.intro': '销售与运营分析（演示数据）。',
            'reports.kpi_revenue': '净收入（30 天）',
            'reports.kpi_revenue_sub': '较上月 +11%',
            'reports.kpi_orders': '订单数（30 天）',
            'reports.kpi_orders_sub': '较上月 +6%',
            'reports.kpi_aov': '客单价',
            'reports.kpi_aov_sub': 'B2C 综合',
            'reports.kpi_refund': '退款率',
            'reports.kpi_refund_sub': '较上月 -0.3%',
            'reports.chart_channel': '各渠道收入',
            'reports.chart_status': '订单状态分布',
            'reports.exports': '导出',
            'reports.exports_desc': '生成 CSV 快照供对账（演示，不实际下载）。',
            'reports.btn_sales': '销售汇总',
            'reports.btn_inventory': '库存估值',
            'reports.btn_customers': '客户列表',
            'reports.highlights': '要点',
            'reports.hl1': '车身类周环比增长 18%。',
            'reports.hl2': '复购率稳定在 34%。',
            'reports.hl3': '12 个 SKU 低于补货点 — 见商品页。',
            'settings.intro': '店铺配置（演示，不会保存）。',
            'settings.store_title': '店铺资料',
            'settings.store_desc': '发票与邮件中显示的对外名称与联系方式。',
            'settings.store_name': '店铺显示名称',
            'settings.support_email': '客服邮箱',
            'settings.timezone': '默认时区',
            'settings.ship_title': '物流默认',
            'settings.ship_desc': '包邮门槛与处理时效。',
            'settings.free_ship': '满额包邮（美元）',
            'settings.proc_days': '处理时间（工作日）',
            'settings.intl': '启用国际物流报价',
            'settings.notif_title': '通知',
            'settings.notif_desc': '团队邮件提醒。',
            'settings.notif_new': '新订单',
            'settings.notif_low': '低库存预警',
            'settings.notif_digest': '每日销售摘要',
            'settings.sec_title': '安全',
            'settings.sec_desc': '管理员访问策略。',
            'settings.sec_rel': '8 小时后需重新登录',
            'settings.sec_2fa': '双因素认证（即将推出）',
            'settings.save': '保存设置',
            'login.brand_title': '管理后台',
            'login.brand_desc': '管理商品、订单与客户。',
            'login.copyright': '© 2023 AutoParts Global 保留所有权利。',
            'login.form_title': '登录您的账户',
            'login.email': '电子邮箱',
            'login.password': '密码',
            'login.remember': '记住我',
            'login.forgot': '忘记密码？',
            'login.submit': '登录',
            'login.demo_hint': '演示账号：',
            'login.fill_demo': '填入演示账号'
        }
    };

    function getLang() {
        var v = localStorage.getItem(STORAGE_KEY);
        return v === 'zh' ? 'zh' : 'en';
    }

    function setLang(lang) {
        localStorage.setItem(STORAGE_KEY, lang === 'zh' ? 'zh' : 'en');
        apply();
    }

    function t(key) {
        var lang = getLang();
        var pack = DICT[lang] || DICT.en;
        if (pack[key]) return pack[key];
        return (DICT.en && DICT.en[key]) || key;
    }

    function apply() {
        var lang = getLang();
        document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var k = el.getAttribute('data-i18n');
            if (!k) return;
            var val = t(k);
            el.textContent = val;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var k = el.getAttribute('data-i18n-placeholder');
            if (k) el.setAttribute('placeholder', t(k));
        });

        var page = document.body && document.body.getAttribute('data-admin-page');
        if (page && PAGE_TITLES[page]) {
            document.title = PAGE_TITLES[page][lang] || PAGE_TITLES[page].en;
        }

        document.querySelectorAll('[data-admin-lang]').forEach(function (btn) {
            var l = btn.getAttribute('data-admin-lang');
            var active = lang === l;
            btn.classList.remove('bg-primary-600', 'text-white', 'bg-gray-800', 'text-gray-300', 'hover:bg-gray-600');
            if (active) {
                btn.classList.add('bg-primary-600', 'text-white');
            } else {
                btn.classList.add('bg-gray-800', 'text-gray-300', 'hover:bg-gray-600');
            }
        });
    }

    function bindLangButtons() {
        document.querySelectorAll('[data-admin-lang]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLang(btn.getAttribute('data-admin-lang'));
            });
        });
    }

    function init() {
        apply();
        bindLangButtons();
    }

    global.APGAdminI18n = {
        getLang: getLang,
        setLang: setLang,
        t: t,
        apply: apply,
        init: init,
        STORAGE_KEY: STORAGE_KEY
    };
})(typeof window !== 'undefined' ? window : {});
