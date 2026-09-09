import React,{useMemo,useRef,useState}from'react'
import{createRoot}from'react-dom/client'
import{ArrowRight,Banknote,Check,ChevronDown,CircleAlert,FileCheck2,HeartPulse,Info,LockKeyhole,MessageCircle,RefreshCcw,Send,ShieldCheck,Sparkles,Stethoscope,Umbrella,Users,WalletCards,X,Zap}from'lucide-react'
import'./conversation.css'

const empty={age:'',city:'',marital:'married',spouseAge:'',children:0,youngestAge:'',parents:0,income:'',spouseIncome:'',expenses:'',debt:'',savings:'',budget:'',social:true,company:false,medical:false,life:0,critical:0,accident:0,health:'standard',job:'low',preference:'balanced'}
const demo={age:36,city:'杭州',marital:'married',spouseAge:34,children:2,youngestAge:4,parents:2,income:42,spouseIncome:24,expenses:2.2,debt:180,savings:45,budget:2.4,social:true,company:true,medical:false,life:50,critical:20,accident:30,health:'standard',job:'low',preference:'balanced'}
const n=v=>Number(v)||0
const money=v=>Math.max(0,v).toLocaleString('zh-CN',{maximumFractionDigits:1})+' 万'
const stageNames=['家庭情况','家庭财务','已有保障','风险偏好','保障方案']

function parseText(t){
 const p={},read=rs=>{for(const r of rs){const m=t.match(r);if(m)return Number(m[1])}return null}
 const vals={age:read([/(?:我|本人)?\s*(\d{2})\s*岁/]),spouseAge:read([/(?:配偶|爱人|妻子|丈夫)\s*(\d{2})\s*岁/]),income:read([/(?:本人)?年收入\s*(\d+(?:\.\d+)?)\s*万/]),expenses:read([/(?:家庭)?月支出\s*(\d+(?:\.\d+)?)\s*万/]),debt:read([/(?:房贷|负债|贷款)\s*(?:还有|剩余|约)?\s*(\d+(?:\.\d+)?)\s*万/]),savings:read([/(?:存款|储蓄)\s*(?:约|有)?\s*(\d+(?:\.\d+)?)\s*万/]),budget:read([/(?:保费预算|保险预算|每年保险预算)\s*(\d+(?:\.\d+)?)\s*万/]),youngestAge:read([/(?:最小的?孩子|孩子)\s*(\d{1,2})\s*岁/])}
 Object.entries(vals).forEach(([k,v])=>{if(v!==null)p[k]=v})
 if(/两个孩子|俩孩子/.test(t))p.children=2;else if(/一个孩子/.test(t))p.children=1;else if(/没有孩子|无子女/.test(t))p.children=0
 if(/单身|未婚|离异/.test(t))p.marital='single';if(/配偶|爱人|妻子|丈夫|已婚/.test(t))p.marital='married'
 const city=t.match(/(?:住在|居住在|常住)\s*([\u4e00-\u9fa5]{2,6})/);if(city)p.city=city[1]
 if(/没有社保|无社保/.test(t))p.social=false;else if(/社保|医保/.test(t))p.social=true
 return p
}

function getPlan(p){
 const income=n(p.income)+n(p.spouseIncome),annual=n(p.expenses)*12,reserve=annual*.5,dependents=n(p.children)+n(p.parents)+(p.marital==='married'?1:0)
 const years=p.children?Math.max(5,Math.min(12,18-n(p.youngestAge))):dependents?5:3
 const target={medical:p.social?200:300,critical:Math.max(30,Math.round((n(p.income)*3+20)/10)*10),life:Math.max(0,Math.round((n(p.debt)+annual*years-Math.max(0,n(p.savings)-reserve))/10)*10),accident:Math.max(50,Math.round(n(p.income)*.5)*10)}
 const current={medical:p.medical?target.medical:0,critical:n(p.critical),life:n(p.life),accident:n(p.accident)}
 const gap=Object.fromEntries(Object.keys(target).map(k=>[k,Math.max(0,target[k]-current[k])]))
 const af=n(p.age)<30?.78:n(p.age)<40?1:n(p.age)<50?1.65:n(p.age)<60?2.7:4
 const cost={medical:gap.medical?(n(p.age)<40?.08:n(p.age)<50?.16:n(p.age)<60?.32:.62):0,critical:gap.critical*.012*af,life:dependents?gap.life*.0012*af:0,accident:gap.accident?.03+gap.accident*.0005:0}
 const premium=Object.values(cost).reduce((a,b)=>a+b,0)
 const score=Math.round((p.social?16:0)+(p.medical?24:0)+(target.life?Math.min(25,current.life/target.life*25):25)+Math.min(25,current.critical/target.critical*25)+Math.min(10,current.accident/target.accident*10))
 const recs=[
  {id:'medical',title:'百万医疗险',icon:Stethoscope,target:target.medical,gap:gap.medical,cost:cost.medical,why:p.social?'补充医保目录外费用和大额住院支出':'无基本医保，医疗风险敞口较高',watch:'续保条件、免赔额、医院范围和既往症'},
  {id:'critical',title:'重疾险',icon:HeartPulse,target:target.critical,gap:gap.critical,cost:cost.critical,why:'覆盖约 3 年收入中断和康复支出',watch:'健康告知、疾病定义和保障期限'},
  {id:'life',title:'定期寿险',icon:Umbrella,target:target.life,gap:gap.life,cost:cost.life,why:dependents?'覆盖负债和约 '+years+' 年家庭责任':'家庭责任较轻，可后配置',watch:'保障期限、免责条款和受益人'},
  {id:'accident',title:'综合意外险',icon:Zap,target:target.accident,gap:gap.accident,cost:cost.accident,why:p.job==='high'?'职业风险偏高，需优先确认职业类别':'低保费补充意外伤残和医疗',watch:'职业类别、伤残比例和报销范围'}
 ]
 return{income,annual,reserve,target,current,gap,cost,premium,score,recs,status:n(p.budget)?(premium<=n(p.budget)?'fit':'tight'):'unset'}
}

function App(){
 const[p,setP]=useState(empty),[stage,setStage]=useState(0),[intro,setIntro]=useState(''),[history,setHistory]=useState([]),[expanded,setExpanded]=useState('critical'),[privacy,setPrivacy]=useState(false)
 const plan=useMemo(()=>getPlan(p),[p]),bottom=useRef(null),set=(k,v)=>setP(x=>({...x,[k]:v}))
 const reply=(summary,next)=>{setHistory(h=>[...h,{stage,text:summary}]);setStage(next);setTimeout(()=>bottom.current?.scrollIntoView({behavior:'smooth'}),30)}
 const submitIntro=()=>{const parsed=parseText(intro);setP(x=>({...x,...parsed}));reply(intro||'我想先逐项填写',1)}
 const reset=()=>{setP(empty);setStage(0);setIntro('');setHistory([]);setExpanded('critical')}
 return <div className="chat-app">
  <header className="topbar"><button className="brand" onClick={reset}><b><ShieldCheck/></b><span><strong>家庭保</strong><small>保险规划 Agent</small></span></button><div><span className="private"><LockKeyhole/>资料仅在本机处理</span><button className="icon-btn" onClick={reset} title="重新开始"><RefreshCcw/></button></div></header>
  <div className="shell">
   <aside className="rail"><div className="agent-id"><b><Sparkles/></b><span><strong>小保 Agent</strong><small>在线 · 正在为你分析</small></span></div><div className="progress"><span><i style={{width:Math.min(100,(stage+1)*20)+'%'}}/></span><p>{stage<4?'信息收集中':'分析已完成'} · {Math.min(100,(stage+1)*20)}%</p></div><nav>{stageNames.map((x,i)=><div className={(i===stage?'active ':'')+(i<stage?'done':'')} key={x}><b>{i<stage?<Check/>:i+1}</b><span>{x}</span></div>)}</nav><p className="rail-note"><Info/>我只提供保障需求测算，不销售具体保险产品。</p></aside>
   <main className="conversation">
    <header className="conversation-head"><div><span className="online"/><div><strong>小保 Agent</strong><small>通常几秒内回复</small></div></div><span>会话编号 FC-{new Date().getFullYear()}</span></header>
    <section className="messages">
     <AgentMessage><p>你好，我是小保。接下来我会了解你的家庭责任、收支和已有保障，再给出适合的<strong>保险类型、建议保额和配置顺序</strong>。</p><p className="muted">不用提供身份证、电话、病历或银行卡信息。</p></AgentMessage>
     {stage===0&&<AgentMessage><h2>先简单介绍一下你的家庭吧</h2><p>你可以像聊天一样说，也可以点击示例体验。</p><textarea value={intro} onChange={e=>setIntro(e.target.value)} placeholder="例如：我 36 岁，已婚，有两个孩子，家庭月支出 2 万，房贷 150 万……"/><div className="composer-actions"><button onClick={()=>setIntro('我 36 岁，配偶 34 岁，有两个孩子，最小孩子 4 岁。住在杭州，房贷还有 180 万，存款 45 万，有社保。')}>填入示例</button><button className="send" disabled={!intro.trim()} onClick={submitIntro}><Send/>发送</button></div></AgentMessage>}
     {history.map((m,i)=><React.Fragment key={i}><UserMessage>{m.text}</UserMessage><AgentMessage compact><p><Check className="inline-check"/>收到，我已经更新了你的{['家庭情况','家庭成员','家庭财务','已有保障','风险偏好'][m.stage]}。</p></AgentMessage></React.Fragment>)}
     {stage===1&&<FamilyQuestion p={p} set={set} next={()=>reply('家庭成员信息已确认',2)}/>}
     {stage===2&&<FinanceQuestion p={p} set={set} next={()=>reply('家庭年收入 '+money(n(p.income)+n(p.spouseIncome))+'，月支出 '+money(n(p.expenses))+'，保费预算 '+money(n(p.budget)),3)}/>}
     {stage===3&&<CoverageQuestion p={p} set={set} next={()=>reply('已有保障盘点完成',4)}/>}
     {stage===4&&<RiskQuestion p={p} set={set} next={()=>reply('选择了'+({essential:'预算优先',balanced:'均衡保障',enhanced:'保障优先'}[p.preference])+'方案',5)}/>}
     {stage===5&&<ResultMessage p={p} plan={plan} expanded={expanded} setExpanded={setExpanded}/>}
     <div ref={bottom}/>
    </section>
   </main>
   <ProfilePanel p={p} plan={plan} stage={stage}/>
  </div>
  <footer className="legal"><span>结果仅供需求测算，不构成投保承诺</span><button onClick={()=>setPrivacy(true)}>隐私与使用说明</button></footer>
  {privacy&&<div className="backdrop" onMouseDown={e=>e.target===e.currentTarget&&setPrivacy(false)}><section className="dialog"><button onClick={()=>setPrivacy(false)}><X/></button><LockKeyhole/><h2>隐私与使用说明</h2><p>填写内容只在当前浏览器中处理，不会自动上传。实际费率、条款和核保结果以保险公司为准。</p><button className="primary" onClick={()=>setPrivacy(false)}>我知道了</button></section></div>}
 </div>
}

function AgentMessage({children,compact=false}){return <article className={'message agent-message '+(compact?'compact':'')}><span className="avatar"><Sparkles/></span><div className="bubble">{children}</div></article>}
function UserMessage({children}){return <article className="message user-message"><div className="bubble">{children}</div><span className="user-avatar">我</span></article>}
function Question({title,sub,children,onNext,disabled=false}){return <AgentMessage><header className="question-title"><span>需要你确认</span><h2>{title}</h2><p>{sub}</p></header>{children}<button className="continue" disabled={disabled} onClick={onNext}>确认，继续<ArrowRight/></button></AgentMessage>}
function Field({label,value,onChange,suffix='',disabled=false,placeholder=''}){return <label className={disabled?'disabled':''}><span>{label}</span><div className="input"><input type="number" min="0" step=".1" disabled={disabled} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>{suffix&&<em>{suffix}</em>}</div></label>}
function Select({label,value,onChange,items}){return <label><span>{label}</span><div className="input"><select value={value} onChange={e=>onChange(e.target.value)}>{items.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select><ChevronDown/></div></label>}
function Counter({label,value,onChange,max=6}){return <label><span>{label}</span><div className="counter"><button onClick={()=>onChange(Math.max(0,n(value)-1))}>−</button><strong>{value}</strong><button onClick={()=>onChange(Math.min(max,n(value)+1))}>+</button></div></label>}
function Toggle({title,value,onChange}){return <button className={'toggle '+(value?'selected':'')} onClick={()=>onChange(!value)}><i>{value&&<Check/>}</i><span>{title}</span></button>}

function FamilyQuestion({p,set,next}){return <Question title="确认家庭成员" sub="这些信息用于判断家庭责任期限。" onNext={next} disabled={!n(p.age)}><div className="answer-grid three"><Field label="你的年龄 *" value={p.age} onChange={v=>set('age',v)} suffix="岁" placeholder="35"/><Select label="婚姻状态" value={p.marital} onChange={v=>set('marital',v)} items={[['married','已婚 / 有伴侣'],['single','单身']]}/><Field label="配偶年龄" value={p.spouseAge} onChange={v=>set('spouseAge',v)} suffix="岁" disabled={p.marital==='single'}/><Counter label="子女数量" value={p.children} onChange={v=>set('children',v)}/><Field label="最小子女年龄" value={p.youngestAge} onChange={v=>set('youngestAge',v)} suffix="岁" disabled={!p.children}/><Counter label="需赡养老人" value={p.parents} onChange={v=>set('parents',v)} max={4}/></div></Question>}
function FinanceQuestion({p,set,next}){return <Question title="家庭的收支情况如何？" sub="所有金额都按人民币万元填写，建议使用税后口径。" onNext={next} disabled={!n(p.income)||!n(p.expenses)||!n(p.budget)}><div className="answer-grid two"><Field label="本人年收入 *" value={p.income} onChange={v=>set('income',v)} suffix="万元"/><Field label="配偶年收入" value={p.spouseIncome} onChange={v=>set('spouseIncome',v)} suffix="万元" disabled={p.marital==='single'}/><Field label="家庭月支出 *" value={p.expenses} onChange={v=>set('expenses',v)} suffix="万元"/><Field label="每年保费预算 *" value={p.budget} onChange={v=>set('budget',v)} suffix="万元"/><Field label="房贷及其他负债" value={p.debt} onChange={v=>set('debt',v)} suffix="万元"/><Field label="存款及流动资产" value={p.savings} onChange={v=>set('savings',v)} suffix="万元"/></div></Question>}
function CoverageQuestion({p,set,next}){return <Question title="现在已经有哪些保障？" sub="多张保单请填写合计保额，没有就填 0。" onNext={next}><div className="toggle-row"><Toggle title="基本医保 / 社保" value={p.social} onChange={v=>set('social',v)}/><Toggle title="单位补充医疗" value={p.company} onChange={v=>set('company',v)}/><Toggle title="商业医疗险" value={p.medical} onChange={v=>set('medical',v)}/></div><div className="answer-grid three"><Field label="寿险保额" value={p.life} onChange={v=>set('life',v)} suffix="万元"/><Field label="重疾险保额" value={p.critical} onChange={v=>set('critical',v)} suffix="万元"/><Field label="意外险保额" value={p.accident} onChange={v=>set('accident',v)} suffix="万元"/></div></Question>}
function RiskQuestion({p,set,next}){return <Question title="最后，确认一下风险偏好" sub="健康情况会影响承保，这里只选择范围。" onNext={next}><div className="answer-grid two"><Select label="近年健康情况" value={p.health} onChange={v=>set('health',v)} items={[['standard','无明显异常 / 常见小问题'],['review','体检异常或长期用药'],['complex','曾住院、手术或有慢性病']]}/><Select label="职业风险" value={p.job} onChange={v=>set('job',v)} items={[['low','办公室 / 一般室内职业'],['medium','经常外出 / 轻体力'],['high','高空、机械、运输等']]}/></div><div className="preference">{[['essential','预算优先','先兜住大额风险'],['balanced','均衡保障','兼顾保障和预算'],['enhanced','保障优先','尽量补足主要缺口']].map(([v,t,s])=><button className={p.preference===v?'selected':''} onClick={()=>set('preference',v)} key={v}><i>{p.preference===v&&<b/>}</i><span><strong>{t}</strong><small>{s}</small></span></button>)}</div>{p.health!=='standard'&&<p className="warning"><CircleAlert/>实际投保时请完整、如实进行健康告知。</p>}</Question>}

function ResultMessage({p,plan,expanded,setExpanded}){return <AgentMessage><div className="result-intro"><span><FileCheck2/></span><div><em>分析完成</em><h2>建议先保大风险，再补收入损失</h2><p>现有保障完整度 <strong>{plan.score}/100</strong>，建议预留 {money(plan.reserve)} 应急金。</p></div></div><div className={'budget-note '+plan.status}><WalletCards/><span><strong>{plan.status==='fit'?'当前预算可覆盖估算方案':'完整补足可能超过预算，建议分阶段配置'}</strong><small>保费粗估 {money(plan.premium)}/年，年度预算 {money(n(p.budget))}</small></span></div><div className="recommendations">{plan.recs.map((r,i)=>{const I=r.icon,open=expanded===r.id;return <article className={open?'open':''} key={r.id}><button onClick={()=>setExpanded(open?'':r.id)}><em>{i+1}</em><b className={r.id}><I/></b><span><strong>{r.title}</strong><small>建议 {money(r.target)} · 缺口 {money(r.gap)}</small></span><ChevronDown/></button>{open&&<div><p><strong>为什么：</strong>{r.why}</p><p><strong>重点看：</strong>{r.watch}</p><small>年保费粗估约 {money(r.cost)}</small></div>}</article>})}</div><div className="next-steps"><h3>接下来这样做</h3><ol><li>先留足应急金，不用生活费购买长期缴费型保险。</li><li>优先确认医疗险能否承保，再比较续保和免赔条件。</li><li>按医疗、重疾、寿险、意外的缺口逐步补充。</li></ol></div><p className="disclaimer"><Info/>结果为需求测算，不构成具体产品推荐或投保承诺。实际条款、费率和核保以保险公司为准。</p><button className="print" onClick={()=>window.print()}><FileCheck2/>打印 / 保存这份方案</button></AgentMessage>}

function ProfilePanel({p,plan,stage}){return <aside className="profile"><header><span><Users/></span><div><strong>家庭档案</strong><small>根据对话实时更新</small></div></header><section><h3>家庭</h3><dl><div><dt>主要投保人</dt><dd>{p.age?p.age+' 岁':'待填写'}</dd></div><div><dt>家庭结构</dt><dd>{p.marital==='married'?'有伴侣':'单身'} · {p.children} 个子女</dd></div><div><dt>赡养老人</dt><dd>{p.parents} 人</dd></div></dl></section><section><h3>财务</h3><dl><div><dt>家庭年收入</dt><dd>{p.income?money(plan.income):'待填写'}</dd></div><div><dt>家庭月支出</dt><dd>{p.expenses?money(n(p.expenses)):'待填写'}</dd></div><div><dt>年度预算</dt><dd>{p.budget?money(n(p.budget)):'待填写'}</dd></div></dl></section><section><h3>已有保障</h3><div className="coverage-tags"><span className={p.social?'on':''}>医保</span><span className={p.medical?'on':''}>医疗</span><span className={p.critical?'on':''}>重疾</span><span className={p.life?'on':''}>寿险</span><span className={p.accident?'on':''}>意外</span></div></section>{stage===5&&<section className="mini-score"><span>保障完整度</span><strong>{plan.score}</strong><small>/ 100</small></section>}<p><LockKeyhole/>信息不会发送给保险公司</p></aside>}
const root=window.__familyCoverRoot||(window.__familyCoverRoot=createRoot(document.getElementById('root')))
root.render(<App/>)
