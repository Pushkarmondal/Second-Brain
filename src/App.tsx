import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { CreateContentModel } from "./components/CreateContentModel"
import { Add } from "./icons/Add"
import { Share } from "./icons/Share"

function App() {

  return (
    <div>
      <CreateContentModel open={true}/>
      <div className="flex justify-end mr-20 mt-4 justify-center items-center gap-x-4">
        <Button variant="primary" text="Add Content" startIcon={Share()} />
        <Button variant="secondary" text="Share" startIcon={Add()} />
      </div>
      <div className="flex mt-10 ml-40">
        <Card title="CICD Tweet" link="https://x.com/pushkarmondal79/status/1871167395731226726" contentType="twitter" />
        <Card title="Youtube Videos" link="https://www.youtube.com/watch?v=vsWxs1tuwDk" contentType="youtube" />
        <Card title="Article" link="https://docs.gitlab.com/ci/" contentType="article" />
      </div>

    </div>
   
  )
}

export default App
