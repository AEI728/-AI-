import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Check,
  CircleCheck,
  ChevronRight,
  Clock3,
  Heart,
  HeartOff,
  MessageCircle,
  Mic,
  Pause,
  Play,
  Plus,
  Sparkles,
  Upload,
  Video,
  Volume2,
  X,
} from 'lucide-react'
import './styles.css'

const SKILLS = {
  calligraphy: {
    name: '书法',
    roman: 'CALLIGRAPHY',
    icon: '书',
    iconType: 'brush',
    tagline: '每天两行，写出自己的从容',
    progress: '第 3 天',
    progressText: '楷书基础 · 28%',
    color: '#9d2f26',
    tint: '#f4e5df',
    lessons: [
      { title: '横平竖直：写好第一个“一”', level: '入门', duration: '08:32', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=85' },
      { title: '兰亭序 · 第三行', level: '跟写', duration: '12:08', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85' },
      { title: '收笔的分寸感', level: '进阶', duration: '06:44', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85' },
    ],
    feed: [
      { name: '林阿姨', caption: '临了三遍，终于有点像啦！', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85', likes: 126 },
      { name: '小伴示范', caption: '看懂“藏锋”，笔画就稳了一半', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85', likes: 98 },
      { name: '周叔', caption: '晚饭后写两行，心里特别安静', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85', likes: 84 },
    ],
  },
  photography: {
    name: '摄影',
    roman: 'PHOTOGRAPHY',
    icon: '光',
    iconType: 'camera',
    tagline: '把平常日子，拍出一点光',
    progress: '第 5 天',
    progressText: '手机构图 · 42%',
    color: '#28615c',
    tint: '#e1eeeb',
    lessons: [
      { title: '一张照片的三个层次', level: '入门', duration: '10:16', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85' },
      { title: '拍好家门口的光', level: '跟拍', duration: '07:48', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85' },
      { title: '给家人拍自然的笑', level: '进阶', duration: '09:02', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85' },
    ],
    feed: [
      { name: '陈奶奶', caption: '楼下的玉兰，原来每天都在变', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85', likes: 214 },
      { name: '小程老师', caption: '顺着光线走三步，画面就有了', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85', likes: 182 },
      { name: '赵叔', caption: '孙女说我拍得越来越像样了', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85', likes: 156 },
    ],
  },
  music: {
    name: '乐器',
    roman: 'MUSIC',
    icon: '音',
    iconType: 'music',
    tagline: '每天一首，让喜欢的歌回到手上',
    progress: '第 2 天',
    progressText: '口琴入门 · 16%',
    color: '#b05c27',
    tint: '#f6e8da',
    lessons: [
      { title: '吹响第一声：气息入门', level: '入门', duration: '09:24', image: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=900&q=85' },
      { title: '茉莉花 · 前四小节', level: '跟奏', duration: '11:36', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=85' },
      { title: '让旋律更有呼吸', level: '进阶', duration: '08:10', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=900&q=85' },
    ],
    feed: [
      { name: '王叔', caption: '今天把《茉莉花》吹完整了', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=85', likes: 76 },
      { name: '小伴示范', caption: '不用急，给每一个音符留一点气', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=900&q=85', likes: 112 },
      { name: '宋阿姨', caption: '邻居听见了，说像春天', image: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=900&q=85', likes: 91 },
    ],
  },
  gardening: {
    name: '家庭园艺',
    roman: 'HOME GARDENING',
    icon: '花',
    iconType: 'garden',
    tagline: '从一盆花开始，把四季种进家里',
    progress: '第 1 天',
    color: '#52724f',
    tint: '#e5eee2',
    lessons: [
      { title: '新手也能养好的第一盆花', level: '入门', duration: '07:20', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85' },
      { title: '看叶子判断什么时候浇水', level: '跟学', duration: '08:45', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85' },
      { title: '阳台小花园的摆放方法', level: '进阶', duration: '10:12', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85' },
    ],
    feed: [
      { name: '许老师', caption: '三步换盆，让长寿花住得更舒服', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85', video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', duration: '01:36', likes: 238, featured: true },
      { name: '刘阿姨', caption: '窗台上的第一朵花开了', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85', likes: 166 },
      { name: '小伴示范', caption: '摸一摸盆土，再决定要不要浇水', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85', likes: 121 },
    ],
  },
}

const LIBRARY_SKILL_KEYS = ['calligraphy', 'photography', 'music']
const FEATURED_SKILL_KEY = 'gardening'
const GENERAL_SHARE_ITEMS = LIBRARY_SKILL_KEYS.map((key) => ({ ...SKILLS[key].feed[0], sourceSkill: SKILLS[key].name }))
const LEARNING_STORAGE_KEY = 'silver-coach-learning-state'

function loadLearningState() {
  try {
    const stored = JSON.parse(localStorage.getItem(LEARNING_STORAGE_KEY))
    if (Array.isArray(stored?.skills) && stored.skills.every((key) => SKILLS[key])) {
      const joinedAt = Object.fromEntries(stored.skills.map((key) => [key, Number(stored.joinedAt?.[key]) || Date.now()]))
      return { skills: stored.skills, joinedAt }
    }
  } catch {
    localStorage.removeItem(LEARNING_STORAGE_KEY)
  }
  return { skills: ['calligraphy'], joinedAt: { calligraphy: Date.now() } }
}

function getJoinedDays(joinedAt) {
  if (!joinedAt) return 1
  const today = new Date()
  const joined = new Date(joinedAt)
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const joinedStart = new Date(joined.getFullYear(), joined.getMonth(), joined.getDate()).getTime()
  return Math.max(1, Math.floor((todayStart - joinedStart) / 86400000) + 1)
}

function getMascotBounds() {
  const appWidth = Math.min(window.innerWidth, 640)
  const appLeft = Math.max(0, (window.innerWidth - appWidth) / 2)
  return { minX: appLeft + 8, maxX: appLeft + appWidth - 98, minY: 72, maxY: window.innerHeight - 124 }
}

function clampMascotPosition(position) {
  const bounds = getMascotBounds()
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, position.x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, position.y)),
  }
}

function Mascot({ onClick, speech, isListening, joinPrompt }) {
  const [position, setPosition] = useState(() => {
    try {
      const stored = localStorage.getItem('silver-coach-position')
      if (stored) return clampMascotPosition(JSON.parse(stored))
    } catch {
      localStorage.removeItem('silver-coach-position')
    }
    const bounds = getMascotBounds()
    return { x: bounds.maxX, y: bounds.maxY }
  })
  const positionRef = useRef(position)
  const drag = useRef(null)

  useEffect(() => {
    const handleResize = () => setPosition((current) => clampMascotPosition(current))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, origin: position, moved: false }
  }

  const handlePointerMove = (event) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.current.startX
    const dy = event.clientY - drag.current.startY
    if (Math.abs(dx) + Math.abs(dy) > 6) drag.current.moved = true
    if (drag.current.moved) {
      const nextPosition = clampMascotPosition({ x: drag.current.origin.x + dx, y: drag.current.origin.y + dy })
      positionRef.current = nextPosition
      setPosition(nextPosition)
    }
  }

  const handlePointerUp = (event) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    const wasMoved = drag.current.moved
    drag.current = null
    localStorage.setItem('silver-coach-position', JSON.stringify(positionRef.current))
    if (!wasMoved) onClick()
  }

  return (
    <div className={`mascot-wrap ${isListening ? 'is-listening' : ''}`} style={{ left: position.x, top: position.y }}>
      {joinPrompt ? <div className="mascot-bubble mascot-question"><span>这个技能有意思吗？要加入学习吗？</span><div><button onClick={joinPrompt.onConfirm}>加入学习</button><button onClick={joinPrompt.onDismiss}>先看看</button></div></div> : speech && <div className="mascot-bubble">{speech}</div>}
      <button className="mascot-character" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} aria-label="和小伴说话，可拖动">
        <span className="mascot-shadow" />
        <span className="mascot">
          <span className="mascot-hat"><span className="hat-bristle" /></span>
          <span className="mascot-face"><span className="eye left" /><span className="eye right" /><span className="cheek left" /><span className="cheek right" /><span className="smile" /></span>
          <span className="mascot-body"><span className="body-mark">伴</span></span>
          <span className="mascot-arm left" /><span className="mascot-arm right" />
        </span>
        <span className="mascot-mic"><Mic size={16} strokeWidth={2.5} /></span>
      </button>
    </div>
  )
}

function App() {
  const [view, setView] = useState('home')
  const [skillKey, setSkillKey] = useState('calligraphy')
  const [tab, setTab] = useState('tutorial')
  const [showVoice, setShowVoice] = useState(false)
  const [toast, setToast] = useState('')
  const [saved, setSaved] = useState({})
  const [liked, setLiked] = useState({})
  const [uploadsBySkill, setUploadsBySkill] = useState({})
  const [playing, setPlaying] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [learningState, setLearningState] = useState(loadLearningState)
  const [skillBackgrounds, setSkillBackgrounds] = useState({})
  const [viewingFeatured, setViewingFeatured] = useState(false)
  const [showJoinPrompt, setShowJoinPrompt] = useState(false)
  const featuredSkillKey = FEATURED_SKILL_KEY
  const skill = SKILLS[skillKey]
  const interestedSkills = learningState.skills

  useEffect(() => {
    localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(learningState))
  }, [learningState])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [view, skillKey, tab])

  const announce = (message) => {
    setToast(message)
    window.clearTimeout(window.__toastTimer)
    window.__toastTimer = window.setTimeout(() => setToast(''), 2400)
  }

  const openSkill = (key) => {
    setSkillKey(key)
    setTab('tutorial')
    setViewingFeatured(false)
    setShowJoinPrompt(false)
    setView('skill')
    announce(`好嘞，这就带您去${SKILLS[key].name}课堂`)
  }

  const browseSkill = (key) => {
    setSkillKey(key)
    setTab('feed')
    setViewingFeatured(false)
    setShowJoinPrompt(false)
    setView('skill')
  }

  const handleMascot = () => setShowVoice(true)
  const watchFeaturedSkill = (key) => {
    setSkillKey(key)
    setTab('feed')
    setViewingFeatured(true)
    setShowJoinPrompt(false)
    setView('skill')
  }

  const addSkill = (key) => {
    setLearningState((current) => current.skills.includes(key) ? current : {
      skills: [...current.skills, key],
      joinedAt: { ...current.joinedAt, [key]: Date.now() },
    })
    setShowJoinPrompt(false)
    announce(`${SKILLS[key].name}已加入您的技能库`)
  }

  const removeSkill = (key, reason) => {
    setLearningState((current) => {
      const joinedAt = { ...current.joinedAt }
      delete joinedAt[key]
      return { skills: current.skills.filter((item) => item !== key), joinedAt }
    })
    announce(reason === 'finished' ? `${SKILLS[key].name}已完成学习` : `已从正在学习中移除${SKILLS[key].name}`)
  }

  const changeSkillBackground = (key, file) => {
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setSkillBackgrounds((current) => {
      if (current[key]?.startsWith('blob:')) URL.revokeObjectURL(current[key])
      return { ...current, [key]: imageUrl }
    })
    announce(`${SKILLS[key].name}背景已更换`)
  }

  return (
    <main className="app-shell">
      {view === 'home' ? (
        <HomePage featuredSkillKey={featuredSkillKey} featuredSkill={SKILLS[featuredSkillKey]} interestedSkills={interestedSkills} joinedAt={learningState.joinedAt} skillBackgrounds={skillBackgrounds} onWatchFeatured={watchFeaturedSkill} onOpenSkill={openSkill} onOpenPlaza={() => setView('plaza')} onRemoveSkill={removeSkill} onChangeBackground={changeSkillBackground} />
      ) : view === 'plaza' ? (
        <SkillPlaza interestedSkills={interestedSkills} onBack={() => setView('home')} onOpenSkill={browseSkill} />
      ) : (
        <SkillPage skill={skill} skillKey={skillKey} tab={tab} setTab={setTab} onBack={() => setView('home')} saved={saved} setSaved={setSaved} liked={liked} setLiked={setLiked} uploads={uploadsBySkill[skillKey] || []} onUpload={(item) => setUploadsBySkill((current) => ({ ...current, [skillKey]: [item, ...(current[skillKey] || [])] }))} playing={playing} setPlaying={setPlaying} onLesson={(lesson) => setSelectedLesson(lesson)} isInterested={interestedSkills.includes(skillKey)} joinedDays={getJoinedDays(learningState.joinedAt[skillKey])} onAddSkill={() => addSkill(skillKey)} onRemoveSkill={(reason) => removeSkill(skillKey, reason)} featured={viewingFeatured && skillKey === featuredSkillKey} onFeaturedEnded={() => setShowJoinPrompt(true)} />
      )}
      <Mascot onClick={handleMascot} speech={view === 'home' ? '王叔，想学什么告诉小伴' : view === 'plaza' ? '慢慢挑，看到喜欢的就点开' : `王叔，${skill.name}课等您呢`} isListening={showVoice} joinPrompt={showJoinPrompt && viewingFeatured && !interestedSkills.includes(skillKey) ? { onConfirm: () => addSkill(skillKey), onDismiss: () => setShowJoinPrompt(false) } : null} />
      {showVoice && <VoiceSheet onClose={() => setShowVoice(false)} onNavigate={(destination) => { setShowVoice(false); if (destination === 'practice') { setTab('practice'); setView('skill') } else if (destination === 'feed') { setTab('feed'); setView('skill') } else if (destination === 'tutorial') { setTab('tutorial'); setView('skill') } else if (destination === 'plaza') { setViewingFeatured(false); setShowJoinPrompt(false); setView('plaza') } }} />}
      {selectedLesson && <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} onPractice={() => { setSelectedLesson(null); setTab('practice'); setView('skill') }} />}
      {toast && <div className="toast"><Check size={18} />{toast}</div>}
    </main>
  )
}

function HomePage({ featuredSkillKey, featuredSkill, interestedSkills, joinedAt, skillBackgrounds, onWatchFeatured, onOpenSkill, onOpenPlaza, onRemoveSkill, onChangeBackground }) {
  return (
    <div className="page home-page">
      <header className="topbar home-topbar">
        <div className="brand-lockup"><span className="brand-mark">伴</span><div><p className="brand-name">小伴</p><p className="brand-sub">银发 AI 私教</p></div></div>
      </header>
      <section className="welcome-block">
        <div><p className="eyebrow">晚上好，王叔</p><h1>今天想和小伴<br /><em>练点什么？</em></h1><p className="welcome-note">每天一点点，喜欢的事就会发光。</p></div>
      </section>
      <button className="featured-skill" onClick={() => onWatchFeatured(featuredSkillKey)}>
        <div className="featured-image" style={{ backgroundImage: `url(${featuredSkill.feed[0].image})` }}><span className="featured-kicker"><Sparkles size={14} />今日推荐</span><span className="featured-play"><Play size={23} fill="white" /></span><span className="featured-duration">短视频 · 01:20</span></div>
        <div className="featured-copy"><div><span>{interestedSkills.includes(featuredSkillKey) ? '继续看看这个技能' : '发现一个新技能'}</span><h2>{featuredSkill.name} · {featuredSkill.feed[0].caption}</h2><p>点击直接观看这条分享</p></div><ChevronRight size={25} /></div>
      </button>
      <div className="section-heading"><div><p className="eyebrow">正在学习 · {interestedSkills.length} 门</p><h2>选一项，开始你的练习</h2></div><button className="section-count" onClick={onOpenPlaza} aria-label="进入技能广场"><Plus size={25} /></button></div>
      <section id="skill-library" className="skill-grid">
        {interestedSkills.map((key) => <SkillCard key={key} skillKey={key} joinedDays={getJoinedDays(joinedAt[key])} cardBackground={skillBackgrounds[key]} onOpenSkill={onOpenSkill} onRemoveSkill={onRemoveSkill} onChangeBackground={onChangeBackground} />)}
        {!interestedSkills.length && <button className="empty-library" onClick={onOpenPlaza}><Plus size={24} /><strong>去技能广场挑一门</strong><span>找到喜欢的，再加入学习</span></button>}
      </section>
      <div className="home-footer-space" />
    </div>
  )
}

function SkillPlaza({ interestedSkills, onBack, onOpenSkill }) {
  const [filter, setFilter] = useState('all')
  const sortedSkills = Object.entries(SKILLS).sort(([keyA], [keyB]) => Number(interestedSkills.includes(keyA)) - Number(interestedSkills.includes(keyB)))
  const visibleSkills = sortedSkills.filter(([key]) => filter === 'all' || (filter === 'learning' ? interestedSkills.includes(key) : !interestedSkills.includes(key)))
  return <div className="page plaza-page">
    <header className="plaza-header"><button className="back-btn" onClick={onBack} aria-label="返回"><ArrowLeft size={27} /></button><div><p className="eyebrow">发现新兴趣</p><h1>技能广场</h1></div></header>
    <p className="plaza-intro">看看大家在学什么，点开喜欢的视频慢慢了解。</p>
    <div className="plaza-filters" aria-label="筛选技能">{[
      ['all', `全部 ${sortedSkills.length}`],
      ['new', `未学习 ${sortedSkills.length - interestedSkills.length}`],
      ['learning', `学习中 ${interestedSkills.length}`],
    ].map(([id, label]) => <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <section className="plaza-grid">
      {visibleSkills.map(([key, item]) => <button className="plaza-skill" key={key} onClick={() => onOpenSkill(key)} style={{ '--skill-color': item.color, '--skill-tint': item.tint }}>
        <div className="plaza-media" style={{ backgroundImage: `url(${item.feed[0].image})` }}><span className="plaza-play"><Play size={24} fill="white" /></span><span className="plaza-duration">视频 · {item.feed[0].duration || '02:10'}</span>{interestedSkills.includes(key) && <span className="plaza-learning"><Check size={14} />正在学习</span>}</div>
        <div className="plaza-copy"><div><h2>{item.name}</h2><p>{item.feed[0].caption}</p></div><ChevronRight size={23} /></div>
      </button>)}
      {!visibleSkills.length && <div className="plaza-empty">这里暂时没有技能</div>}
    </section>
  </div>
}

function BackgroundUpload({ image, onUpload, compact = false }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0]
    if (file) onUpload(file)
    event.target.value = ''
  }
  if (compact) return <label className="background-art-action"><Upload size={17} /><span>更换背景</span><input className="visually-hidden" type="file" accept="image/*" onChange={handleChange} /></label>
  return <label className="background-upload"><span className="background-upload-preview" style={image ? { backgroundImage: `url(${image})` } : undefined}>{!image && <Upload size={24} />}</span><span><strong>{image ? '重新上传背景' : '上传背景图片'}</strong><small>从手机相册或本机选择图片</small></span><ChevronRight size={20} /><input className="visually-hidden" type="file" accept="image/*" onChange={handleChange} /></label>
}

function SkillCard({ skillKey, joinedDays, cardBackground, onOpenSkill, onRemoveSkill, onChangeBackground }) {
  const skill = SKILLS[skillKey]
  return <article className="skill-card" style={{ '--skill-color': skill.color, '--skill-tint': skill.tint }}>
    <button className="skill-card-main" onClick={() => onOpenSkill(skillKey)}>
      <div className={`skill-card-art ${cardBackground ? 'has-custom-background' : ''}`} style={cardBackground ? { backgroundImage: `url(${cardBackground})` } : undefined}><div className={`skill-glyph ${skill.iconType}`}>{skill.icon}</div><div className="art-orbit" /><span className="art-label">{skill.roman}</span></div>
      <div className="skill-card-content"><div><h3>{skill.name}</h3><p>{skill.tagline}</p></div><ChevronRight className="skill-chevron" size={25} /></div>
      <div className="skill-checkin"><Clock3 size={16} /><span>加入学习 {joinedDays} 天</span></div>
    </button>
    <BackgroundUpload compact image={cardBackground} onUpload={(file) => onChangeBackground(skillKey, file)} />
    <div className="direct-skill-actions"><button onClick={() => onRemoveSkill(skillKey, 'not-interested')}><HeartOff size={17} />不感兴趣</button><button onClick={() => onRemoveSkill(skillKey, 'finished')}><CircleCheck size={17} />完成学习</button></div>
  </article>
}

function SkillPage({ skill, skillKey, tab, setTab, onBack, saved, setSaved, liked, setLiked, uploads, onUpload, playing, setPlaying, onLesson, isInterested, joinedDays, onAddSkill, onRemoveSkill, featured, onFeaturedEnded }) {
  const tabs = [{ id: 'tutorial', label: '教程', icon: BookOpen }, { id: 'feed', label: '分享', icon: MessageCircle }, { id: 'practice', label: 'AI 陪练', icon: Sparkles }]
  return <div className="page skill-page" style={{ '--skill-color': skill.color, '--skill-tint': skill.tint }}>
    <header className="skill-header"><button className="back-btn" onClick={onBack} aria-label="返回"><ArrowLeft size={27} /></button><div className="skill-title"><span className="mini-glyph">{skill.icon}</span><div><h1>{skill.name}</h1><p>{skill.tagline}</p></div></div>{!isInterested && <button className="header-join" onClick={onAddSkill}><Plus size={17} />加入学习</button>}</header>
    {isInterested && <div className="skill-learning-actions"><button onClick={() => { onRemoveSkill('not-interested'); onBack() }}><HeartOff size={18} />不感兴趣</button><button onClick={() => { onRemoveSkill('finished'); onBack() }}><CircleCheck size={18} />完成学习</button></div>}
    <div className="skill-meta">{isInterested ? <span><Clock3 size={18} /> 加入学习 {joinedDays} 天</span> : <span><Sparkles size={18} /> 今日发现的新技能</span>}</div>
    <div className="tabbar">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={22} strokeWidth={tab === id ? 2.6 : 2} /><span>{label}</span></button>)}</div>
    <div className="tab-content">{tab === 'tutorial' && <TutorialTab skill={skill} onLesson={onLesson} onPractice={() => setTab('practice')} playing={playing} setPlaying={setPlaying} />}{tab === 'feed' && <FeedTab skill={skill} saved={saved} setSaved={setSaved} liked={liked} setLiked={setLiked} uploads={uploads} onUpload={onUpload} featured={featured} onFeaturedEnded={onFeaturedEnded} />}{tab === 'practice' && <PracticeTab skill={skill} />}</div>
  </div>
}

function TutorialTab({ skill, onLesson, onPractice, playing, setPlaying }) {
  return <>
    <section className="continue-banner"><div className="continue-thumb" style={{ backgroundImage: `url(${skill.lessons[1].image})` }}><button className="play-mini" onClick={() => setPlaying(!playing)} aria-label={playing ? '暂停' : '播放'}>{playing ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}</button></div><div className="continue-copy"><span>接着练 · 上次看到 06:42</span><h2>{skill.lessons[1].title}</h2><div className="watch-progress"><i style={{ width: '46%' }} /></div><small>还剩 5 分钟</small></div><ChevronRight className="continue-arrow" size={23} /></section>
    <div className="list-heading"><div><p className="eyebrow">循序渐进</p><h2>为您准备的教程</h2></div><span>共 3 节</span></div>
    <section className="lesson-list">{skill.lessons.map((lesson, index) => <button className="lesson-row" key={lesson.title} onClick={() => onLesson(lesson)}><div className="lesson-index">{String(index + 1).padStart(2, '0')}</div><div className="lesson-image" style={{ backgroundImage: `url(${lesson.image})` }}><span><Play size={16} fill="white" /></span></div><div className="lesson-copy"><h3>{lesson.title}</h3><div><span className="level-chip">{lesson.level}</span><small>{lesson.duration}</small></div></div><ChevronRight size={23} color="#a59f95" /></button>)}</section>
    <button className="practice-cta" onClick={onPractice}><Sparkles size={21} />学完了，去陪练</button>
  </>
}

function FeedTab({ skill, saved, setSaved, liked, setLiked, uploads, onUpload, featured, onFeaturedEnded }) {
  const inputRef = useRef(null)
  const handleUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    onUpload({ name: '王叔', caption: `我分享了一个${skill.name}练习视频`, video: URL.createObjectURL(file), likes: 0, own: true })
    event.target.value = ''
  }
  const items = featured ? [skill.feed[0], ...GENERAL_SHARE_ITEMS] : [...uploads, ...skill.feed]
  return <>
    <div className="share-header">
      <div><p className="eyebrow">{featured ? '今日推荐视频' : '大家的练习'}</p><h2>{featured ? '先看看，喜欢再学' : '一起看看，也分享您的进步'}</h2></div>
      <button className="upload-button" onClick={() => inputRef.current?.click()}><Upload size={20} />上传视频</button>
      <input ref={inputRef} className="visually-hidden" type="file" accept="video/*" onChange={handleUpload} />
    </div>
    <section className="feed-list">
      {items.map((item, index) => {
        const id = `${skill.name}-${item.own ? 'own-' : ''}${index}`
        return <React.Fragment key={id}>
          <article className={`feed-card ${featured && index === 0 ? 'featured-feed-card' : ''}`}>
            <div className={`feed-media ${item.video ? 'has-video' : ''}`} style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}>
              {item.video && <video src={item.video} poster={item.image} controls playsInline autoPlay={featured && index === 0} muted={featured && index === 0} onEnded={featured && index === 0 ? onFeaturedEnded : undefined} />}
              <div className="feed-overlay"><span className="feed-tag">{featured && index === 0 ? '今日推荐' : item.own ? '我的分享' : item.name.includes('小伴') ? '小伴示范' : '学员分享'}</span>{!item.video && <span className="feed-duration">{item.duration || `0${index + 1}:2${index}`}</span>}</div>
              {!item.video && <button className="feed-play" aria-label="播放"><Play size={27} fill="white" /></button>}
            </div>
            <div className="feed-info"><div className="feed-author"><div className="author-dot">{item.name.slice(0, 1)}</div><strong>{item.name}</strong><span>刚刚</span></div><p>{item.caption}</p><div className="feed-actions"><button className={liked[id] ? 'on' : ''} onClick={() => setLiked({ ...liked, [id]: !liked[id] })}><Heart size={23} fill={liked[id] ? 'currentColor' : 'none'} /> <span>{item.likes + (liked[id] ? 1 : 0)}</span></button><button className={saved[id] ? 'on' : ''} onClick={() => setSaved({ ...saved, [id]: !saved[id] })}><Bookmark size={22} fill={saved[id] ? 'currentColor' : 'none'} /><span>{saved[id] ? '已收藏' : '收藏'}</span></button><button><MessageCircle size={22} /><span>交流</span></button></div></div>
          </article>
        </React.Fragment>
      })}
    </section>
  </>
}

function PracticeTab({ skill }) {
  const [mode, setMode] = useState('video')
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const steps = ['先活动一下手腕，慢慢准备', '今天的任务是：专心练习 10 分钟', '轮到您啦，按自己的节奏来']
  const changeMode = (nextMode) => { setMode(nextMode); setStarted(false); setStep(0) }
  return <section className="practice-screen"><div className="practice-mode-switch"><button className={mode === 'video' ? 'active' : ''} onClick={() => changeMode('video')}><Video size={18} />视频陪练</button><button className={mode === 'voice' ? 'active' : ''} onClick={() => changeMode('voice')}><Mic size={18} />语音陪练</button></div><div className={`practice-stage ${mode === 'video' ? 'video-practice-stage' : ''}`} style={mode === 'video' ? { backgroundImage: `url(${skill.lessons[0].image})` } : undefined}><div className="stage-pattern" />{mode === 'video' ? <div className={`video-practice-focus ${started ? 'is-active' : ''}`}><Video size={42} /><strong>{started ? '正在观察您的动作' : '视频陪练已准备'}</strong><small>{started ? '请把手机放稳，完整拍到上半身' : '开始后将使用摄像头画面'}</small></div> : <div className={`practice-focus ${started ? 'is-active' : ''}`}><span className="focus-glyph">{skill.icon}</span><div className="sound-waves"><i /><i /><i /><i /><i /></div><small>{started ? '正在聆听' : '语音陪练已准备'}</small></div>}<div className="practice-status"><span className="live-dot" />{mode === 'video' ? '视频' : '语音'}陪练在线</div><div className="practice-caption"><span>今晚的练习</span><h2>{skill.name} · 10 分钟</h2><p>{started ? steps[step] : '准备好了，就从第一个动作开始'}</p></div></div><div className="practice-controls">{started ? <><button className="round-control" onClick={() => setStarted(false)} aria-label="结束"><X size={25} /></button><button className="talk-button" onClick={() => setStep((step + 1) % steps.length)}>{mode === 'video' ? <Video size={28} /> : <Mic size={28} fill="white" />}<span>{mode === 'video' ? '下一个动作' : '按住说话'}</span></button><button className="round-control" aria-label="音量"><Volume2 size={24} /></button></> : <button className="start-practice" onClick={() => setStarted(true)}>{mode === 'video' ? <span className="video-icon"><Video size={20} /></span> : <span className="video-icon"><Mic size={20} /></span>}<span>开始{mode === 'video' ? '视频' : '语音'}陪练</span><small>预计 10 分钟</small></button>}</div></section>
}

function VoiceSheet({ onClose, onNavigate }) {
  const [listening, setListening] = useState(true)
  useEffect(() => { const timer = setTimeout(() => setListening(false), 4000); return () => clearTimeout(timer) }, [])
  return <div className="voice-backdrop" onClick={onClose}><section className="voice-sheet companion-sheet" onClick={(e) => e.stopPropagation()}><button className="sheet-close" onClick={onClose} aria-label="关闭"><X size={25} /></button><div className="companion-heading"><span className="companion-mark">伴</span><div><p>小伴</p><span>一直在，您慢慢说</span></div></div><button className={`voice-orb ${listening ? 'pulse' : ''}`} onClick={() => setListening(!listening)} aria-label="开始说话"><Mic size={31} /></button><p className="voice-greeting">{listening ? '正在听您说话…' : '想做什么？点一下就可以'}</p><div className="companion-actions"><button onClick={() => onNavigate('tutorial')}><span><BookOpen size={22} /></span><div><strong>继续上次课程</strong><small>接着学，不用重新找</small></div><ChevronRight size={20} /></button><button onClick={() => onNavigate('feed')}><span><MessageCircle size={22} /></span><div><strong>看看大家的分享</strong><small>也可以上传您的视频</small></div><ChevronRight size={20} /></button><button onClick={() => onNavigate('practice')}><span><Sparkles size={22} /></span><div><strong>开始 AI 陪练</strong><small>练习 10 分钟</small></div><ChevronRight size={20} /></button><button onClick={() => onNavigate('plaza')}><span><Plus size={22} /></span><div><strong>想学点新的</strong><small>去技能广场慢慢挑选</small></div><ChevronRight size={20} /></button></div></section></div>
}

function LessonModal({ lesson, onClose, onPractice }) {
  const [playing, setPlaying] = useState(false)
  return <div className="modal-backdrop" onClick={onClose}><section className="lesson-modal" onClick={(e) => e.stopPropagation()}><div className="modal-video" style={{ backgroundImage: `url(${lesson.image})` }}><div className="modal-video-shade" /><button className="modal-close" onClick={onClose} aria-label="关闭"><X size={25} /></button><button className="modal-play" onClick={() => setPlaying(!playing)} aria-label={playing ? '暂停' : '播放'}>{playing ? <Pause size={34} fill="white" /> : <Play size={34} fill="white" />}</button><div className="video-time">{playing ? '00:18' : '00:00'} <span>/ {lesson.duration}</span></div></div><div className="modal-body"><span className="level-chip">{lesson.level}</span><h2>{lesson.title}</h2><p>跟着小伴一步一步来，今天只学一个小诀窍，慢慢练，就很好。</p><button className="modal-practice" onClick={onPractice}><Sparkles size={20} />看完了，去陪练</button></div></section></div>
}

const root = window.__silverCoachRoot || (window.__silverCoachRoot = createRoot(document.getElementById('root')))
root.render(<App />)
