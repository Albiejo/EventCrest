import { createVendorType, findVerndorTypeByName ,findVerndorTypes , VendorfindByIdAndDelete , getVendorById , UpdateTypeById} from "../Repository/vendorTypeRepository";


export const addType = async (type: string, status: string)=> {
  try {
    const existingType = await findVerndorTypeByName(type);
    if (existingType) {
      throw new Error("Type already exist!");
    }
    
    const new_type=await createVendorType({type,status:status==="Active"})

    return {  message: "New Type added..." ,new_type};
  } catch (error) {
    throw error;
  }
};

export const getTypes = async ()=> {
  try {
    const availableTypes=await findVerndorTypes()
    return availableTypes;
  } catch (error) {
    throw error;
  }
};


export const deleteVendorType = async(vendorId:string): Promise<void> =>{
  try {
    console.log("service" , vendorId , typeof vendorId);
    
    const deletedVendor = await VendorfindByIdAndDelete(vendorId);
    
    if (!deletedVendor) {
      throw new Error('Vendor not found');
    }
  } catch (error) {
    throw error;
  }

}


export const getSingleVendordata = async(vendorId:string)=>{
try {
  return await getVendorById(vendorId)
} catch (error) {
  throw error
}
}


export const updateVendorType= async(vendorTypeId: string, type: string, status: string):Promise<any>=>{
try {
  const updateddata = await UpdateTypeById(vendorTypeId , {type , status:status==="Active"?true:false});
  return updateddata;
} catch (error) {
  throw new Error('Failed to update vendor type , please try again..');
}
}

