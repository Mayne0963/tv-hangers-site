import type { ReactNode } from 'react'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import InstallPrompt from '@/components/InstallPrompt'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-6">
        {children}
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  )
}
