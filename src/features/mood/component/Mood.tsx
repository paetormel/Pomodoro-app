import React from 'react'

const Mood = () => {
  return (
    <div className="w-64 rounded-2xl bg-white p-4 shadow-xl border border-slate-100 text-slate-800">
      <h3 className="font-bold mb-2">How are you feeling?</h3>
      <div className="flex gap-4 text-2xl justify-around">
        <button className="hover:scale-125 transition-transform">😊</button>
        <button className="hover:scale-125 transition-transform">😐</button>
        <button className="hover:scale-125 transition-transform">😔</button>
      </div>
    </div>
  )
}

export default Mood