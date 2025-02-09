import axios from 'axios';
import { profileAtom } from '../../../atoms';
import { useSetRecoilState } from 'recoil';
const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})
const ProfileCard=()=>{
    const setProfile=useSetRecoilState(profileAtom)
    const handleLogOut=async()=>{
        try{
            const response=await api.get('/logout');
            console.log(response)
            setProfile(null);
            window.location.reload();
        }catch(err){
            console.error(err);
        }
    }
    return (
        <div className="absolute right-0 top-full w-60 mt-2  flex-col bg-white rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="flex border-b justify-start pb-1">
                    <div className="flex items-center justify-center p-1 pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-7 h-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                  <div className="flex-col items-center">
                    <div className="text-base font-bold">John Smith</div>
                    <div className="text-slate-700">john@example.com</div>
                  </div>
            </div>
                    <div className="flex p-1 m-1 hover:bg-gray-200 hover:cursor-pointer">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                          </svg>
                        </div>
                        <div className="pl-1">Dashboard</div>
                    </div>
                    <div className="flex p-1 m-1 hover:bg-gray-200 hover:cursor-pointer">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                          </svg>
                        </div>
                        <div onClick={handleLogOut} className="pl-1 text-red-400">Log Out</div>
                    </div>
                </div> 
    )
}
export default ProfileCard;