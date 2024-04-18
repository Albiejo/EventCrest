import Admin , { AdminDocument } from "../Model/Admin";


export const findAdminByEmail = async (email: string): Promise<AdminDocument | null> => {
  try {
    return await Admin.findOne({ email });
  } catch (error) {
    throw error;
  }
};


export const updateNotificationstatus=async(adminId:string , notifiID:string)=>{
  try {
  
    let adminData = await Admin.findById(adminId);
    if (!adminData) {
      throw new Error('User not found');
    }
    
    const notification = adminData.notifications.find((notif) => notif._id.toString() === notifiID);
    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.Read = !notification.Read;
    await adminData.save();
    console.log("N status updated ", notification.Read)
    adminData = await Admin.findById(adminId);
    const message = notification.Read ? 'Notification marked as read' : 'Notification marked as unread';
    return {message:message , adminData:adminData}
  } catch (error) {
    throw error;
  }
}