import AddVendorType from '../../Components/admin/vendor-types/AddVendorType'
import VendorTypeList from '../../Components/admin/vendor-types/VendorTypeList'

function VendorTypes() {

  return (
    <div className="m-20">
        <AddVendorType/>
        <div className="mt-8">
        <VendorTypeList/>
        </div>
    </div>
  )
}

export default VendorTypes
