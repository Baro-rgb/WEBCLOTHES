import Bestseller from "../components/Bestseller"
import Hero from "../components/Hero"
import LatestCollection from "../components/LatestCollection"
import NewsletterBox from "../components/NewsletterBox"
import OurPolicy from "../components/OurPolicy"


const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <Bestseller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home