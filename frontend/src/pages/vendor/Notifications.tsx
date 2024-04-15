import DefaultLayout from '../../Layout/DefaultLayout'
import Breadcrumb from '../../Components/vendor/Breadcrumbs/Breadcrumb'
import ChatCard from '../../Components/vendor/Chat/ChatCard'

const Notifications = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName="Notifications" folderName="" />
        <ChatCard/>
    </DefaultLayout>
  )
}

export default Notifications