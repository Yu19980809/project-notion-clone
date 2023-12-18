import Header from './_components/header'
import Heroes from './_components/heroes'
import Footer from './_components/footer'

const MarketingPage = () => {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-col justify-center md:justify-start items-center gap-y-8 flex-1 px-6 pb-10 text-center">
        <Header />
        <Heroes />
      </div>

      <Footer />
    </div>
  )
}

export default MarketingPage
