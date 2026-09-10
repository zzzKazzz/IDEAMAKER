import { useEffect, useState, type KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'
import {
  defaultHabitWords,
  defaultMoneyWords,
  defaultWantWords,
} from './defaultWords.ts'

type CategoryId = 'habit' | 'money' | 'want'

type Category = {
  id: CategoryId
  storageKey: string
  label: string
  short: string
  placeholder: string
}

type MixPart = { word: string; short: string }

const CATEGORIES: Category[] = [
  {
    id: 'habit',
    storageKey: 'likeWords',
    label: '普段していること',
    short: '普段',
    placeholder: 'いまやっていること',
  },
  {
    id: 'money',
    storageKey: 'moneyWords',
    label: 'お金になりそうなこと',
    short: 'お金',
    placeholder: '誰かが払いそうなこと',
  },
  {
    id: 'want',
    storageKey: 'wantWords',
    label: 'やってみたいこと',
    short: 'やってみたい',
    placeholder: 'まだやってないこと',
  },
]

function parseWordList(raw: string | null, fallback: string[]): string[] {
  if (raw === null) return fallback
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) {
      return fallback
    }
    return parsed
  } catch {
    return fallback
  }
}

function loadWords(key: string, fallback: string[]): string[] {
  try {
    return parseWordList(localStorage.getItem(key), fallback)
  } catch (error) {
    console.error('保存された単語の読み込みに失敗しました:', error)
    return fallback
  }
}

function loadWantWords(): string[] {
  try {
    const saved = localStorage.getItem('wantWords')
    if (saved !== null) return parseWordList(saved, defaultWantWords)
    const legacy = localStorage.getItem('skillWords')
    if (legacy !== null) return parseWordList(legacy, defaultWantWords)
    return defaultWantWords
  } catch (error) {
    console.error('保存された単語の読み込みに失敗しました:', error)
    return defaultWantWords
  }
}

function saveWords(key: string, words: string[], label: string) {
  try {
    localStorage.setItem(key, JSON.stringify(words))
  } catch (error) {
    console.error(`${label}の保存に失敗しました:`, error)
  }
}

function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = next[i]!
    next[i] = next[j]!
    next[j] = current
  }
  return next
}

export default function App() {
  const [tab, setTab] = useState<CategoryId>('habit')
  const [inputs, setInputs] = useState<Record<CategoryId, string>>({
    habit: '',
    money: '',
    want: '',
  })
  const [habitWords, setHabitWords] = useState(() =>
    loadWords('likeWords', defaultHabitWords),
  )
  const [moneyWords, setMoneyWords] = useState(() => {
    const saved = loadWords('moneyWords', defaultMoneyWords)
    const extras = defaultMoneyWords.filter((word) => !saved.includes(word))
    return extras.length > 0 ? [...saved, ...extras] : saved
  })
  const [wantWords, setWantWords] = useState(loadWantWords)
  const [mix, setMix] = useState<MixPart[] | null>(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  const lists: Record<CategoryId, string[]> = {
    habit: habitWords,
    money: moneyWords,
    want: wantWords,
  }

  const setters: Record<CategoryId, (words: string[]) => void> = {
    habit: setHabitWords,
    money: setMoneyWords,
    want: setWantWords,
  }

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    saveWords('likeWords', habitWords, '普段していること')
  }, [habitWords, ready])

  useEffect(() => {
    if (!ready) return
    saveWords('moneyWords', moneyWords, 'お金になりそうなこと')
  }, [moneyWords, ready])

  useEffect(() => {
    if (!ready) return
    saveWords('wantWords', wantWords, 'やってみたいこと')
  }, [wantWords, ready])

  const filled = CATEGORIES.filter((category) => lists[category.id].length > 0)
  const active = CATEGORIES.find((category) => category.id === tab)!
  const activeWords = lists[tab]

  function addWord() {
    const word = inputs[tab].trim()
    if (!word || activeWords.includes(word)) return
    setters[tab]([...activeWords, word])
    setInputs((current) => ({ ...current, [tab]: '' }))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addWord()
    }
  }

  function mixFrom(categories: Category[]) {
    const parts = categories.map((category) => ({
      word: pickOne(lists[category.id]),
      short: category.short,
    }))
    setMix(parts)
    setError('')
  }

  function mixTwo() {
    if (filled.length < 2) {
      setError('2つ以上の棚に単語を入れてください')
      return
    }
    mixFrom(shuffle(filled).slice(0, 2))
  }

  function mixThree() {
    if (filled.length < 3) {
      setError('3つの棚すべてに単語を入れてください')
      return
    }
    mixFrom(CATEGORIES)
  }

  return (
    <main className="shell">
      <header className="brand">
        <p>IDEAMAKER</p>
        <h1>既存アイデアの新しい組み合わせ</h1>
      </header>

      <section className="hero" aria-live="polite">
        {mix ? (
          <>
            {mix.map((part, index) => (
              <div key={`${part.short}-${part.word}-${index}`}>
                {index > 0 && <p className="times">×</p>}
                <p className="hero-word">{part.word}</p>
              </div>
            ))}
            <p className="caption">{mix.map((part) => part.short).join(' × ')}</p>
          </>
        ) : (
          <p className="placeholder">No <Idea></Idea></p>
        )}
      </section>

      <div className="actions">
        <button type="button" onClick={mixTwo} disabled={filled.length < 2}>
          2つ混ぜ
        </button>
        <button
          type="button"
          className="ghost"
          onClick={mixThree}
          disabled={filled.length < 3}
        >
          3つ混ぜ
        </button>
      </div>
      {error && <p className="err">{error}</p>}

      <nav className="tabs" aria-label="単語の棚">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={tab === category.id ? 'active' : ''}
            onClick={() => setTab(category.id)}
          >
            {category.short}
          </button>
        ))}
      </nav>

      <section>
        <div className="panel-head">
          <h2>{active.label}</h2>
          <div className="panel-meta">
            <p className="count">{activeWords.length}個</p>
            {activeWords.length > 0 && (
              <button
                type="button"
                className="clear"
                onClick={() => {
                  if (window.confirm(`「${active.label}」を全部消しますか？`)) {
                    setters[tab]([])
                  }
                }}
              >
                全削除
              </button>
            )}
          </div>
        </div>

        <div className="row">
          <input
            type="text"
            value={inputs[tab]}
            onChange={(event) =>
              setInputs((current) => ({ ...current, [tab]: event.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder={active.placeholder}
            autoComplete="off"
            enterKeyHint="done"
          />
          <button
            type="button"
            className="add"
            onClick={addWord}
            disabled={!inputs[tab].trim()}
          >
            <Plus size={18} />
            追加
          </button>
        </div>

        {activeWords.length === 0 ? (
          <p className="empty">この棚はまだ空</p>
        ) : (
          <div className="chips">
            {activeWords.map((word, index) => (
              <div key={`${word}-${index}`} className="chip">
                <span>{word}</span>
                <button
                  type="button"
                  aria-label={`${word}を削除`}
                  onClick={() =>
                    setters[tab](activeWords.filter((_, i) => i !== index))
                  }
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
