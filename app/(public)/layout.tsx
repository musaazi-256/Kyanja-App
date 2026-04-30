import Navbar from '@/components/public/nav/Navbar'
import Footer from '@/components/public/footer/Footer'
import RecoveryRedirect from '@/components/auth/RecoveryRedirect'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <RecoveryRedirect />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
