import { Conversation, ContractReviewResult, CaseComparisonResult, LegalDocument } from '../types/legal';

// Recommended search & prompt chips matching the screenshot's "为你推荐" section
export const RECOMMENDED_PROMPTS = [
  {
    tag: '热点',
    text: '2026最高院劳动争议司法解释二核心要点梳理及企业用工应对',
    type: 'case_comparison',
    query: '2026劳动争议司法解释二 竞业限制与经济补偿金'
  },
  {
    tag: '审查',
    text: '审查一份软件开发采购合同并输出违约责任红线批注',
    type: 'contract_review',
    query: '审查软件开发采购合同'
  },
  {
    tag: '文书',
    text: '起草一份严密的《有限责任公司股权转让协议（含对赌条款）》',
    type: 'drafting',
    query: '起草股权转让协议'
  },
  {
    tag: '检索',
    text: '检索民间借贷年利率超LPR四倍部分利息抗辩的裁判规则与对比案例',
    type: 'case_comparison',
    query: '民间借贷利息超过LPR四倍 裁判要旨'
  }
];

// Presets for the 1st Quick Tool: 智能法律文书撰写
export const DRAFTING_TEMPLATES = [
  {
    id: 'civil_complaint',
    category: '诉讼仲裁',
    name: '民事起诉状（买卖合同货款纠纷）',
    description: '适用于卖方追索未付货款、逾期利息及违约金的标准诉讼状纸',
    defaultData: {
      docType: '诉讼文书' as const,
      caseType: '买卖合同纠纷',
      plaintiff: '上海鼎盛智能装备有限公司',
      defendant: '苏州创联精工机械制造有限公司',
      claimAmount: '865,000元',
      court: '苏州市工业园区人民法院',
      keyFacts: '原告于2024年10月依约交付全部智能数控设备并经被告验收合格，被告仅支付首期款30%，余款经原告多次书面催告仍拒不支付。'
    }
  },
  {
    id: 'labor_arbitration',
    category: '劳动人事',
    name: '劳动仲裁申请书（违法解除与加班费）',
    description: '用于主张违法解除劳动合同赔偿金（2N）、未休年休假及延时加班费',
    defaultData: {
      docType: '诉讼文书' as const,
      caseType: '劳动争议仲裁',
      plaintiff: '李明（申请人）',
      defendant: '北京智联互通信息技术有限公司（被申请人）',
      claimAmount: '194,500元',
      court: '北京市海淀区劳动人事争议仲裁委员会',
      keyFacts: '申请人入职3年担任高级架构师，被申请人无正当理由单方解除劳动合同，且在职期间长期存在强迫加班事实未足额支付报酬。'
    }
  },
  {
    id: 'lawyer_letter',
    category: '非诉业务',
    name: '律师函 / 履约催告函（债务催清）',
    description: '正式书面通知债务人限期清偿欠款并保留采取法律措施权利',
    defaultData: {
      docType: '函件通知' as const,
      caseType: '合同履约催告',
      plaintiff: '北京市金杜律师事务所（受托方）/ 浙江天宏贸易有限公司',
      defendant: '广州粤航供应链管理有限责任公司',
      claimAmount: '1,280,000元',
      court: '拟提起诉讼管辖法院：杭州市西湖区人民法院',
      keyFacts: '截至2026年1月，贵方逾期应付未付供应链货款已达128万元，逾期达92天，严重违反双方《供应链合作协议》第7.2条约定。'
    }
  },
  {
    id: 'equity_transfer',
    category: '公司并购',
    name: '股权转让协议（含陈述保证与交割前承诺）',
    description: '规范股东向第三方或内部转让股权，含过渡期安排与税务负担条款',
    defaultData: {
      docType: '合同协议' as const,
      caseType: '公司股权变动',
      plaintiff: '转让方：陈志强（持股25%）',
      defendant: '受让方：深圳市汇丰前海投资合伙企业（有限合伙）',
      claimAmount: '转让总对价：5,000,000元',
      court: '深圳市南山区人民法院',
      keyFacts: '标的公司为深圳微芯未来科技有限公司，转让方将其合法持有的25%股权转让给受让方，双方就交割条件、工商变更、竞业限制及追索权达成一致。'
    }
  },
  {
    id: 'non_compete',
    category: '劳动人事',
    name: '高级管理人员竞业限制与商业秘密保护协议',
    description: '明确竞业限制期限、范围、地域、按月补偿金标准及违约赔偿金倍数',
    defaultData: {
      docType: '合同协议' as const,
      caseType: '劳动合规保障',
      plaintiff: '用人单位：杭州极光云联软件系统有限公司',
      defendant: '员工：王建国（研发副总裁）',
      claimAmount: '违约金约定：前12个月总报酬的3倍',
      court: '杭州市滨江区人民法院',
      keyFacts: '员工离职后24个月内不得在竞对企业任职，用人单位按离职前12个月平均工资30%按月支付补偿金。'
    }
  }
];

// Presets for the 2nd Quick Tool: 合同风险智能审查与红线批注
export const SAMPLE_CONTRACTS_FOR_REVIEW = [
  {
    id: 'tech_dev_contract',
    title: '《企业管理系统技术开发与定制服务合同》（采购方视角审查）',
    summary: '审查发现该合同存在单方付款周期过紧、知识产权完全被乙方截留、违约赔偿上限对甲方不公平等4项中高风险。',
    content: `【第一条 项目范围与交付】
乙方应根据附件需求说明书开发ERP进销存协同管理系统。系统源代码及所有交付物著作权归乙方所有，甲方仅获得非排他、不可转让之普通商业使用许可。

【第二条 合同价款与付款进度】
本合同总金额为人民币 800,000 元（大写：捌拾万元整）。
1. 合同签署生效后 3 个工作日内，甲方支付 50% 预付款；
2. 乙方提交原型界面后 3 个工作日内，甲方支付 40% 进度款；
3. 系统上线试运行即视为最终验收合格，甲方应于 5 个工作日内支付剩余 10% 尾款。

【第三条 验收标准】
乙方提交测试版本后，甲方若在 3 日内未出具书面异议，即视为无条件验收通过。

【第四条 违约责任】
若甲方延迟付款，每逾期一日应按应付未付款项之 0.5% 支付违约金。
若乙方交付延期或系统存在缺陷，乙方承担之全部赔偿责任累计上限不超过本合同实际已收到款项总额的 5%，且乙方不承担任何间接损失。

【第五条 争议解决】
因本合同引起的任何争议，由乙方所在地人民法院管辖。`
  },
  {
    id: 'lease_agreement',
    title: '《商业办公用房租赁合同》（承租人防坑红线审查）',
    summary: '审查发现出租方排除房屋质量修缮责任、押金退还设置苛刻前置条件、并设定出租方随时单方解约权。',
    content: `【第三条 房屋修缮与维护】
承租方在租赁期间对该房屋结构、水电气管线及附着设施负有全部维护与自费修缮义务。出租方不承担因房屋自然损耗或原建筑质量问题造成的任何损失。

【第五条 押金及退还】
承租方应支付三个月租金作为押金（计人民币 150,000 元）。租赁期满后，须由出租方指定的评估机构完成全面房屋损耗评估，且在出租方与新承租人签订租赁协议后 60 个工作日内方可启动押金结算。

【第八条 出租方特殊解除权】
在租赁期内，出租方如因企业自身战略重组、物业改造升级或整体出售，有权提前 15 日书面通知承租方解除本合同，承租方应无条件腾退房屋，出租方不承担任何搬迁赔偿或装修补偿责任。`
  }
];

// Presets for the 3rd Quick Tool: 精准法规检索与类似案例对比
export const SAMPLE_CASE_COMPARISONS: CaseComparisonResult[] = [
  {
    id: 'case_comp_default',
    queryTopic: '买卖合同违约金过高抗辩与酌减裁判规则',
    statutes: [
      {
        lawName: '《中华人民共和国民法典》',
        article: '第585条第2款',
        content: '约定的违约金低于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以增加；约定的违约金过分高于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以适当减少。',
        interpretation: '违约金的根本性质在于“以补偿为主，以惩罚为辅”。当违约金超过造成损失的30%时，司法实践一般认定为“过分高于造成的损失”，法院依当事人抗辩有权予以酌减。'
      },
      {
        lawName: '《最高人民法院关于适用〈中华人民共和国民法典〉合同编通则若干问题的解释》',
        article: '第65条',
        content: '当事人主张约定的违约金过分高于违约造成的损失，请求予以适当减少的，人民法院应当以民法典第五百八十四条规定的损失为基础，兼顾合同主体、交易类型、合同的履行情况、当事人的过错程度等综合衡量。',
        interpretation: '举证责任分配：主张违约金过高的一方（违约方）应当对违约金过分高于非违约方实际损失承担初步举证责任。非违约方主张存在其他可得利益损失的，亦需举证。'
      }
    ],
    precedents: [
      {
        id: 'case_01',
        caseName: '最高院指导性案例：江苏中泰机电与河南天能成套买卖合同纠纷',
        caseNumber: '（2023）最高法民申字第1984号',
        court: '中华人民共和国最高人民法院',
        judgmentDate: '2023-11-18',
        similarity: 97,
        disputeFocus: '约定的日万分之五（年化18.25%）逾期付款违约金是否应予酌减',
        verdictSummary: '原审法院认定违约金过高，按违约行为发生时全国银行间同业拆借中心公布的一年期贷款市场报价利率（LPR）的1.3倍予以支持，最高法裁定驳回再审申请。',
        judgeReasoning: '在商事买卖中，金钱给付债务迟延履行的损失通常以利息损失为主要体现。在原告未举证证明存在其他转售违约损失的情况下，违约金不应超出合理资金占用成本的法规划定限度。',
        applicableLaw: ['民法典第585条', '买卖合同司法解释第18条'],
        significance: '明确了逾期付款违约金以LPR为基础参考指标的酌减基准，有效遏制以违约金为名获取暴利。'
      },
      {
        id: 'case_02',
        caseName: '浙江高院典型案例：杭州智盛网络与宁波东港实业设备买卖案',
        caseNumber: '（2024）浙民终字第412号',
        court: '浙江省高级人民法院',
        judgmentDate: '2024-06-12',
        similarity: 92,
        disputeFocus: '合同约定总价30%违约金加利息，能否合并支持',
        verdictSummary: '二审改判认定定金、违约金与逾期利息不得超出守约方实际遭受的可预见损失总额，最终调减违约金至实际货款本金的10%。',
        judgeReasoning: '违约金调整应当体现诚信原则和禁止牟利原则。守约方主张高额违约金同时主张利息，实质导致双重赔偿，应以合同履行时的可预见损失为最高封顶线。',
        applicableLaw: ['民法典第584条', '民法典第585条'],
        significance: '确立了违约金与利息重叠计算时的“穿透式合并核算”审判规则。'
      }
    ],
    legalAdvice: '诉讼中应重点审查守约方的实际损失证据（借款利息、外部替代采购成本）。若对方仅为资金占用，坚决提出“违约金过高抗辩”，申请法庭将日0.5%违约金依法调减至LPR的1倍至1.5倍。',
    litigationStrategy: [
      '在答辩状及庭审举证期内明确提出书面《违约金酌减申请书》，切勿仅作口头抗辩。',
      '调取同期限同期LPR报价数据作为法定基准（当前1年期LPR约为3.10%）。',
      '申请法庭责令对方披露与第三方交易记录，证明其未发生转售惩罚或停产停工次生损失。'
    ]
  }
];

// Initial mock conversations to populate sidebar faithfully matching the user's screenshot
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_pin_1',
    title: '用 C 实现类似 C++ unordered_map',
    updatedAt: '昨天 21:05',
    isPinned: true,
    category: 'pinned',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        timestamp: '21:04',
        content: '用 C 实现类似 C++ unordered_map 的开散列哈希表，包含冲突拉链法和扩容机制。'
      },
      {
        id: 'm2',
        sender: 'assistant',
        timestamp: '21:05',
        content: '为你设计了基于链地址法的纯 C 哈希表实现，具备动态负载因子检测（Load Factor > 0.75 时自动扩容 2 倍）以及内存安全管理...'
      }
    ]
  },
  {
    id: 'conv_draft_1',
    title: '将这个图片的坦克抠出来',
    updatedAt: '今天 11:20',
    category: 'draft',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        timestamp: '11:20',
        content: '将这个图片的坦克抠出来并去除背景噪点。'
      }
    ]
  },
  {
    id: 'conv_recent_1',
    title: '凡人修仙传马良下界目的',
    updatedAt: '前天 18:32',
    category: 'recent',
    messages: [
      {
        id: 'm4',
        sender: 'user',
        timestamp: '18:30',
        content: '凡人修仙传马良下界真实目的是什么？'
      },
      {
        id: 'm5',
        sender: 'assistant',
        timestamp: '18:32',
        content: '马良乃真仙界九元观叛逃弟子，下界首要目的是追捕盗走掌天瓶的韩立师门旧仇...'
      }
    ]
  },
  {
    id: 'conv_recent_2',
    title: '瑞幸店利润分析',
    updatedAt: '3天前',
    category: 'recent',
    messages: [
      {
        id: 'm6',
        sender: 'user',
        timestamp: '15:10',
        content: '分析瑞幸咖啡标准单店的盈亏平衡点与净利率测算。'
      },
      {
        id: 'm7',
        sender: 'assistant',
        timestamp: '15:12',
        content: '从日均出杯量、物料成本占比（约34%）、租金及人工折旧三要素进行单店UE模型拆解...'
      }
    ]
  },
  {
    id: 'conv_recent_3',
    title: 'AI智能客服创业方向分析',
    updatedAt: '4天前',
    category: 'recent',
    messages: [
      {
        id: 'm8',
        sender: 'user',
        timestamp: '10:05',
        content: '目前大模型落地在B端智能客服赛道还有哪些未被满足的痛点？'
      },
      {
        id: 'm9',
        sender: 'assistant',
        timestamp: '10:08',
        content: '核心痛点集中在多轮复杂业务流鉴权、幻觉兜底机制、以及企业私有知识库实时同步更新机制...'
      }
    ]
  },
  {
    id: 'conv_recent_4',
    title: '1200亿美元兑换人民币',
    updatedAt: '5天前',
    category: 'recent',
    messages: [
      {
        id: 'm10',
        sender: 'user',
        timestamp: '09:20',
        content: '1200亿美元按当前即期汇率换算成人民币是多少？'
      },
      {
        id: 'm11',
        sender: 'assistant',
        timestamp: '09:21',
        content: '按当前美元兑人民币中间价约 7.23 测算，1200亿美元折合约 8,676 亿元人民币。'
      }
    ]
  },
  {
    id: 'conv_recent_5',
    title: '项目合作回复策略',
    updatedAt: '上周',
    category: 'recent',
    messages: [
      {
        id: 'm12',
        sender: 'user',
        timestamp: '14:22',
        content: '收到投资机构的尽调合作意向邮件，如何得体回复既表诚意又掌握主动权？'
      },
      {
        id: 'm13',
        sender: 'assistant',
        timestamp: '14:25',
        content: '建议采用三段式响应法：确认意向与肯定互补价值、设定信息保密与对接时间表、明确下阶段沟通清单...'
      }
    ]
  },
  {
    id: 'conv_recent_6',
    title: '拒绝邀约回复',
    updatedAt: '上周',
    category: 'recent',
    messages: [
      {
        id: 'm14',
        sender: 'user',
        timestamp: '16:40',
        content: '写一封委婉拒绝参加行业论坛主讲嘉宾的商务回复信。'
      },
      {
        id: 'm15',
        sender: 'assistant',
        timestamp: '16:41',
        content: '为您准备了兼顾商务礼仪与未来合作契机的感谢拒绝函模版...'
      }
    ]
  }
];
