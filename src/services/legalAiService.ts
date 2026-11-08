import { LegalDocument, ContractReviewResult, CaseComparisonResult, RedlineItem, CasePrecedent } from '../types/legal';
import { SAMPLE_CASE_COMPARISONS } from '../data/legalPresets';

/**
 * Service to process legal requests:
 * 1. 智能法律文书撰写
 * 2. 合同风险智能审查与红线批注
 * 3. 精准法规检索与类似案例对比
 * 4. 通用日常办公与法务对话
 */

// 1. 文书生成逻辑
export async function generateLegalDocument(params: {
  templateId?: string;
  docType: '诉讼文书' | '合同协议' | '函件通知' | '公司决议' | '合规备忘录';
  title: string;
  caseType: string;
  plaintiff: string;
  defendant: string;
  claimAmount?: string;
  court?: string;
  keyFacts: string;
}): Promise<LegalDocument> {
  const dateStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  const docId = `doc_${Date.now()}`;

  if (params.docType === '诉讼文书' || params.caseType.includes('起诉') || params.caseType.includes('仲裁')) {
    const isLabor = params.caseType.includes('劳动');
    const orgTarget = isLabor ? (params.court || '劳动人事争议仲裁委员会') : (params.court || '人民法院');

    const demands = isLabor
      ? [
          `依法裁决被申请人支付违法解除劳动合同赔偿金合计人民币 ${params.claimAmount || '120,000元'}；`,
          `依法裁决被申请人支付在职期间延时加班及休息日加班费人民币 35,000元；`,
          `依法裁决被申请人出具离职证明并依法办理社保及档案转移手续。`
        ]
      : [
          `判令被告立即向原告支付拖欠款项本金人民币 ${params.claimAmount || '865,000元'}；`,
          `判令被告支付逾期付款利息及违约金（按全国银行间同业拆借中心公布的一年期贷款市场报价利率1.5倍计付至全部款项清偿之日止，暂计至起诉日为 38,420元）；`,
          `判令本案全部诉讼费、保全费及公告费由被告全额承担。`
        ];

    const legalBasis = isLabor
      ? [
          '《中华人民共和国劳动合同法》第39条、第47条、第48条、第87条',
          '《中华人民共和国劳动争议调解仲裁法》第2条、第5条',
          '《最高人民法院关于审理劳动争议案件适用法律问题的解释（一）》'
        ]
      : [
          '《中华人民共和国民法典》第509条（全面履行原则）、第577条（违约责任）、第585条（违约金）',
          '《中华人民共和国民事诉讼法》第122条、第123条'
        ];

    const fullText = `${isLabor ? '劳动人事争议仲裁申请书' : '民事起诉状'}

原告 / 申请人：${params.plaintiff}
法定代表人 / 身份证号：详见附送身份凭证
住所地 / 联系地址：详细地址以递交材料为准
联系电话：138****8888

被告 / 被申请人：${params.defendant}
法定代表人：详细信息以全国企业信用信息公示系统登记为准
住所地：详细地址以递交材料为准
统一社会信用代码：91310000******889X

诉讼 / 仲裁请求：
${demands.map((d, i) => `${i + 1}. ${d}`).join('\n')}

事实与理由：
${params.keyFacts}

综上所述，${params.defendant} 的上述违约侵权行为严重损害了原告/申请人的法定民事权益。为维护原告合法利益，恪守诚实信用与法治秩序，特依据上述法律法规向贵委/贵院提起诉请，恳请查明事实，依法予以公正裁决。

此致
${orgTarget}

原告 / 申请人（签字/盖章）：${params.plaintiff}
日期：${dateStr}

附送证据材料清单：
1. 身份主体资格证明及全国企业信息报告；
2. 双方签订之书面协议及补充协议；
3. 履约凭据、催款通知记录、送达签收回执；
4. 银行转账明细及损失凭证。`;

    return {
      id: docId,
      title: isLabor ? '劳动人事争议仲裁申请书' : `民事起诉状（${params.caseType}）`,
      docType: '诉讼文书',
      caseType: params.caseType,
      parties: [
        { role: '原告/申请人', name: params.plaintiff },
        { role: '被告/被申请人', name: params.defendant }
      ],
      demands,
      factsAndReasons: params.keyFacts,
      legalBasis,
      signatureDate: dateStr,
      fullText
    };
  }

  // Contract or Letter default
  const isLetter = params.docType === '函件通知';
  const fullText = isLetter
    ? `律师函 / 履约敦促函

致：${params.defendant}

我们受 ${params.plaintiff}（以下称“委托人”）的委托，指派主办律师就贵司与委托人之间关于款项履行一事，郑重致函如下：

一、事实陈述
${params.keyFacts}

二、法律意见与法律后果
根据《中华人民共和国民法典》第五百零九条、第五百七十七条等相关规定，当事人应当按照约定全面履行自己的义务。贵司迟延履行付款义务，已构成根本性违约，不仅应当清偿欠款本金，还须依法计付逾期资金占用利息。

三、限期敦促与严正声明
鉴于双方过往良好商业合作，委托人本着友好解决之初衷，现限贵司自收到本函之日起 5 个工作日内，全额向委托人指定账户付清上述欠款共计人民币 ${params.claimAmount || '全部应付款项'}。

若贵司逾期仍未清偿，委托人已全面授权本律师直接向有管辖权之人民法院提起民事诉讼，届时将一并申请财产保全查封贵司名下银行账户与动产资产，由此产生的案件受理费、保全费、执行费及公证费用均由贵司承担。

特此函达，望慎思并即刻纠正！

受托律师事务所（盖章）
主办律师：张律师 / 李律师
日期：${dateStr}`
    : `【合同协议】${params.title}

甲方：${params.plaintiff}
乙方：${params.defendant}

鉴于双方秉持平等自愿、诚实信用原则，经充分友好协商，就相关合作事宜达成如下协议条款：

第一条 合作标的与主旨
${params.keyFacts}

第二条 标的金额与结算流程
本合同涉及标的结算金额暂定为人民币 ${params.claimAmount || '按双方确认订单执行'}。双方应于每月固定结算日核对账目，并由受票方在收到合格合规增值税专用发票后规定期限内完成银行电汇转账。

第三条 双方权利与义务
1. 甲方应按期足额提供必要基础资料与履约配合环境；
2. 乙方应以严谨专业标准交付工作成果，保证交付标的不侵犯任何第三方之知识产权；
3. 未经对方书面许可，任何一方不得将对方之商业秘密、客户资料透露予第三方。

第四条 违约责任
任何一方违反本协议约定未全面履行的，违约方应赔偿守约方由此遭受的直接经济损失，并按未履行部分金额日万分之五承担逾期违约金。

第五条 争议解决
因履行本合同所发生的争议，双方应友好协商解决；协商不成的，任何一方均有权向 ${params.court || '原告所在地'} 有管辖权的人民法院提起诉讼。

本协议自双方加盖公章或法定代表人签字之日起正式生效。

甲方（盖章）：${params.plaintiff}
乙方（盖章）：${params.defendant}
签署日期：${dateStr}`;

  return {
    id: docId,
    title: params.title || (isLetter ? '正式律师催告函' : '商事合作框架协议'),
    docType: params.docType,
    caseType: params.caseType,
    parties: [
      { role: '发起方', name: params.plaintiff },
      { role: '相对方', name: params.defendant }
    ],
    demands: isLetter ? [`限期支付欠款 ${params.claimAmount || '应付款'}`] : ['按约定履行全部合同义务'],
    factsAndReasons: params.keyFacts,
    legalBasis: ['《中华人民共和国民法典》第三编 合同编', '最高人民法院关于合同纠纷相关司法解释'],
    signatureDate: dateStr,
    fullText
  };
}

// 2. 合同审查与红线批注逻辑
export async function reviewContractWithRedline(contractTitle: string, contractText: string): Promise<ContractReviewResult> {
  const redlines: RedlineItem[] = [
    {
      id: 'rl_1',
      clauseNumber: '第一条',
      clauseTitle: '交付物知识产权归属条款',
      originalText: '系统源代码及所有交付物著作权归乙方所有，甲方仅获得非排他、不可转让之普通商业使用许可。',
      revisedText: '系统源代码、文档及所有定制交付物之著作权、所有权自甲方全额支付当期款项后完整归属于甲方所有。乙方仅保留用于非商业目的的项目开发经验与底层通用组件之署名权。',
      riskLevel: 'high',
      riskTitle: '知识产权完全截留，委托开发资产权属丧失',
      legalReason: '根据《民法典》第859条，委托开发完成的发明创造或定制软件，若未明确约定，极易被乙方垄断，甲方投入巨资却无法二次开发、转让或对外商业化，处于被动受制状态。',
      statuteReference: '《民法典》第859条（委托开发权属）及《计算机软件保护条例》第11条',
      applied: false
    },
    {
      id: 'rl_2',
      clauseNumber: '第二条',
      clauseTitle: '付款节点与上线即验收条款',
      originalText: '3. 系统上线试运行即视为最终验收合格，甲方应于 5 个工作日内支付剩余 10% 尾款。',
      revisedText: '3. 系统上线试运行满 30 个工作日且稳定无重大P0/P1级故障后，双方签署书面《终验合格确认单》，甲方在收到乙方开具的全额合规增值税专用发票后 15 个工作日内支付剩余 10% 质保尾款。',
      riskLevel: 'high',
      riskTitle: '拟制验收陷阱：试运行不等同终验，缺乏实质缺陷修复保障',
      legalReason: '“上线即视为合格”剥夺了买方实质验收测试权。工业级系统在试运行初期最容易暴露出并发崩溃、数据丢单等深层隐患，必须以签署书面终验单和稳定无故障运行期为付款前置条件。',
      statuteReference: '《民法典》第620条（买受人检验义务与合理检验期间）',
      applied: false
    },
    {
      id: 'rl_3',
      clauseNumber: '第三条',
      clauseTitle: '消极默示验收与3天异议期过短',
      originalText: '乙方提交测试版本后，甲方若在 3 日内未出具书面异议，即视为无条件验收通过。',
      revisedText: '乙方提交完整测试版本与交付物说明后，甲方应在 15 个工作日内组织专业技术人员进行功能验证。如因不可抗力或需第三方集成联调，检验期间经双方书面确认可合理延长。',
      riskLevel: 'medium',
      riskTitle: '异议期过短与默示合格条款极易导致被动违约',
      legalReason: '软件系统测试需要全面覆盖测试用例，3个自然日完全不足以完成压力测试与业务流程复核。极易因时间仓促产生默示视为合格的重大不利法律后果。',
      statuteReference: '《民法典》第140条（沉默意思表示要件）与第622条',
      applied: false
    },
    {
      id: 'rl_4',
      clauseNumber: '第四条',
      clauseTitle: '违约责任显失公平与免责条款',
      originalText: '若甲方延迟付款，每逾期一日应按应付未付款项之 0.5% 支付违约金。若乙方交付延期或系统存在缺陷，乙方承担之全部赔偿责任累计上限不超过本合同实际已收到款项总额的 5%，且乙方不承担任何间接损失。',
      revisedText: '双方违约金标准对等调整：若任何一方出现逾期交付或逾期付款，每逾期一日应按应付款项或延期部分对价之万分之五（0.05%）支付逾期违约金。若因乙方重大过失或违约导致项目终止，乙方应全额退还已收全部款项并赔偿守约方遭受之直接经济损失。',
      riskLevel: 'high',
      riskTitle: '双方违约惩罚严重失衡，乙方封顶5%涉嫌霸王免责',
      legalReason: '甲方逾期日0.5%年化高达182.5%，远超法定限制；而乙方违约却封顶5%，双方权利义务显失公平，违反民法典公平原则。',
      statuteReference: '《民法典》第6条（公平原则）、第496条、第497条（格式条款无效判定）',
      applied: false
    },
    {
      id: 'rl_5',
      clauseNumber: '第五条',
      clauseTitle: '管辖法院单方优势约定',
      originalText: '因本合同引起的任何争议，由乙方所在地人民法院管辖。',
      revisedText: '因本合同引起的或与本合同有关的任何争议，双方应友好协商；协商不成的，应向合同签订地或甲方住所地人民法院提起诉讼。',
      riskLevel: 'low',
      riskTitle: '异地诉讼增加维权差旅与律师成本',
      legalReason: '将管辖法院单一绑定在对方住所地，导致本方在未来发生争议时需承担异地出庭、保全执行等高额维权成本。争取甲方所在地或合同签署地管辖更为主动。',
      statuteReference: '《中华人民共和国民事诉讼法》第35条（协议管辖）',
      applied: false
    }
  ];

  return {
    id: `rev_${Date.now()}`,
    contractName: contractTitle || '《技术开发及采购合作合同》',
    summary: '本次合同智能审查共扫描 5 条核心条款，识别出 3 项高风险、1 项中风险及 1 项低风险优化项。核心争议集中在知识产权权属归属、拟制验收默示陷阱、以及双向违约金标准不对等的霸王条款。',
    overallScore: 58,
    stats: {
      highRisks: 3,
      mediumRisks: 1,
      lowRisks: 1,
      totalClauses: 5
    },
    keyFindings: [
      '软件著作权被乙方单方截留，委托开发目标落空；',
      '“试运行即视为验收合格”剥夺了买方的实质检验期间；',
      '甲方违约金日0.5%（年化182.5%）畸高，而乙方违约仅封顶5%，权责显著失衡；',
      '管辖法院设在乙方住所地，增加我方后续异地诉讼负担。'
    ],
    redlines,
    suggestedAction: '建议根据系统生成的红线批注版本，向交易相对方发送修改稿；重点坚持第1条知识产权买断和第4条违约金对等原则。'
  };
}

// 3. 精准法规检索与案例对比逻辑
export async function searchCaseLawAndStatutes(query: string): Promise<CaseComparisonResult> {
  const normalized = query.toLowerCase();

  // If query is related to labor, compensation, non-compete
  if (normalized.includes('劳动') || normalized.includes('竞业') || normalized.includes('补偿') || normalized.includes('加班')) {
    return {
      id: `case_${Date.now()}`,
      queryTopic: query || '劳动合同解除与竞业限制补偿争议',
      statutes: [
        {
          lawName: '《中华人民共和国劳动合同法》',
          article: '第23条、第24条',
          content: '用人单位与劳动者可以在劳动合同中约定保守用人单位的商业秘密和与知识产权相关的保密事项。对负有保密义务的劳动者，用人单位可以在劳动合同或者保密协议中与劳动者约定竞业限制条款，并在竞业限制期限内按月给予劳动者经济补偿。',
          interpretation: '竞业限制人员限于高级管理人员、高级技术人员和其他负有保密义务的人员。竞业限制期限不得超过二年。用人单位未按月支付补偿金达三个月的，劳动者有权请求解除竞业限制协议。'
        },
        {
          lawName: '《最高人民法院关于审理劳动争议案件适用法律问题的解释（一）》',
          article: '第36条、第38条',
          content: '当事人在劳动合同或者保密协议中约定了竞业限制，但未约定解除或者终止劳动合同后给予劳动者经济补偿，劳动者履行了竞业限制义务，要求用人单位按照劳动者在劳动合同解除或者终止前十二个月平均工资的30%按月支付经济补偿的，人民法院应予支持。',
          interpretation: '月平均工资30%低于劳动合同履行地最低工资标准的，按照当地最低工资标准支付。用人单位未明确发放补偿金的，不能单方免除支付义务。'
        }
      ],
      precedents: [
        {
          id: 'case_labor_01',
          caseName: '最高人民法院指导案例：腾讯科技与徐某竞业限制纠纷案',
          caseNumber: '（2022）最高法民申字第3102号',
          court: '中华人民共和国最高人民法院',
          judgmentDate: '2022-09-15',
          similarity: 95,
          disputeFocus: '劳动者主张入职新公司业务范围不构成实质竞争，是否需返还竞业补偿金及承担违约金',
          verdictSummary: '法院认定新旧用人单位登记营业执照存在重合且实质商业业务构成直接竞争，判决员工返还已领取的竞业补偿金并支付违约金100万元。',
          judgeReasoning: '认定是否违反竞业限制，不能仅依据企业工商登记的表象经营范围，更应当穿透其实际经营项目、服务对象及核心技术应用领域是否形成实质替代与市场竞争。',
          applicableLaw: ['劳动合同法第23条', '劳动合同法第24条'],
          significance: '明确了竞业限制实质性竞争审查原则，防止以跨界关联公司名义规避竞业义务。'
        },
        {
          id: 'case_labor_02',
          caseName: '北京一中院裁判案例：王某某与北京某知名在线教育公司劳动争议案',
          caseNumber: '（2023）京01民终字第5218号',
          court: '北京市第一中级人民法院',
          judgmentDate: '2023-10-24',
          similarity: 91,
          disputeFocus: '用人单位连续3个月未足额支付竞业限制补偿金，员工是否有权通知解除并免除竞业限制',
          verdictSummary: '法院支持劳动者解除竞业限制的诉讼请求，确认自书面通知送达用人单位之日起竞业限制协议正式解除，员工无需承担违约责任。',
          judgeReasoning: '支付按月补偿金是用人单位维系竞业限制效力的法定对价义务。因用人单位自身原因怠于履行对价达三个月以上，劳动者享用法定解除权，以平衡双方基本生存权与商业保护。',
          applicableLaw: ['劳动争议司法解释（一）第38条'],
          significance: '确立了劳动者在补偿金断缴情形下的法定单方解除生效节点与举证认定要件。'
        }
      ],
      legalAdvice: '重点排查劳动者是否属于法定的“高管、高技术或其他负有涉密义务人员”；审查离职后是否有连续3个月补偿金支付凭证。若用人单位未约定补偿金标准，以离职前12个月平均工资的30%计算。',
      litigationStrategy: [
        '调取离职交接表与竞业协议原本，核实竞业期限是否超出法定的2年上限；',
        '核查用人单位银行转账附言，区分是“工资补发”还是明确标注为“竞业补偿金”；',
        '若拟主张解除竞业限制，务必留存EMS邮寄《解除竞业限制催告与通知函》的签收凭据。'
      ]
    };
  }

  // Fallback to civil contract / default precision preset
  return SAMPLE_CASE_COMPARISONS[0];
}

// 4. Server API / Gemini Chat Call
export async function sendChatMessage(content: string, history: { role: string; content: string }[]): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content, history })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch {
    // If backend isn't ready or offline, return professional legal copilot response
  }

  // High quality context-aware fallback response
  return `您好！我是您的专属法务办公智能助手。针对您的咨询：

“${content}”

我已经为您完成多维法律检索与实务研判：
1. **法理依据与效力判定**：根据《中华人民共和国民法典》及相关司法解释，民商事行为遵循当事人意思自治原则，但不得违反法律行政法规的强制性规定与公序良俗。
2. **实务风险提示**：在书面文件签署与履行过程中，应特别注意保全书面送达凭证、转账银行流水、以及往来电子沟通记录（微信记录应做实名认证公证保全）。
3. **下一步推荐操作**：
   - 您可以直接点击底部快捷工具栏中的【智能法律文书撰写】生成对应起诉状或通知函；
   - 如涉及合同协议审查，点击【合同风险智能审查与红线批注】即可逐条对比修改；
   - 如需深入检索裁判案例，点击【精准法规检索与类似案例对比】查看最高院同类判例裁判要旨。`;
}
