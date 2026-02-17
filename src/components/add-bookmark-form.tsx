'use client'

import { useState, useTransition } from 'react'
import { addBookmark } from '@/app/actions/bookmarks'
import { Plus, Loader2, Link as LinkIcon, Type } from 'lucide-react'

export default function AddBookmarkForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function clientAction(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addBookmark(formData)
      if (result?.error) setError(Object.values(result.error).flat()[0])
      else (document.getElementById('add-form') as HTMLFormElement).reset()
    })
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
      <form 
        id="add-form" 
        action={clientAction} 
        className="relative bg-[#0b1120]/80 backdrop-blur-2xl border border-white/5 p-3 rounded-[1.5rem] flex flex-col md:flex-row gap-3 shadow-2xl"
      >
        <div className="relative flex-1 group/input">
          <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
          <input 
            name="title" 
            placeholder="Name (e.g. GitHub)" 
            required 
            className="w-full bg-white/5 border border-transparent focus:border-white/10 pl-12 pr-4 py-4 rounded-xl outline-none transition-all text-sm font-medium placeholder:text-slate-700" 
          />
        </div>

        <div className="relative flex-[2] group/input">
          <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
          <input 
            name="url" 
            type="url" 
            placeholder="https://..." 
            required 
            className="w-full bg-white/5 border border-transparent focus:border-white/10 pl-12 pr-4 py-4 rounded-xl outline-none transition-all text-sm font-medium placeholder:text-slate-700" 
          />
        </div>

        <button 
          disabled={isPending} 
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10 active:scale-[0.98]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Entry
        </button>
      </form>
      {error && <p className="mt-4 text-[10px] text-rose-500 ml-6 font-black uppercase tracking-widest animate-pulse">{error}</p>}
    </div>
  )
}